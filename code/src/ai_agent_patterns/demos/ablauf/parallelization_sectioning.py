"""Parallelization (Sectioning): Eingabe in unabhängige Abschnitte zerlegen, jeden separat verarbeiten.

Der Lernpunkt: Sektionen kennen einander nie — jede läuft isoliert. Ein `consolidator`-Schritt
führt die Teilresultate am Ende zusammen. Die Abschnittsgrenze ist die sichtbare Parallelitätseinheit.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class Section(TypedDict):
    id: str
    focus: str
    content: str


class SectioningState(TypedDict):
    prompt: str
    sections: list[Section]
    section_results: dict[str, str]
    answer: str


# ── Decompose ─────────────────────────────────────────────────────────────────

def decompose_into_sections(prompt: str) -> list[Section]:
    """Split the prompt into named sections, each with an independent focus."""
    words = prompt.split()
    third = max(1, len(words) // 3)
    return [
        Section(id="introduction", focus="context and background",
                content=" ".join(words[:third])),
        Section(id="main_body",    focus="core analysis",
                content=" ".join(words[third : 2 * third])),
        Section(id="conclusion",   focus="implications and next steps",
                content=" ".join(words[2 * third :])),
    ]


# ── Section workers ───────────────────────────────────────────────────────────

def process_section(section: Section) -> str:
    """Process one section independently (in production this runs in parallel for all sections)."""
    word_count = len(section["content"].split())
    preview = section["content"][:40].rstrip() + ("…" if len(section["content"]) > 40 else "")
    return f"[{section['id']}] focus={section['focus']!r}, words={word_count}, preview={preview!r}"


# ── Consolidate ───────────────────────────────────────────────────────────────

def consolidate(section_results: dict[str, str]) -> str:
    """Merge section outputs into a single coherent result."""
    parts = [f"  {sid}: {result}" for sid, result in section_results.items()]
    return "Consolidated {} section(s):\n".format(len(section_results)) + "\n".join(parts)


# ── Graph nodes ───────────────────────────────────────────────────────────────

def decompose_node(state: SectioningState) -> SectioningState:
    sections = decompose_into_sections(state["prompt"])
    return {**state, "sections": sections}


def process_sections_node(state: SectioningState) -> SectioningState:
    # Each section is processed independently — parallel in production
    results = {s["id"]: process_section(s) for s in state["sections"]}
    return {**state, "section_results": results}


def consolidate_node(state: SectioningState) -> SectioningState:
    return {**state, "answer": consolidate(state["section_results"])}


# ── Runtime ───────────────────────────────────────────────────────────────────

def run_with_langgraph(prompt: str) -> tuple[str, SectioningState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: SectioningState = {
            "prompt": prompt, "sections": [], "section_results": {}, "answer": "",
        }
        state = consolidate_node(process_sections_node(decompose_node(state)))
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(SectioningState)
    graph.add_node("decompose", decompose_node)
    graph.add_node("process_sections", process_sections_node)
    graph.add_node("consolidate", consolidate_node)
    graph.add_edge(START, "decompose")
    graph.add_edge("decompose", "process_sections")
    graph.add_edge("process_sections", "consolidate")
    graph.add_edge("consolidate", END)

    app = graph.compile()
    result: SectioningState = typed_state(app.invoke({"prompt": prompt, "sections": [], "section_results": {}, "answer": ""}))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: SectioningState) -> str:
    section_ids = [s["id"] for s in state["sections"]]
    lines = [
        "Pattern: Parallelization (Sectioning)",
        f"Runtime: {runtime} with optional LangSmith tracing",
        f"Input: {state['prompt'][:80]}{'...' if len(state['prompt']) > 80 else ''}",
        f"Sections identified: {section_ids}",
        "── per-section results (each processed independently) ──",
    ]
    for sid, result in state["section_results"].items():
        lines.append(f"  {result}")
    lines.append("── consolidation ──")
    lines.append(state["answer"])
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo("demo.parallelization-sectioning")
    def traced_run(user_prompt: str) -> tuple[str, SectioningState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "decompose_into_sections",
    "process_section",
    "consolidate",
    "run_with_langgraph",
    "render_result",
    "run",
]
