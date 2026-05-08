"""Contract Net: Aufgabe wird ausgeschrieben, Worker-Agents geben Bids, Gewinner wird gewählt.

Der Lernpunkt: Kein festes Routing — der Manager announced eine Aufgabe, Worker
antworten mit cost/confidence/expertise_match, und eine explizite Auswahlregel
(günstigstes Bid mit confidence >= Schwellwert) bestimmt den Gewinner.
"""

from __future__ import annotations

from typing import TypedDict, cast

from ai_agent_patterns.demos.common import trace_demo, typed_state

# ---------------------------------------------------------------------------
# Bid-Datenstruktur
# ---------------------------------------------------------------------------


class Bid(TypedDict):
    worker: str
    cost: float  # niedriger = günstiger
    confidence: float  # 0.0–1.0
    expertise_match: str  # "high" | "medium" | "low"


class ContractNetState(TypedDict):
    task: str
    bids: list[Bid]
    winner: str
    result: str


# ---------------------------------------------------------------------------
# Worker-Agents — geben je ein Bid ab
# ---------------------------------------------------------------------------


def worker_alpha_bid(task: str) -> Bid:
    """Worker Alpha: günstig, mittlere Confidence."""
    return {
        "worker": "worker_alpha",
        "cost": 2.0,
        "confidence": 0.70,
        "expertise_match": "medium",
    }


def worker_beta_bid(task: str) -> Bid:
    """Worker Beta: teurer, hohe Confidence, passt gut zur Aufgabe."""
    return {
        "worker": "worker_beta",
        "cost": 4.5,
        "confidence": 0.95,
        "expertise_match": "high",
    }


def worker_gamma_bid(task: str) -> Bid:
    """Worker Gamma: billig, aber niedrige Confidence."""
    return {
        "worker": "worker_gamma",
        "cost": 1.0,
        "confidence": 0.45,
        "expertise_match": "low",
    }


# ---------------------------------------------------------------------------
# Manager-Agent-Logik
# ---------------------------------------------------------------------------

MIN_CONFIDENCE = 0.60  # Bids unter diesem Schwellwert werden verworfen


def announce_task(state: ContractNetState) -> ContractNetState:
    """Manager schreibt die Aufgabe aus und sammelt Bids von allen Workers."""
    task = state["task"]
    bids: list[Bid] = [
        worker_alpha_bid(task),
        worker_beta_bid(task),
        worker_gamma_bid(task),
    ]
    return {**state, "bids": bids}


def select_winner(state: ContractNetState) -> ContractNetState:
    """Auswahlregel: günstigstes Bid unter qualifizierten Anbietern (confidence >= MIN_CONFIDENCE)."""
    qualified = [b for b in state["bids"] if b["confidence"] >= MIN_CONFIDENCE]
    if not qualified:
        return {**state, "winner": "none — kein Bid erfüllt Mindest-Confidence"}
    winner_bid = min(qualified, key=lambda b: b["cost"])
    return {**state, "winner": winner_bid["worker"]}


def execute_winner(state: ContractNetState) -> ContractNetState:
    """Gewinner-Worker führt die Aufgabe aus."""
    result = f"[{state['winner']}] Aufgabe ausgeführt: '{state['task']}'"
    return {**state, "result": result}


# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------


def run_with_langgraph(prompt: str) -> tuple[str, ContractNetState]:
    init: ContractNetState = {"task": prompt, "bids": [], "winner": "", "result": ""}
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state = execute_winner(select_winner(announce_task(init)))
        return "plain Python fallback (langgraph not installed)", state

    graph = StateGraph(ContractNetState)
    graph.add_node("announce_task", announce_task)
    graph.add_node("select_winner", select_winner)
    graph.add_node("execute_winner", execute_winner)
    graph.add_edge(START, "announce_task")
    graph.add_edge("announce_task", "select_winner")
    graph.add_edge("select_winner", "execute_winner")
    graph.add_edge("execute_winner", END)

    app = graph.compile()
    result: ContractNetState = typed_state(app.invoke(init))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: ContractNetState) -> str:
    bid_lines = [
        f"  {b['worker']}: cost={b['cost']}, confidence={b['confidence']}, "
        f"expertise={b['expertise_match']}"
        for b in state["bids"]
    ]
    return "\n".join(
        [
            "Pattern: Contract Net",
            f"Runtime: {runtime}",
            f"Task: {state['task']}",
            f"Min-confidence threshold: {MIN_CONFIDENCE}",
            "Bids:",
            *bid_lines,
            f"Winner: {state['winner']}",
            f"Result: {state['result']}",
        ]
    )


def run(prompt: str) -> str:
    @trace_demo("demo.contract-net")
    def traced_run(user_prompt: str) -> tuple[str, ContractNetState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
