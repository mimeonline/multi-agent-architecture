"""Integration Tests für Agents: Reproduzierbare Szenarien prüfen das Agentensystem end-to-end.

Der Lernpunkt: Jedes Szenario definiert `(input, expected_action, mocks)` — das Harness
vergleicht tatsächlichen Output mit Erwartung und meldet Pass/Fail. Gemockte Tools halten
externe Abhängigkeiten heraus.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "integration-tests-for-agents"


class TestCase(TypedDict):
    name: str
    input: str
    expected_action: str
    mocks: dict[str, Callable[..., str]]


class TestResult(TypedDict):
    name: str
    input: str
    expected_action: str
    actual_action: str
    passed: bool
    detail: str


class TestRunState(TypedDict):
    cases: list[TestCase]
    results: list[TestResult]
    passed: int
    failed: int
    pass_rate: float


# --- Mock tools used by agent ---

def mock_search(query: str) -> str:
    return f"[mock] search results for '{query[:30]}'"


def mock_search_empty(query: str) -> str:
    return "[mock] no results found"


def mock_calculator(expression: str) -> str:
    return f"[mock] calculated: {expression} = 42"


def mock_send_email(to: str, subject: str) -> str:
    return f"[mock] email sent to {to}"


# --- Agent under test ---

def agent_under_test(user_input: str, mocks: dict[str, Callable[..., str]]) -> str:
    """Deterministic routing agent: picks an action based on keywords in the input."""
    lower = user_input.lower()
    if "calculate" in lower or "how much" in lower or "sum" in lower:
        fn = mocks.get("calculator", mock_calculator)
        fn(expression=user_input[:30])
        return "call_calculator"
    if "send" in lower or "email" in lower or "notify" in lower:
        fn = mocks.get("send_email", mock_send_email)
        fn(to="team@example.com", subject=user_input[:30])
        return "call_send_email"
    if "search" in lower or "find" in lower or "look up" in lower:
        fn = mocks.get("search", mock_search)
        result = fn(query=user_input[:30])
        if "no results" in result:
            return "call_search_empty"
        return "call_search"
    return "no_action"


def run_test_case(case: TestCase) -> TestResult:
    actual_action = agent_under_test(case["input"], case["mocks"])
    passed = actual_action == case["expected_action"]
    detail = "ok" if passed else f"expected '{case['expected_action']}', got '{actual_action}'"
    return TestResult(
        name=case["name"],
        input=case["input"],
        expected_action=case["expected_action"],
        actual_action=actual_action,
        passed=passed,
        detail=detail,
    )


def run_plain_python(prompt: str) -> tuple[str, TestRunState]:
    cases: list[TestCase] = [
        {
            "name": "search_happy_path",
            "input": f"Search for information about {prompt[:30]}",
            "expected_action": "call_search",
            "mocks": {"search": mock_search},
        },
        {
            "name": "search_empty_results",
            "input": "Find documents about quantum computing",
            "expected_action": "call_search_empty",
            "mocks": {"search": mock_search_empty},
        },
        {
            "name": "calculator_invocation",
            "input": "Calculate the total cost: 3 * 49.99",
            "expected_action": "call_calculator",
            "mocks": {"calculator": mock_calculator},
        },
        {
            "name": "email_notification",
            "input": "Send email to the team about the deployment",
            "expected_action": "call_send_email",
            "mocks": {"send_email": mock_send_email},
        },
        {
            "name": "no_matching_action",
            "input": "Hello, how are you?",
            "expected_action": "no_action",
            "mocks": {},
        },
        {
            "name": "keyword_ambiguity_check",
            "input": "Notify me when you find the sum",
            # 'notify' triggers send_email, not calculator — tests routing priority
            "expected_action": "call_send_email",
            "mocks": {"send_email": mock_send_email},
        },
    ]

    results = [run_test_case(case) for case in cases]
    passed = sum(1 for r in results if r["passed"])
    failed = len(results) - passed

    state: TestRunState = {
        "cases": cases,
        "results": results,
        "passed": passed,
        "failed": failed,
        "pass_rate": round(passed / len(results), 2) if results else 0.0,
    }
    return "plain Python test harness (mock injection)", state


def render_result(runtime: str, state: TestRunState) -> str:
    lines = [
        "Pattern: Integration Tests für Agents",
        f"Runtime: {runtime}",
        "Mechanic: test cases with mocks injected; harness compares actual_action to expected_action",
        "",
        "Test results:",
    ]
    for result in state["results"]:
        status = "PASS" if result["passed"] else "FAIL"
        lines.append(f"  [{status}] {result['name']}: {result['detail']}")
    lines.extend([
        "",
        f"Summary: {state['passed']}/{state['passed'] + state['failed']} passed "
        f"(pass rate: {state['pass_rate']:.0%})",
    ])
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, TestRunState]:
        return run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["agent_under_test", "run_test_case", "run_plain_python", "render_result", "run"]
