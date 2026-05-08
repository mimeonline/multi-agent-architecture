# Pattern Demos

Konkrete Code-Beispiele für alle Patterns aus der AI Agent Pattern Landscape.

## Struktur

- `denken/`: Reasoning Patterns eines einzelnen Agents
- `ablauf/`: Workflow und Control Flow Patterns
- `zusammenarbeit/`: Multi-Agent Coordination Patterns
- `systembetrieb/`: Memory, Tool Integration, Runtime, Governance und Observability

Jedes Pattern hat eine eigene Datei im passenden Domänenordner. Jede Pattern-Datei enthält die ausführbare Demo-Logik selbst, inklusive LangChain `RunnableLambda`, LangGraph `StateGraph`, Deep Agents oder einer bewusst lokalen Python-Implementierung, wenn das Pattern davon profitiert.

`common.py` enthält nur Boilerplate: Registry-Typen, Pattern-Metadaten-Typ und optionales LangSmith `traceable`. Die agentische Logik liegt nicht dort, sondern in den einzelnen Pattern-Dateien.

## Beispiele

- `denken/react.py`: ReAct und Tool Calling mit LangChain
- `denken/reflexion.py`: Reflexion als Evaluator Loop
- `ablauf/sequential_pipeline.py`: Sequential Pipeline mit LangChain Prompt Chains
- `ablauf/routing.py`: Routing mit LangGraph Conditional Edges
- `zusammenarbeit/supervisor.py`: Supervisor als LangGraph State Graph
- `zusammenarbeit/magentic.py`: Deep Agents für Magentic-ähnliche Composite Orchestration
- `systembetrieb/conversational_memory.py`: Conversational Memory und Checkpointing

## Ausführen

```bash
agent-patterns list
agent-patterns list --grouped
agent-patterns run all
agent-patterns run deepagents "Research how handoffs should be documented."
```
