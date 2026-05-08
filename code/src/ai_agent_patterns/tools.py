from __future__ import annotations

import ast
import operator


ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
}


def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression."""

    def eval_node(node: ast.AST) -> float:
        if isinstance(node, ast.Expression):
            return eval_node(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, int | float):
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in ALLOWED_OPERATORS:
            return ALLOWED_OPERATORS[type(node.op)](eval_node(node.left), eval_node(node.right))
        if isinstance(node, ast.UnaryOp) and type(node.op) in ALLOWED_OPERATORS:
            return ALLOWED_OPERATORS[type(node.op)](eval_node(node.operand))
        raise ValueError("Only numeric arithmetic expressions are allowed.")

    tree = ast.parse(expression, mode="eval")
    return str(eval_node(tree))


def tiny_search(query: str) -> str:
    """Return a local, deterministic search result for demo purposes."""
    snippets = {
        "langgraph": "LangGraph models agent workflows as stateful graphs.",
        "langsmith": "LangSmith traces, evaluates, and monitors LLM applications.",
        "memory": "Memory stores useful conversation facts and retrieves them later.",
        "handoff": "Handoffs transfer control from one specialized agent to another.",
    }
    query_lower = query.lower()
    matches = [text for key, text in snippets.items() if key in query_lower]
    return " ".join(matches) if matches else "No local snippet found."
