"""Vector Memory: Inhalte werden als Vektoren gespeichert und über Ähnlichkeit wiedergefunden.

Der Lernpunkt: Ein Mini-VectorStore repräsentiert Dokumente als Wortmengen; Ähnlichkeit
wird per Jaccard-Similarity berechnet. Top-k Retrieval speist ein RAG-Template — Wortlaut
spielt keine Rolle, Bedeutung schon.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "vector-memory"


class VectorDoc(TypedDict):
    doc_id: str
    text: str
    word_set: set[str]


class VectorState(TypedDict):
    prompt: str
    vector_store: list[VectorDoc]
    query_words: set[str]
    retrieved_docs: list[tuple[float, VectorDoc]]  # (score, doc)
    answer: str


_VECTOR_STORE: list[VectorDoc] = [
    {
        "doc_id": "doc_1",
        "text": "Python is a dynamically typed, interpreted programming language.",
        "word_set": {"python", "dynamically", "typed", "interpreted", "programming", "language"},
    },
    {
        "doc_id": "doc_2",
        "text": "LangGraph builds stateful agent workflows as directed graphs.",
        "word_set": {"langgraph", "builds", "stateful", "agent", "workflows", "directed", "graphs"},
    },
    {
        "doc_id": "doc_3",
        "text": "Retrieval-Augmented Generation (RAG) grounds LLM answers in retrieved documents.",
        "word_set": {"retrieval", "augmented", "generation", "rag", "grounds", "llm", "answers", "retrieved", "documents"},
    },
    {
        "doc_id": "doc_4",
        "text": "Vector embeddings represent text as high-dimensional numerical vectors.",
        "word_set": {"vector", "embeddings", "represent", "text", "high", "dimensional", "numerical", "vectors"},
    },
    {
        "doc_id": "doc_5",
        "text": "Episodic memory stores past task episodes for future reuse.",
        "word_set": {"episodic", "memory", "stores", "past", "task", "episodes", "future", "reuse"},
    },
]


def _stopwords() -> set[str]:
    return {"a", "an", "the", "in", "is", "of", "to", "do", "how", "what", "i", "for", "and", "or"}


def _jaccard(a: set[str], b: set[str]) -> float:
    if not a and not b:
        return 0.0
    return len(a & b) / len(a | b)


def embed_query(state: VectorState) -> VectorState:
    """'Embed' the query as its word set (stand-in for a real embedding call)."""
    stopwords = _stopwords()
    words = {w.lower().strip("?.,!") for w in state["prompt"].split()} - stopwords
    return {**state, "query_words": words}


def retrieve_top_k(state: VectorState, k: int = 2) -> VectorState:
    """Rank all documents by Jaccard similarity and return top-k."""
    scored = [
        (_jaccard(state["query_words"], doc["word_set"]), doc)
        for doc in state["vector_store"]
    ]
    scored.sort(key=lambda x: x[0], reverse=True)
    return {**state, "retrieved_docs": scored[:k]}


def generate_rag_answer(state: VectorState) -> VectorState:
    """Insert retrieved doc texts into a RAG answer template."""
    if not state["retrieved_docs"] or state["retrieved_docs"][0][0] == 0.0:
        answer = f"No relevant documents found for: {state['prompt']}"
    else:
        context = "\n".join(
            f"  [{score:.3f}] {doc['doc_id']}: {doc['text']}"
            for score, doc in state["retrieved_docs"]
        )
        answer = f"RAG answer for \"{state['prompt']}\":\nContext:\n{context}\nSynthesis: see above docs."
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> VectorState:
    state: VectorState = {
        "prompt": prompt,
        "vector_store": list(_VECTOR_STORE),
        "query_words": set(),
        "retrieved_docs": [],
        "answer": "",
    }
    state = embed_query(state)
    state = retrieve_top_k(state, k=2)
    return generate_rag_answer(state)


def render_result(runtime: str, state: VectorState) -> str:
    lines = [
        "Pattern: Vector Memory",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        f"Query word-set (pseudo-embedding): {sorted(state['query_words'])}",
        "",
        f"Vector store ({len(state['vector_store'])} docs, similarity = Jaccard over word sets):",
    ]
    for doc in state["vector_store"]:
        score = _jaccard(state["query_words"], doc["word_set"])
        lines.append(f"  [{doc['doc_id']}] score={score:.3f}  words={sorted(doc['word_set'])}")
    lines.append("")
    lines.append("Top-2 retrieved:")
    for score, doc in state["retrieved_docs"]:
        lines.append(f"  score={score:.3f}  {doc['doc_id']}: {doc['text']}")
    lines += ["", f"Answer:\n{state['answer']}"]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, VectorState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "VectorDoc",
    "VectorState",
    "embed_query",
    "retrieve_top_k",
    "generate_rag_answer",
    "run_plain_python",
    "render_result",
    "run",
]
