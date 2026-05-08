"""Plan-and-Execute: Erst kompletter Schrittplan, dann sequenzielle Ausführung.

Der Lernpunkt: Der Plan steht VOR der ersten Aktion vollständig im State und ist
prüfbar. Der Executor arbeitet ihn ab; ein `needs_replan`-Flag erlaubt Korrekturen,
ohne die Plan/Execute-Trennung zu verwischen.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class PlanAndExecuteState(TypedDict):
    prompt: str
    plan: list[str]           # vollständiger Plan, sichtbar vor Execution
    completed: list[str]      # abgearbeitete Schritte mit Ergebnis
    needs_replan: bool        # gesetzt, wenn ein Schritt scheitert
    answer: str


# ---------------------------------------------------------------------------
# Planner: leitet aus dem Prompt einen Schrittplan ab, BEVOR etwas ausgeführt wird
# ---------------------------------------------------------------------------

def derive_plan(prompt: str) -> list[str]:
    """Heuristik: zerlegt den Prompt in 3 konkrete Ausführungsschritte."""
    keywords = prompt.lower()
    if "vergleich" in keywords or "konkurrent" in keywords or "wettbewerb" in keywords:
        return [
            "Konkurrenten identifizieren und Liste erstellen",
            "Daten je Konkurrent erheben (Preise, Features)",
            "Markdown-Vergleich erzeugen und zurückgeben",
        ]
    if "analyse" in keywords or "report" in keywords or "bericht" in keywords:
        return [
            "Datenbasis sammeln und strukturieren",
            "Kennzahlen berechnen und interpretieren",
            "Ergebnisbericht zusammenfassen",
        ]
    # Allgemein-Plan als Fallback
    return [
        f"Aufgabe verstehen und Informationen zu '{prompt[:40]}' sammeln",
        "Informationen verarbeiten und Zwischenergebnis bilden",
        "Antwort formulieren und zurückgeben",
    ]


# ---------------------------------------------------------------------------
# Executor: arbeitet den Plan schrittweise ab
# ---------------------------------------------------------------------------

def execute_step(step: str, index: int) -> str:
    """Führt einen Planschritt aus und liefert eine Beobachtung."""
    return f"Schritt {index} erledigt: {step} -> Ergebnis liegt vor."


def check_needs_replan(completed: list[str]) -> bool:
    """Einfache Heuristik: Replanning, wenn mehr als ein Schritt 'fehlgeschlagen' signalisiert."""
    return sum(1 for c in completed if "fehler" in c.lower()) > 1


# ---------------------------------------------------------------------------
# LangGraph-Nodes
# ---------------------------------------------------------------------------

def planner_node(state: PlanAndExecuteState) -> dict:
    plan = derive_plan(state["prompt"])
    return {"plan": plan, "completed": [], "needs_replan": False, "answer": ""}


def executor_node(state: PlanAndExecuteState) -> dict:
    completed = [
        execute_step(step, i)
        for i, step in enumerate(state["plan"], start=1)
    ]
    needs_replan = check_needs_replan(completed)
    return {"completed": completed, "needs_replan": needs_replan}


def replan_node(state: PlanAndExecuteState) -> dict:
    """Einfaches Replanning: fügt einen Korrekturschritt am Ende ein."""
    corrected = state["plan"] + ["Korrekturschritt: Ergebnisse validieren und Lücken schließen"]
    extra = execute_step("Korrekturschritt", len(corrected))
    return {"plan": corrected, "completed": state["completed"] + [extra], "needs_replan": False}


def finish_node(state: PlanAndExecuteState) -> dict:
    summary = f"Plan ({len(state['plan'])} Schritte) vollständig ausgeführt für: {state['prompt'][:80]}"
    return {"answer": summary}


def route_after_executor(state: PlanAndExecuteState) -> str:
    return "replan" if state["needs_replan"] else "finish"


# ---------------------------------------------------------------------------
# run_with_langgraph / plain Python fallback
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, PlanAndExecuteState]:
    initial: PlanAndExecuteState = {
        "prompt": prompt,
        "plan": [],
        "completed": [],
        "needs_replan": False,
        "answer": "",
    }

    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        # Plain Python: selbe Logik ohne LangGraph
        state: PlanAndExecuteState = {**initial}
        state.update(planner_node(state))
        state.update(executor_node(state))
        if state["needs_replan"]:
            state.update(replan_node(state))
        state.update(finish_node(state))
        return "plain Python fallback (langgraph nicht installiert)", state

    graph = StateGraph(PlanAndExecuteState)
    graph.add_node("planner", planner_node)
    graph.add_node("executor", executor_node)
    graph.add_node("replan", replan_node)
    graph.add_node("finish", finish_node)
    graph.add_edge(START, "planner")
    graph.add_edge("planner", "executor")
    graph.add_conditional_edges("executor", route_after_executor, {"replan": "replan", "finish": "finish"})
    graph.add_edge("replan", "finish")
    graph.add_edge("finish", END)

    app = graph.compile()
    result: PlanAndExecuteState = typed_state(app.invoke(initial))
    return "LangGraph StateGraph", result


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

def render_result(runtime: str, state: PlanAndExecuteState) -> str:
    plan_lines = [f"  {i}. {s}" for i, s in enumerate(state["plan"], start=1)]
    exec_lines = [f"  {c}" for c in state["completed"]]
    return "\n".join(
        [
            "Pattern: Plan-and-Execute",
            f"Runtime: {runtime}",
            "",
            "-- PLAN (vor erster Aktion) --",
            *plan_lines,
            "",
            "-- EXECUTION (sequenziell) --",
            *exec_lines,
            "",
            f"Replanning ausgeloest: {state['needs_replan']}",
            f"Ergebnis: {state['answer']}",
        ]
    )


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run(prompt: str) -> str:
    @trace_demo("demo.plan-and-execute")
    def traced_run(user_prompt: str) -> tuple[str, PlanAndExecuteState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
