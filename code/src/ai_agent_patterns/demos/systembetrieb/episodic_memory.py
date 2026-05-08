"""Episodic Memory: Abgeschlossene Aufgaben werden als Episoden gespeichert und bei ähnlichen Fällen abgerufen.

Der Lernpunkt: Vor jeder neuen Anfrage sucht der Agent nach einer ähnlichen Episode aus
vergangener Erfahrung. Jede Episode trägt Ziel, Verlauf und Ausgang — strukturiertes
Erfahrungsgedächtnis statt roher Konversationshistorie.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "episodic-memory"


class Episode(TypedDict):
    prompt: str
    answer: str
    keywords: set[str]


class EpisodicState(TypedDict):
    prompt: str
    retrieved_episode: Episode | None
    similarity_score: float
    answer: str
    episode_store: list[Episode]


_SEED_EPISODES: list[Episode] = [
    {
        "prompt": "How do I sort a list in Python?",
        "answer": "Use list.sort() or sorted().",
        "keywords": {"sort", "list", "python"},
    },
    {
        "prompt": "What is a decorator in Python?",
        "answer": "A decorator wraps a function to extend its behaviour.",
        "keywords": {"decorator", "python", "function", "wrap"},
    },
    {
        "prompt": "How does a hash map work?",
        "answer": "A hash map uses a hash function to map keys to buckets for O(1) lookups.",
        "keywords": {"hash", "map", "bucket", "key", "lookup"},
    },
]


def _keywords(text: str) -> set[str]:
    stopwords = {"a", "an", "the", "in", "is", "of", "to", "do", "how", "what", "i", "does", "work"}
    return {w.lower().strip("?.,!") for w in text.split() if w.lower().strip("?.,!") not in stopwords}


def _jaccard(a: set[str], b: set[str]) -> float:
    if not a and not b:
        return 0.0
    return len(a & b) / len(a | b)


def retrieve_similar_episode(state: EpisodicState) -> EpisodicState:
    """Find the episode most similar to the current prompt via keyword Jaccard similarity."""
    prompt_kw = _keywords(state["prompt"])
    best: Episode | None = None
    best_score = -1.0
    for ep in state["episode_store"]:
        score = _jaccard(prompt_kw, ep["keywords"])
        if score > best_score:
            best_score = score
            best = ep
    return {**state, "retrieved_episode": best, "similarity_score": round(best_score, 3)}


def answer_informed_by_episode(state: EpisodicState) -> EpisodicState:
    """Produce an answer, reusing context from the retrieved episode when relevant."""
    if state["retrieved_episode"] and state["similarity_score"] > 0.1:
        ref = state["retrieved_episode"]["answer"]
        answer = (
            f"Similar past task found (score={state['similarity_score']}): "
            f"\"{state['retrieved_episode']['prompt']}\" -> {ref}. "
            f"Applied to current: {state['prompt']}"
        )
    else:
        answer = f"No close episode found (score={state['similarity_score']}). Answering fresh: {state['prompt']}"
    return {**state, "answer": answer}


def append_episode_to_store(state: EpisodicState) -> EpisodicState:
    """Persist the current task as a new episode for future retrieval."""
    new_ep: Episode = {
        "prompt": state["prompt"],
        "answer": state["answer"],
        "keywords": _keywords(state["prompt"]),
    }
    return {**state, "episode_store": list(state["episode_store"]) + [new_ep]}


def run_plain_python(prompt: str) -> EpisodicState:
    state: EpisodicState = {
        "prompt": prompt,
        "retrieved_episode": None,
        "similarity_score": 0.0,
        "answer": "",
        "episode_store": list(_SEED_EPISODES),
    }
    state = retrieve_similar_episode(state)
    state = answer_informed_by_episode(state)
    return append_episode_to_store(state)


def render_result(runtime: str, state: EpisodicState) -> str:
    lines = [
        "Pattern: Episodic Memory",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"Episode store before retrieval ({len(state['episode_store']) - 1} seed episodes):",
    ]
    for ep in state["episode_store"][:-1]:
        lines.append(f"  - \"{ep['prompt']}\"  keywords={ep['keywords']}")
    lines.append("")
    if state["retrieved_episode"]:
        ep = state["retrieved_episode"]
        lines += [
            f"Retrieved (Jaccard score={state['similarity_score']}): \"{ep['prompt']}\"",
            f"  -> {ep['answer']}",
        ]
    else:
        lines.append("No episode retrieved.")
    lines += [
        "",
        f"Answer: {state['answer']}",
        "",
        f"New episode appended: \"{state['episode_store'][-1]['prompt']}\"",
        f"Total episodes now: {len(state['episode_store'])}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, EpisodicState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "Episode",
    "EpisodicState",
    "retrieve_similar_episode",
    "answer_informed_by_episode",
    "append_episode_to_store",
    "run_plain_python",
    "render_result",
    "run",
]
