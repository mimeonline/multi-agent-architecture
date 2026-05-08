"""Multi-Agent Debate: Pro-Agent und Contra-Agent liefern Argumente, Judge bewertet anhand Rubrik.

Der Lernpunkt: Strukturierte Gegenrede — pro_agent und contra_agent erzeugen je 2 Argumente,
judge_agent zählt sie, prüft den Tie-Breaker (Risikobewertung) und dokumentiert sein Verdict
mit Begründung.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class Argument(TypedDict):
    side: str    # "pro" | "contra"
    point: str


class DebateState(TypedDict):
    thesis: str
    pro_args: list[Argument]
    contra_args: list[Argument]
    verdict: str
    reasoning: str
    answer: str


# ---------------------------------------------------------------------------
# Debattanten
# ---------------------------------------------------------------------------

def pro_agent(thesis: str) -> list[Argument]:
    """Pro-Agent: liefert 2 Argumente für die These."""
    return [
        {"side": "pro", "point": f"Argument P1: '{thesis}' steigert nachweislich Effizienz um ~30%."},
        {"side": "pro", "point": f"Argument P2: Frühe Piloten zeigen Nutzerakzeptanz für '{thesis}'."},
    ]


def contra_agent(thesis: str) -> list[Argument]:
    """Contra-Agent: liefert 2 Argumente gegen die These."""
    return [
        {"side": "contra", "point": f"Argument C1: '{thesis}' erhöht Systemkomplexität erheblich."},
        {"side": "contra", "point": f"Argument C2: Datenschutzrisiken bei '{thesis}' unzureichend bewertet."},
    ]


# ---------------------------------------------------------------------------
# Judge-Agent mit Rubrik
# ---------------------------------------------------------------------------

def judge_agent(thesis: str, pro_args: list[Argument], contra_args: list[Argument]) -> tuple[str, str]:
    """Judge bewertet anhand Rubrik: Argumentanzahl + Tie-Breaker Risiko."""
    pro_count = len(pro_args)
    contra_count = len(contra_args)

    # Rubrik: Wer hat mehr Argumente?
    if pro_count > contra_count:
        raw_verdict = "pro"
    elif contra_count > pro_count:
        raw_verdict = "contra"
    else:
        # Tie-Breaker: Risikohinweis im Contra gibt Ausschlag
        has_risk = any("risiko" in a["point"].lower() or "risiken" in a["point"].lower() for a in contra_args)
        raw_verdict = "contra" if has_risk else "pro"

    reasoning = (
        f"Pro: {pro_count} Argument(e), Contra: {contra_count} Argument(e). "
        + ("Tie-Breaker: Risiko-Argument auf Contra-Seite gibt Ausschlag." if raw_verdict == "contra" and pro_count == contra_count else "")
    )
    verdict = (
        f"Empfehlung: {'Für die These' if raw_verdict == 'pro' else 'Gegen die These'} — "
        f"'{thesis}'"
    )
    return verdict, reasoning


# ---------------------------------------------------------------------------
# Debate-Ablauf als Nodes
# ---------------------------------------------------------------------------

def collect_pro(state: DebateState) -> DebateState:
    return {**state, "pro_args": pro_agent(state["thesis"])}


def collect_contra(state: DebateState) -> DebateState:
    return {**state, "contra_args": contra_agent(state["thesis"])}


def judge(state: DebateState) -> DebateState:
    verdict, reasoning = judge_agent(state["thesis"], state["pro_args"], state["contra_args"])
    pro_lines = "\n".join(f"  + {a['point']}" for a in state["pro_args"])
    contra_lines = "\n".join(f"  - {a['point']}" for a in state["contra_args"])
    answer = f"Pro:\n{pro_lines}\nContra:\n{contra_lines}\nVerdict: {verdict}\nReasoning: {reasoning}"
    return {**state, "verdict": verdict, "reasoning": reasoning, "answer": answer}


# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, DebateState]:
    init: DebateState = {
        "thesis": prompt,
        "pro_args": [],
        "contra_args": [],
        "verdict": "",
        "reasoning": "",
        "answer": "",
    }
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state = judge(collect_contra(collect_pro(init)))
        return "plain Python fallback (langgraph not installed)", state

    graph = StateGraph(DebateState)
    graph.add_node("collect_pro", collect_pro)
    graph.add_node("collect_contra", collect_contra)
    graph.add_node("judge", judge)
    graph.add_edge(START, "collect_pro")
    graph.add_edge("collect_pro", "collect_contra")
    graph.add_edge("collect_contra", "judge")
    graph.add_edge("judge", END)

    app = graph.compile()
    result: DebateState = typed_state(app.invoke(init))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: DebateState) -> str:
    pro_lines = [f"  + {a['point']}" for a in state["pro_args"]]
    contra_lines = [f"  - {a['point']}" for a in state["contra_args"]]
    return "\n".join([
        "Pattern: Multi-Agent Debate",
        f"Runtime: {runtime}",
        f"Thesis: {state['thesis']}",
        "Pro arguments:",
        *pro_lines,
        "Contra arguments:",
        *contra_lines,
        f"Verdict: {state['verdict']}",
        f"Reasoning: {state['reasoning']}",
    ])


def run(prompt: str) -> str:
    @trace_demo("demo.multi-agent-debate")
    def traced_run(user_prompt: str) -> tuple[str, DebateState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
