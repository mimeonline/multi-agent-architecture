"""Checkpointing / Resumability: Nach jedem Schritt wird der vollständige Zustand persistiert.

Der Lernpunkt: Der Store ist per `thread_id` adressiert — dieselbe ID hydratisiert denselben
Lauf, auch nach Tagen Pause. `completed_steps` als Set verhindert Doppelausführung beim Resume.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "checkpointing-resumability"


class StepResult(TypedDict):
    step: str
    output: str


class CheckpointState(TypedDict):
    thread_id: str
    completed_steps: list[StepResult]
    next_step_index: int
    phase: str  # "initial" | "resumed"


# In-memory checkpoint store (simulates durable storage)
_CHECKPOINT_STORE: dict[str, CheckpointState] = {}


def save_checkpoint(thread_id: str, state: CheckpointState) -> None:
    import copy
    _CHECKPOINT_STORE[thread_id] = copy.deepcopy(state)


def load_checkpoint(thread_id: str) -> CheckpointState | None:
    return _CHECKPOINT_STORE.get(thread_id)


# --- Step implementations ---

def step_fetch(prompt: str) -> str:
    return f"fetched data for: {prompt[:40]}"


def step_process(prompt: str) -> str:
    return f"processed: {prompt[:40]}"


def step_finalize(prompt: str) -> str:
    return f"finalized and stored result for: {prompt[:40]}"


_STEPS = [
    ("step_fetch", step_fetch),
    ("step_process", step_process),
    ("step_finalize", step_finalize),
]


def run_from_checkpoint(thread_id: str, prompt: str, interrupt_before: int | None = None) -> CheckpointState:
    existing = load_checkpoint(thread_id)
    if existing:
        state = existing
        state["phase"] = "resumed"
    else:
        state = CheckpointState(
            thread_id=thread_id,
            completed_steps=[],
            next_step_index=0,
            phase="initial",
        )

    for i, (name, fn) in enumerate(_STEPS):
        if i < state["next_step_index"]:
            continue  # already done — skip
        if interrupt_before is not None and i == interrupt_before:
            # Simulate crash: save what we have and stop
            save_checkpoint(thread_id, state)
            break
        output = fn(prompt)
        state["completed_steps"].append({"step": name, "output": output})
        state["next_step_index"] = i + 1
        save_checkpoint(thread_id, state)

    return state


def run_plain_python(prompt: str) -> tuple[str, dict[str, CheckpointState]]:
    thread_id = "thread-demo-42"
    _CHECKPOINT_STORE.clear()  # fresh store for each demo run

    # Phase 1: run steps 0 and 1, then interrupt before step 2
    phase1 = run_from_checkpoint(thread_id, prompt, interrupt_before=2)

    # Phase 2: resume with same thread_id — picks up from step 2
    phase2 = run_from_checkpoint(thread_id, prompt, interrupt_before=None)

    return "plain Python checkpoint store (dict)", {"phase1": phase1, "phase2": phase2}


def render_result(runtime: str, states: dict[str, CheckpointState]) -> str:  # type: ignore[override]
    p1 = states["phase1"]
    p2 = states["phase2"]
    lines = [
        "Pattern: Checkpointing / Resumability",
        f"Runtime: {runtime}",
        "Mechanic: state saved after each step; same thread_id resumes from last checkpoint",
        "",
        f"Thread ID: {p1['thread_id']}",
        "",
        "Phase 1 (interrupted before step_finalize):",
        *[f"  [done] {s['step']} -> {s['output']}" for s in p1["completed_steps"]],
        f"  [interrupted] next_step_index={p1['next_step_index']} saved to checkpoint store",
        "",
        "Phase 2 (resumed from checkpoint):",
        f"  Resumed at step index {p1['next_step_index']}",
        *[f"  [done] {s['step']} -> {s['output']}" for s in p2["completed_steps"]],
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, dict[str, CheckpointState]]:
        return run_plain_python(user_prompt)

    runtime, states = traced_run(prompt)
    return render_result(runtime, states)


__all__ = ["save_checkpoint", "load_checkpoint", "run_from_checkpoint", "run_plain_python", "render_result", "run"]
