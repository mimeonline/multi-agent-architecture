"""Agents-as-Tools: Hauptagent ruft Spezialisten als typisierte Tool-Funktionen auf.

Der Lernpunkt: Die Kontrolle bleibt zentral — der Hauptagent wählt das Tool je nach
Prompt-Inhalt, ruft `tools[name](sub_prompt)` auf und aggregiert das Ergebnis selbst.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo, typed_state


class AgentsAsToolsState(TypedDict):
    request: str
    selected_tool: str
    sub_prompt: str
    tool_result: str
    answer: str


# ---------------------------------------------------------------------------
# Spezialist-Agents — hinter einer stabilen Funktionsschnittstelle gekapselt
# ---------------------------------------------------------------------------

def research_agent(sub_prompt: str) -> str:
    """Simulierter Research-Specialist: sucht und fasst Fakten zusammen."""
    return f"[research_agent] Quellen durchsucht und Fakten aggregiert für: '{sub_prompt}'"


def code_agent(sub_prompt: str) -> str:
    """Simulierter Code-Specialist: übersetzt Anforderung in Implementierungsschritte."""
    return f"[code_agent] Implementierungsschritte erstellt für: '{sub_prompt}'"


def translate_agent(sub_prompt: str) -> str:
    """Simulierter Translate-Specialist: erkennt Sprache und übersetzt den Text."""
    return f"[translate_agent] Text erkannt und übersetzt: '{sub_prompt}'"


# Tool-Registry: Name -> callable Spezialist
TOOLS: dict[str, object] = {
    "research": research_agent,
    "code": code_agent,
    "translate": translate_agent,
}


# ---------------------------------------------------------------------------
# Hauptagent-Logik
# ---------------------------------------------------------------------------

def main_agent_select(state: AgentsAsToolsState) -> AgentsAsToolsState:
    """Hauptagent wählt passendes Tool anhand von Schlüsselwörtern im Request."""
    request = state["request"].lower()
    if any(kw in request for kw in ("übersetze", "translate", "sprache", "language")):
        tool = "translate"
    elif any(kw in request for kw in ("code", "implementier", "funktion", "schreib")):
        tool = "code"
    else:
        tool = "research"
    sub_prompt = state["request"]
    return {**state, "selected_tool": tool, "sub_prompt": sub_prompt}


def main_agent_invoke(state: AgentsAsToolsState) -> AgentsAsToolsState:
    """Hauptagent ruft das gewählte Tool auf — wie tools[name](sub_prompt)."""
    tool_fn = TOOLS[state["selected_tool"]]  # type: ignore[operator]
    result = tool_fn(state["sub_prompt"])  # type: ignore[call-arg]
    return {**state, "tool_result": result}


def main_agent_synthesize(state: AgentsAsToolsState) -> AgentsAsToolsState:
    answer = (
        f"Hauptagent delegierte an '{state['selected_tool']}' "
        f"und erhielt: {state['tool_result']}"
    )
    return {**state, "answer": answer}


# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------

def run_with_langgraph(prompt: str) -> tuple[str, AgentsAsToolsState]:
    init: AgentsAsToolsState = {
        "request": prompt,
        "selected_tool": "",
        "sub_prompt": "",
        "tool_result": "",
        "answer": "",
    }
    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        state = main_agent_synthesize(main_agent_invoke(main_agent_select(init)))
        return "plain Python fallback (langgraph not installed)", state

    graph = StateGraph(AgentsAsToolsState)
    graph.add_node("select", main_agent_select)
    graph.add_node("invoke", main_agent_invoke)
    graph.add_node("synthesize", main_agent_synthesize)
    graph.add_edge(START, "select")
    graph.add_edge("select", "invoke")
    graph.add_edge("invoke", "synthesize")
    graph.add_edge("synthesize", END)

    app = graph.compile()
    result: AgentsAsToolsState = typed_state(app.invoke(init))
    return "LangGraph StateGraph", result


def render_result(runtime: str, state: AgentsAsToolsState) -> str:
    return "\n".join([
        "Pattern: Agents-as-Tools",
        f"Runtime: {runtime}",
        f"Request: {state['request']}",
        f"Selected tool: {state['selected_tool']}",
        f"Tool result: {state['tool_result']}",
        f"Answer: {state['answer']}",
    ])


def run(prompt: str) -> str:
    @trace_demo("demo.agents-as-tools")
    def traced_run(user_prompt: str) -> tuple[str, AgentsAsToolsState]:
        return run_with_langgraph(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = ["run", "run_with_langgraph", "render_result"]
