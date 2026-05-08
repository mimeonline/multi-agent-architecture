from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.config import pick_model_config
from ai_agent_patterns.llm import init_langchain_model, is_offline_model


class ReflectionState(TypedDict):
    prompt: str
    draft: str
    score: int
    verdict: str
    final: str
    trace: list[str]


def _score(text: str) -> tuple[int, str]:
    score = 0
    score += 1 if len(text.split()) <= 70 else 0
    score += 1 if any(char in text for char in ".!?") else 0
    score += 1 if "next" in text.lower() or "because" in text.lower() else 0
    verdict = "pass" if score >= 2 else "revise"
    return score, verdict


def _draft_node(model: object):
    def draft(state: ReflectionState) -> dict[str, str | list[str]]:
        if is_offline_model(model):
            text = f"Draft: {state['prompt'].strip()} Next, validate it against a simple rubric."
        else:
            response = model.invoke(
                [
                    {"role": "system", "content": "Draft a concise answer. Include one concrete next step."},
                    {"role": "user", "content": state["prompt"]},
                ]
            )
            text = response.content
        return {"draft": text, "trace": state.get("trace", []) + ["generator produced draft"]}

    return draft


def _evaluate_node(state: ReflectionState) -> dict[str, int | str | list[str]]:
    score, verdict = _score(state["draft"])
    return {
        "score": score,
        "verdict": verdict,
        "trace": state.get("trace", []) + [f"evaluator returned {verdict} ({score}/3)"],
    }


def _decide(state: ReflectionState) -> str:
    return "revise" if state["verdict"] == "revise" else "finish"


def _revise_node(model: object):
    def revise(state: ReflectionState) -> dict[str, str | list[str]]:
        if is_offline_model(model):
            final = f"{state['draft'].rstrip('.')}. Next, make the recommendation explicit."
        else:
            response = model.invoke(
                [
                    {"role": "system", "content": "Revise the draft using the evaluator feedback. Keep it concise."},
                    {
                        "role": "user",
                        "content": f"Original request: {state['prompt']}\nDraft: {state['draft']}\nVerdict: {state['verdict']}",
                    },
                ]
            )
            final = response.content
        return {"final": final, "trace": state.get("trace", []) + ["optimizer revised draft"]}

    return revise


def _finish_node(state: ReflectionState) -> dict[str, str | list[str]]:
    return {"final": state["draft"], "trace": state.get("trace", []) + ["draft accepted"]}


def run(prompt: str) -> str:
    config = pick_model_config()
    model = init_langchain_model(config)

    try:
        from langgraph.constants import END, START
        from langgraph.graph import StateGraph
    except ImportError:
        if is_offline_model(model):
            draft = f"Draft: {prompt.strip()} Next, validate it against a simple rubric."
        else:
            response = model.invoke(
                [
                    {"role": "system", "content": "Draft a concise answer. Include one concrete next step."},
                    {"role": "user", "content": prompt},
                ]
            )
            draft = response.content
        score, verdict = _score(draft)
        final = f"{draft.rstrip('.')}. Next, make the recommendation explicit." if verdict == "revise" else draft
        return "\n".join(
            [
                "Pattern: Reflection / evaluator",
                "Runtime: fallback without LangGraph",
                f"Evaluator score: {score}/3 ({verdict})",
                f"Final: {final}",
            ]
        )

    graph = StateGraph(ReflectionState)
    graph.add_node("draft", _draft_node(model))
    graph.add_node("evaluate", _evaluate_node)
    graph.add_node("revise", _revise_node(model))
    graph.add_node("finish", _finish_node)
    graph.add_edge(START, "draft")
    graph.add_edge("draft", "evaluate")
    graph.add_conditional_edges("evaluate", _decide, {"revise": "revise", "finish": "finish"})
    graph.add_edge("revise", END)
    graph.add_edge("finish", END)

    app = graph.compile()
    result = app.invoke(
        {
            "prompt": prompt,
            "draft": "",
            "score": 0,
            "verdict": "",
            "final": "",
            "trace": [],
        }
    )

    return "\n".join(
        [
            "Pattern: Reflection / evaluator",
            "Runtime: LangGraph StateGraph with generator, evaluator, optimizer",
            f"Evaluator score: {result['score']}/3 ({result['verdict']})",
            "Trace: " + " -> ".join(result["trace"]),
            f"Final: {result['final']}",
        ]
    )
