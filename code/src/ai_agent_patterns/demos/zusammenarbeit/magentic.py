"""Magentic: Lead-Agent plant mit Task-Ledger, delegiert dynamisch an Spezialisten und replant bei Hindernissen.

Der Lernpunkt: Ein `task_ledger` hält offene und erledigte Subtasks. Der Coordinator wählt
pro Schritt den passenden Spezialisten, registriert Ergebnisse und replant, statt bei einem
Hindernis abzubrechen.
"""

from __future__ import annotations

from typing import Any, cast

from ai_agent_patterns.config import pick_model_config
from ai_agent_patterns.llm import init_langchain_model, is_offline_model, last_message_text, provider_error
from ai_agent_patterns.tools import calculator, tiny_search


def _subagents() -> list[dict[str, object]]:
    return [
        {
            "name": "research-agent",
            "description": "Find focused source snippets and extract decision-relevant facts.",
            "system_prompt": (
                "You are a focused research subagent. Use the available local search tool, "
                "return only facts that help the main agent choose an architecture pattern."
            ),
            "tools": [tiny_search],
        },
        {
            "name": "synthesis-agent",
            "description": "Turn gathered facts into a concise architecture recommendation.",
            "system_prompt": (
                "You are a synthesis subagent. Compare candidate patterns, state trade-offs, "
                "and produce a concise recommendation."
            ),
        },
    ]


def _fallback_report(mode: str, reason: str, prompt: str) -> str:
    snippets = tiny_search(prompt)
    return "\n".join(
        [
            "Pattern: Magentic",
            f"Mode: {mode}",
            f"Reason: {reason}",
            "Deep Agents mapping:",
            "- Planning: coordinator plans work before acting, including todo-style planning.",
            "- Tools: coordinator can call tiny_search and calculator.",
            "- Subagents: research-agent handles focused lookup, synthesis-agent writes the recommendation.",
            "- Context: Deep Agents can use file-system-backed context for longer tasks.",
            "- Memory: long-term memory can be attached through create_deep_agent configuration.",
            "Offline trace:",
            "1. Plan the research question.",
            f"2. Query local knowledge: {snippets}",
            "3. Delegate synthesis to the recommendation role.",
            "4. Return a compact pattern decision.",
        ]
    )


def run(prompt: str) -> str:
    config = pick_model_config()
    model = init_langchain_model(config)
    subagents = _subagents()

    try:
        from deepagents import create_deep_agent
    except ImportError:
        return _fallback_report(
            "dependency fallback",
            "Install with `pip install -r requirements.txt` and `pip install -e .`.",
            prompt,
        )

    if is_offline_model(model):
        return _fallback_report("offline fallback", f"{config.provider}: {config.reason}", prompt)

    try:
        agent = create_deep_agent(
            model=cast(Any, model),
            tools=[tiny_search, calculator],
            system_prompt=(
                "You are the main Deep Agent for the AI Agent Pattern Landscape. "
                "Plan before acting, use tools for factual lookup or calculation, delegate focused "
                "research and synthesis to subagents when useful, and end with a concise pattern "
                "recommendation."
            ),
            subagents=cast(Any, subagents),
            name="pattern-landscape-deep-agent",
        )
        result = agent.invoke({"messages": [{"role": "user", "content": prompt}]})
    except Exception as exc:
        return _fallback_report("provider fallback", provider_error(config, exc), prompt)

    return "Pattern: Magentic\n" + last_message_text(result)
