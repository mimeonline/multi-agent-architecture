"""Capability Routing: Vor dem LLM-Call wird klassifiziert, welche Fähigkeiten die Anfrage braucht.

Der Lernpunkt: Jedes Tool trägt ein Set von Capability-Tags; der Router extrahiert die
benötigte Capability aus dem Prompt und liefert nur die passenden Tools zurück — das Modell
sieht 5 statt 50 Tools.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "capability-routing"


class CapabilityTool(TypedDict):
    name: str
    description: str
    capabilities: set[str]


class CapabilityRoutingState(TypedDict):
    prompt: str
    required_capability: str
    all_tools: list[CapabilityTool]
    routed_tools: list[CapabilityTool]
    selected_tool: CapabilityTool | None
    answer: str


TOOL_CATALOG: list[CapabilityTool] = [
    {
        "name": "get_invoice",
        "description": "Retrieve an invoice by ID.",
        "capabilities": {"billing", "read"},
    },
    {
        "name": "create_invoice",
        "description": "Create a new invoice for a customer.",
        "capabilities": {"billing", "write"},
    },
    {
        "name": "list_users",
        "description": "List all users in the system.",
        "capabilities": {"admin", "read"},
    },
    {
        "name": "delete_user",
        "description": "Delete a user account.",
        "capabilities": {"admin", "write", "destructive"},
    },
    {
        "name": "send_notification",
        "description": "Send an email or push notification.",
        "capabilities": {"messaging", "write"},
    },
    {
        "name": "get_report",
        "description": "Generate a usage or billing report.",
        "capabilities": {"billing", "analytics", "read"},
    },
]

_CAPABILITY_KEYWORDS: dict[str, str] = {
    "invoice": "billing",
    "bill": "billing",
    "payment": "billing",
    "user": "admin",
    "account": "admin",
    "delete": "destructive",
    "remove": "destructive",
    "notify": "messaging",
    "email": "messaging",
    "report": "analytics",
    "analytics": "analytics",
    "read": "read",
    "list": "read",
    "create": "write",
    "update": "write",
    "send": "messaging",
}


def extract_required_capability(state: CapabilityRoutingState) -> CapabilityRoutingState:
    """Detect the most relevant capability from the prompt."""
    tokens = [t.lower().strip("?.,!") for t in state["prompt"].split()]
    for token in tokens:
        cap = _CAPABILITY_KEYWORDS.get(token)
        if cap:
            return {**state, "required_capability": cap}
    return {**state, "required_capability": "read"}  # safe default


def route_to_capable_tools(state: CapabilityRoutingState) -> CapabilityRoutingState:
    """Filter tool catalog to those that have the required capability tag."""
    cap = state["required_capability"]
    routed = [tool for tool in state["all_tools"] if cap in tool["capabilities"]]
    return {**state, "routed_tools": routed}


def select_best_tool(state: CapabilityRoutingState) -> CapabilityRoutingState:
    """Pick the first routed tool as the selected tool (mock model decision)."""
    selected = state["routed_tools"][0] if state["routed_tools"] else None
    return {**state, "selected_tool": selected}


def compose_routing_answer(state: CapabilityRoutingState) -> CapabilityRoutingState:
    if state["selected_tool"]:
        tool = state["selected_tool"]
        answer = (
            f"Capability Routing: prompt required capability '{state['required_capability']}' -> "
            f"routed to {len(state['routed_tools'])} tool(s) -> selected '{tool['name']}': {tool['description']}"
        )
    else:
        answer = f"No tool found with capability '{state['required_capability']}'."
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> CapabilityRoutingState:
    state: CapabilityRoutingState = {
        "prompt": prompt,
        "required_capability": "",
        "all_tools": list(TOOL_CATALOG),
        "routed_tools": [],
        "selected_tool": None,
        "answer": "",
    }
    state = extract_required_capability(state)
    state = route_to_capable_tools(state)
    state = select_best_tool(state)
    return compose_routing_answer(state)


def render_result(runtime: str, state: CapabilityRoutingState) -> str:
    lines = [
        "Pattern: Capability Routing",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"Tool catalog ({len(state['all_tools'])} tools with capability tags):",
    ]
    for tool in state["all_tools"]:
        caps = ", ".join(sorted(tool["capabilities"]))
        lines.append(f"  {tool['name']:25s} capabilities=[{caps}]  — {tool['description']}")
    lines += [
        "",
        f"Required capability (extracted from prompt): '{state['required_capability']}'",
        f"Routed tools ({len(state['routed_tools'])}):",
    ]
    for tool in state["routed_tools"]:
        lines.append(f"  -> {tool['name']}")
    lines += [
        f"Selected: {state['selected_tool']['name'] if state['selected_tool'] else 'none'}",
        "",
        f"Answer: {state['answer']}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, CapabilityRoutingState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "CapabilityTool",
    "CapabilityRoutingState",
    "TOOL_CATALOG",
    "extract_required_capability",
    "route_to_capable_tools",
    "select_best_tool",
    "compose_routing_answer",
    "run_plain_python",
    "render_result",
    "run",
]
