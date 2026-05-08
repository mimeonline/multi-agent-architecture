"""Iterative Refinement: Jeder Durchlauf fokussiert auf eine explizite Verbesserungsdimension.

Der Lernpunkt: Die Liste `["structure", "examples", "tone"]` macht den Fortschritt greifbar —
jeder `focus`-Wert steuert einen eigenen Prompt. `revisions` protokolliert alle Zwischenstände,
so dass ziellose Revisionen ausgeschlossen sind.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state

# Named refinement dimensions applied in order
REFINEMENT_ROUNDS: list[tuple[str, str]] = [
    ("structure", "Reorganise into clear introduction, body, and conclusion."),
    ("examples", "Add a concrete example to each main point."),
    ("tone", "Adjust tone to be concise and direct, removing filler words."),
]


class Revision(TypedDict):
    round: int
    dimension: str
    instruction: str
    text: str


class RefinementState(TypedDict):
    prompt: str
    initial_draft: str
    revisions: list[Revision]
    current_text: str
    answer: str


# ── Drafter ───────────────────────────────────────────────────────────────────


def produce_initial_draft(prompt: str) -> str:
    """Create the first rough draft — intentionally sparse."""
    return f"Draft: {prompt[:60]}. More details needed."


# ── Refiner ───────────────────────────────────────────────────────────────────


def refine(text: str, round_num: int, dimension: str, instruction: str) -> str:
    """Apply one targeted improvement to the current text."""
    tag = f"[{dimension.upper()}]"
    return f"{text} {tag} {instruction}"


# ── Graph nodes ───────────────────────────────────────────────────────────────


def draft_node(state: RefinementState) -> RefinementState:
    initial = produce_initial_draft(state["prompt"])
    return {**state, "initial_draft": initial, "current_text": initial}


def refine_node(state: RefinementState) -> RefinementState:
    """Apply all refinement rounds sequentially, recording each revision."""
    text = state["current_text"]
    revisions: list[Revision] = list(state["revisions"])

    for i, (dimension, instruction) in enumerate(REFINEMENT_ROUNDS, start=1):
        text = refine(text, i, dimension, instruction)
        revisions.append(
            Revision(
                round=i,
                dimension=dimension,
                instruction=instruction,
                text=text,
            )
        )

    return {**state, "revisions": revisions, "current_text": text}


def finalize_node(state: RefinementState) -> RefinementState:
    rounds_summary = ", ".join(r["dimension"] for r in state["revisions"])
    answer = (
        f"Refined over {len(state['revisions'])} round(s) [{rounds_summary}].\n"
        f"Final text: {state['current_text']}"
    )
    return {**state, "answer": answer}


# ── Runtime ───────────────────────────────────────────────────────────────────


def run_with_langgraph(prompt: str) -> tuple[str, RefinementState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: RefinementState = {
            "prompt": prompt,
            "initial_draft": "",
            "revisions": [],
            "current_text": "",
            "answer": "",
        }
        state = finalize_node(refine_node(draft_node(state)))
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(RefinementState)
    graph.add_node("draft", draft_node)
    graph.add_node("refine", refine_node)
    graph.add_node("finalize", finalize_node)
    graph.add_edge(START, "draft")
    graph.add_edge("draft", "refine")
    graph.add_edge("refine", "finalize")
    graph.add_edge("finalize", END)

    app = graph.compile()
    result: RefinementState = typed_state(app.invoke(
        {
            "prompt": prompt,
            "initial_draft": "",
            "revisions": [],
            "current_text": "",
            "answer": "",
        }
    ))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: RefinementState) -> str:
    lines = [
        "Pattern: Iterative Refinement",
        f"Runtime: {runtime} with optional LangSmith tracing",
        f"Input: {state['prompt'][:80]}",
        f"Initial draft: {state['initial_draft']!r}",
        f"── {len(state['revisions'])} refinement round(s) ──",
    ]
    for rev in state["revisions"]:
        text_preview = rev["text"][:80]
        ellipsis = "…" if len(rev["text"]) > 80 else ""
        lines.append(
            f"  round {rev['round']} [{rev['dimension']}]: {text_preview}{ellipsis}"
        )

    lines.append("── final ──")
    final_text = state["current_text"][:120]
    final_ellipsis = "…" if len(state["current_text"]) > 120 else ""
    lines.append(f"  {final_text}{final_ellipsis}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo("demo.iterative-refinement")
    def traced_run(user_prompt: str) -> tuple[str, RefinementState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "produce_initial_draft",
    "refine",
    "run_with_langgraph",
    "render_result",
    "run",
]
