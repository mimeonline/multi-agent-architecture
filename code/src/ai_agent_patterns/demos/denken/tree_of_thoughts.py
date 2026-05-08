"""Tree of Thoughts: An Entscheidungspunkten mehrere Reasoning-Äste erzeugen, bewerten, besten vertiefen.

Der Lernpunkt: 3 Strategien werden als Äste erzeugt, jeder bewertet — der beste Ast wird
weiter ausgebaut, Sackgassen fallen früh raus. `scores.index(max(scores))` macht die Auswahl
transparent.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class Branch(TypedDict):
    strategy: str       # Name des Ansatzes
    reasoning: str      # Reasoning-Schritt in diesem Ast
    score: int          # Bewertung 0-10
    pruned: bool        # True = Sackgasse, frueh abgeschnitten


class TreeOfThoughtsState(TypedDict):
    prompt: str
    branches: list[Branch]          # alle 3 Aeste mit Scores
    best_branch: Branch             # Ast mit hoechstem Score
    best_continuation: str          # weiterer Ausbaupfad des besten Asts


# ---------------------------------------------------------------------------
# Branch-Generierung: 3 Strategien mit unterschiedlichen Ansaetzen
# ---------------------------------------------------------------------------

def _branch_decompose(prompt: str) -> Branch:
    """Strategie A: Aufgabe zerlegen in Teilprobleme."""
    complexity = len(prompt.split())
    score = min(10, 4 + complexity // 5)
    return {
        "strategy": "Dekomposition",
        "reasoning": (
            f"Aufgabe '{prompt[:40]}' in {max(2, complexity // 4)} "
            "Teilprobleme zerlegen und separat loesen."
        ),
        "score": score,
        "pruned": score < 5,
    }


def _branch_analogize(prompt: str) -> Branch:
    """Strategie B: Analogie zu bekanntem Problem ziehen."""
    has_comparison = any(w in prompt.lower() for w in ("verglichen", "aehnlich", "wie", "als"))
    score = 7 if has_comparison else 4
    return {
        "strategy": "Analogie",
        "reasoning": (
            f"Analogie zu bekanntem Muster suchen (Treffer: {has_comparison}). "
            "Loesung durch Uebertragung ableiten."
        ),
        "score": score,
        "pruned": score < 5,
    }


def _branch_heuristic(prompt: str) -> Branch:
    """Strategie C: Greedy-Heuristik, schnell zum besten naechsten Schritt."""
    keywords = {"optimier", "maxim", "minim", "best", "schnell"}
    match = any(k in prompt.lower() for k in keywords)
    score = 8 if match else 5
    return {
        "strategy": "Greedy-Heuristik",
        "reasoning": (
            f"Optimierungsschluesselbegriff gefunden: {match}. "
            "Greedy nimmt jeweils den lokal besten naechsten Schritt."
        ),
        "score": score,
        "pruned": False,
    }


_BRANCH_GENERATORS = [_branch_decompose, _branch_analogize, _branch_heuristic]


def generate_branches(prompt: str) -> list[Branch]:
    """Erzeugt alle 3 Reasoning-Aeste unabhaengig voneinander."""
    return [gen(prompt) for gen in _BRANCH_GENERATORS]


# ---------------------------------------------------------------------------
# Bewertung und Auswahl
# ---------------------------------------------------------------------------

def select_best(branches: list[Branch]) -> Branch:
    return max(branches, key=lambda b: b["score"])


def expand_branch(branch: Branch, prompt: str) -> str:
    """Baut den besten Ast eine Tiefe weiter aus."""
    return (
        f"[Vertiefung von '{branch['strategy']}'] "
        f"Naechster Reasoning-Schritt fuer '{prompt[:50]}': "
        f"Strategie pruefen, Zwischenergebnis validieren, Loesung verfeinern. "
        f"Ausgangsscore {branch['score']}/10 rechtfertigt weiteres Aufloesen."
    )


# ---------------------------------------------------------------------------
# LangGraph-Nodes
# ---------------------------------------------------------------------------

def branching_node(state: TreeOfThoughtsState) -> dict:
    branches = generate_branches(state["prompt"])
    return {"branches": branches, "best_branch": {}, "best_continuation": ""}


def evaluation_node(state: TreeOfThoughtsState) -> dict:
    best = select_best(state["branches"])
    return {"best_branch": best}


def expansion_node(state: TreeOfThoughtsState) -> dict:
    continuation = expand_branch(state["best_branch"], state["prompt"])
    return {"best_continuation": continuation}


# ---------------------------------------------------------------------------
# run_with_langgraph / plain Python fallback
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, TreeOfThoughtsState]:
    initial: TreeOfThoughtsState = {
        "prompt": prompt,
        "branches": [],
        "best_branch": {"strategy": "", "reasoning": "", "score": 0, "pruned": False},
        "best_continuation": "",
    }

    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: TreeOfThoughtsState = {**initial}
        state.update(branching_node(state))
        state.update(evaluation_node(state))
        state.update(expansion_node(state))
        return "plain Python fallback (langgraph nicht installiert)", state

    graph = StateGraph(TreeOfThoughtsState)
    graph.add_node("branching",  branching_node)
    graph.add_node("evaluation", evaluation_node)
    graph.add_node("expansion",  expansion_node)
    graph.add_edge(START, "branching")
    graph.add_edge("branching",  "evaluation")
    graph.add_edge("evaluation", "expansion")
    graph.add_edge("expansion",  END)

    app = graph.compile()
    result: TreeOfThoughtsState = typed_state(app.invoke(initial))
    return "LangGraph StateGraph", result


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

def render_result(runtime: str, state: TreeOfThoughtsState) -> str:
    branch_lines = []
    for b in state["branches"]:
        pruned_tag = " [PRUNED - Sackgasse]" if b["pruned"] else ""
        branch_lines.append(
            f"  [{b['strategy']}] Score {b['score']}/10{pruned_tag}: {b['reasoning']}"
        )
    best = state["best_branch"]
    return "\n".join(
        [
            "Pattern: Tree of Thoughts",
            f"Runtime: {runtime}",
            "",
            "-- BRANCHES (alle 3 Strategien mit Score) --",
            *branch_lines,
            "",
            f"-- BESTER AST -> {best['strategy']} (Score {best['score']}/10) --",
            "",
            "-- EXPANSION (bester Ast weiter ausgebaut) --",
            f"  {state['best_continuation']}",
        ]
    )


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run(prompt: str) -> str:
    @trace_demo("demo.tree-of-thoughts")
    def traced_run(user_prompt: str) -> tuple[str, TreeOfThoughtsState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
