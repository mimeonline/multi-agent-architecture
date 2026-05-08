"""Adapter Pattern: Uneinheitliche externe APIs werden hinter einer stabilen Tool-Schnittstelle versteckt.

Der Lernpunkt: Zwei Backends (`JiraAPI.create`, `LinearAPI.submit`) liegen hinter dem
einen `TicketAdapter.agent_create_ticket(title, body)`. Der Agent kennt nur die
Adapter-Signatur — das Backend ist austauschbar, ohne den Agent anzufassen.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "adapter-pattern"


# --- External API A: Jira-style ---

class JiraAPI:
    """External API A: expects title + body as separate keyword args."""

    @staticmethod
    def create(title: str, body: str) -> dict[str, str]:
        return {"system": "Jira", "id": f"JIRA-{abs(hash(title)) % 9000 + 1000}", "title": title, "body": body}


# --- External API B: Linear-style ---

class LinearAPI:
    """External API B: expects a single payload dict."""

    @staticmethod
    def submit(payload: dict[str, str]) -> dict[str, str]:
        return {"system": "Linear", "id": f"LIN-{abs(hash(payload['title'])) % 9000 + 1000}", **payload}


# --- Unified Adapter ---

class TicketAdapter:
    """Adapter: normalises both APIs to agent_create_ticket(title, body)."""

    def __init__(self, backend: str = "jira") -> None:
        self.backend = backend

    def agent_create_ticket(self, title: str, body: str) -> dict[str, str]:
        if self.backend == "jira":
            return JiraAPI.create(title=title, body=body)
        elif self.backend == "linear":
            return LinearAPI.submit({"title": title, "description": body})
        else:
            raise ValueError(f"Unknown backend: {self.backend}")


class AdapterState(TypedDict):
    prompt: str
    chosen_backend: str
    ticket_title: str
    ticket_body: str
    raw_api_result: dict[str, str]
    answer: str


def parse_ticket_request(state: AdapterState) -> AdapterState:
    """Extract a ticket title from the prompt heuristically."""
    title = state["prompt"][:60].strip() if state["prompt"] else "Agent Request"
    body = f"Auto-created from agent prompt: {state['prompt']}"
    # Pick backend based on keyword hint in prompt
    backend = "linear" if "linear" in state["prompt"].lower() else "jira"
    return {**state, "ticket_title": title, "ticket_body": body, "chosen_backend": backend}


def create_ticket_via_adapter(state: AdapterState) -> AdapterState:
    """Route through the adapter — the agent never calls JiraAPI or LinearAPI directly."""
    adapter = TicketAdapter(backend=state["chosen_backend"])
    result = adapter.agent_create_ticket(title=state["ticket_title"], body=state["ticket_body"])
    return {**state, "raw_api_result": result}


def compose_adapter_answer(state: AdapterState) -> AdapterState:
    res = state["raw_api_result"]
    answer = (
        f"Adapter Pattern: agent called adapter.agent_create_ticket(...) -> "
        f"routed to {res.get('system')} API -> ticket {res.get('id')} created."
    )
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> AdapterState:
    state: AdapterState = {
        "prompt": prompt,
        "chosen_backend": "jira",
        "ticket_title": "",
        "ticket_body": "",
        "raw_api_result": {},
        "answer": "",
    }
    state = parse_ticket_request(state)
    state = create_ticket_via_adapter(state)
    return compose_adapter_answer(state)


def render_result(runtime: str, state: AdapterState) -> str:
    res = state["raw_api_result"]
    lines = [
        "Pattern: Adapter Pattern",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        "External APIs (different schemas):",
        "  API A (Jira):   JiraAPI.create(title: str, body: str) -> dict",
        "  API B (Linear): LinearAPI.submit(payload: dict) -> dict",
        "",
        "Unified adapter interface:",
        "  TicketAdapter.agent_create_ticket(title: str, body: str) -> dict",
        "",
        f"Chosen backend (from prompt): {state['chosen_backend']}",
        f"Ticket title: {state['ticket_title']}",
        f"Raw API result: system={res.get('system')}  id={res.get('id')}  title={res.get('title', res.get('title', ''))}",
        "",
        f"Answer: {state['answer']}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, AdapterState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "JiraAPI",
    "LinearAPI",
    "TicketAdapter",
    "AdapterState",
    "parse_ticket_request",
    "create_ticket_via_adapter",
    "compose_adapter_answer",
    "run_plain_python",
    "render_result",
    "run",
]
