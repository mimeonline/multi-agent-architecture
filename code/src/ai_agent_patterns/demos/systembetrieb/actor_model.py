"""Actor Model: Isolierte Einheiten mit eigenem Zustand kommunizieren ausschließlich über Nachrichten.

Der Lernpunkt: Jeder Actor besitzt eine `inbox: Queue` und ein eigenes `state`-Dict — kein
Shared Memory. Kommunikation läuft nur über `inbox.put(msg)`, nie über direkte Referenzen
auf fremde States.
"""

from __future__ import annotations

import queue
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "actor-model"


class Message(TypedDict):
    sender: str
    topic: str
    payload: object


class ActorState(TypedDict):
    actor_a_state: dict[str, object]
    actor_b_state: dict[str, object]
    message_log: list[str]


class Actor:
    def __init__(self, name: str, initial_state: dict[str, object]) -> None:
        self.name = name
        self.state: dict[str, object] = dict(initial_state)
        self.inbox: queue.Queue[Message] = queue.Queue()
        self._other: "Actor | None" = None

    def link(self, other: "Actor") -> None:
        self._other = other

    def send(self, topic: str, payload: object) -> None:
        if self._other is not None:
            self._other.inbox.put({"sender": self.name, "topic": topic, "payload": payload})

    def _counter(self, name: str) -> int:
        value = self.state.get(name, 0)
        return value if isinstance(value, int) else 0

    def process(self) -> list[str]:
        log: list[str] = []
        while not self.inbox.empty():
            msg: Message = self.inbox.get_nowait()
            log.append(f"[{self.name}] received '{msg['topic']}' from {msg['sender']}: {msg['payload']}")
            if msg["topic"] == "ping":
                self.state["pings_received"] = self._counter("pings_received") + 1
                self.send("pong", {"echo": msg["payload"], "count": self.state["pings_received"]})
            elif msg["topic"] == "pong":
                self.state["pongs_received"] = self._counter("pongs_received") + 1
                self.state["last_echo"] = msg["payload"]
        return log


def run_plain_python(prompt: str) -> tuple[str, ActorState]:
    actor_a = Actor("ActorA", {"role": "initiator", "pings_sent": 0, "pongs_received": 0})
    actor_b = Actor("ActorB", {"role": "responder", "pings_received": 0})
    actor_a.link(actor_b)
    actor_b.link(actor_a)

    message_log: list[str] = []

    # Round 1: A pings B
    actor_a.state["pings_sent"] = actor_a._counter("pings_sent") + 1
    actor_a.send("ping", {"request": prompt[:40], "seq": 1})
    message_log.extend(actor_b.process())  # B processes ping, sends pong

    # Round 2: A receives pong
    message_log.extend(actor_a.process())  # A processes pong

    # Round 3: A sends second ping
    actor_a.state["pings_sent"] = actor_a._counter("pings_sent") + 1
    actor_a.send("ping", {"request": "follow-up", "seq": 2})
    message_log.extend(actor_b.process())
    message_log.extend(actor_a.process())

    state: ActorState = {
        "actor_a_state": dict(actor_a.state),
        "actor_b_state": dict(actor_b.state),
        "message_log": message_log,
    }
    return "plain Python actors (Queue-based)", state


def render_result(runtime: str, state: ActorState) -> str:
    lines = [
        "Pattern: Actor Model",
        f"Runtime: {runtime}",
        "Mechanic: isolated state + message-passing inbox (no shared memory)",
        "",
        "Message log (round-trips):",
        *[f"  {entry}" for entry in state["message_log"]],
        "",
        f"ActorA final state: {state['actor_a_state']}",
        f"ActorB final state: {state['actor_b_state']}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, ActorState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["Actor", "run_plain_python", "render_result", "run"]
