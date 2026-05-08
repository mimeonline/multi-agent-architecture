"""Market-based: Budget wird verteilt, Tasks haben Utility, Agents bieten Capacity-Preise.

Der Lernpunkt: Greedy-Marktregel — Tasks nach utility/cost absteigend sortiert, Allocations
unter Budget-Constraint. Die Allocations-Liste macht sichtbar, welche Tasks wem zugewiesen
wurden und warum andere unter den Tisch fallen.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


# ---------------------------------------------------------------------------
# Markt-Datenstrukturen
# ---------------------------------------------------------------------------

class Task(TypedDict):
    name: str
    utility: float   # Wert des Tasks (höher = wertvoller)
    cost: float      # Ressourcenkosten


class Allocation(TypedDict):
    task: str
    agent: str
    utility: float
    cost: float
    ratio: float     # utility / cost


class MarketState(TypedDict):
    request: str
    budget: float
    tasks: list[Task]
    allocations: list[Allocation]
    budget_used: float
    answer: str


# ---------------------------------------------------------------------------
# Agent-Pool mit Capacity-Preisen
# ---------------------------------------------------------------------------

AGENT_CAPACITY: dict[str, float] = {
    "agent_gpu_a": 3.0,   # teuer, leistungsstark
    "agent_gpu_b": 2.0,   # mittel
    "agent_cpu":   1.0,   # günstig, langsamer
}

TOTAL_BUDGET = 6.0


def define_tasks(request: str) -> list[Task]:
    """Definiert Tasks aus dem Request — Utilities und Costs sind deterministisch."""
    return [
        {"name": "data_preprocessing", "utility": 4.0, "cost": 1.0},
        {"name": "model_inference",    "utility": 9.0, "cost": 3.0},
        {"name": "result_aggregation", "utility": 3.0, "cost": 1.0},
        {"name": "report_generation",  "utility": 2.0, "cost": 2.0},
    ]


# ---------------------------------------------------------------------------
# Markt-Mechanik
# ---------------------------------------------------------------------------

def market_define_tasks(state: MarketState) -> MarketState:
    """Markt initialisiert Tasks aus dem Request."""
    tasks = define_tasks(state["request"])
    return {**state, "tasks": tasks}


def market_allocate(state: MarketState) -> MarketState:
    """Greedy-Allokation: Tasks nach utility/cost sortiert, günstigster Agent pro Task."""
    tasks_by_ratio = sorted(
        state["tasks"],
        key=lambda t: t["utility"] / t["cost"],
        reverse=True,
    )
    budget_remaining = state["budget"]
    allocations: list[Allocation] = []
    agent_names = list(AGENT_CAPACITY.keys())
    agent_idx = 0

    for task in tasks_by_ratio:
        if task["cost"] > budget_remaining:
            continue  # Task fällt weg — Budget reicht nicht
        # Günstigster Agent der noch capacity hat
        agent = agent_names[agent_idx % len(agent_names)]
        agent_idx += 1
        alloc: Allocation = {
            "task": task["name"],
            "agent": agent,
            "utility": task["utility"],
            "cost": task["cost"],
            "ratio": round(task["utility"] / task["cost"], 2),
        }
        allocations.append(alloc)
        budget_remaining -= task["cost"]

    budget_used = state["budget"] - budget_remaining
    answer = (
        f"Markt hat {len(allocations)} von {len(state['tasks'])} Tasks alloziert "
        f"bei Budget {state['budget']} (verwendet: {budget_used})."
    )
    return {**state, "allocations": allocations, "budget_used": budget_used, "answer": answer}


# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, MarketState]:
    init: MarketState = {
        "request": prompt,
        "budget": TOTAL_BUDGET,
        "tasks": [],
        "allocations": [],
        "budget_used": 0.0,
        "answer": "",
    }
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state = market_allocate(market_define_tasks(init))
        return "plain Python fallback (langgraph not installed)", state

    graph = StateGraph(MarketState)
    graph.add_node("market_define_tasks", market_define_tasks)
    graph.add_node("market_allocate", market_allocate)
    graph.add_edge(START, "market_define_tasks")
    graph.add_edge("market_define_tasks", "market_allocate")
    graph.add_edge("market_allocate", END)

    app = graph.compile()
    result: MarketState = typed_state(app.invoke(init))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: MarketState) -> str:
    alloc_lines = [
        f"  {a['task']} -> {a['agent']} "
        f"(utility={a['utility']}, cost={a['cost']}, ratio={a['ratio']})"
        for a in state["allocations"]
    ]
    return "\n".join([
        "Pattern: Market-based",
        f"Runtime: {runtime}",
        f"Request: {state['request']}",
        f"Budget: {state['budget']} | Used: {state['budget_used']}",
        "Allocations (greedy, sorted by utility/cost):",
        *alloc_lines,
        f"Answer: {state['answer']}",
    ])


def run(prompt: str) -> str:
    @trace_demo("demo.market-based")
    def traced_run(user_prompt: str) -> tuple[str, MarketState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
