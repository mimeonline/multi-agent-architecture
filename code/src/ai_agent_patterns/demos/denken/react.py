"""ReAct: Der Agent wechselt iterativ zwischen Reasoning, Tool-Aufruf und Beobachtung.

Der Lernpunkt: Jede Iteration erzeugt ein `Thought → Action → Observation`-Triple, das im
State akkumuliert. Das nächste Reasoning hängt direkt vom letzten Tool-Ergebnis ab — die
enge Kopplung ist im Loop-Body sichtbar.
"""

from __future__ import annotations

import contextlib
import io
import warnings
from typing import Any, cast

from ai_agent_patterns.config import pick_model_config
from ai_agent_patterns.llm import init_langchain_model, last_message_text, provider_error
from ai_agent_patterns.tools import calculator, tiny_search


def run(prompt: str) -> str:
    config = pick_model_config()
    if not config.online:
        return "\n".join(
            [
                "Pattern: ReAct",
                f"Mode: offline fallback ({config.reason})",
                f"Thought: the prompt may need tools: {prompt}",
                f"Tool calculator('12 * 7'): {calculator('12 * 7')}",
                f"Tool tiny_search('LangGraph handoff'): {tiny_search('LangGraph handoff')}",
                "Answer: combine tool observations before responding to the user.",
            ]
        )

    try:
        warning_buffer = io.StringIO()
        with contextlib.redirect_stderr(warning_buffer), warnings.catch_warnings():
            warnings.filterwarnings("ignore", message=".*allowed_objects.*")
            from langchain.agents import create_agent

            model = cast(Any, init_langchain_model(config))
            agent = create_agent(
                model=model,
                tools=[calculator, tiny_search],
                system_prompt="You are a concise ReAct-style agent. Use tools when helpful.",
            )
            result = agent.invoke({"messages": [{"role": "user", "content": prompt}]})
    except Exception as exc:
        return "\n".join(
            [
                "Pattern: ReAct",
                f"Mode: online provider failed ({provider_error(config, exc)})",
                f"Thought: still demonstrate the ReAct loop for: {prompt}",
                f"Tool calculator('12 * 7'): {calculator('12 * 7')}",
                f"Tool tiny_search('LangGraph handoff'): {tiny_search('LangGraph handoff')}",
                "Answer: combine tool observations before responding to the user.",
            ]
        )

    return "Pattern: ReAct\n" + last_message_text(result)
