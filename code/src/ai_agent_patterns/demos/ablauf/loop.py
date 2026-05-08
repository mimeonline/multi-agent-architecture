"""Loop: Einen Schritt wiederholen, bis eine explizite Abbruchbedingung erfüllt ist.

Der Lernpunkt: Die `while`-Schleife hat eine harte Obergrenze via `max_attempts` — Zähler
und Qualitätsschwelle liegen offen im State. Der Lesende sieht sofort, warum die Schleife
stoppt: Qualitätsziel erreicht oder Budget aufgebraucht.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state

MAX_ATTEMPTS = 4
QUALITY_THRESHOLD = 60  # score out of 100


class LoopState(TypedDict):
    prompt: str
    attempt: int
    draft: str
    quality_score: int
    passed: bool
    iterations: list[str]
    answer: str


# ── Worker ────────────────────────────────────────────────────────────────────


def produce_draft(prompt: str, attempt: int) -> str:
    """Produce a draft; each attempt adds a little more content."""
    base = f"Draft for '{prompt[:50]}'"
    extension = " [improved]" * attempt
    return base + extension + "."


# ── Quality check ─────────────────────────────────────────────────────────────


def assess_quality(draft: str) -> int:
    """Score the draft 0–100. Passes if length >= 60 chars and ends with '.'."""
    length_score = min(100, len(draft) * 2)
    ends_correctly = 10 if draft.endswith(".") else 0
    return length_score + ends_correctly


def quality_gate(score: int) -> bool:
    return score >= QUALITY_THRESHOLD


# ── Loop logic ────────────────────────────────────────────────────────────────


def run_loop(prompt: str) -> LoopState:
    """Run the worker-check-retry loop and return final state."""
    state: LoopState = {
        "prompt": prompt,
        "attempt": 0,
        "draft": "",
        "quality_score": 0,
        "passed": False,
        "iterations": [],
        "answer": "",
    }

    while state["attempt"] < MAX_ATTEMPTS and not state["passed"]:
        state["attempt"] += 1
        draft = produce_draft(prompt, state["attempt"])
        score = assess_quality(draft)
        passed = quality_gate(score)

        iteration_log = (
            f"attempt={state['attempt']} | "
            f"draft_len={len(draft)} | "
            f"score={score} | "
            f"passed={passed}"
        )
        state = {
            **state,
            "draft": draft,
            "quality_score": score,
            "passed": passed,
            "iterations": [*state["iterations"], iteration_log],
        }

    stop_reason = (
        "quality threshold reached"
        if state["passed"]
        else f"max_attempts={MAX_ATTEMPTS} exhausted"
    )
    state["answer"] = (
        f"Loop stopped after {state['attempt']} attempt(s): {stop_reason}. "
        f"Final score={state['quality_score']}."
    )
    return state


# ── LangGraph wrapper ─────────────────────────────────────────────────────────


def loop_node(state: LoopState) -> LoopState:
    """Single LangGraph node that runs the entire loop internally."""
    return run_loop(state["prompt"])


def run_with_langgraph(prompt: str) -> tuple[str, LoopState]:
    try:
        from langgraph.constants import END, START  # type: ignore[import-not-found]
        from langgraph.graph import StateGraph  # type: ignore[import-not-found]
    except ImportError:
        state = run_loop(prompt)
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(LoopState)
    graph.add_node("loop", loop_node)
    graph.add_edge(START, "loop")
    graph.add_edge("loop", END)

    app = graph.compile()
    init: LoopState = {
        "prompt": prompt,
        "attempt": 0,
        "draft": "",
        "quality_score": 0,
        "passed": False,
        "iterations": [],
        "answer": "",
    }
    result = typed_state(app.invoke(init))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: LoopState) -> str:
    lines = [
        "Pattern: Loop",
        f"Runtime: {runtime} with optional LangSmith tracing",
        f"Input: {state['prompt'][:80]}",
        f"Config: max_attempts={MAX_ATTEMPTS}, quality_threshold={QUALITY_THRESHOLD}",
        "── iteration log ──",
    ]
    for entry in state["iterations"]:
        lines.append(f"  {entry}")
    lines.append("── result ──")
    lines.append(f"  {state['answer']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo("demo.loop")
    def traced_run(user_prompt: str) -> tuple[str, LoopState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "produce_draft",
    "assess_quality",
    "quality_gate",
    "run_loop",
    "run_with_langgraph",
    "render_result",
    "run",
]
