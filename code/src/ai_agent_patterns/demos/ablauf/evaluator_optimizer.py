"""Evaluator-Optimizer (Generator-Critic): Generator erzeugt Entwurf, Critic bewertet, Generator überarbeitet.

Der Lernpunkt: Zwei getrennte Rollen statt Selbstkritik — `generator` und `evaluator` sind
separate Funktionen. Das `verdict`-Objekt mit `ok` und `notes` treibt die Schleife und macht
Abbruchbedingung und Feedback sichtbar.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class EvaluationResult(TypedDict):
    score: int  # 0–100
    passed: bool
    feedback: str


class EvalOptState(TypedDict):
    prompt: str
    draft: str
    evaluation: EvaluationResult
    optimized: str
    answer: str


# ── Generator ─────────────────────────────────────────────────────────────────


def generator(prompt: str) -> str:
    """Produce an initial draft from the prompt."""
    return f"Initial draft: {prompt[:60]}."


# ── Evaluator ─────────────────────────────────────────────────────────────────


def evaluator(draft: str) -> EvaluationResult:
    """Score the draft and emit structured feedback.

    Passing criteria (visible to reader):
    - length >= 20 characters
    - ends with a period
    - contains at least one word longer than 5 characters
    """
    long_word = any(len(w) > 5 for w in draft.split())
    score = 0
    feedback_parts: list[str] = []

    if len(draft) >= 20:
        score += 40
    else:
        feedback_parts.append("too short (need >= 20 chars)")

    if draft.endswith("."):
        score += 40
    else:
        feedback_parts.append("must end with a period")

    if long_word:
        score += 20
    else:
        feedback_parts.append("include at least one word longer than 5 chars")

    passed = score >= 80
    feedback = "OK" if not feedback_parts else "; ".join(feedback_parts)
    return EvaluationResult(score=score, passed=passed, feedback=feedback)


# ── Optimizer ─────────────────────────────────────────────────────────────────


def optimizer(draft: str, evaluation: EvaluationResult) -> str:
    """Apply the evaluator's feedback to improve the draft."""
    if evaluation["passed"]:
        return draft  # nothing to fix

    improved = draft
    if "too short" in evaluation["feedback"]:
        improved += (
            " This expanded version adds necessary detail to meet length requirements."
        )
    if "must end with a period" in evaluation["feedback"]:
        improved = improved.rstrip() + "."
    if "longer than 5 chars" in evaluation["feedback"]:
        improved += " Sophisticated vocabulary included."
    return improved


# ── Graph nodes ───────────────────────────────────────────────────────────────


def generate_node(state: EvalOptState) -> EvalOptState:
    draft = generator(state["prompt"])
    return {**state, "draft": draft}


def evaluate_node(state: EvalOptState) -> EvalOptState:
    evaluation = evaluator(state["draft"])
    return {**state, "evaluation": evaluation}


def optimize_node(state: EvalOptState) -> EvalOptState:
    optimized = optimizer(state["draft"], state["evaluation"])
    ev = state["evaluation"]
    answer = (
        f"Generator draft: {state['draft']!r}\n"
        f"Evaluator score: {ev['score']}/100 "
        f"(passed={ev['passed']}), feedback: {ev['feedback']!r}\n"
        f"Optimizer output: {optimized!r}"
    )
    return {**state, "optimized": optimized, "answer": answer}


# ── Runtime ───────────────────────────────────────────────────────────────────


def run_with_langgraph(prompt: str) -> tuple[str, EvalOptState]:
    empty_eval = EvaluationResult(score=0, passed=False, feedback="")
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: EvalOptState = {
            "prompt": prompt,
            "draft": "",
            "evaluation": empty_eval,
            "optimized": "",
            "answer": "",
        }
        state = optimize_node(evaluate_node(generate_node(state)))
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(EvalOptState)
    graph.add_node("generate", generate_node)
    graph.add_node("evaluate", evaluate_node)
    graph.add_node("optimize", optimize_node)
    graph.add_edge(START, "generate")
    graph.add_edge("generate", "evaluate")
    graph.add_edge("evaluate", "optimize")
    graph.add_edge("optimize", END)

    app = graph.compile()
    result: EvalOptState = typed_state(
        app.invoke(
            {
                "prompt": prompt,
                "draft": "",
                "evaluation": empty_eval,
                "optimized": "",
                "answer": "",
            }
        )
    )
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: EvalOptState) -> str:
    ev = state["evaluation"]
    lines = [
        "Pattern: Evaluator-Optimizer (Generator-Critic)",
        f"Runtime: {runtime} with optional LangSmith tracing",
        f"Input: {state['prompt'][:80]}",
        "── generator ──",
        f"  draft: {state['draft']!r}",
        "── evaluator ──",
        f"  score={ev['score']}/100 | passed={ev['passed']} | feedback={ev['feedback']!r}",
        "── optimizer ──",
        f"  optimized: {state['optimized']!r}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo("demo.evaluator-optimizer")
    def traced_run(user_prompt: str) -> tuple[str, EvalOptState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "generator",
    "evaluator",
    "optimizer",
    "run_with_langgraph",
    "render_result",
    "run",
]
