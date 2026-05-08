"""Human-in-the-Loop Approval Gate: Der Agent pausiert vor riskanten Aktionen und wartet auf menschliche Freigabe.

Der Lernpunkt: Ein `risk_score` bestimmt, ob das Gate automatisch öffnet oder explizite
Freigabe verlangt. Der pausierte State liegt im Checkpoint — `approved(action)` ist die
einzige Schranke vor `execute(action)`.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "human-in-the-loop-approval-gate"

APPROVAL_THRESHOLD = 0.6


class Action(TypedDict):
    name: str
    description: str
    risk_score: float  # 0.0 = safe, 1.0 = highly dangerous


class ApprovalRecord(TypedDict):
    action: str
    risk_score: float
    gate_triggered: bool
    approval_decision: str  # "auto-approved" | "human-approved" | "human-rejected"
    executed: bool
    result: str


class HITLState(TypedDict):
    actions: list[Action]
    approval_log: list[ApprovalRecord]
    threshold: float


def compute_risk(action: Action) -> float:
    return action["risk_score"]


def simulate_human_approval(action: Action) -> str:
    """Simulate a human approval step. In production this would pause and wait for a callback."""
    # Demo policy: approve unless action name contains "delete"
    if "delete" in action["name"].lower():
        return "human-rejected"
    return "human-approved"


def execute_action(action: Action) -> str:
    return f"executed: {action['description']}"


def process_action_through_gate(action: Action, threshold: float) -> ApprovalRecord:
    risk = compute_risk(action)
    gate_triggered = risk >= threshold

    if not gate_triggered:
        decision = "auto-approved"
        executed = True
        result = execute_action(action)
    else:
        decision = simulate_human_approval(action)
        if decision == "human-approved":
            executed = True
            result = execute_action(action)
        else:
            executed = False
            result = f"blocked: human rejected '{action['name']}'"

    return ApprovalRecord(
        action=action["name"],
        risk_score=risk,
        gate_triggered=gate_triggered,
        approval_decision=decision,
        executed=executed,
        result=result,
    )


def run_plain_python(prompt: str) -> tuple[str, HITLState]:
    actions: list[Action] = [
        {"name": "read_report", "description": f"read quarterly report (prompt: {prompt[:30]})", "risk_score": 0.1},
        {"name": "send_notification", "description": "send summary email to team", "risk_score": 0.5},
        {"name": "update_config", "description": "update production rate-limit config", "risk_score": 0.75},
        {"name": "delete_user_data", "description": "permanently delete user records", "risk_score": 0.95},
    ]

    approval_log = [process_action_through_gate(a, APPROVAL_THRESHOLD) for a in actions]

    state: HITLState = {
        "actions": actions,
        "approval_log": approval_log,
        "threshold": APPROVAL_THRESHOLD,
    }
    return "plain Python approval gate", state


def render_result(runtime: str, state: HITLState) -> str:
    lines = [
        "Pattern: Human-in-the-Loop Approval Gate",
        f"Runtime: {runtime}",
        f"Mechanic: risk_score >= {state['threshold']} triggers gate; human decides approve/reject",
        "",
        "Approval log:",
    ]
    for record in state["approval_log"]:
        gate = "GATE" if record["gate_triggered"] else "pass"
        lines.append(
            f"  [{gate}] {record['action']} "
            f"(risk={record['risk_score']:.2f}) "
            f"-> {record['approval_decision']} "
            f"-> {record['result']}"
        )
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, HITLState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["process_action_through_gate", "run_plain_python", "render_result", "run"]
