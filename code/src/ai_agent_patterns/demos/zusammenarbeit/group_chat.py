"""Group Chat: Round-Robin durch 3 Rollen, Konversations-Verlauf wächst, Moderator fasst zusammen.

Der Lernpunkt: Kein zentraler Supervisor — die Gesprächsrunde läuft deterministisch durch
researcher -> critic -> builder. Die wachsende messages-Liste macht den Chat-Verlauf sichtbar.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo


class Message(TypedDict):
    role: str
    content: str


class GroupChatState(TypedDict):
    topic: str
    messages: list[Message]
    summary: str


# ---------------------------------------------------------------------------
# Chat-Teilnehmer — je eine Runde
# ---------------------------------------------------------------------------

ROLES = ["researcher", "critic", "builder"]


def researcher_turn(topic: str, messages: list[Message]) -> Message:
    """Researcher liefert Kontext und Fakten zum Thema."""
    prior = f" (aufbauend auf {len(messages)} vorigen Beiträgen)" if messages else ""
    return {
        "role": "researcher",
        "content": f"[researcher] Recherche zu '{topic}'{prior}: Belege zeigen Ansatz X als valide.",
    }


def critic_turn(topic: str, messages: list[Message]) -> Message:
    """Critic hinterfragt die letzte Aussage kritisch."""
    last = messages[-1]["content"] if messages else "?"
    return {
        "role": "critic",
        "content": (
            f"[critic] Kritik zum letzten Beitrag: '{last[:60]}…' — "
            f"Risiko Y wurde nicht berücksichtigt."
        ),
    }


def builder_turn(topic: str, messages: list[Message]) -> Message:
    """Builder schlägt einen konkreten nächsten Schritt vor."""
    return {
        "role": "builder",
        "content": f"[builder] Konkreter Schritt: Implementiere Z als nächste Maßnahme für '{topic}'.",
    }


TURN_FNS = {
    "researcher": researcher_turn,
    "critic": critic_turn,
    "builder": builder_turn,
}


# ---------------------------------------------------------------------------
# Moderator-Agent
# ---------------------------------------------------------------------------

def moderator_summarize(topic: str, messages: list[Message]) -> str:
    roles_seen = [m["role"] for m in messages]
    return (
        f"Moderator-Zusammenfassung für '{topic}': "
        f"{len(messages)} Beiträge von {roles_seen}. "
        f"Konsens: Ansatz X mit Schritt Z, Risiko Y als offener Punkt."
    )


# ---------------------------------------------------------------------------
# Chat-Mechanik
# ---------------------------------------------------------------------------

def run_plain_python(prompt: str) -> tuple[str, GroupChatState]:
    """Round-Robin-Chat ohne LangGraph — natürlicher Ablauf ohne künstlichen Graph-Overhead."""
    messages: list[Message] = []
    for role in ROLES:
        turn_fn = TURN_FNS[role]
        msg = turn_fn(prompt, messages)
        messages.append(msg)

    summary = moderator_summarize(prompt, messages)
    state: GroupChatState = {"topic": prompt, "messages": messages, "summary": summary}
    return "plain Python round-robin", state


def run_with_langgraph(prompt: str) -> tuple[str, GroupChatState]:
    # Group Chat als Round-Robin ist in Plain Python natürlicher als im StateGraph.
    # LangGraph-Support als optionale Alternative, plain Python bleibt bevorzugt.
    return run_plain_python(prompt)


def render_result(runtime: str, state: GroupChatState) -> str:
    msg_lines = [f"  [{m['role']}] {m['content']}" for m in state["messages"]]
    return "\n".join([
        "Pattern: Group Chat",
        f"Runtime: {runtime}",
        f"Topic: {state['topic']}",
        "Messages:",
        *msg_lines,
        f"Moderator summary: {state['summary']}",
    ])


def run(prompt: str) -> str:
    @trace_demo("demo.group-chat")
    def traced_run(user_prompt: str) -> tuple[str, GroupChatState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_plain_python", "run_with_langgraph", "render_result"]
