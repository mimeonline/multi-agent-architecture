"""MCP (Model Context Protocol): Offener Standard, über den Modelle Tools frameworkübergreifend einbinden.

Der Lernpunkt: Ein MCP-Client discovert Tools via `list_tools()`, wählt das passende anhand
des Prompts aus und ruft es über `invoke(name, args)` auf — dasselbe Protokoll für jeden
MCP-fähigen Client, unabhängig vom Framework.
"""

from __future__ import annotations

from typing import Any, TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "mcp"


class MCPToolSchema(TypedDict):
    name: str
    description: str
    input_schema: dict[str, Any]


class MCPInvokeResult(TypedDict):
    tool: str
    args: dict[str, Any]
    output: Any


class MCPState(TypedDict):
    prompt: str
    discovered_tools: list[MCPToolSchema]
    selected_tool: MCPToolSchema | None
    invoke_args: dict[str, Any]
    invoke_result: MCPInvokeResult | None
    answer: str


# --- Mock MCP Client ---

class MockMCPClient:
    """Simulates an MCP server over stdio or HTTP without real network calls."""

    _REGISTRY: list[MCPToolSchema] = [
        {
            "name": "search_web",
            "description": "Search the web and return top results.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query."},
                    "max_results": {"type": "integer", "description": "Max number of results.", "default": 5},
                },
                "required": ["query"],
            },
        },
        {
            "name": "read_file",
            "description": "Read the contents of a file from the server filesystem.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Absolute file path."},
                },
                "required": ["path"],
            },
        },
        {
            "name": "run_python",
            "description": "Execute a Python snippet in a sandboxed interpreter.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "string", "description": "Python source code to execute."},
                    "timeout_seconds": {"type": "integer", "description": "Max execution time.", "default": 10},
                },
                "required": ["code"],
            },
        },
    ]

    def list_tools(self) -> list[MCPToolSchema]:
        """MCP: tools/list — returns all available tool schemas."""
        return list(self._REGISTRY)

    def invoke(self, name: str, args: dict[str, Any]) -> Any:
        """MCP: tools/call — executes the named tool with given args (mocked)."""
        if name == "search_web":
            return [f"Result {i+1} for '{args.get('query', '')}'" for i in range(args.get("max_results", 5))]
        elif name == "read_file":
            return f"[mocked file content of {args.get('path', 'unknown')}]"
        elif name == "run_python":
            code = args.get("code", "")
            # Safe mock: eval only simple expressions, else return placeholder
            try:
                result = eval(code, {"__builtins__": {}})  # noqa: S307 — mock only
                return str(result)
            except Exception:
                return f"[mocked execution of: {code[:60]}]"
        else:
            raise ValueError(f"Unknown MCP tool: {name}")


_TOOL_KEYWORDS: dict[str, str] = {
    "search": "search_web",
    "web": "search_web",
    "find": "search_web",
    "read": "read_file",
    "file": "read_file",
    "open": "read_file",
    "run": "run_python",
    "python": "run_python",
    "execute": "run_python",
    "code": "run_python",
    "compute": "run_python",
    "calculate": "run_python",
}


def discover_tools(state: MCPState) -> MCPState:
    """Call MCP list_tools() to get all available schemas."""
    client = MockMCPClient()
    tools = client.list_tools()
    return {**state, "discovered_tools": tools}


def select_mcp_tool(state: MCPState) -> MCPState:
    """Match prompt keywords to a tool name via the keyword map."""
    tokens = [t.lower().strip("?.,!") for t in state["prompt"].split()]
    tool_map = {t["name"]: t for t in state["discovered_tools"]}
    for token in tokens:
        tool_name = _TOOL_KEYWORDS.get(token)
        if tool_name and tool_name in tool_map:
            return {**state, "selected_tool": tool_map[tool_name]}
    # Default: search_web
    return {**state, "selected_tool": state["discovered_tools"][0] if state["discovered_tools"] else None}


def build_invoke_args(state: MCPState) -> MCPState:
    """Construct args for the selected tool from the prompt."""
    tool = state["selected_tool"]
    if tool is None:
        return {**state, "invoke_args": {}}
    name = tool["name"]
    if name == "search_web":
        args: dict[str, Any] = {"query": state["prompt"], "max_results": 3}
    elif name == "read_file":
        args = {"path": "/tmp/agent_context.txt"}
    elif name == "run_python":
        # Try to find a numeric expression to evaluate
        import re
        match = re.search(r"[\d\s\+\-\*/\(\)]+", state["prompt"])
        expr = match.group(0).strip() if match else "1 + 1"
        args = {"code": expr}
    else:
        args = {}
    return {**state, "invoke_args": args}


def invoke_mcp_tool(state: MCPState) -> MCPState:
    """Call MCP invoke() with the selected tool and args."""
    if state["selected_tool"] is None:
        return {**state, "invoke_result": None}
    client = MockMCPClient()
    output = client.invoke(state["selected_tool"]["name"], state["invoke_args"])
    result: MCPInvokeResult = {
        "tool": state["selected_tool"]["name"],
        "args": state["invoke_args"],
        "output": output,
    }
    return {**state, "invoke_result": result}


def compose_mcp_answer(state: MCPState) -> MCPState:
    if state["invoke_result"]:
        r = state["invoke_result"]
        answer = (
            f"MCP (Model Context Protocol): discovered {len(state['discovered_tools'])} tools via list_tools(), "
            f"invoked '{r['tool']}' with {r['args']}, output={r['output']!r}"
        )
    else:
        answer = "No MCP tool could be selected or invoked."
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> MCPState:
    state: MCPState = {
        "prompt": prompt,
        "discovered_tools": [],
        "selected_tool": None,
        "invoke_args": {},
        "invoke_result": None,
        "answer": "",
    }
    state = discover_tools(state)
    state = select_mcp_tool(state)
    state = build_invoke_args(state)
    state = invoke_mcp_tool(state)
    return compose_mcp_answer(state)


def render_result(runtime: str, state: MCPState) -> str:
    lines = [
        "Pattern: MCP (Model Context Protocol)",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"Discovered tools via MCP list_tools() ({len(state['discovered_tools'])}):",
    ]
    for tool in state["discovered_tools"]:
        props = list(tool["input_schema"].get("properties", {}).keys())
        required = tool["input_schema"].get("required", [])
        lines.append(f"  {tool['name']:15s} — {tool['description']}")
        lines.append(f"    schema: properties={props}  required={required}")
    lines += [
        "",
        f"Selected tool: {state['selected_tool']['name'] if state['selected_tool'] else 'none'}",
        f"Invoke args:   {state['invoke_args']}",
    ]
    if state["invoke_result"]:
        lines.append(f"Invoke result: {state['invoke_result']['output']!r}")
    lines += ["", f"Answer: {state['answer']}"]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, MCPState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "MCPToolSchema",
    "MCPInvokeResult",
    "MCPState",
    "MockMCPClient",
    "discover_tools",
    "select_mcp_tool",
    "build_invoke_args",
    "invoke_mcp_tool",
    "compose_mcp_answer",
    "run_plain_python",
    "render_result",
    "run",
]
