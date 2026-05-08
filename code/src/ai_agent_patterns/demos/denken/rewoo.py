"""ReWOO: Strikte Phasentrennung — Planner, Worker, Solver laufen ohne Observation dazwischen.

Der Lernpunkt: Der Planner erzeugt ALLE Tool-Calls vorab als Variablen-DAG, Worker führt sie
gesammelt aus, Solver kombiniert einmalig. Kein Reasoning-Schritt zwischen den Tools spart
LLM-Calls über den gesamten Ablauf.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class ToolCall(TypedDict):
    var: str        # z.B. "#E1"
    tool: str       # Toolname
    arg: str        # Argument (kann auf frueheres #Ei verweisen)


class ReWOOState(TypedDict):
    prompt: str
    tool_plan: list[ToolCall]   # Variablen-DAG: alle Calls vorab geplant
    observations: dict[str, str]  # #Ei -> Ergebnis
    answer: str                   # einmaliger Solver-Output


# ---------------------------------------------------------------------------
# Mock-Tools: kleine, reine Funktionen ohne Seiteneffekte
# ---------------------------------------------------------------------------

def search_docs(query: str) -> str:
    return f"[search_docs] Dokumente zu '{query}': 3 Treffer gefunden, relevantester: Abschnitt 4.2"


def read_examples(topic: str) -> str:
    return f"[read_examples] Beispiele fuer '{topic}': 2 Codebeispiele und 1 Diagramm"


def summarize_constraints(context: str) -> str:
    return (
        f"[summarize_constraints] Einschraenkungen aus '{context}': "
        "max. Latenz 200 ms, kein externer Netzwerkzugriff"
    )


def compare_results(a: str, b: str) -> str:
    return f"[compare_results] Vergleich: '{a[:30]}' vs '{b[:30]}' -> Ergebnis A bevorzugt"


_TOOL_REGISTRY = {
    "search_docs": search_docs,
    "read_examples": read_examples,
    "summarize_constraints": summarize_constraints,
    "compare_results": compare_results,
}


# ---------------------------------------------------------------------------
# Planner: erzeugt Variablen-DAG aus dem Prompt — EINMALIG, vor jedem Tool-Call
# ---------------------------------------------------------------------------

def build_tool_plan(prompt: str) -> list[ToolCall]:
    """Leitet aus dem Prompt einen DAG von Tool-Calls ab.

    Spaeteren Calls koennen fruehe Variablen (#E1) als Argument referenzieren.
    Der Planner denkt NICHT zwischen den Calls — das ist der Kern von ReWOO.
    """
    keywords = prompt.lower()
    if "beispiel" in keywords or "demo" in keywords or "code" in keywords:
        return [
            {"var": "#E1", "tool": "search_docs",         "arg": prompt},
            {"var": "#E2", "tool": "read_examples",        "arg": "#E1"},
            {"var": "#E3", "tool": "summarize_constraints","arg": "#E1"},
            {"var": "#E4", "tool": "compare_results",      "arg": "#E2, #E3"},
        ]
    return [
        {"var": "#E1", "tool": "search_docs",         "arg": prompt},
        {"var": "#E2", "tool": "summarize_constraints","arg": "#E1"},
        {"var": "#E3", "tool": "read_examples",        "arg": prompt},
    ]


# ---------------------------------------------------------------------------
# Worker: fuehrt ALLE Tool-Calls gesammelt aus (kein LLM dazwischen)
# ---------------------------------------------------------------------------

def _resolve_arg(arg: str, observations: dict[str, str]) -> str:
    """Ersetzt #Ei-Referenzen durch echte Beobachtungswerte."""
    for var, val in observations.items():
        arg = arg.replace(var, val[:40])
    return arg


def run_all_tools(tool_plan: list[ToolCall]) -> dict[str, str]:
    """Fuehrt jeden geplanten Tool-Call aus und sammelt Ergebnisse."""
    observations: dict[str, str] = {}
    for call in tool_plan:
        resolved_arg = _resolve_arg(call["arg"], observations)
        fn = _TOOL_REGISTRY.get(call["tool"])
        result = fn(resolved_arg) if fn else f"[unbekanntes Tool: {call['tool']}]"
        observations[call["var"]] = result
    return observations


# ---------------------------------------------------------------------------
# Solver: kombiniert EINMALIG alle Beobachtungen zur Antwort
# ---------------------------------------------------------------------------

def solve(prompt: str, observations: dict[str, str]) -> str:
    """Einmaliger Abschluss-Reasoning-Schritt mit allen Ergebnissen."""
    obs_text = "; ".join(f"{k}={v[:50]}" for k, v in observations.items())
    return (
        f"Auf Basis aller Tool-Ergebnisse ({obs_text}): "
        f"Antwort auf '{prompt[:60]}' erarbeitet ohne Zwischen-Reasoning."
    )


# ---------------------------------------------------------------------------
# LangGraph-Nodes
# ---------------------------------------------------------------------------

def planner_node(state: ReWOOState) -> dict:
    return {"tool_plan": build_tool_plan(state["prompt"]), "observations": {}, "answer": ""}


def worker_node(state: ReWOOState) -> dict:
    observations = run_all_tools(state["tool_plan"])
    return {"observations": observations}


def solver_node(state: ReWOOState) -> dict:
    answer = solve(state["prompt"], state["observations"])
    return {"answer": answer}


# ---------------------------------------------------------------------------
# run_with_langgraph / plain Python fallback
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, ReWOOState]:
    initial: ReWOOState = {"prompt": prompt, "tool_plan": [], "observations": {}, "answer": ""}

    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: ReWOOState = {**initial}
        state.update(planner_node(state))
        state.update(worker_node(state))
        state.update(solver_node(state))
        return "plain Python fallback (langgraph nicht installiert)", state

    graph = StateGraph(ReWOOState)
    graph.add_node("planner", planner_node)
    graph.add_node("worker",  worker_node)
    graph.add_node("solver",  solver_node)
    graph.add_edge(START, "planner")
    graph.add_edge("planner", "worker")
    graph.add_edge("worker",  "solver")
    graph.add_edge("solver",  END)

    app = graph.compile()
    result: ReWOOState = typed_state(app.invoke(initial))
    return "LangGraph StateGraph", result


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

def render_result(runtime: str, state: ReWOOState) -> str:
    plan_lines = [
        f"  {c['var']} = {c['tool']}({c['arg']})"
        for c in state["tool_plan"]
    ]
    obs_lines = [f"  {k}: {v}" for k, v in state["observations"].items()]
    return "\n".join(
        [
            "Pattern: ReWOO",
            f"Runtime: {runtime}",
            "",
            "-- PLAN-PHASE (Variablen-DAG, kein LLM zwischen den Calls) --",
            *plan_lines,
            "",
            "-- WORKER-PHASE (alle Tools gesammelt ausgefuehrt) --",
            *obs_lines,
            "",
            "-- SOLVER-PHASE (einmaliger Abschluss-Reasoning-Schritt) --",
            f"  {state['answer']}",
        ]
    )


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run(prompt: str) -> str:
    @trace_demo("demo.rewoo")
    def traced_run(user_prompt: str) -> tuple[str, ReWOOState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
