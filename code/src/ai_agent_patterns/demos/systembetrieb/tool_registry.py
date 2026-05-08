"""Tool Registry: Tools werden zentral mit Schema, Scopes und Owner katalogisiert.

Der Lernpunkt: Statt Tools im Agent zu hardcoden, hält eine `ToolRegistry`-Klasse den
Katalog. `for_task(prompt)` filtert per Keyword-Match, `for_scope(scope)` per Berechtigung
— dieselbe Quelle liefert je nach Anfrage unterschiedliche Sichten.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "tool-registry"


class RegistryEntry(TypedDict):
    name: str
    description: str
    keywords: list[str]
    scopes: list[str]
    owner: str


class ToolRegistryState(TypedDict):
    prompt: str
    active_scope: str
    task_matches: list[RegistryEntry]
    scope_matches: list[RegistryEntry]
    answer: str


class ToolRegistry:
    """Central catalog for agent tools, supporting lookup by task or scope."""

    def __init__(self) -> None:
        self._entries: list[RegistryEntry] = []

    def add(self, name: str, description: str, keywords: list[str], scopes: list[str], owner: str) -> None:
        self._entries.append(
            {
                "name": name,
                "description": description,
                "keywords": keywords,
                "scopes": scopes,
                "owner": owner,
            }
        )

    def for_task(self, prompt: str) -> list[RegistryEntry]:
        """Return tools whose keywords overlap with the prompt tokens."""
        tokens = {t.lower().strip("?.,!") for t in prompt.split()}
        return [
            entry for entry in self._entries
            if tokens & {kw.lower() for kw in entry["keywords"]}
        ]

    def for_scope(self, scope: str) -> list[RegistryEntry]:
        """Return tools available in the given scope."""
        return [entry for entry in self._entries if scope in entry["scopes"]]

    def all_tools(self) -> list[RegistryEntry]:
        return list(self._entries)


def _build_registry() -> ToolRegistry:
    reg = ToolRegistry()
    reg.add("search_web",        "Search the internet for information.",     ["search", "web", "find", "lookup"],           ["public", "internal"],             "platform-team")
    reg.add("read_database",     "Run a SELECT query against the DB.",        ["database", "db", "query", "select", "read"], ["internal", "data"],               "data-team")
    reg.add("write_database",    "Execute INSERT/UPDATE statements.",         ["database", "db", "write", "insert", "update"],["internal", "data", "admin"],     "data-team")
    reg.add("send_email",        "Send an email to a recipient.",             ["email", "send", "notify", "message"],        ["internal", "comms"],              "ops-team")
    reg.add("generate_report",   "Produce a PDF or CSV report.",              ["report", "export", "generate", "pdf", "csv"],["internal", "analytics"],          "analytics-team")
    reg.add("delete_record",     "Permanently delete a DB record.",           ["delete", "remove", "purge"],                 ["admin"],                          "admin-team")
    reg.add("list_users",        "List all system users.",                    ["user", "users", "list", "accounts"],         ["internal", "admin"],              "platform-team")
    reg.add("charge_customer",   "Charge a customer via payment gateway.",    ["charge", "payment", "billing", "invoice"],   ["billing", "admin"],               "billing-team")
    return reg


_SCOPE_KEYWORDS: dict[str, str] = {
    "public": "public",
    "internal": "internal",
    "admin": "admin",
    "analytics": "analytics",
    "billing": "billing",
    "comms": "comms",
    "data": "data",
}


def detect_active_scope(state: ToolRegistryState) -> ToolRegistryState:
    """Detect the requested scope from the prompt."""
    tokens = [t.lower().strip("?.,!") for t in state["prompt"].split()]
    for token in tokens:
        scope = _SCOPE_KEYWORDS.get(token)
        if scope:
            return {**state, "active_scope": scope}
    return {**state, "active_scope": "internal"}  # default


def lookup_by_task(state: ToolRegistryState, registry: ToolRegistry) -> ToolRegistryState:
    """Find tools whose keywords match the prompt."""
    matches = registry.for_task(state["prompt"])
    return {**state, "task_matches": matches}


def lookup_by_scope(state: ToolRegistryState, registry: ToolRegistry) -> ToolRegistryState:
    """Find tools visible in the active scope."""
    matches = registry.for_scope(state["active_scope"])
    return {**state, "scope_matches": matches}


def compose_registry_answer(state: ToolRegistryState) -> ToolRegistryState:
    task_names = [t["name"] for t in state["task_matches"]]
    scope_names = [t["name"] for t in state["scope_matches"]]
    answer = (
        f"Tool Registry: for_task() -> {task_names or 'none'}; "
        f"for_scope('{state['active_scope']}') -> {scope_names or 'none'}"
    )
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> ToolRegistryState:
    registry = _build_registry()
    state: ToolRegistryState = {
        "prompt": prompt,
        "active_scope": "",
        "task_matches": [],
        "scope_matches": [],
        "answer": "",
    }
    state = detect_active_scope(state)
    state = lookup_by_task(state, registry)
    state = lookup_by_scope(state, registry)
    state = compose_registry_answer(state)
    # Attach full registry snapshot for render
    state["_all_tools"] = registry.all_tools()  # type: ignore[typeddict-unknown-key]
    return state


def render_result(runtime: str, state: ToolRegistryState) -> str:
    all_tools = state.get("_all_tools", [])  # type: ignore[attr-defined]
    lines = [
        "Pattern: Tool Registry",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"Registry ({len(all_tools)} tools):",
    ]
    for entry in all_tools:
        lines.append(
            f"  {entry['name']:20s} scopes={entry['scopes']}  owner={entry['owner']}  "
            f"keywords={entry['keywords']}"
        )
    lines += [
        "",
        f"for_task(prompt) -> {[t['name'] for t in state['task_matches']] or 'none'}",
        f"for_scope('{state['active_scope']}') -> {[t['name'] for t in state['scope_matches']] or 'none'}",
        "",
        f"Answer: {state['answer']}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, ToolRegistryState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "RegistryEntry",
    "ToolRegistryState",
    "ToolRegistry",
    "detect_active_scope",
    "lookup_by_task",
    "lookup_by_scope",
    "compose_registry_answer",
    "run_plain_python",
    "render_result",
    "run",
]
