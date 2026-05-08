"""Event-driven Choreography: Komponenten reagieren auf Events, kein zentraler Orchestrator steuert.

Der Lernpunkt: `bus.on("OrderPlaced", handler)` entkoppelt Publisher und Subscriber vollständig —
das Koordinationsmuster entsteht aus dem Event-Log, nicht aus einem Controller. Neuen Reagenten
einzubinden erfordert keine Änderung am bestehenden Code.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Callable
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "event-driven-choreography"


class EventRecord(TypedDict):
    topic: str
    payload: dict[str, object]
    handler: str
    emitted: str | None


class ChoreographyState(TypedDict):
    initial_topic: str
    event_log: list[EventRecord]


class EventBus:
    def __init__(self) -> None:
        self._subscribers: dict[
            str, list[tuple[str, Callable[[dict[str, object]], dict[str, object] | None]]]
        ] = defaultdict(list)
        self.log: list[EventRecord] = []

    def subscribe(
        self,
        topic: str,
        handler_name: str,
        handler: Callable[[dict[str, object]], dict[str, object] | None],
    ) -> None:
        self._subscribers[topic].append((handler_name, handler))

    def publish(self, topic: str, payload: dict[str, object]) -> None:
        for handler_name, handler in self._subscribers.get(topic, []):
            result = handler(payload)
            emitted_topic: str | None = result.get("emit") if result else None  # type: ignore[union-attr]
            self.log.append({"topic": topic, "payload": payload, "handler": handler_name, "emitted": emitted_topic})
            if result and "emit" in result:
                self.publish(result["emit"], result.get("payload", {}))  # type: ignore[arg-type]


# --- Service handlers (no shared state, no orchestrator) ---

def validator_service(payload: dict[str, object]) -> dict[str, object] | None:
    task_id = payload.get("task_id", "?")
    return {"emit": "task.validated", "payload": {"task_id": task_id, "valid": True}}


def enrichment_service(payload: dict[str, object]) -> dict[str, object] | None:
    task_id = payload.get("task_id", "?")
    return {"emit": "task.enriched", "payload": {"task_id": task_id, "tags": ["enriched", "ready"]}}


def logger_service(payload: dict[str, object]) -> dict[str, object] | None:
    # Passive observer: logs the event, emits nothing
    return None


def executor_service(payload: dict[str, object]) -> dict[str, object] | None:
    task_id = payload.get("task_id", "?")
    return {"emit": "task.completed", "payload": {"task_id": task_id, "status": "done"}}


def run_plain_python(prompt: str) -> tuple[str, ChoreographyState]:
    bus = EventBus()

    # Wire subscriptions — no orchestrator knows all of these
    bus.subscribe("task.created", "validator_service", validator_service)
    bus.subscribe("task.created", "logger_service", logger_service)
    bus.subscribe("task.validated", "enrichment_service", enrichment_service)
    bus.subscribe("task.enriched", "executor_service", executor_service)
    bus.subscribe("task.completed", "logger_service", logger_service)

    # One publish triggers the entire choreography
    bus.publish("task.created", {"task_id": "t-001", "description": prompt[:60]})

    state: ChoreographyState = {
        "initial_topic": "task.created",
        "event_log": bus.log,
    }
    return "plain Python EventBus (no central orchestrator)", state


def render_result(runtime: str, state: ChoreographyState) -> str:
    lines = [
        "Pattern: Event-driven Choreography",
        f"Runtime: {runtime}",
        "Mechanic: publish/subscribe — coordination emerges from events, not from a controller",
        "",
        f"Trigger: publish('{state['initial_topic']}')",
        "",
        "Event log (reactions in order):",
    ]
    for i, record in enumerate(state["event_log"], 1):
        emitted = f" -> emits '{record['emitted']}'" if record["emitted"] else " (no further emission)"
        lines.append(f"  {i}. [{record['topic']}] {record['handler']}{emitted}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, ChoreographyState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["EventBus", "run_plain_python", "render_result", "run"]
