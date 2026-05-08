"""Function Calling demo.

This file intentionally contains code, not pattern metadata.
The metadata lives in demos/metadata.py because the theory is documented in docs, slides, and the webapp.

What happens here:
1. A real Python function is exposed as an agent tool with a small JSON-like schema.
2. The "model decision" is represented as a structured function call: name plus arguments.
3. The arguments are validated before the function is executed.
4. LangChain can wire the same steps as a local RunnableSequence, while LangSmith can trace the run.

Framework focus: LangChain Tools, OpenAI Agents SDK.
Pattern idea: Tools werden über strukturierte, validierbare Argumente aufgerufen.
"""

from __future__ import annotations

import re
from collections.abc import Callable
from typing import Any, TypedDict

from ai_agent_patterns.demos.common import trace_demo
from ai_agent_patterns.demos.metadata import get_pattern

SLUG = "function-calling"


class ToolSpec(TypedDict):
    name: str
    description: str
    parameters: dict[str, type]
    function: Callable[..., object]


class FunctionCall(TypedDict):
    name: str
    arguments: dict[str, object]


class FunctionCallState(TypedDict):
    prompt: str
    function_call: FunctionCall
    validation_errors: list[str]
    tool_result: object
    answer: str


def calculate_subscription_cost(seats: int, price_per_seat: float, months: int) -> float:
    """Calculate subscription cost for a team."""
    return round(seats * price_per_seat * months, 2)


TOOL_REGISTRY: dict[str, ToolSpec] = {
    "calculate_subscription_cost": {
        "name": "calculate_subscription_cost",
        "description": "Calculate total subscription cost from seats, price_per_seat, and months.",
        "parameters": {
            "seats": int,
            "price_per_seat": float,
            "months": int,
        },
        "function": calculate_subscription_cost,
    }
}


def extract_numbers(prompt: str) -> list[float]:
    return [float(match) for match in re.findall(r"-?\d+(?:\.\d+)?", prompt)]


def choose_function_call(prompt: str) -> FunctionCallState:
    """Represent the model's tool decision as structured data."""
    numbers = extract_numbers(prompt)
    seats = int(numbers[0]) if len(numbers) >= 1 else 5
    price_per_seat = float(numbers[1]) if len(numbers) >= 2 else 29.0
    months = int(numbers[2]) if len(numbers) >= 3 else 12
    return {
        "prompt": prompt,
        "function_call": {
            "name": "calculate_subscription_cost",
            "arguments": {
                "seats": seats,
                "price_per_seat": price_per_seat,
                "months": months,
            },
        },
        "validation_errors": [],
        "tool_result": None,
        "answer": "",
    }


def validate_function_call(state: FunctionCallState) -> FunctionCallState:
    call = state["function_call"]
    tool = TOOL_REGISTRY.get(call["name"])
    if tool is None:
        return {**state, "validation_errors": [f"Unknown tool: {call['name']}"]}

    errors: list[str] = []
    arguments = call["arguments"]
    for name, expected_type in tool["parameters"].items():
        value = arguments.get(name)
        if value is None:
            errors.append(f"Missing argument: {name}")
            continue
        if expected_type is int and not isinstance(value, int):
            errors.append(f"{name} must be int, got {type(value).__name__}")
        if expected_type is float and not isinstance(value, (int, float)):
            errors.append(f"{name} must be float, got {type(value).__name__}")
    return {**state, "validation_errors": errors}


def execute_function_call(state: FunctionCallState) -> FunctionCallState:
    if state["validation_errors"]:
        return {**state, "tool_result": "not executed"}

    call = state["function_call"]
    tool = TOOL_REGISTRY[call["name"]]
    result = tool["function"](**call["arguments"])
    return {**state, "tool_result": result}


def synthesize_answer(state: FunctionCallState) -> FunctionCallState:
    metadata = get_pattern(SLUG)
    call = state["function_call"]
    if state["validation_errors"]:
        answer = f"Rejected invalid function call: {', '.join(state['validation_errors'])}"
    else:
        answer = (
            f"{metadata.name} called `{call['name']}` with {call['arguments']} "
            f"and returned {state['tool_result']}."
        )
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> FunctionCallState:
    state = choose_function_call(prompt)
    state = validate_function_call(state)
    state = execute_function_call(state)
    return synthesize_answer(state)


def run_with_langchain(prompt: str) -> tuple[str, FunctionCallState]:
    try:
        from langchain_core.runnables import RunnableLambda
    except ImportError:
        return "plain Python fallback because langchain_core is not installed", run_plain_python(prompt)

    chain = (
        RunnableLambda(choose_function_call)
        | RunnableLambda(validate_function_call)
        | RunnableLambda(execute_function_call)
        | RunnableLambda(synthesize_answer)
    )
    return "LangChain RunnableSequence", chain.invoke(prompt)


def render_result(runtime: str, state: FunctionCallState) -> str:
    call = state["function_call"]
    return "\n".join(
        [
            "Pattern: Function Calling",
            f"Runtime: {runtime} with optional LangSmith tracing",
            f"Input: {state['prompt']}",
            "Registered function:",
            "  calculate_subscription_cost(seats: int, price_per_seat: float, months: int) -> float",
            f"Structured call: {call['name']}({call['arguments']})",
            f"Validation: {'ok' if not state['validation_errors'] else state['validation_errors']}",
            f"Tool result: {state['tool_result']}",
            f"Answer: {state['answer']}",
        ]
    )


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, FunctionCallState]:
        return run_with_langchain(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "TOOL_REGISTRY",
    "calculate_subscription_cost",
    "choose_function_call",
    "validate_function_call",
    "execute_function_call",
    "run_with_langchain",
    "run",
]
