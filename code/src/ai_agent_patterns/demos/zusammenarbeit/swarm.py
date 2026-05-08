"""Swarm: Dezentrale Peer-Agents schlagen je eine Aktion vor, Konsens-Regel bestimmt Ergebnis.

Der Lernpunkt: Kein zentraler Manager — jeder Peer wendet eine lokale Heuristik an.
Über mehrere Iterationen mit Budget sammelt ein Konsens-Mechanismus (häufigster Vorschlag)
die emergente Gruppenentscheidung. Peer-Vorschläge je Iteration sind explizit sichtbar.
"""

from __future__ import annotations

from collections import Counter
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo


class PeerProposal(TypedDict):
    peer: str
    action: str
    priority: int   # lokale Einschätzung des Peers (1=niedrig, 3=hoch)


class SwarmIteration(TypedDict):
    iteration: int
    proposals: list[PeerProposal]
    consensus: str


class SwarmState(TypedDict):
    task: str
    iterations: list[SwarmIteration]
    final_consensus: str
    answer: str


# ---------------------------------------------------------------------------
# Peer-Agents — lokale Heuristiken
# ---------------------------------------------------------------------------

PEERS = ["scout_a", "scout_b", "scout_c"]

# Aktionskatalog je Peer — deterministisch, keine LLM-Calls
_PEER_ACTIONS: dict[str, list[str]] = {
    "scout_a": ["fetch_source_1", "fetch_source_2", "validate_cache"],
    "scout_b": ["fetch_source_2", "fetch_source_3", "fetch_source_1"],
    "scout_c": ["validate_cache", "fetch_source_1", "fetch_source_2"],
}


def peer_propose(peer: str, task: str, iteration: int) -> PeerProposal:
    """Peer schlägt eine Aktion vor — lokale Heuristik rotiert durch Aktionskatalog."""
    actions = _PEER_ACTIONS[peer]
    action = actions[iteration % len(actions)]
    priority = (iteration % 3) + 1
    return {"peer": peer, "action": action, "priority": priority}


# ---------------------------------------------------------------------------
# Konsens-Mechanismus
# ---------------------------------------------------------------------------

def consensus_rule(proposals: list[PeerProposal]) -> str:
    """Häufigster Vorschlag (plurality vote) unter den Peer-Aktionen."""
    action_counts: Counter[str] = Counter(p["action"] for p in proposals)
    return action_counts.most_common(1)[0][0]


# ---------------------------------------------------------------------------
# Swarm-Iterationen
# ---------------------------------------------------------------------------

MAX_ITERATIONS = 3


def run_plain_python(prompt: str) -> tuple[str, SwarmState]:
    """Swarm-Loop ohne LangGraph — dezentrale Koordination über Iterationen."""
    iterations: list[SwarmIteration] = []

    for i in range(MAX_ITERATIONS):
        proposals = [peer_propose(peer, prompt, i) for peer in PEERS]
        consensus = consensus_rule(proposals)
        iterations.append({"iteration": i + 1, "proposals": proposals, "consensus": consensus})

    # Finaler Konsens: häufigster Konsens über alle Iterationen
    final_consensus = Counter(it["consensus"] for it in iterations).most_common(1)[0][0]
    answer = (
        f"Swarm ({len(PEERS)} Peers, {MAX_ITERATIONS} Iterationen) "
        f"hat Konsens '{final_consensus}' für Task '{prompt}' erreicht."
    )
    state: SwarmState = {
        "task": prompt,
        "iterations": iterations,
        "final_consensus": final_consensus,
        "answer": answer,
    }
    return "plain Python swarm loop", state


def run_with_langgraph(prompt: str) -> tuple[str, SwarmState]:
    # Swarm als iterativer Loop ist in Plain Python natürlicher als im StateGraph.
    return run_plain_python(prompt)


def render_result(runtime: str, state: SwarmState) -> str:
    iter_lines: list[str] = []
    for it in state["iterations"]:
        proposals_str = ", ".join(
            f"{p['peer']}={p['action']}(prio={p['priority']})" for p in it["proposals"]
        )
        iter_lines.append(f"  Iter {it['iteration']}: [{proposals_str}] -> consensus='{it['consensus']}'")

    return "\n".join([
        "Pattern: Swarm",
        f"Runtime: {runtime}",
        f"Task: {state['task']}",
        f"Peers: {PEERS}",
        "Iterations:",
        *iter_lines,
        f"Final consensus: {state['final_consensus']}",
        f"Answer: {state['answer']}",
    ])


def run(prompt: str) -> str:
    @trace_demo("demo.swarm")
    def traced_run(user_prompt: str) -> tuple[str, SwarmState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_plain_python", "run_with_langgraph", "render_result"]
