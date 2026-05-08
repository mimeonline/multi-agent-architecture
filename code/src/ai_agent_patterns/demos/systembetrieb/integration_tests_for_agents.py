"""Integration Tests für Agents demo.

This file intentionally contains code, not pattern metadata.
The metadata lives in demos/metadata.py because the theory is documented in docs, slides, and the webapp.

What happens here:
1. This file defines its own demo state, plan step, execution step, and synthesis step.
2. run_with_langchain wires those steps as a local RunnableSequence when LangChain is installed.
3. run_with_langgraph wires those steps as a local StateGraph when LangGraph is installed.
4. run wraps the local implementation with optional LangSmith tracing.

Framework focus: pytest, LangSmith datasets.
Pattern idea: Agenten werden über realistische Szenarien mit Tools und State getestet."""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo
from ai_agent_patterns.demos.metadata import get_pattern

SLUG = 'integration-tests-for-agents'


class DemoState(TypedDict):
    prompt: str
    plan: list[str]
    observations: list[str]
    answer: str


def build_plan(prompt: str) -> list[str]:
    metadata = get_pattern(SLUG)
    return [f"{step} for: {prompt}" for step in metadata.steps]


def execute_step(step: str, index: int, prompt: str) -> str:
    action = step.split(" for: ", 1)[0]
    return f"{index}. {action} -> executable step for `{prompt[:90]}`"


def synthesize(prompt: str, observations: list[str]) -> str:
    metadata = get_pattern(SLUG)
    return (
        f"{metadata.name} executed {len(observations)} steps for `{prompt[:90]}`. "
        f"The demo used the pattern move: {metadata.idea}"
    )


def plan_node(prompt: str) -> DemoState:
    return {"prompt": prompt, "plan": build_plan(prompt), "observations": [], "answer": ""}


def execute_node(state: DemoState) -> DemoState:
    observations = [
        execute_step(step, index, state["prompt"])
        for index, step in enumerate(state["plan"], start=1)
    ]
    return {**state, "observations": observations}


def synthesize_node(state: DemoState) -> DemoState:
    return {**state, "answer": synthesize(state["prompt"], state["observations"])}


def run_with_langchain(prompt: str) -> tuple[str, DemoState]:
    try:
        from langchain_core.runnables import RunnableLambda
    except ImportError:
        state = synthesize_node(execute_node(plan_node(prompt)))
        return "plain Python fallback because langchain_core is not installed", state

    chain = RunnableLambda(plan_node) | RunnableLambda(execute_node) | RunnableLambda(synthesize_node)
    return "LangChain RunnableSequence", chain.invoke(prompt)


def run_with_langgraph(prompt: str) -> tuple[str, DemoState]:
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        return run_with_langchain(prompt)

    graph = StateGraph(DemoState)
    graph.add_node("plan", lambda state: plan_node(state["prompt"]))
    graph.add_node("execute", execute_node)
    graph.add_node("synthesize", synthesize_node)
    graph.add_edge(START, "plan")
    graph.add_edge("plan", "execute")
    graph.add_edge("execute", "synthesize")
    graph.add_edge("synthesize", END)
    app = graph.compile()
    result = app.invoke({"prompt": prompt, "plan": [], "observations": [], "answer": ""})
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: DemoState) -> str:
    metadata = get_pattern(SLUG)
    return "\n".join(
        [
            f"Pattern: {metadata.name}",
            f"Framework runtime: {runtime} with optional LangSmith tracing",
            f"Input: {state['prompt']}",
            "Executable trace:",
            *state["observations"],
            f"Result: {state['answer']}",
        ]
    )


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, DemoState]:
        return run_with_langchain(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "build_plan",
    "execute_step",
    "synthesize",
    "run_with_langchain",
    "run_with_langgraph",
    "run",
]
