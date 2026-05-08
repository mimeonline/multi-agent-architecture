"""Compressed Context Memory: Ältere Konversationsteile werden verdichtet, neuere bleiben wortgenau.

Der Lernpunkt: Alte Nachrichten werden zu einem Rolling Summary komprimiert; der nächste
Turn erhält nur Summary + neue Nachricht. Token-Verbrauch sinkt dramatisch, während der
Verlauf über das physische Kontextfenster hinaus nutzbar bleibt.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "compressed-context-memory"


class Message(TypedDict):
    role: str
    content: str


class CompressedContextState(TypedDict):
    new_message: str
    old_messages: list[Message]
    rolling_summary: str
    token_count_before: int
    token_count_after: int
    context_for_next_turn: list[Message]
    answer: str


_OLD_CONVERSATION: list[Message] = [
    {"role": "user", "content": "Hi, I want to learn about agent architectures."},
    {"role": "assistant", "content": "Sure! Agent architectures define how an AI system plans and acts."},
    {"role": "user", "content": "What is ReAct?"},
    {"role": "assistant", "content": "ReAct interleaves reasoning steps with action calls to tools."},
    {"role": "user", "content": "Can you give me an example of a ReAct trace?"},
    {"role": "assistant", "content": "Thought: I need to look this up. Action: search('ReAct paper'). Observation: ..."},
    {"role": "user", "content": "What about Reflexion?"},
    {"role": "assistant", "content": "Reflexion adds a self-critique loop after each action to improve future attempts."},
    {"role": "user", "content": "How does memory work in agents?"},
    {"role": "assistant", "content": "Agents use working memory for in-flight state, episodic memory for past tasks, and semantic memory for facts."},
]


def _count_tokens(messages: list[Message]) -> int:
    """Approximate token count: 1 token per ~4 chars."""
    total_chars = sum(len(m["content"]) for m in messages)
    return max(1, total_chars // 4)


def summarize_old_messages(state: CompressedContextState) -> CompressedContextState:
    """Compress old messages into a single rolling summary (deterministic mock)."""
    topics: list[str] = []
    for msg in state["old_messages"]:
        content = msg["content"]
        if "ReAct" in content:
            topics.append("ReAct (interleaved reasoning + actions)")
        if "Reflexion" in content:
            topics.append("Reflexion (self-critique loop)")
        if "memory" in content.lower():
            topics.append("agent memory types (working, episodic, semantic)")
        if "architecture" in content.lower():
            topics.append("agent architectures overview")

    unique_topics = list(dict.fromkeys(topics))  # deduplicate while preserving order
    summary = f"Summary of {len(state['old_messages'])} previous messages: covered {'; '.join(unique_topics)}."
    token_before = _count_tokens(state["old_messages"])
    return {**state, "rolling_summary": summary, "token_count_before": token_before}


def build_compressed_context(state: CompressedContextState) -> CompressedContextState:
    """Replace old messages with summary + new message; count tokens after compression."""
    context: list[Message] = [
        {"role": "system", "content": state["rolling_summary"]},
        {"role": "user", "content": state["new_message"]},
    ]
    token_after = _count_tokens(context)
    return {**state, "context_for_next_turn": context, "token_count_after": token_after}


def respond_with_compressed_context(state: CompressedContextState) -> CompressedContextState:
    saved = state["token_count_before"] - state["token_count_after"]
    answer = (
        f"Compressed Context Memory: context reduced from ~{state['token_count_before']} tokens "
        f"to ~{state['token_count_after']} tokens (saved ~{saved} tokens). "
        f"Responding to \"{state['new_message']}\" with compressed context: "
        f"[{state['rolling_summary'][:80]}...]"
    )
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> CompressedContextState:
    state: CompressedContextState = {
        "new_message": prompt,
        "old_messages": list(_OLD_CONVERSATION),
        "rolling_summary": "",
        "token_count_before": 0,
        "token_count_after": 0,
        "context_for_next_turn": [],
        "answer": "",
    }
    state = summarize_old_messages(state)
    state = build_compressed_context(state)
    return respond_with_compressed_context(state)


def render_result(runtime: str, state: CompressedContextState) -> str:
    lines = [
        "Pattern: Compressed Context Memory",
        f"Runtime: {runtime}",
        f"New message: {state['new_message']}",
        "",
        f"Old conversation ({len(state['old_messages'])} messages, ~{state['token_count_before']} tokens):",
    ]
    for msg in state["old_messages"]:
        lines.append(f"  [{msg['role']}] {msg['content'][:70]}")
    lines += [
        "",
        f"Rolling summary: {state['rolling_summary']}",
        "",
        f"Context for next turn (~{state['token_count_after']} tokens):",
    ]
    for msg in state["context_for_next_turn"]:
        lines.append(f"  [{msg['role']}] {msg['content'][:80]}")
    lines += [
        "",
        f"Token reduction: {state['token_count_before']} -> {state['token_count_after']} "
        f"(saved ~{state['token_count_before'] - state['token_count_after']})",
        "",
        f"Answer: {state['answer']}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, CompressedContextState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "Message",
    "CompressedContextState",
    "summarize_old_messages",
    "build_compressed_context",
    "respond_with_compressed_context",
    "run_plain_python",
    "render_result",
    "run",
]
