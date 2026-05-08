"""Workflow DAG / Durable Execution: Der Lauf ist ein gerichteter Graph, dessen Zustand nach jedem Knoten persistiert.

Der Lernpunkt: Abhängigkeiten zwischen Tasks stehen im DAG — ein Knoten läuft erst, wenn
alle Vorläufer abgeschlossen sind. Ein dauerhaftes Dict speichert `completed_steps`, so
dass ein Crash mitten im Workflow fortsetzbar ist.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "workflow-dag-durable-execution"

MAX_RETRIES = 2


class NodeResult(TypedDict):
    status: str  # "ok" | "failed" | "skipped"
    retries: int
    output: str


class DAGState(TypedDict):
    dag: dict[str, list[str]]
    durable_store: dict[str, NodeResult]
    execution_order: list[str]
    outcome: str


# --- DAG node implementations ---

def node_fetch_data(inputs: dict[str, str]) -> str:
    return f"fetched dataset (rows=1024)"


def node_validate(inputs: dict[str, str]) -> str:
    fetch_out = inputs.get("fetch_data", "")
    return f"validated {fetch_out}"


def node_transform(inputs: dict[str, str]) -> str:
    validate_out = inputs.get("validate", "")
    return f"transformed: {validate_out}"


def node_enrich(inputs: dict[str, str]) -> str:
    fetch_out = inputs.get("fetch_data", "")
    return f"enriched: {fetch_out} with metadata"


def node_load(inputs: dict[str, str]) -> str:
    transform_out = inputs.get("transform", "")
    enrich_out = inputs.get("enrich", "")
    return f"loaded {transform_out} + {enrich_out} into warehouse"


_NODE_FNS = {
    "fetch_data": node_fetch_data,
    "validate": node_validate,
    "transform": node_transform,
    "enrich": node_enrich,
    "load": node_load,
}


def topo_sort(dag: dict[str, list[str]]) -> list[str]:
    """Kahn's algorithm for topological ordering."""
    in_degree: dict[str, int] = {node: 0 for node in dag}
    for node, deps in dag.items():
        for dep in deps:
            in_degree[node] = in_degree.get(node, 0)
        for dep in deps:
            pass  # deps are predecessors; node depends on dep
    # Rebuild: dag[node] = list of predecessors
    in_degree = {node: len(deps) for node, deps in dag.items()}
    queue = [n for n, d in in_degree.items() if d == 0]
    order: list[str] = []
    while queue:
        node = queue.pop(0)
        order.append(node)
        for candidate, deps in dag.items():
            if node in deps:
                in_degree[candidate] -= 1
                if in_degree[candidate] == 0:
                    queue.append(candidate)
    return order


def execute_dag(dag: dict[str, list[str]], durable_store: dict[str, NodeResult]) -> list[str]:
    order = topo_sort(dag)
    for node in order:
        if node in durable_store and durable_store[node]["status"] == "ok":
            # Already persisted — skip (durable resume)
            continue
        inputs = {dep: durable_store[dep]["output"] for dep in dag[node] if dep in durable_store}
        fn = _NODE_FNS[node]
        retries = 0
        while retries <= MAX_RETRIES:
            try:
                output = fn(inputs)
                durable_store[node] = {"status": "ok", "retries": retries, "output": output}
                break
            except Exception as exc:
                retries += 1
                if retries > MAX_RETRIES:
                    durable_store[node] = {"status": "failed", "retries": retries - 1, "output": str(exc)}
    return order


def run_plain_python(prompt: str) -> tuple[str, DAGState]:
    # DAG: node -> list of predecessor nodes
    dag: dict[str, list[str]] = {
        "fetch_data": [],
        "validate": ["fetch_data"],
        "transform": ["validate"],
        "enrich": ["fetch_data"],
        "load": ["transform", "enrich"],
    }
    durable_store: dict[str, NodeResult] = {}
    order = execute_dag(dag, durable_store)

    state: DAGState = {
        "dag": dag,
        "durable_store": durable_store,
        "execution_order": order,
        "outcome": "workflow complete" if all(v["status"] == "ok" for v in durable_store.values()) else "workflow failed",
    }
    return "plain Python DAG + durable dict store", state


def render_result(runtime: str, state: DAGState) -> str:
    lines = [
        "Pattern: Workflow DAG / Durable Execution",
        f"Runtime: {runtime}",
        "Mechanic: topo-sort DAG, execute nodes with retry, persist each result durably",
        "",
        "DAG edges (node: [predecessors]):",
        *[f"  {node}: {deps}" for node, deps in state["dag"].items()],
        "",
        "Execution trace:",
    ]
    for node in state["execution_order"]:
        result = state["durable_store"].get(node, {"status": "?", "retries": 0, "output": ""})
        retry_note = f" (retried {result['retries']}x)" if result["retries"] else ""
        lines.append(f"  [{result['status'].upper()}] {node}{retry_note} -> {result['output']}")
    lines.append("")
    lines.append(f"Outcome: {state['outcome']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, DAGState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["topo_sort", "execute_dag", "run_plain_python", "render_result", "run"]
