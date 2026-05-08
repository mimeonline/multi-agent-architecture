"""Self-Consistency: Mehrere unabhängige Läufe erzeugen, die häufigste Antwort gewinnt.

Der Lernpunkt: 5 unabhängige Antworten werden mit verschiedenen Heuristiken erzeugt, dann
entscheidet ein `Counter` per Mehrheitsvotum. Korrekte Pfade konvergieren häufiger als
zufällige Fehler — Robustheit durch Modellvarianz.
"""

from __future__ import annotations

from collections import Counter
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class Sample(TypedDict):
    persona: str
    reasoning: str
    answer: str


class SelfConsistencyState(TypedDict):
    prompt: str
    samples: list[Sample]           # alle 5 unabhaengigen Laeufe
    vote_counts: dict[str, int]     # Antwort -> Stimmen
    majority_answer: str


# ---------------------------------------------------------------------------
# Sampling: 5 unabhaengige Laeufe mit verschiedenen Heuristiken/Personas
# ---------------------------------------------------------------------------

def _sample_pragmatist(prompt: str) -> Sample:
    answer = "Ja" if len(prompt) % 2 == 0 else "Nein"
    return {
        "persona": "Pragmatist",
        "reasoning": f"Bewertet Nutzen direkt: Prompt-Laenge {len(prompt)} -> {answer}",
        "answer": answer,
    }


def _sample_analyst(prompt: str) -> Sample:
    keywords = {"nicht", "kein", "nie", "schlecht", "falsch"}
    negative = any(w in prompt.lower().split() for w in keywords)
    answer = "Nein" if negative else "Ja"
    return {
        "persona": "Analyst",
        "reasoning": f"Sucht negative Schluesselbegriffe: gefunden={negative} -> {answer}",
        "answer": answer,
    }


def _sample_optimist(prompt: str) -> Sample:
    return {
        "persona": "Optimist",
        "reasoning": "Geht grundsaetzlich von positiver Antwort aus.",
        "answer": "Ja",
    }


def _sample_skeptic(prompt: str) -> Sample:
    uncertain = "?" in prompt or len(prompt.split()) < 5
    answer = "Nein" if uncertain else "Ja"
    return {
        "persona": "Skeptiker",
        "reasoning": f"Zweifelt bei kurzen oder unsicheren Prompts: unsicher={uncertain} -> {answer}",
        "answer": answer,
    }


def _sample_statistician(prompt: str) -> Sample:
    vowels = sum(1 for c in prompt.lower() if c in "aeiou")
    answer = "Ja" if vowels % 3 != 0 else "Nein"
    return {
        "persona": "Statistiker",
        "reasoning": f"Vokal-Heuristik: {vowels} Vokale, Modulo-3={vowels % 3} -> {answer}",
        "answer": answer,
    }


_SAMPLERS = [
    _sample_pragmatist,
    _sample_analyst,
    _sample_optimist,
    _sample_skeptic,
    _sample_statistician,
]


def generate_samples(prompt: str) -> list[Sample]:
    """Fuehrt alle 5 unabhaengigen Sampling-Laeufe aus."""
    return [sampler(prompt) for sampler in _SAMPLERS]


# ---------------------------------------------------------------------------
# Voting: Counter zaehlt Stimmen, Mehrheit gewinnt
# ---------------------------------------------------------------------------

def majority_vote(samples: list[Sample]) -> tuple[dict[str, int], str]:
    counts: Counter[str] = Counter(s["answer"] for s in samples)
    winner = counts.most_common(1)[0][0]
    return dict(counts), winner


# ---------------------------------------------------------------------------
# LangGraph-Nodes
# ---------------------------------------------------------------------------

def sampling_node(state: SelfConsistencyState) -> dict:
    samples = generate_samples(state["prompt"])
    return {"samples": samples, "vote_counts": {}, "majority_answer": ""}


def voting_node(state: SelfConsistencyState) -> dict:
    counts, winner = majority_vote(state["samples"])
    return {"vote_counts": counts, "majority_answer": winner}


# ---------------------------------------------------------------------------
# run_with_langgraph / plain Python fallback
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, SelfConsistencyState]:
    initial: SelfConsistencyState = {
        "prompt": prompt,
        "samples": [],
        "vote_counts": {},
        "majority_answer": "",
    }

    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: SelfConsistencyState = {**initial}
        state.update(sampling_node(state))
        state.update(voting_node(state))
        return "plain Python fallback (langgraph nicht installiert)", state

    graph = StateGraph(SelfConsistencyState)
    graph.add_node("sampling", sampling_node)
    graph.add_node("voting",   voting_node)
    graph.add_edge(START, "sampling")
    graph.add_edge("sampling", "voting")
    graph.add_edge("voting", END)

    app = graph.compile()
    result: SelfConsistencyState = typed_state(app.invoke(initial))
    return "LangGraph StateGraph", result


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

def render_result(runtime: str, state: SelfConsistencyState) -> str:
    sample_lines = [
        f"  Sample {i + 1} [{s['persona']}]: {s['answer']} | {s['reasoning']}"
        for i, s in enumerate(state["samples"])
    ]
    vote_line = ", ".join(f"{ans}: {n}" for ans, n in state["vote_counts"].items())
    return "\n".join(
        [
            "Pattern: Self-Consistency",
            f"Runtime: {runtime}",
            "",
            "-- 5 UNABHAENGIGE SAMPLES --",
            *sample_lines,
            "",
            f"-- VOTE-COUNTS -- {vote_line}",
            f"-- MEHRHEITSENTSCHEID -> {state['majority_answer']} --",
        ]
    )


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run(prompt: str) -> str:
    @trace_demo("demo.self-consistency")
    def traced_run(user_prompt: str) -> tuple[str, SelfConsistencyState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
