"""Blackboard: Mehrere Spezialisten lesen und schreiben in eine gemeinsame Zustandsfläche.

Der Lernpunkt: Keine direkten Agent-zu-Agent-Aufrufe — stattdessen ein zentrales
`Blackboard`-Dict mit `hypotheses`, `evidence` und `synthesis`. Wer eine Bedingung
erfüllt, übernimmt den nächsten Schritt.
"""

from __future__ import annotations

from typing import TypedDict, cast

from ai_agent_patterns.demos.common import trace_demo, typed_state

# ---------------------------------------------------------------------------
# Blackboard — das zentrale geteilte State-Dict
# ---------------------------------------------------------------------------


class Blackboard(TypedDict):
    hypotheses: list[str]
    evidence: list[str]
    synthesis: str


class BlackboardState(TypedDict):
    request: str
    blackboard: Blackboard
    answer: str


# ---------------------------------------------------------------------------
# Spezialist-Agents — lesen und schreiben auf das Blackboard
# ---------------------------------------------------------------------------


def hypothesis_agent(state: BlackboardState) -> BlackboardState:
    """Liest den Request, schreibt erste Hypothesen auf das Blackboard."""
    bb = dict(state["blackboard"])
    bb["hypotheses"] = [
        f"Hypothese A: '{state['request']}' lässt sich durch Ansatz X lösen.",
        f"Hypothese B: '{state['request']}' erfordert Ansatz Y.",
    ]
    return {**state, "blackboard": bb}  # type: ignore[typeddict-item]


def evidence_agent(state: BlackboardState) -> BlackboardState:
    """Liest Hypothesen vom Blackboard, schreibt Belege zurück."""
    bb = dict(state["blackboard"])
    evidence = []
    for i, hyp in enumerate(cast(list[str], bb["hypotheses"]), start=1):
        evidence.append(f"Beleg {i}: Daten unterstützen — {hyp[:60]}…")
    bb["evidence"] = evidence
    return {**state, "blackboard": bb}  # type: ignore[typeddict-item]


def synthesis_agent(state: BlackboardState) -> BlackboardState:
    """Liest Hypothesen + Belege, schreibt finale Synthese auf das Blackboard."""
    bb = dict(state["blackboard"])
    hyp_count = len(cast(list[str], bb["hypotheses"]))
    ev_count = len(cast(list[str], bb["evidence"]))
    bb["synthesis"] = (
        f"Synthese aus {hyp_count} Hypothesen und {ev_count} Belegen: "
        f"Ansatz X dominiert für '{state['request']}'."
    )
    answer = (
        f"Blackboard nach 3 Agenten:\n"
        f"  hypotheses: {bb['hypotheses']}\n"
        f"  evidence:   {bb['evidence']}\n"
        f"  synthesis:  {bb['synthesis']}"
    )
    return {**state, "blackboard": bb, "answer": answer}  # type: ignore[typeddict-item]


# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------


def _empty_blackboard() -> Blackboard:
    return {"hypotheses": [], "evidence": [], "synthesis": ""}


def run_with_langgraph(prompt: str) -> tuple[str, BlackboardState]:
    init: BlackboardState = {
        "request": prompt,
        "blackboard": _empty_blackboard(),
        "answer": "",
    }
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state = synthesis_agent(evidence_agent(hypothesis_agent(init)))
        return "plain Python fallback (langgraph not installed)", state

    graph = StateGraph(BlackboardState)
    graph.add_node("hypothesis_agent", hypothesis_agent)
    graph.add_node("evidence_agent", evidence_agent)
    graph.add_node("synthesis_agent", synthesis_agent)
    graph.add_edge(START, "hypothesis_agent")
    graph.add_edge("hypothesis_agent", "evidence_agent")
    graph.add_edge("evidence_agent", "synthesis_agent")
    graph.add_edge("synthesis_agent", END)

    app = graph.compile()
    result: BlackboardState = typed_state(app.invoke(init))
    return "LangGraph StateGraph", cast(BlackboardState, result)


def render_result(runtime: str, state: BlackboardState) -> str:
    bb = state["blackboard"]
    return "\n".join(
        [
            "Pattern: Blackboard",
            f"Runtime: {runtime}",
            f"Request: {state['request']}",
            "Blackboard state:",
            f"  hypotheses: {bb['hypotheses']}",
            f"  evidence:   {bb['evidence']}",
            f"  synthesis:  {bb['synthesis']}",
            f"Answer: {state['answer']}",
        ]
    )


def run(prompt: str) -> str:
    @trace_demo("demo.blackboard")
    def traced_run(user_prompt: str) -> tuple[str, BlackboardState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
