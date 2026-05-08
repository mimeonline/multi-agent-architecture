"""Permission-scoped Tools: Tools tragen Berechtigungs-Scopes; Agenten dürfen nur passende Scopes aufrufen.

Der Lernpunkt: Jedes Tool trägt eine `required_permission`; der Agent-Scope filtert die
Liste so, dass ein Read-only-Agent technisch keine destruktiven Tools erreichen kann —
Least Privilege auf Tool-Ebene, nicht im Prompt.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "permission-scoped-tools"


class ScopedTool(TypedDict):
    name: str
    description: str
    required_permission: str


class PermissionScopedState(TypedDict):
    prompt: str
    user_scope: set[str]
    all_tools: list[ScopedTool]
    visible_tools: list[ScopedTool]
    blocked_tools: list[ScopedTool]
    selected_tool: ScopedTool | None
    answer: str


ALL_TOOLS: list[ScopedTool] = [
    {"name": "read_file",         "description": "Read a file from storage.",             "required_permission": "files:read"},
    {"name": "write_file",        "description": "Write or overwrite a file.",             "required_permission": "files:write"},
    {"name": "delete_file",       "description": "Permanently delete a file.",             "required_permission": "files:delete"},
    {"name": "list_users",        "description": "List all users.",                        "required_permission": "users:read"},
    {"name": "create_user",       "description": "Create a new user account.",             "required_permission": "users:write"},
    {"name": "delete_user",       "description": "Delete a user account.",                 "required_permission": "users:delete"},
    {"name": "get_billing_info",  "description": "Read billing details.",                  "required_permission": "billing:read"},
    {"name": "charge_customer",   "description": "Charge a customer's payment method.",    "required_permission": "billing:write"},
    {"name": "run_sql_query",     "description": "Execute a read-only SQL query.",         "required_permission": "db:read"},
    {"name": "run_sql_mutation",  "description": "Execute a write SQL statement.",         "required_permission": "db:write"},
]

_READ_ONLY_SCOPE: set[str] = {"files:read", "users:read", "billing:read", "db:read"}
_ADMIN_SCOPE: set[str] = {tool["required_permission"] for tool in ALL_TOOLS}

_SCOPE_KEYWORDS: dict[str, set[str]] = {
    "read": _READ_ONLY_SCOPE,
    "readonly": _READ_ONLY_SCOPE,
    "list": _READ_ONLY_SCOPE,
    "admin": _ADMIN_SCOPE,
    "write": {"files:write", "users:write", "billing:write", "db:write"},
    "delete": {"files:delete", "users:delete"},
}


def determine_user_scope(state: PermissionScopedState) -> PermissionScopedState:
    """Derive the user's permission scope from the prompt (keyword heuristic)."""
    tokens = [t.lower().strip("?.,!") for t in state["prompt"].split()]
    for token in tokens:
        scope = _SCOPE_KEYWORDS.get(token)
        if scope is not None:
            return {**state, "user_scope": scope}
    return {**state, "user_scope": _READ_ONLY_SCOPE}  # safe default: read-only


def filter_tools_by_permission(state: PermissionScopedState) -> PermissionScopedState:
    """Split tools into visible (permitted) and blocked (not in scope)."""
    visible = [t for t in state["all_tools"] if t["required_permission"] in state["user_scope"]]
    blocked = [t for t in state["all_tools"] if t["required_permission"] not in state["user_scope"]]
    return {**state, "visible_tools": visible, "blocked_tools": blocked}


def select_tool_from_visible(state: PermissionScopedState) -> PermissionScopedState:
    """Pick the first visible tool that matches a keyword in the prompt."""
    tokens = {t.lower().strip("?.,!") for t in state["prompt"].split()}
    for tool in state["visible_tools"]:
        for word in tool["name"].split("_"):
            if word in tokens:
                return {**state, "selected_tool": tool}
    selected = state["visible_tools"][0] if state["visible_tools"] else None
    return {**state, "selected_tool": selected}


def compose_permission_answer(state: PermissionScopedState) -> PermissionScopedState:
    tool = state["selected_tool"]
    if tool:
        answer = (
            f"Permission-scoped Tools: scope={sorted(state['user_scope'])} "
            f"-> {len(state['visible_tools'])} tools visible, {len(state['blocked_tools'])} blocked "
            f"-> selected '{tool['name']}' (requires {tool['required_permission']})"
        )
    else:
        answer = f"No permitted tool found for scope={sorted(state['user_scope'])}."
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> PermissionScopedState:
    state: PermissionScopedState = {
        "prompt": prompt,
        "user_scope": set(),
        "all_tools": list(ALL_TOOLS),
        "visible_tools": [],
        "blocked_tools": [],
        "selected_tool": None,
        "answer": "",
    }
    state = determine_user_scope(state)
    state = filter_tools_by_permission(state)
    state = select_tool_from_visible(state)
    return compose_permission_answer(state)


def render_result(runtime: str, state: PermissionScopedState) -> str:
    lines = [
        "Pattern: Permission-scoped Tools",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"All tools ({len(state['all_tools'])}) with required_permission:",
    ]
    for tool in state["all_tools"]:
        in_scope = tool["required_permission"] in state["user_scope"]
        marker = "ALLOWED" if in_scope else "BLOCKED"
        lines.append(f"  [{marker}] {tool['name']:22s} requires={tool['required_permission']}")
    lines += [
        "",
        f"User scope: {sorted(state['user_scope'])}",
        f"Visible tools ({len(state['visible_tools'])}): {[t['name'] for t in state['visible_tools']]}",
        f"Blocked tools ({len(state['blocked_tools'])}): {[t['name'] for t in state['blocked_tools']]}",
        f"Selected: {state['selected_tool']['name'] if state['selected_tool'] else 'none'}",
        "",
        f"Answer: {state['answer']}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, PermissionScopedState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "ScopedTool",
    "PermissionScopedState",
    "ALL_TOOLS",
    "determine_user_scope",
    "filter_tools_by_permission",
    "select_tool_from_visible",
    "compose_permission_answer",
    "run_plain_python",
    "render_result",
    "run",
]
