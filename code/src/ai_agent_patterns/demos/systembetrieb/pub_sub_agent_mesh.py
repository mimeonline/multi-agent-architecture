"""Pub/Sub Agent Mesh: Publisher schreiben in Topics, Subscriber empfangen — beide Seiten kennen einander nicht.

Der Lernpunkt: `bus.subscribe("OrderShipped", agent)` ist alles, was nötig ist, um einen
neuen Agenten einzubinden — ohne Änderung am Publisher. Fan-out zu mehreren Subscribern
entsteht automatisch beim `publish`-Aufruf.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Callable
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "pub-sub-agent-mesh"


class DeliveryRecord(TypedDict):
    topic: str
    agent: str
    payload: dict[str, object]
    response: str


class MeshState(TypedDict):
    publications: list[str]
    deliveries: list[DeliveryRecord]


AgentFn = Callable[[str, dict[str, object]], str]


class AgentMesh:
    def __init__(self) -> None:
        self._subscriptions: dict[str, list[tuple[str, AgentFn]]] = defaultdict(list)
        self.deliveries: list[DeliveryRecord] = []

    def subscribe(self, topic: str, agent_name: str, agent: AgentFn) -> None:
        self._subscriptions[topic].append((agent_name, agent))

    def publish(self, topic: str, payload: dict[str, object]) -> None:
        for agent_name, agent in self._subscriptions.get(topic, []):
            response = agent(topic, payload)
            self.deliveries.append({"topic": topic, "agent": agent_name, "payload": payload, "response": response})


# --- Agent implementations ---

def monitoring_agent(topic: str, payload: dict[str, object]) -> str:
    return f"monitoring_agent: logged event on '{topic}' — {payload.get('summary', '')}"


def alert_agent(topic: str, payload: dict[str, object]) -> str:
    severity = payload.get("severity", "low")
    return f"alert_agent: {'ALERT fired' if severity == 'high' else 'no alert'} for severity={severity}"


def analytics_agent(topic: str, payload: dict[str, object]) -> str:
    return f"analytics_agent: recorded metric '{payload.get('metric', '?')}' from topic '{topic}'"


def remediation_agent(topic: str, payload: dict[str, object]) -> str:
    return f"remediation_agent: triggered auto-fix for {payload.get('component', '?')}"


def run_plain_python(prompt: str) -> tuple[str, MeshState]:
    mesh = AgentMesh()

    # Wire the mesh — agents subscribe to multiple topics
    mesh.subscribe("system.metric", "monitoring_agent", monitoring_agent)
    mesh.subscribe("system.metric", "analytics_agent", analytics_agent)
    mesh.subscribe("system.alert", "monitoring_agent", monitoring_agent)
    mesh.subscribe("system.alert", "alert_agent", alert_agent)
    mesh.subscribe("system.alert", "remediation_agent", remediation_agent)
    mesh.subscribe("user.event", "analytics_agent", analytics_agent)
    mesh.subscribe("user.event", "monitoring_agent", monitoring_agent)

    publications: list[str] = []

    # Fan-out 1: metric event
    mesh.publish("system.metric", {"summary": prompt[:40], "metric": "latency_ms", "value": 142})
    publications.append("system.metric")

    # Fan-out 2: high-severity alert
    mesh.publish("system.alert", {"summary": "disk > 90%", "severity": "high", "component": "disk"})
    publications.append("system.alert")

    # Fan-out 3: user event
    mesh.publish("user.event", {"summary": "login", "metric": "login_count", "value": 1})
    publications.append("user.event")

    state: MeshState = {
        "publications": publications,
        "deliveries": mesh.deliveries,
    }
    return "plain Python AgentMesh (fan-out publish)", state


def render_result(runtime: str, state: MeshState) -> str:
    lines = [
        "Pattern: Pub/Sub Agent Mesh",
        f"Runtime: {runtime}",
        "Mechanic: publish fan-outs to all subscribed agents; agents subscribe to multiple topics",
        "",
        "Publications and deliveries:",
    ]
    current_topic = None
    for record in state["deliveries"]:
        if record["topic"] != current_topic:
            current_topic = record["topic"]
            lines.append(f"\n  publish('{current_topic}'):")
        lines.append(f"    -> {record['agent']}: {record['response']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, MeshState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["AgentMesh", "run_plain_python", "render_result", "run"]
