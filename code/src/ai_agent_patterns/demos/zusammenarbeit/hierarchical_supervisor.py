"""Hierarchical Supervisor: Top-Supervisor delegiert an Sub-Supervisoren, die an Worker delegieren.

Der Lernpunkt: Zweistufige Hierarchie — top_supervisor wählt ein Team (research_team oder
engineering_team), der Sub-Supervisor wählt seinen Worker. Die Hierarchie ist im Output
explizit als Delegation-Kette sichtbar.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class TeamResult(TypedDict):
    team: str
    worker: str
    output: str


class HierarchicalState(TypedDict):
    request: str
    selected_team: str
    team_result: TeamResult
    answer: str


# ---------------------------------------------------------------------------
# Ebene 2: Worker-Agents
# ---------------------------------------------------------------------------

def searcher_worker(request: str) -> str:
    return f"[searcher] Quellen durchsucht und Fakten gesammelt für: '{request}'"


def analyst_worker(request: str) -> str:
    return f"[analyst] Daten ausgewertet und Trends identifiziert für: '{request}'"


def coder_worker(request: str) -> str:
    return f"[coder] Implementierungsplan erstellt für: '{request}'"


def reviewer_worker(request: str) -> str:
    return f"[reviewer] Code-Review und Qualitätssicherung für: '{request}'"


# ---------------------------------------------------------------------------
# Ebene 1: Sub-Supervisoren
# ---------------------------------------------------------------------------

def research_team_supervisor(request: str) -> TeamResult:
    """Research-Sub-Supervisor: wählt searcher oder analyst anhand des Requests."""
    worker = "analyst" if any(kw in request.lower() for kw in ("analyse", "trend", "daten")) else "searcher"
    output = analyst_worker(request) if worker == "analyst" else searcher_worker(request)
    return {"team": "research_team", "worker": worker, "output": output}


def engineering_team_supervisor(request: str) -> TeamResult:
    """Engineering-Sub-Supervisor: wählt coder oder reviewer anhand des Requests."""
    worker = "reviewer" if any(kw in request.lower() for kw in ("review", "prüf", "qualität")) else "coder"
    output = reviewer_worker(request) if worker == "reviewer" else coder_worker(request)
    return {"team": "engineering_team", "worker": worker, "output": output}


# ---------------------------------------------------------------------------
# Ebene 0: Top-Supervisor
# ---------------------------------------------------------------------------

def top_supervisor_select(state: HierarchicalState) -> HierarchicalState:
    """Top-Supervisor entscheidet: research_team oder engineering_team."""
    request = state["request"].lower()
    team = "engineering_team" if any(kw in request for kw in ("code", "implementier", "bau", "review")) else "research_team"
    return {**state, "selected_team": team}


def top_supervisor_delegate(state: HierarchicalState) -> HierarchicalState:
    """Top-Supervisor delegiert an gewähltes Team und aggregiert Ergebnis."""
    if state["selected_team"] == "engineering_team":
        team_result = engineering_team_supervisor(state["request"])
    else:
        team_result = research_team_supervisor(state["request"])

    answer = (
        f"Hierarchie: top_supervisor -> {team_result['team']} -> {team_result['worker']}\n"
        f"Ergebnis: {team_result['output']}"
    )
    return {**state, "team_result": team_result, "answer": answer}


# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, HierarchicalState]:
    empty_result: TeamResult = {"team": "", "worker": "", "output": ""}
    init: HierarchicalState = {
        "request": prompt,
        "selected_team": "",
        "team_result": empty_result,
        "answer": "",
    }
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state = top_supervisor_delegate(top_supervisor_select(init))
        return "plain Python fallback (langgraph not installed)", state

    graph = StateGraph(HierarchicalState)
    graph.add_node("top_supervisor_select", top_supervisor_select)
    graph.add_node("top_supervisor_delegate", top_supervisor_delegate)
    graph.add_edge(START, "top_supervisor_select")
    graph.add_edge("top_supervisor_select", "top_supervisor_delegate")
    graph.add_edge("top_supervisor_delegate", END)

    app = graph.compile()
    result: HierarchicalState = typed_state(app.invoke(init))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: HierarchicalState) -> str:
    tr = state["team_result"]
    return "\n".join([
        "Pattern: Hierarchical Supervisor",
        f"Runtime: {runtime}",
        f"Request: {state['request']}",
        "Delegation hierarchy:",
        f"  top_supervisor -> {tr['team']} -> {tr['worker']}",
        f"Worker output: {tr['output']}",
        f"Answer: {state['answer']}",
    ])


def run(prompt: str) -> str:
    @trace_demo("demo.hierarchical-supervisor")
    def traced_run(user_prompt: str) -> tuple[str, HierarchicalState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
