"""Handoff: Ein Agent erkennt, dass er nicht weiterführen sollte, und übergibt Kontrolle und Kontext vollständig.

Der Lernpunkt: Der übergebende Agent packt nur das relevante Kontext-Bundle — der Spezialist
übernimmt ab da die volle Kontrolle. Kein Supervisor bleibt im Loop; die Übergabe ist
einmalig und vollständig.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class HandoffState(TypedDict):
    request: str
    receiving_agent: str
    handoff_context: str
    answer: str


def intake_agent(state: HandoffState) -> HandoffState:
    request = state["request"].lower()
    receiving_agent = "security_agent" if "permission" in request or "risk" in request else "implementation_agent"
    context = f"Context package for {receiving_agent}: user asked `{state['request']}`"
    return {**state, "receiving_agent": receiving_agent, "handoff_context": context}


def choose_receiver(state: HandoffState) -> str:
    return state["receiving_agent"]


def security_agent(state: HandoffState) -> HandoffState:
    answer = f"Security agent accepted control and checks scopes before acting. {state['handoff_context']}"
    return {**state, "answer": answer}


def implementation_agent(state: HandoffState) -> HandoffState:
    answer = f"Implementation agent accepted control and turns the request into next coding steps. {state['handoff_context']}"
    return {**state, "answer": answer}


def run_with_langgraph(prompt: str) -> tuple[str, HandoffState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: HandoffState = {"request": prompt, "receiving_agent": "", "handoff_context": "", "answer": ""}
        state = intake_agent(state)
        state = security_agent(state) if choose_receiver(state) == "security_agent" else implementation_agent(state)
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(HandoffState)
    graph.add_node("intake_agent", intake_agent)
    graph.add_node("security_agent", security_agent)
    graph.add_node("implementation_agent", implementation_agent)
    graph.add_edge(START, "intake_agent")
    graph.add_conditional_edges(
        "intake_agent",
        choose_receiver,
        {
            "security_agent": "security_agent",
            "implementation_agent": "implementation_agent",
        },
    )
    graph.add_edge("security_agent", END)
    graph.add_edge("implementation_agent", END)

    app = graph.compile()
    result: HandoffState = typed_state(app.invoke({"request": prompt, "receiving_agent": "", "handoff_context": "", "answer": ""}))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: HandoffState) -> str:
    return "\n".join(
        [
            "Pattern: Handoff",
            f"Runtime: {runtime} with optional LangSmith tracing",
            f"Receiving agent: {state['receiving_agent']}",
            f"Handoff context: {state['handoff_context']}",
            f"Result: {state['answer']}",
        ]
    )


def run(prompt: str) -> str:
    @trace_demo("demo.handoff")
    def traced_run(user_prompt: str) -> tuple[str, HandoffState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph"]
