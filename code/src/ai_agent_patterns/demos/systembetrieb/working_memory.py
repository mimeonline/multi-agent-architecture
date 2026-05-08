"""Working Memory / Scratchpad: Pro Aufgabe ein flüchtiger Notizblock für Tool-Ergebnisse und Zwischengedanken.

Der Lernpunkt: Das Scratchpad wächst während einer Aufgabe durch mehrere Sub-Steps; der
finale Syntheseschritt liest das gesamte Scratchpad. Mit Aufgabenende wird es verworfen —
kein Persistent-Store, reines Kurzzeitgedächtnis.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "working-memory"


class ScratchEntry(TypedDict):
    step: str
    note: str


class WorkingMemoryState(TypedDict):
    prompt: str
    scratchpad: list[ScratchEntry]
    answer: str


def parse_task(state: WorkingMemoryState) -> WorkingMemoryState:
    """Break the prompt into sub-tasks and write the parse result to scratchpad."""
    words = state["prompt"].split()
    entry: ScratchEntry = {
        "step": "parse_task",
        "note": f"Identified {len(words)} tokens. First token: '{words[0] if words else ''}'.",
    }
    return {**state, "scratchpad": state["scratchpad"] + [entry]}


def fetch_tool_result(state: WorkingMemoryState) -> WorkingMemoryState:
    """Simulate a tool call and write the (fake) result to scratchpad."""
    topic = state["prompt"].split()[0] if state["prompt"].split() else "unknown"
    entry: ScratchEntry = {
        "step": "fetch_tool_result",
        "note": f"Tool lookup for '{topic}' returned: definition_v1 (mocked, no LLM).",
    }
    return {**state, "scratchpad": state["scratchpad"] + [entry]}


def compute_intermediate_result(state: WorkingMemoryState) -> WorkingMemoryState:
    """Derive an intermediate conclusion from scratchpad notes and append it."""
    all_notes = "; ".join(e["note"] for e in state["scratchpad"])
    entry: ScratchEntry = {
        "step": "intermediate_result",
        "note": f"Combined observations: [{all_notes}].",
    }
    return {**state, "scratchpad": state["scratchpad"] + [entry]}


def synthesize_from_scratchpad(state: WorkingMemoryState) -> WorkingMemoryState:
    """Read the full scratchpad to compose the final answer."""
    steps_summary = ", ".join(e["step"] for e in state["scratchpad"])
    answer = (
        f"Working Memory / Scratchpad completed {len(state['scratchpad'])} steps ({steps_summary}). "
        f"Final note: {state['scratchpad'][-1]['note']}"
    )
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> WorkingMemoryState:
    state: WorkingMemoryState = {"prompt": prompt, "scratchpad": [], "answer": ""}
    state = parse_task(state)
    state = fetch_tool_result(state)
    state = compute_intermediate_result(state)
    return synthesize_from_scratchpad(state)


def render_result(runtime: str, state: WorkingMemoryState) -> str:
    lines = [
        "Pattern: Working Memory / Scratchpad",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"Scratchpad ({len(state['scratchpad'])} entries):",
    ]
    for i, entry in enumerate(state["scratchpad"], 1):
        lines.append(f"  [{i}] {entry['step']}: {entry['note']}")
    lines += ["", f"Answer: {state['answer']}"]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, WorkingMemoryState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "ScratchEntry",
    "WorkingMemoryState",
    "parse_task",
    "fetch_tool_result",
    "compute_intermediate_result",
    "synthesize_from_scratchpad",
    "run_plain_python",
    "render_result",
    "run",
]
