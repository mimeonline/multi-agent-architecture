"""Sequential Pipeline demo with LangChain prompt chains.

The code runs extract, draft, and polish stages in order. Each stage receives the previous output.
"""

from __future__ import annotations

from ai_agent_patterns.config import pick_model_config
from ai_agent_patterns.llm import init_langchain_model, is_offline_model


def _run_langchain_stage(model: object, instruction: str, text: str) -> str:
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.prompts import ChatPromptTemplate

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", instruction),
            ("user", "{input}"),
        ]
    )
    chain = prompt | model | StrOutputParser()
    return chain.invoke({"input": text})


def run(prompt: str) -> str:
    config = pick_model_config()
    model = init_langchain_model(config)

    stages = [
        ("extract", "Extract the user's objective in one sentence."),
        ("draft", "Draft a compact answer for that objective."),
        ("polish", "Polish the answer so it is actionable and clear."),
    ]

    text = prompt
    transcript = ["Pattern: Sequential pipeline", f"Provider: {config.provider} ({config.reason})"]
    for name, instruction in stages:
        if is_offline_model(model):
            text = f"{name}: {instruction} Input was: {text[:120]}"
        else:
            text = _run_langchain_stage(model, instruction, text)
        transcript.append(f"{name}: {text}")
    return "\n".join(transcript)
