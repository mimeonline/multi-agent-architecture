from __future__ import annotations

from typing import TypedDict


class AgentState(TypedDict):
    request: str
    specialist: str
    result: str


def _choose_specialist(state: AgentState) -> dict[str, str]:
    request = state["request"].lower()
    specialist = "researcher" if "research" in request or "compare" in request else "builder"
    return {"specialist": specialist}


def _handoff(state: AgentState) -> str:
    return state["specialist"]


def _researcher(state: AgentState) -> dict[str, str]:
    return {"result": f"Researcher gathered context for: {state['request']}"}


def _builder(state: AgentState) -> dict[str, str]:
    return {"result": f"Builder converted request into implementation steps: {state['request']}"}


def run(prompt: str) -> str:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: AgentState = {"request": prompt, "specialist": "", "result": ""}
        state.update(_choose_specialist(state))
        state.update(_researcher(state) if _handoff(state) == "researcher" else _builder(state))
        return "\n".join(
            [
                "Pattern: Supervisor / handoff state graph",
                "Mode: offline fallback (langgraph not installed)",
                f"Specialist: {state['specialist']}",
                state["result"],
            ]
        )

    graph = StateGraph(AgentState)
    graph.add_node("supervisor", _choose_specialist)
    graph.add_node("researcher", _researcher)
    graph.add_node("builder", _builder)
    graph.add_edge(START, "supervisor")
    graph.add_conditional_edges(
        "supervisor",
        _handoff,
        {"researcher": "researcher", "builder": "builder"},
    )
    graph.add_edge("researcher", END)
    graph.add_edge("builder", END)

    app = graph.compile()
    result = app.invoke({"request": prompt, "specialist": "", "result": ""})
    return "\n".join(
        [
            "Pattern: Supervisor / handoff state graph",
            f"Specialist: {result['specialist']}",
            result["result"],
        ]
    )
