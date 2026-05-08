"""Sandbox Execution: Agentengenerierter Code läuft in einer abgeschotteten Umgebung mit harten Limits.

Der Lernpunkt: Ein AST-Pre-Scan blockiert verbotene Imports und Builtins, bevor `exec()`
mit einem minimalen `globals`-Dict läuft. Sichere Snippets passieren; gefährliche werden
vor der Ausführung abgefangen.
"""

from __future__ import annotations

import ast
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "sandbox-execution"

SAFE_BUILTINS = {
    "abs": abs,
    "len": len,
    "max": max,
    "min": min,
    "range": range,
    "round": round,
    "sorted": sorted,
    "sum": sum,
    "int": int,
    "float": float,
    "str": str,
    "list": list,
    "dict": dict,
    "bool": bool,
    "print": print,
}

FORBIDDEN_NAMES = {"os", "sys", "subprocess", "socket", "open", "eval", "exec", "compile", "__import__"}


class SandboxResult(TypedDict):
    code: str
    allowed: bool
    block_reason: str | None
    output: object


class SandboxState(TypedDict):
    results: list[SandboxResult]


class Sandbox:
    def __init__(self, timeout_ms: int = 500, network: bool = False) -> None:
        self.timeout_ms = timeout_ms
        self.network = network

    def _ast_check(self, code: str) -> str | None:
        """Return block reason string if code is forbidden, else None."""
        try:
            tree = ast.parse(code)
        except SyntaxError as exc:
            return f"SyntaxError: {exc}"

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    name = alias.name.split(".")[0]
                    if name in FORBIDDEN_NAMES:
                        return f"forbidden import: '{name}'"
            if isinstance(node, ast.ImportFrom):
                module = (node.module or "").split(".")[0]
                if module in FORBIDDEN_NAMES:
                    return f"forbidden import from: '{module}'"
            if isinstance(node, ast.Name) and node.id in FORBIDDEN_NAMES:
                return f"forbidden name: '{node.id}'"
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id in FORBIDDEN_NAMES:
                    return f"forbidden call: '{node.func.id}'"
        return None

    def run(self, code: str) -> SandboxResult:
        block_reason = self._ast_check(code)
        if block_reason:
            return SandboxResult(code=code, allowed=False, block_reason=block_reason, output=None)

        restricted_globals: dict[str, object] = {"__builtins__": SAFE_BUILTINS}
        local_vars: dict[str, object] = {}
        try:
            exec(code, restricted_globals, local_vars)  # noqa: S102
            output = local_vars.get("result", "(no result variable set)")
        except Exception as exc:
            output = f"RuntimeError: {exc}"

        return SandboxResult(code=code, allowed=True, block_reason=None, output=output)


def run_plain_python(prompt: str) -> tuple[str, SandboxState]:
    sandbox = Sandbox(timeout_ms=500, network=False)

    snippets = [
        # Safe: arithmetic
        "result = sum(range(1, 11))",
        # Safe: string manipulation
        f"result = str(len('{prompt[:20]}')) + ' chars'",
        # Dangerous: network import
        "import socket\nresult = socket.gethostname()",
        # Dangerous: os module
        "import os\nresult = os.listdir('.')",
        # Dangerous: eval call
        "result = eval('1+1')",
    ]

    results = [sandbox.run(snippet) for snippet in snippets]

    state: SandboxState = {"results": results}
    return "plain Python Sandbox (AST check + restricted exec)", state


def render_result(runtime: str, state: SandboxState) -> str:
    lines = [
        "Pattern: Sandbox Execution",
        f"Runtime: {runtime}",
        "Mechanic: AST pre-scan for forbidden names/imports, then exec() in restricted globals",
        "",
        f"SAFE_BUILTINS: {', '.join(sorted(SAFE_BUILTINS.keys()))}",
        f"FORBIDDEN_NAMES: {', '.join(sorted(FORBIDDEN_NAMES))}",
        "",
        "Execution results:",
    ]
    for result in state["results"]:
        first_line = result["code"].splitlines()[0]
        if result["allowed"]:
            lines.append(f"  [ALLOWED] {first_line!r} -> {result['output']}")
        else:
            lines.append(f"  [BLOCKED] {first_line!r} -- {result['block_reason']}")
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, SandboxState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["Sandbox", "SAFE_BUILTINS", "FORBIDDEN_NAMES", "run_plain_python", "render_result", "run"]
