"""Graph Memory: Entitäten und ihre typisierten Beziehungen werden als Knowledge Graph gespeichert.

Der Lernpunkt: Ein Neighborhood-Query liefert alle Pfade, die von einem Knoten erreichbar
sind — Multi-Hop-Abfragen, die Vector Search nicht beantworten kann. Beziehungen statt
Ähnlichkeit als Retrieval-Grundlage.
"""

from __future__ import annotations

from typing import TypedDict

from ai_agent_patterns.demos.common import trace_demo

SLUG = "graph-memory"

# Edge format: (subject, predicate, object)
Edge = tuple[str, str, str]


class GraphState(TypedDict):
    prompt: str
    entities: set[str]
    edges: list[Edge]
    query_entity: str
    neighborhood: list[Edge]
    answer: str


_SEED_ENTITIES: set[str] = {"Python", "LangGraph", "OpenAI", "RAG", "Vector Memory", "LLM"}

_SEED_EDGES: list[Edge] = [
    ("LangGraph", "is_built_on", "Python"),
    ("LangGraph", "enables", "RAG"),
    ("OpenAI", "provides", "LLM"),
    ("RAG", "uses", "Vector Memory"),
    ("Vector Memory", "stores", "embeddings"),
    ("LLM", "powers", "LangGraph"),
]

_ENTITY_KEYWORDS: dict[str, str] = {
    "python": "Python",
    "langgraph": "LangGraph",
    "openai": "OpenAI",
    "rag": "RAG",
    "vector": "Vector Memory",
    "llm": "LLM",
    "language": "LLM",
    "retrieval": "RAG",
    "graph": "LangGraph",
}


def extract_entities_and_edges(state: GraphState) -> GraphState:
    """Heuristically detect entities mentioned in the prompt and add them to the graph."""
    tokens = [t.lower().strip("?.,!") for t in state["prompt"].split()]
    new_entities: set[str] = set()
    new_edges: list[Edge] = []

    known = {e.lower(): e for e in state["entities"]}
    for token in tokens:
        canonical = _ENTITY_KEYWORDS.get(token)
        if canonical and canonical not in state["entities"]:
            new_entities.add(canonical)
        # If two known entities appear together, add a co-occurrence edge
        if token in known:
            for other_token in tokens:
                if other_token != token and other_token in known:
                    edge: Edge = (known[token], "co-occurs-with", known[other_token])
                    if edge not in state["edges"] and edge not in new_edges:
                        new_edges.append(edge)

    updated_entities = state["entities"] | new_entities
    updated_edges = list(state["edges"]) + new_edges
    return {**state, "entities": updated_entities, "edges": updated_edges}


def identify_query_entity(state: GraphState) -> GraphState:
    """Identify the primary entity the prompt is asking about."""
    tokens = [t.lower().strip("?.,!") for t in state["prompt"].split()]
    for token in tokens:
        canonical = _ENTITY_KEYWORDS.get(token)
        if canonical and canonical in state["entities"]:
            return {**state, "query_entity": canonical}
    # Fallback to first known entity in store
    return {**state, "query_entity": next(iter(state["entities"])) if state["entities"] else ""}


def query_neighborhood(state: GraphState) -> GraphState:
    """Return all edges where the query entity appears as subject or object."""
    entity = state["query_entity"]
    neighborhood = [
        edge for edge in state["edges"]
        if edge[0] == entity or edge[2] == entity
    ]
    return {**state, "neighborhood": neighborhood}


def compose_graph_answer(state: GraphState) -> GraphState:
    if not state["query_entity"]:
        answer = f"No known entity found in prompt: {state['prompt']}"
    elif not state["neighborhood"]:
        answer = f"Entity '{state['query_entity']}' is in the graph but has no edges."
    else:
        paths = "; ".join(f"({s} --{p}--> {o})" for s, p, o in state["neighborhood"])
        answer = f"Graph neighborhood of '{state['query_entity']}': {paths}"
    return {**state, "answer": answer}


def run_plain_python(prompt: str) -> GraphState:
    state: GraphState = {
        "prompt": prompt,
        "entities": set(_SEED_ENTITIES),
        "edges": list(_SEED_EDGES),
        "query_entity": "",
        "neighborhood": [],
        "answer": "",
    }
    state = extract_entities_and_edges(state)
    state = identify_query_entity(state)
    state = query_neighborhood(state)
    return compose_graph_answer(state)


def render_result(runtime: str, state: GraphState) -> str:
    lines = [
        "Pattern: Graph Memory",
        f"Runtime: {runtime}",
        f"Prompt: {state['prompt']}",
        "",
        f"Entities ({len(state['entities'])}): {sorted(state['entities'])}",
        f"Edges ({len(state['edges'])}):",
    ]
    for s, p, o in state["edges"]:
        lines.append(f"  ({s}) --[{p}]--> ({o})")
    lines += [
        "",
        f"Query entity: {state['query_entity']}",
        f"Neighborhood ({len(state['neighborhood'])} edges):",
    ]
    for s, p, o in state["neighborhood"]:
        lines.append(f"  ({s}) --[{p}]--> ({o})")
    lines += ["", f"Answer: {state['answer']}"]
    return "\n".join(lines)


def run(prompt: str) -> str:
    @trace_demo(f"demo.{SLUG}")
    def traced_run(user_prompt: str) -> tuple[str, GraphState]:
        return "plain Python", run_plain_python(user_prompt)

    runtime, state = traced_run(prompt)
    return render_result(runtime, state)


__all__ = [
    "GraphState",
    "extract_entities_and_edges",
    "identify_query_entity",
    "query_neighborhood",
    "compose_graph_answer",
    "run_plain_python",
    "render_result",
    "run",
]
