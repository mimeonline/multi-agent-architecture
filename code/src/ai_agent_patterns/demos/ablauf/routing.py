"""Routing demo with LangGraph conditional edges.

The router classifies the prompt, chooses a specialized node, and records a trace through the graph.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.config import pick_model_config
from ai_agent_patterns.llm import init_langchain_model, is_offline_model


class RoutingState(TypedDict):
    prompt: str
    route: str
    answer: str
    trace: list[str]


def _route(prompt: str) -> str:
    text = prompt.lower()
    if any(word in text for word in ("traceback", "python", "bug", "error")):
        return "engineering"
    if any(word in text for word in ("launch", "copy", "email", "announce")):
        return "writing"
    return "general"


SYSTEM_PROMPTS = {
    "engineering": "You are a debugging assistant. Give likely cause and next step.",
    "writing": "You are a product writer. Produce crisp, user-facing copy.",
    "general": "You are a general assistant. Be practical and concise.",
}


def _router(state: RoutingState) -> dict[str, str | list[str]]:
    route = _route(state["prompt"])
    return {
        "route": route,
        "trace": state.get("trace", []) + [f"router selected `{route}`"],
    }


def _choose_route(state: RoutingState) -> str:
    return state["route"]


def _make_handler(route: str, model: object):
    def handler(state: RoutingState) -> dict[str, str | list[str]]:
        if is_offline_model(model):
            answer = f"Offline {route} handler selected. Next action: respond to `{state['prompt'][:80]}`."
        else:
            response = model.invoke(
                [
                    {"role": "system", "content": SYSTEM_PROMPTS[route]},
                    {"role": "user", "content": state["prompt"]},
                ]
            )
            answer = response.content

        return {
            "answer": answer,
            "trace": state.get("trace", []) + [f"{route} node produced an answer"],
        }

    return handler


def run(prompt: str) -> str:
    config = pick_model_config()
    model = init_langchain_model(config)

    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        route = _route(prompt)
        answer = f"Offline {route} handler selected. Next action: respond to `{prompt[:80]}`."
        return "\n".join(["Pattern: Routing", "Runtime: fallback without LangGraph", f"Route: {route}", answer])

    graph = StateGraph(RoutingState)
    graph.add_node("router", _router)
    graph.add_node("engineering", _make_handler("engineering", model))
    graph.add_node("writing", _make_handler("writing", model))
    graph.add_node("general", _make_handler("general", model))
    graph.add_edge(START, "router")
    graph.add_conditional_edges(
        "router",
        _choose_route,
        {"engineering": "engineering", "writing": "writing", "general": "general"},
    )
    graph.add_edge("engineering", END)
    graph.add_edge("writing", END)
    graph.add_edge("general", END)

    app = graph.compile()
    result = app.invoke({"prompt": prompt, "route": "", "answer": "", "trace": []})

    return "\n".join(
        [
            "Pattern: Routing",
            "Runtime: LangGraph StateGraph with conditional edges",
            f"Route: {result['route']}",
            "Trace: " + " -> ".join(result["trace"]),
            result["answer"],
        ]
    )
