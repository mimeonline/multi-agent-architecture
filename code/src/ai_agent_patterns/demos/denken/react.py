"""ReAct demo with LangChain tools.

The code shows the Thought-Action-Observation idea through a LangChain agent.
Offline mode still runs deterministic local tools so the control flow remains visible without API keys.
"""

from __future__ import annotations

from ai_agent_patterns.config import pick_model_config
from ai_agent_patterns.llm import last_message_text
from ai_agent_patterns.tools import calculator, tiny_search


def run(prompt: str) -> str:
    config = pick_model_config()
    if not config.online:
        return "\n".join(
            [
                "Pattern: ReAct / tool calling",
                f"Mode: offline fallback ({config.reason})",
                f"Thought: the prompt may need tools: {prompt}",
                f"Tool calculator('12 * 7'): {calculator('12 * 7')}",
                f"Tool tiny_search('LangGraph handoff'): {tiny_search('LangGraph handoff')}",
                "Answer: combine tool observations before responding to the user.",
            ]
        )

    try:
        from langchain.agents import create_agent
    except ImportError as exc:
        return f"LangChain import failed, fallback answer: {exc}"

    agent = create_agent(
        model=config.model,
        tools=[calculator, tiny_search],
        system_prompt="You are a concise ReAct-style agent. Use tools when helpful.",
    )
    result = agent.invoke({"messages": [{"role": "user", "content": prompt}]})
    return "Pattern: ReAct / tool calling\n" + last_message_text(result)
