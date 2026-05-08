"""Sequential Pipeline (Prompt Chaining): Fest definierte Schrittfolge, jeder Schritt nimmt den vorherigen Output.

Der Lernpunkt: `extract → draft → polish` sind eigenständige Funktionen, die eine Kette bilden.
Kein Schritt entscheidet über den nächsten — die Reihenfolge steht im Code, nicht im Prompt.
"""

from __future__ import annotations

from typing import Any

from ai_agent_patterns.config import pick_model_config
from ai_agent_patterns.llm import init_langchain_model, is_offline_model, provider_error


def _run_langchain_stage(model: Any, instruction: str, text: str) -> str:
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
    transcript = ["Pattern: Sequential Pipeline (Prompt Chaining)", f"Provider: {config.provider} ({config.reason})"]
    for name, instruction in stages:
        if is_offline_model(model):
            text = f"{name}: {instruction} Input was: {text[:120]}"
        else:
            try:
                text = _run_langchain_stage(model, instruction, text)
            except Exception as exc:
                text = (
                    f"{name}: provider call failed ({provider_error(config, exc)}). "
                    f"Fallback kept input: {text[:120]}"
                )
        transcript.append(f"{name}: {text}")
    return "\n".join(transcript)
