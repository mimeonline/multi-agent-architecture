"""Semantic Memory: Faktenwissen und Domänenkonzepte werden langfristig gespeichert und per Suche abgerufen.

Der Lernpunkt: Der Agent hält ein Knowledge-Dictionary mit validierten Fakten, sucht darin
bei jeder neuen Frage nach passendem Wissen und aktualisiert den Store per Upsert — Wissen
über Sitzungsgrenzen hinweg verfügbar.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "semantic-memory"


class Fact(TypedDict):
    fact_id: str
    subject: str
    predicate: str
    value: str
    confidence: float


class SemanticState(TypedDict):
    prompt: str
    knowledge_store: dict[str, Fact]
    extracted_facts: list[Fact]
    validation_errors: list[str]
    retrieved_fact: Fact | None
    answer: str


_SEED_KNOWLEDGE: dict[str, Fact] = {
    "python_typing": {
        "fact_id": "python_typing",
        "subject": "Python",
        "predicate": "supports",
        "value": "optional static typing via type hints since 3.5",
        "confidence": 0.99,
    },
    "langgraph_purpose": {
        "fact_id": "langgraph_purpose",
        "subject": "LangGraph",
        "predicate": "is",
        "value": "a library for building stateful multi-step agents as graphs",
        "confidence": 0.98,
    },
    "rag_definition": {
        "fact_id": "rag_definition",
        "subject": "RAG",
        "predicate": "stands for",
        "value": "Retrieval-Augmented Generation",
        "confidence": 1.0,
    },
}

_KNOWN_SUBJECTS: dict[str, str] = {
    "python": "python_typing",
    "langgraph": "langgraph_purpose",
    "rag": "rag_definition",
    "retrieval": "rag_definition",
    "augmented": "rag_definition",
    "typing": "python_typing",
    "graph": "langgraph_purpose",
}


def extract_facts_from_prompt(state: SemanticState) -> SemanticState:
    """Extract candidate facts from the prompt via simple heuristic matching."""
    tokens = [t.lower().strip("?.,!") for t in state["prompt"].split()]
    facts: list[Fact] = []
    if "what" in tokens or "explain" in tokens or "tell" in tokens:
        # This is a query, not a fact assertion — no new fact to extract
        pass
    elif "is" in tokens or "are" in tokens:
        # Treat the whole sentence as a candidate fact assertion
        subject = tokens[0] if tokens else "unknown"
        facts.append(
            {
                "fact_id": f"user_{subject}",
                "subject": subject,
                "predicate": "user_claim",
                "value": state["prompt"],
                "confidence": 0.7,
            }
        )
    return {**state, "extracted_facts": facts}


def validate_and_upsert_facts(state: SemanticState) -> SemanticState:
    """Validate confidence threshold; upsert high-confidence facts into the store."""
    errors: list[str] = []
    updated_store = dict(state["knowledge_store"])
    for fact in state["extracted_facts"]:
        if fact["confidence"] < 0.5:
            errors.append(f"Fact '{fact['fact_id']}' rejected: confidence {fact['confidence']} < 0.5")
            continue
        updated_store[fact["fact_id"]] = fact
    return {**state, "knowledge_store": updated_store, "validation_errors": errors}


def search_knowledge_store(state: SemanticState) -> SemanticState:
    """Find the best matching fact for the current prompt by subject keyword overlap."""
    tokens = {t.lower().strip("?.,!") for t in state["prompt"].split()}
    best_fact: Fact | None = None
    for token in tokens:
        fact_id = _KNOWN_SUBJECTS.get(token)
        if fact_id and fact_id in state["knowledge_store"]:
            best_fact = state["knowledge_store"][fact_id]
            break
    # Also check dynamically upserted user facts
    if best_fact is None:
        for fact in state["extracted_facts"]:
            if fact["fact_id"] in state["knowledge_store"]:
                best_fact = state["knowledge_store"][fact["fact_id"]]
                break
    return {**state, "retrieved_fact": best_fact}


def compose_answer(state: SemanticState) -> SemanticState:
    if state["retrieved_fact"]:
        f = state["retrieved_fact"]
        answer = (
            f"Semantic Memory retrieved: [{f['fact_id']}] "
            f"{f['subject']} {f['predicate']} \"{f['value']}\" "
            f"(confidence={f['confidence']})"
        )
    else:
        answer = f"No matching fact found in knowledge store for: {state['prompt']}"
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> SemanticState:
    state: SemanticState = {
        "prompt": prompt,
        "knowledge_store": dict(_SEED_KNOWLEDGE),
        "extracted_facts": [],
        "validation_errors": [],
        "retrieved_fact": None,
        "answer": "",
    }
    state = extract_facts_from_prompt(state)
    state = validate_and_upsert_facts(state)
    state = search_knowledge_store(state)
    return compose_answer(state)


def render_result(runtime: str, state: SemanticState) -> str:
    lines = [
        "Pattern: Semantic Memory",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"Knowledge store ({len(state['knowledge_store'])} facts):",
    ]
    for fid, fact in state["knowledge_store"].items():
        lines.append(f"  [{fid}] {fact['subject']} {fact['predicate']} \"{fact['value']}\" conf={fact['confidence']}")
    lines.append("")
    if state["extracted_facts"]:
        lines.append(f"Extracted from prompt: {[f['fact_id'] for f in state['extracted_facts']]}")
    if state["validation_errors"]:
        lines.append(f"Validation errors: {state['validation_errors']}")
    lines += [
        "",
        f"Retrieved: {state['retrieved_fact']['fact_id'] if state['retrieved_fact'] else 'none'}",
        f"Answer: {state['answer']}",
    ]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, SemanticState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "Fact",
    "SemanticState",
    "extract_facts_from_prompt",
    "validate_and_upsert_facts",
    "search_knowledge_store",
    "compose_answer",
    "run_plain_python",
    "render_result",
    "run",
]
