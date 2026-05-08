"""Orchestrator-Workers: Orchestrator zerlegt das Ziel zur Laufzeit in typisierte Tasks und delegiert an Worker.

Der Lernpunkt: Die Dispatch-Tabelle `workers[task.kind]` macht die Zuteilung explizit —
der Orchestrator vergibt `kind` (research / write / check) und der Worker-Registry-Lookup
erfolgt zur Laufzeit, nicht statisch.
"""

from __future__ import annotations

from typing import Literal, TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state

TaskKind = Literal["research", "write", "check"]


class Task(TypedDict):
    id: str
    kind: TaskKind
    description: str


class WorkerResult(TypedDict):
    task_id: str
    kind: TaskKind
    output: str


class OrchestratorState(TypedDict):
    prompt: str
    tasks: list[Task]
    results: list[WorkerResult]
    answer: str


# ── Orchestrator ──────────────────────────────────────────────────────────────

def decompose_into_tasks(prompt: str) -> list[Task]:
    """Break the goal into typed subtasks. Task kinds determine which worker runs."""
    short = prompt[:40]
    return [
        Task(id="t1", kind="research",  description=f"Research background on: {short}"),
        Task(id="t2", kind="write",     description=f"Write a summary of: {short}"),
        Task(id="t3", kind="check",     description=f"Fact-check the summary for: {short}"),
    ]


# ── Workers (one per task kind) ───────────────────────────────────────────────

def research_worker(task: Task) -> WorkerResult:
    output = f"[research] Found 3 relevant sources for '{task['description'][:40]}'."
    return WorkerResult(task_id=task["id"], kind=task["kind"], output=output)


def write_worker(task: Task) -> WorkerResult:
    output = f"[write] Produced a 2-paragraph summary of '{task['description'][:40]}'."
    return WorkerResult(task_id=task["id"], kind=task["kind"], output=output)


def check_worker(task: Task) -> WorkerResult:
    output = f"[check] Verified all claims in '{task['description'][:40]}' — no issues found."
    return WorkerResult(task_id=task["id"], kind=task["kind"], output=output)


# Dispatch table — the orchestrator uses this to route tasks by kind
WORKER_REGISTRY: dict[TaskKind, object] = {
    "research": research_worker,
    "write":    write_worker,
    "check":    check_worker,
}


def dispatch(task: Task) -> WorkerResult:
    """Route a task to the appropriate worker based on its kind."""
    worker = WORKER_REGISTRY[task["kind"]]
    return worker(task)  # type: ignore[operator]


# ── Merger ────────────────────────────────────────────────────────────────────

def merge_results(results: list[WorkerResult]) -> str:
    parts = [f"  [{r['task_id']} / {r['kind']}] {r['output']}" for r in results]
    return "Orchestrator merged {} worker result(s):\n".format(len(results)) + "\n".join(parts)


# ── Graph nodes ───────────────────────────────────────────────────────────────

def orchestrate_node(state: OrchestratorState) -> OrchestratorState:
    tasks = decompose_into_tasks(state["prompt"])
    return {**state, "tasks": tasks}


def dispatch_workers_node(state: OrchestratorState) -> OrchestratorState:
    results = [dispatch(task) for task in state["tasks"]]
    return {**state, "results": results}


def merge_node(state: OrchestratorState) -> OrchestratorState:
    answer = merge_results(state["results"])
    return {**state, "answer": answer}


# ── Runtime ───────────────────────────────────────────────────────────────────

def run_with_langgraph(prompt: str) -> tuple[str, OrchestratorState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state: OrchestratorState = {"prompt": prompt, "tasks": [], "results": [], "answer": ""}
        state = merge_node(dispatch_workers_node(orchestrate_node(state)))
        return "plain Python fallback because langgraph is not installed", state

    graph = StateGraph(OrchestratorState)
    graph.add_node("orchestrate", orchestrate_node)
    graph.add_node("dispatch_workers", dispatch_workers_node)
    graph.add_node("merge", merge_node)
    graph.add_edge(START, "orchestrate")
    graph.add_edge("orchestrate", "dispatch_workers")
    graph.add_edge("dispatch_workers", "merge")
    graph.add_edge("merge", END)

    app = graph.compile()
    result: OrchestratorState = typed_state(app.invoke({"prompt": prompt, "tasks": [], "results": [], "answer": ""}))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: OrchestratorState) -> str:
    task_summary = ", ".join(f"{t['id']}={t['kind']}" for t in state["tasks"])
    lines = [
        "Pattern: Orchestrator-Workers",
        f"Runtime: {runtime} with optional LangSmith tracing",
        f"Input: {state['prompt'][:80]}",
        f"── orchestrator decomposed into {len(state['tasks'])} task(s): [{task_summary}] ──",
    ]
    for task in state["tasks"]:
        lines.append(f"  {task['id']} [{task['kind']}]: {task['description']}")
    lines.append("── worker results ──")
    for r in state["results"]:
        lines.append(f"  {r['output']}")
    lines.append("── merged ──")
    lines.append(state["answer"])
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo("demo.orchestrator-workers")
    def traced_run(user_prompt: str) -> tuple[str, OrchestratorState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "decompose_into_tasks",
    "dispatch",
    "merge_results",
    "WORKER_REGISTRY",
    "run_with_langgraph",
    "render_result",
    "run",
]
