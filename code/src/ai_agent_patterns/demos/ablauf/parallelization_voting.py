"""Parallelization (Voting): N Kandidaten mit verschiedenen Strategien erzeugen, Mehrheit gewinnt.

Der Lernpunkt: Der `Counter` zählt normalisierte Antworten aller Kandidaten — die häufigste
gewinnt. Varianz sinkt ohne Judge-Modell; wer die Mehrheit bildet, ist direkt im Counter lesbar.
"""

from __future__ import annotations

from collections import Counter
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class Candidate(TypedDict):
    strategy: str
    response: str
    normalized: str


class VotingState(TypedDict):
    prompt: str
    candidates: list[Candidate]
    vote_tally: dict[str, int]
    winner: str
    answer: str


# ── Candidate generation (different strategies / styles) ─────────────────────

def generate_concise(prompt: str) -> Candidate:
    """Strategy A: answer in as few words as possible."""
    core = prompt.split()[0] if prompt.split() else "unknown"
    response = f"Answer: {core}."
    return Candidate(strategy="concise", response=response, normalized=response.lower().strip("."))


def generate_detailed(prompt: str) -> Candidate:
    """Strategy B: expand the prompt into a full sentence."""
    response = f"The answer to '{prompt[:40]}' is: {prompt.split()[0] if prompt.split() else 'unknown'}."
    normalized = response.split("is:")[1].strip(" .").lower() if "is:" in response else response.lower()
    return Candidate(strategy="detailed", response=response, normalized=normalized)


def generate_question_form(prompt: str) -> Candidate:
    """Strategy C: reframe as a direct yes/no or keyword answer."""
    core = prompt.split()[0].lower() if prompt.split() else "unknown"
    # Deterministic: short prompts get 'yes', longer ones get the first word
    response = "yes" if len(prompt) < 20 else core
    return Candidate(strategy="question_form", response=response, normalized=response.lower())


# ── Voting ────────────────────────────────────────────────────────────────────

def majority_vote(candidates: list[Candidate]) -> tuple[dict[str, int], str]:
    """Count normalized responses; return tally and the plurality winner."""
    tally: Counter[str] = Counter(c["normalized"] for c in candidates)
    winner = tally.most_common(1)[0][0]
    return dict(tally), winner


# ── Graph nodes ───────────────────────────────────────────────────────────────

def generate_candidates_node(state: VotingState) -> VotingState:
    prompt = state["prompt"]
    candidates = [
        generate_concise(prompt),
        generate_detailed(prompt),
        generate_question_form(prompt),
    ]
    return {**state, "candidates": candidates}


def vote_node(state: VotingState) -> VotingState:
    tally, winner = majority_vote(state["candidates"])
    # Find the first candidate whose normalized form matches the winner
    winning_candidate = next(
        (c for c in state["candidates"] if c["normalized"] == winner),
        state["candidates"][0],
    )
    answer = (
        f"Winner (plurality): {winner!r} "
        f"via strategy={winning_candidate['strategy']!r}, "
        f"response={winning_candidate['response']!r}"
    )
    return {**state, "vote_tally": tally, "winner": winner, "answer": answer}


# ── Runtime ───────────────────────────────────────────────────────────────────

def run_with_langgraph(prompt: str) -> tuple[str, VotingState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: VotingState = {
            "prompt": prompt, "candidates": [], "vote_tally": {}, "winner": "", "answer": "",
        }
        state = vote_node(generate_candidates_node(state))
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(VotingState)
    graph.add_node("generate_candidates", generate_candidates_node)
    graph.add_node("vote", vote_node)
    graph.add_edge(START, "generate_candidates")
    graph.add_edge("generate_candidates", "vote")
    graph.add_edge("vote", END)

    app = graph.compile()
    result: VotingState = typed_state(app.invoke(
        {"prompt": prompt, "candidates": [], "vote_tally": {}, "winner": "", "answer": ""}
    ))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: VotingState) -> str:
    lines = [
        "Pattern: Parallelization (Voting)",
        f"Runtime: {runtime} with optional LangSmith tracing",
        f"Input: {state['prompt'][:80]}",
        f"── {len(state['candidates'])} candidates generated in parallel ──",
    ]
    for c in state["candidates"]:
        lines.append(
            f"  [{c['strategy']}] {c['response']!r}  →  normalized={c['normalized']!r}"
        )
    lines.append(f"── vote tally: {state['vote_tally']} ──")
    lines.append(f"Winner: {state['answer']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo("demo.parallelization-voting")
    def traced_run(user_prompt: str) -> tuple[str, VotingState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "generate_concise",
    "generate_detailed",
    "generate_question_form",
    "majority_vote",
    "run_with_langgraph",
    "render_result",
    "run",
]
