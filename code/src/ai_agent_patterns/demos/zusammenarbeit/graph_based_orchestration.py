"""Graph-based Orchestration: Knoten und Kanten werden als Code modelliert — testbar, deterministisch, mit klar definierten Übergängen.

Der Lernpunkt: Jeder Knoten ist eine Funktion, jede Kante ein expliziter Pfad im Graphen.
`add_conditional_edges` macht sichtbar, wohin das System als nächstes gehen kann — kein
implizites Routing via Prompt.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class GraphState(TypedDict):
    request: str
    route: str
    draft: str
    review: str
    answer: str


def route_request(state: GraphState) -> GraphState:
    request = state["request"].lower()
    route = "research_path" if "research" in request or "compare" in request else "build_path"
    return {**state, "route": route}


def choose_path(state: GraphState) -> str:
    return state["route"]


def research_node(state: GraphState) -> GraphState:
    draft = f"Research path gathered evidence and trade-offs for `{state['request']}`."
    return {**state, "draft": draft}


def build_node(state: GraphState) -> GraphState:
    draft = f"Build path produced implementation steps for `{state['request']}`."
    return {**state, "draft": draft}


def review_node(state: GraphState) -> GraphState:
    review = f"Review checked graph state: route={state['route']}, draft_length={len(state['draft'])}."
    return {**state, "review": review}


def finish_node(state: GraphState) -> GraphState:
    answer = f"{state['draft']} {state['review']}"
    return {**state, "answer": answer}


def run_with_langgraph(prompt: str) -> tuple[str, GraphState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: GraphState = {"request": prompt, "route": "", "draft": "", "review": "", "answer": ""}
        state = route_request(state)
        state = research_node(state) if choose_path(state) == "research_path" else build_node(state)
        state = finish_node(review_node(state))
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(GraphState)
    graph.add_node("route_request", route_request)
    graph.add_node("research_node", research_node)
    graph.add_node("build_node", build_node)
    graph.add_node("review_node", review_node)
    graph.add_node("finish_node", finish_node)
    graph.add_edge(START, "route_request")
    graph.add_conditional_edges(
        "route_request",
        choose_path,
        {
            "research_path": "research_node",
            "build_path": "build_node",
        },
    )
    graph.add_edge("research_node", "review_node")
    graph.add_edge("build_node", "review_node")
    graph.add_edge("review_node", "finish_node")
    graph.add_edge("finish_node", END)

    app = graph.compile()
    result: GraphState = typed_state(app.invoke({"request": prompt, "route": "", "draft": "", "review": "", "answer": ""}))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: GraphState) -> str:
    return "\n".join(
        [
            "Pattern: Graph-based Orchestration",
            f"Runtime: {runtime} with optional LangSmith tracing",
            f"Route: {state['route']}",
            f"Draft: {state['draft']}",
            f"Review: {state['review']}",
            f"Result: {state['answer']}",
        ]
    )


def run(prompt: str) -> str:
    @trace_demo("demo.graph-based-orchestration")
    def traced_run(user_prompt: str) -> tuple[str, GraphState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph"]
