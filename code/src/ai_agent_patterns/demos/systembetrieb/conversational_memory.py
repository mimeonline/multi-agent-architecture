"""Conversational Memory: Die bisherige Konversation wird als wachsendes Array im LLM-Call mitgeschickt.

Der Lernpunkt: `messages: list` wächst Turn für Turn — jede neue Anfrage bekommt die gesamte
Historie als Kontext. Das Tokenbudget ist die natürliche Grenze; was darüber hinausgeht,
braucht Compressed Context.
"""

from __future__ import annotations

import uuid
from typing import Any, TypedDict, cast


class MemoryState(TypedDict):
    message: str
    facts: list[str]
    response: str


def _remember(state: MemoryState) -> MemoryState:
    facts = list(state.get("facts", []))
    message = state["message"]
    lowered = message.lower()
    if "my name is" in lowered or "i like" in lowered or "i prefer" in lowered:
        facts.append(message)
    response = "I will remember: " + "; ".join(facts[-3:]) if facts else "No durable fact detected."
    return {**state, "facts": facts, "response": response}


def run(prompt: str) -> str:
    try:
        from langgraph.checkpoint.memory import InMemorySaver
        from langgraph.constants import START
        from langgraph.graph import StateGraph
    except ImportError:
        state: MemoryState = {"message": prompt, "facts": [], "response": ""}
        state = _remember(state)
        return "\n".join(
            [
                "Pattern: Conversational Memory",
                "Mode: offline fallback (langgraph not installed)",
                state["response"],
            ]
        )

    graph = StateGraph(MemoryState)
    graph.add_node("remember", _remember)
    graph.add_edge(START, "remember")
    graph.set_finish_point("remember")
    app = graph.compile(checkpointer=InMemorySaver())
    config = cast(Any, {"configurable": {"thread_id": str(uuid.uuid4())}})

    first = app.invoke({"message": prompt, "facts": [], "response": ""}, config)
    second = app.invoke(
        {"message": "What do you remember about me?", "facts": first["facts"], "response": ""},
        config,
    )
    return "\n".join(
        [
            "Pattern: Conversational Memory",
            first["response"],
            "Replay: " + second["response"],
        ]
    )
