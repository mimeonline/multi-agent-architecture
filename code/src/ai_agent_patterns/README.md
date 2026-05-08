# ai_agent_patterns

Python-Package für praktische Pattern-Demos mit LangChain, LangGraph, LangSmith und Deep Agents.

## Module

- `cli.py`: Kommandozeileninterface `agent-patterns`
- `config.py`: Auswahl von Provider, Modell und Offline-Modus
- `llm.py`: Initialisierung der LangChain-Modelle und Fallback-Helfer
- `tools.py`: kleine Demo-Tools für Tool-Calling und Deep Agents
- `demos/`: konkrete Pattern-Implementierungen

## Design

Alle Demos besitzen einen deterministischen Fallback, damit die Beispiele auch ohne API Keys und ohne vollständige lokale Installation erklärbar bleiben.

