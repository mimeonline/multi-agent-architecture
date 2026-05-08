"""LLM-as-Judge: Ein zweites Modell bewertet Ausgaben des ersten anhand schriftlich fixierter Kriterien.

Der Lernpunkt: Die Rubrik ist eine Liste benannter Kriterien, jedes mit Score 1–5. Der Judge
aggregiert per Mittelwert — transparent nachvollziehbar und kalibrierbar gegen menschliche
Referenzwerte.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "llm-as-judge"

# Rubric criteria with descriptions
RUBRIC: dict[str, str] = {
    "clarity": "Is the answer easy to understand, well-structured, and concise?",
    "accuracy": "Is the answer factually correct and complete?",
    "relevance": "Does the answer directly address the question asked?",
}


class CriterionScore(TypedDict):
    criterion: str
    score: int  # 1–5
    rationale: str


class CandidateEvaluation(TypedDict):
    candidate_id: str
    answer: str
    scores: list[CriterionScore]
    aggregate: float


class JudgeState(TypedDict):
    question: str
    candidates: list[str]
    evaluations: list[CandidateEvaluation]
    best_candidate: str
    best_score: float


def judge_candidate(candidate_id: str, answer: str, question: str) -> CandidateEvaluation:
    """Deterministic mock judge: scores based on structural properties of the answer."""
    word_count = len(answer.split())
    has_structure = any(marker in answer for marker in [":", "1.", "-", "•"])
    mentions_question_words = any(w in answer.lower() for w in question.lower().split() if len(w) > 4)

    # Clarity: penalise very short or very long answers
    clarity = 5 if 20 <= word_count <= 80 else (3 if word_count < 10 else 2)
    clarity_rationale = f"word_count={word_count}, structured={has_structure}"

    # Accuracy: boost if the answer uses structured information (proxy for thoroughness)
    accuracy = 4 if has_structure else 3
    accuracy_rationale = f"structured_format={has_structure}"

    # Relevance: did the answer reference the question's key terms?
    relevance = 5 if mentions_question_words else 2
    relevance_rationale = f"mentions_question_terms={mentions_question_words}"

    scores: list[CriterionScore] = [
        {"criterion": "clarity", "score": clarity, "rationale": clarity_rationale},
        {"criterion": "accuracy", "score": accuracy, "rationale": accuracy_rationale},
        {"criterion": "relevance", "score": relevance, "rationale": relevance_rationale},
    ]
    aggregate = round(sum(s["score"] for s in scores) / len(scores), 2)

    return CandidateEvaluation(
        candidate_id=candidate_id,
        answer=answer,
        scores=scores,
        aggregate=aggregate,
    )


def run_plain_python(prompt: str) -> tuple[str, JudgeState]:
    question = prompt or "What are the main benefits of distributed tracing for AI agents?"

    candidates = [
        # Candidate A: short, vague
        "Tracing helps you debug agents.",
        # Candidate B: structured, thorough, references question terms
        (
            "Distributed tracing provides three main benefits for AI agents: "
            "1. Visibility into which tools were called and in what order. "
            "2. Latency profiling per span so slow steps are identified. "
            "3. Error attribution — faults are localized to the exact sub-call that failed."
        ),
        # Candidate C: medium length, somewhat relevant
        (
            "Using distributed tracing you can see the full call tree of an agent run, "
            "including tool calls and LLM inference steps, each with their own duration."
        ),
    ]

    evaluations = [
        judge_candidate(f"candidate_{chr(65 + i)}", answer, question)
        for i, answer in enumerate(candidates)
    ]

    best = max(evaluations, key=lambda e: e["aggregate"])

    state: JudgeState = {
        "question": question,
        "candidates": candidates,
        "evaluations": evaluations,
        "best_candidate": best["candidate_id"],
        "best_score": best["aggregate"],
    }
    return "plain Python judge (rubric scoring)", state


def render_result(runtime: str, state: JudgeState) -> str:
    lines = [
        "Pattern: LLM-as-Judge",
        f"Runtime: {runtime}",
        "Mechanic: rubric with named criteria -> per-candidate scores (1-5) -> mean aggregate -> winner",
        "",
        f"Question: {state['question'][:80]}",
        "",
        "Rubric criteria:",
        *[f"  {criterion}: {desc}" for criterion, desc in RUBRIC.items()],
        "",
        "Evaluations:",
    ]
    for ev in state["evaluations"]:
        lines.append(f"\n  {ev['candidate_id']} (aggregate={ev['aggregate']:.2f}):")
        lines.append(f"    Answer: \"{ev['answer'][:80]}{'...' if len(ev['answer']) > 80 else ''}\"")
        for s in ev["scores"]:
            lines.append(f"    {s['criterion']:10} {s['score']}/5  ({s['rationale']})")
    lines.extend([
        "",
        f"Winner: {state['best_candidate']} with aggregate score {state['best_score']:.2f}",
    ])
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, JudgeState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["RUBRIC", "judge_candidate", "run_plain_python", "render_result", "run"]
