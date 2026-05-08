"""Map-Reduce: Eingaben auf unabhängige Chunks aufteilen, jeden einzeln mappen, am Ende reduzieren.

Der Lernpunkt: Die Zweiphasen-Trennung ist im Code direkt sichtbar — `mapped` enthält alle
Teilresultate, erst `reduce_fn(mapped)` sieht das Gesamtbild. Kein Chunk kennt einen anderen.
"""

from __future__ import annotations

import textwrap
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class MapReduceState(TypedDict):
    prompt: str
    chunks: list[str]
    mapped: list[str]
    answer: str


# ── Map phase ────────────────────────────────────────────────────────────────

def split_into_chunks(text: str, chunk_size: int = 8) -> list[str]:
    """Break the input into word-groups so each can be mapped independently."""
    words = text.split()
    chunks: list[str] = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i : i + chunk_size]))
    return chunks or [text]


def mapper(chunk: str) -> str:
    """Process a single chunk and return a partial result (word count + top keyword)."""
    words = chunk.split()
    keyword = next((w for w in words if len(w) > 4), words[0] if words else "?")
    return f"[words={len(words)}, keyword={keyword!r}]"


# ── Reduce phase ─────────────────────────────────────────────────────────────

def reducer(partials: list[str]) -> str:
    """Aggregate all partial results from the map phase into one final summary."""
    total_words = 0
    keywords: list[str] = []
    for partial in partials:
        try:
            total_words += int(partial.split("words=")[1].split(",")[0])
            keywords.append(partial.split("keyword=")[1].strip("[]'\""))
        except (IndexError, ValueError):
            pass
    return (
        f"Reduced {len(partials)} partial result(s) | "
        f"total_words={total_words} | top_keywords={keywords}"
    )


# ── Graph nodes ───────────────────────────────────────────────────────────────

def chunk_node(state: MapReduceState) -> MapReduceState:
    return {**state, "chunks": split_into_chunks(state["prompt"])}


def map_node(state: MapReduceState) -> MapReduceState:
    # Each chunk is mapped independently — in production these run in parallel
    mapped = [mapper(chunk) for chunk in state["chunks"]]
    return {**state, "mapped": mapped}


def reduce_node(state: MapReduceState) -> MapReduceState:
    return {**state, "answer": reducer(state["mapped"])}


# ── Runtime ───────────────────────────────────────────────────────────────────

def run_with_langgraph(prompt: str) -> tuple[str, MapReduceState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: MapReduceState = {"prompt": prompt, "chunks": [], "mapped": [], "answer": ""}
        state = reduce_node(map_node(chunk_node(state)))
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(MapReduceState)
    graph.add_node("chunk", chunk_node)
    graph.add_node("map", map_node)
    graph.add_node("reduce", reduce_node)
    graph.add_edge(START, "chunk")
    graph.add_edge("chunk", "map")
    graph.add_edge("map", "reduce")
    graph.add_edge("reduce", END)

    app = graph.compile()
    result: MapReduceState = typed_state(app.invoke({"prompt": prompt, "chunks": [], "mapped": [], "answer": ""}))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: MapReduceState) -> str:
    lines = [
        "Pattern: Map-Reduce",
        f"Runtime: {runtime} with optional LangSmith tracing",
        f"Input ({len(state['prompt'].split())} words): {textwrap.shorten(state['prompt'], 70)}",
        f"── MAP phase: {len(state['chunks'])} chunk(s) ──",
    ]
    for i, (chunk, partial) in enumerate(zip(state["chunks"], state["mapped"]), 1):
        lines.append(f"  chunk {i}: {textwrap.shorten(chunk, 40)!r}  →  {partial}")
    lines.append(f"── REDUCE ──")
    lines.append(f"  {state['answer']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo("demo.map-reduce")
    def traced_run(user_prompt: str) -> tuple[str, MapReduceState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "split_into_chunks",
    "mapper",
    "reducer",
    "run_with_langgraph",
    "render_result",
    "run",
]
