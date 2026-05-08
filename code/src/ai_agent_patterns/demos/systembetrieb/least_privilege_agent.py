"""Least Privilege Agent: Jeder Agent kennt nur die Tools, die er zwingend braucht.

Der Lernpunkt: Die Tool-Liste wird beim Instantiieren hart auf die Rolle begrenzt — ein
Versuch, ein Tool außerhalb des Scopes aufzurufen, wird vor der Ausführung abgelehnt.
Blast-Radius-Begrenzung ist im Tool-Layer, nicht im Prompt.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "least-privilege-agent"


class ToolSpec(TypedDict):
    name: str
    description: str
    fn: Callable[..., str]


class InvocationRecord(TypedDict):
    agent: str
    tool: str
    args: dict[str, object]
    allowed: bool
    result: str


class LeastPrivilegeState(TypedDict):
    agent_scopes: dict[str, list[str]]
    invocations: list[InvocationRecord]


# --- Available tools (full registry) ---

def account_lookup_readonly(account_id: str) -> str:
    return f"account {account_id}: active, balance=$240.00"


def refund_money(account_id: str, amount: float) -> str:
    return f"refunded ${amount:.2f} to account {account_id}"


def email_customer(account_id: str, message: str) -> str:
    return f"email sent to account {account_id}: '{message[:40]}'"


def update_billing_plan(account_id: str, plan: str) -> str:
    return f"billing plan for {account_id} updated to '{plan}'"


FULL_TOOL_REGISTRY: dict[str, ToolSpec] = {
    "account_lookup_readonly": {
        "name": "account_lookup_readonly",
        "description": "Read-only account lookup",
        "fn": account_lookup_readonly,
    },
    "refund_money": {
        "name": "refund_money",
        "description": "Issue a refund",
        "fn": refund_money,
    },
    "email_customer": {
        "name": "email_customer",
        "description": "Send email to customer",
        "fn": email_customer,
    },
    "update_billing_plan": {
        "name": "update_billing_plan",
        "description": "Change customer billing plan",
        "fn": update_billing_plan,
    },
}


class ScopedAgent:
    def __init__(self, name: str, allowed_tools: list[str]) -> None:
        self.name = name
        self.allowed_tools = set(allowed_tools)

    def invoke(self, tool_name: str, args: dict[str, object]) -> InvocationRecord:
        if tool_name not in self.allowed_tools:
            return InvocationRecord(
                agent=self.name,
                tool=tool_name,
                args=args,
                allowed=False,
                result=f"ACCESS DENIED: '{tool_name}' not in scope for {self.name}",
            )
        tool = FULL_TOOL_REGISTRY[tool_name]
        result = tool["fn"](**args)
        return InvocationRecord(
            agent=self.name,
            tool=tool_name,
            args=args,
            allowed=True,
            result=result,
        )


def run_plain_python(prompt: str) -> tuple[str, LeastPrivilegeState]:
    # Billing support agent: read-only — cannot issue refunds or email customers
    billing_agent = ScopedAgent(
        name="billing_support_agent",
        allowed_tools=["account_lookup_readonly"],
    )
    # Refund specialist: can lookup and refund, but cannot change plans
    refund_agent = ScopedAgent(
        name="refund_specialist_agent",
        allowed_tools=["account_lookup_readonly", "refund_money"],
    )

    invocations: list[InvocationRecord] = []

    # billing_agent attempts allowed and disallowed tools
    invocations.append(billing_agent.invoke("account_lookup_readonly", {"account_id": "acc-007"}))
    invocations.append(billing_agent.invoke("refund_money", {"account_id": "acc-007", "amount": 49.99}))
    invocations.append(billing_agent.invoke("email_customer", {"account_id": "acc-007", "message": prompt[:40]}))

    # refund_agent attempts allowed and disallowed tools
    invocations.append(refund_agent.invoke("account_lookup_readonly", {"account_id": "acc-007"}))
    invocations.append(refund_agent.invoke("refund_money", {"account_id": "acc-007", "amount": 49.99}))
    invocations.append(refund_agent.invoke("update_billing_plan", {"account_id": "acc-007", "plan": "enterprise"}))

    state: LeastPrivilegeState = {
        "agent_scopes": {
            billing_agent.name: sorted(billing_agent.allowed_tools),
            refund_agent.name: sorted(refund_agent.allowed_tools),
        },
        "invocations": invocations,
    }
    return "plain Python ScopedAgent", state


def render_result(runtime: str, state: LeastPrivilegeState) -> str:
    lines = [
        "Pattern: Least Privilege Agent",
        f"Runtime: {runtime}",
        "Mechanic: agent receives only the tools it needs; out-of-scope calls are rejected pre-execution",
        "",
        "Agent scopes:",
        *[f"  {agent}: {tools}" for agent, tools in state["agent_scopes"].items()],
        "",
        "Invocation log:",
    ]
    for record in state["invocations"]:
        status = "OK  " if record["allowed"] else "DENY"
        lines.append(f"  [{status}] {record['agent']} -> {record['tool']}({record['args']}) => {record['result']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, LeastPrivilegeState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["ScopedAgent", "FULL_TOOL_REGISTRY", "run_plain_python", "render_result", "run"]
