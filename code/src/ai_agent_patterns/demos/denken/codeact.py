"""CodeAct demo with a restricted local sandbox.

The code translates a prompt into a small Python program, validates the AST against an allowlist,
executes it with safe builtins only, and explains the result.
"""

from __future__ import annotations

import ast
import re
from textwrap import indent


ALLOWED_NODES = {
    ast.Module,
    ast.Assign,
    ast.Expr,
    ast.Name,
    ast.Load,
    ast.Store,
    ast.Constant,
    ast.List,
    ast.Tuple,
    ast.Dict,
    ast.BinOp,
    ast.UnaryOp,
    ast.Add,
    ast.Sub,
    ast.Mult,
    ast.Div,
    ast.FloorDiv,
    ast.Mod,
    ast.Pow,
    ast.USub,
    ast.Call,
    ast.keyword,
    ast.JoinedStr,
    ast.FormattedValue,
}

SAFE_BUILTINS = {
    "len": len,
    "max": max,
    "min": min,
    "round": round,
    "sorted": sorted,
    "sum": sum,
}


def _plan_code(prompt: str) -> str:
    text = prompt.lower()
    numbers = [float(match) for match in re.findall(r"-?\d+(?:\.\d+)?", prompt)]
    if any(word in text for word in ("average", "mean", "durchschnitt")):
        values = numbers or [8.0, 13.0, 21.0, 34.0]
        return "\n".join(
            [
                f"values = {values}",
                "result = round(sum(values) / len(values), 2)",
                "explanation = f'Average over {len(values)} values is {result}'",
            ]
        )
    if any(word in text for word in ("rank", "sort", "prioritize", "priorisiere")):
        return "\n".join(
            [
                "ranked_patterns = ['CodeAct', 'Plan-and-Execute', 'ReAct']",
                "result = len(ranked_patterns)",
                "explanation = f'Ranked {result} patterns; CodeAct is first because execution is required'",
            ]
        )
    return "\n".join(
        [
            "tasks = ['parse request', 'execute safe code', 'explain result']",
            "result = len(tasks)",
            "explanation = f'CodeAct completed {result} deterministic steps'",
        ]
    )


def _validate_sandbox_ast(code: str) -> ast.Module:
    tree = ast.parse(code, mode="exec")
    for node in ast.walk(tree):
        if type(node) not in ALLOWED_NODES:
            raise ValueError(f"Unsupported sandbox node: {type(node).__name__}")
        if isinstance(node, ast.Call):
            if not isinstance(node.func, ast.Name) or node.func.id not in SAFE_BUILTINS:
                raise ValueError("Only selected safe builtins may be called.")
    return tree


def _run_sandbox(code: str) -> dict[str, object]:
    tree = _validate_sandbox_ast(code)
    globals_: dict[str, object] = {"__builtins__": SAFE_BUILTINS}
    locals_: dict[str, object] = {}
    exec(compile(tree, "<codeact-demo>", "exec"), globals_, locals_)
    return {
        "result": locals_.get("result"),
        "explanation": locals_.get("explanation", "No explanation produced."),
    }


def run(prompt: str) -> str:
    code = _plan_code(prompt)
    try:
        sandbox_result = _run_sandbox(code)
    except Exception as exc:
        return "\n".join(
            [
                "Pattern: CodeAct",
                "Mode: sandbox rejected generated code",
                f"Reason: {exc}",
                "Generated code:",
                indent(code, "  "),
            ]
        )

    return "\n".join(
        [
            "Pattern: CodeAct",
            "Mode: executable reasoning with a restricted local sandbox",
            f"Task: {prompt}",
            "Generated code:",
            indent(code, "  "),
            f"Sandbox result: {sandbox_result['result']}",
            f"Answer: {sandbox_result['explanation']}",
        ]
    )


__all__ = ["run"]
