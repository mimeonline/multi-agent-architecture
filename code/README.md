# AI Agent Patterns Demo Suite

Praktische Python-Demos unter einer gemeinsamen CLI für zentrale Agent Patterns mit LangChain, LangGraph, LangSmith Tracing und Deep Agents.

Jede Demo hat einen deterministischen Offline-Fallback. Dadurch bleibt die Suite nutzbar, auch wenn noch keine API Keys oder optionalen Pakete installiert sind.

## Enthaltene Patterns

Die Suite stellt Demos für alle Patterns aus der Landscape bereit:

- Denken: ReAct, Plan-and-Execute, ReWOO, Reflexion, Tree of Thoughts, Self-Consistency, CodeAct
- Ablauf: Sequential Pipeline, Routing, Parallelization, Loop, Evaluator-Optimizer, Iterative Refinement, Orchestrator-Workers, Map-Reduce
- Zusammenarbeit: Supervisor, Hierarchical Supervisor, Handoff, Swarm, Group Chat, Multi-Agent Debate, Magentic, Blackboard, Contract Net, Market-based, Agents-as-Tools, Graph-based Orchestration
- Systembetrieb: Memory, Tool Integration, Runtime, Governance und Observability Capabilities

Zentrale Patterns nutzen konkrete LangChain- oder LangGraph-Implementierungen. Infrastruktur-lastige Patterns nutzen deterministische Architekturskizzen mit ausführbarer CLI-Ausgabe.

Jedes Pattern liegt in einer eigenen Python-Datei im passenden Domänenordner. Die Pattern-Dateien enthalten die agentische Logik selbst, inklusive lokaler LangChain `RunnableSequence`, LangGraph `StateGraph`, Deep Agents oder bewusst lokalem Python-Code. `demos/common.py` enthält nur Boilerplate wie Registry-Typen, Pattern-Metadaten-Typen und optionales LangSmith Tracing.

## Installation

```bash
cd code
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .
```

`requirements.txt` installiert das vollständige Demo-Set inklusive Deep Agents. Die editable install fügt die lokale `agent-patterns` CLI hinzu.

## Konfiguration

```bash
cp .env.example .env
```

Einen Provider Key setzen und einen Provider auswählen:

```bash
export AGENT_PROVIDER=openai
export OPENAI_API_KEY=...
```

Unterstützte Provider-Umgebungsvariablen:

- `OPENAI_API_KEY` mit `AGENT_MODEL_OPENAI`
- `ANTHROPIC_API_KEY` mit `AGENT_MODEL_ANTHROPIC`
- `OPENROUTER_API_KEY` mit `AGENT_MODEL_OPENROUTER`
- `GITHUB_TOKEN` mit `GITHUB_MODEL` und optional `GITHUB_MODELS_BASE_URL`
- `OLLAMA_BASE_URL` mit `AGENT_MODEL_OLLAMA`

`AGENT_PROVIDER=offline` nutzen oder alle Keys leer lassen, um den Fallback-Modus zu verwenden. `AGENT_PROVIDER=gh` wird als Kurzform für `AGENT_PROVIDER=github` akzeptiert.

## LangSmith

LangSmith Tracing wird vollständig über Umgebungsvariablen gesteuert:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=...
export LANGSMITH_PROJECT=ai-agent-patterns-demo
```

Es sind keine Code-Änderungen nötig. LangChain und LangGraph erzeugen Traces, sobald Tracing aktiviert ist.

## CLI

Demos auflisten:

```bash
agent-patterns list
agent-patterns list --plain
```

Alle Demos ausführen:

```bash
agent-patterns run all
```

Eine einzelne Demo ausführen:

```bash
agent-patterns run react "Find 12 * 7 and summarize the tool result."
agent-patterns run sequential "Draft a launch note for a memory feature."
agent-patterns run routing "I need this Python traceback explained."
agent-patterns run graph "Plan a tiny agent architecture."
agent-patterns run reflection "Write a two sentence product update."
agent-patterns run memory "My name is Michael and I like concise demos."
agent-patterns run deepagents "Research how agent handoffs should be documented."
```

Direkt ohne Installation ausführen:

```bash
python -m ai_agent_patterns.cli run all
```

## Hinweise

Die LangChain v1 Agent-Beispiele nutzen `langchain.agents.create_agent` und Model Provider Strings wie `openai:gpt-4.1-mini`, `openrouter:openai/gpt-4o-mini` oder `ollama:llama3.1`. GitHub Models nutzt den OpenAI-kompatiblen Endpoint `https://models.github.ai/inference` mit Model IDs wie `openai/gpt-4.1-mini`.

Die Deep Agents Demo folgt der LangChain Deep Agents Architektur: Ein Coordinator plant die Aufgabe, nutzt Tools, kann an benannte Subagents delegieren und lässt sich über `create_deep_agent` mit file-system-backed context, Memory, Permissions, Stores und Checkpointers erweitern.

Die Demos sind defensiv gebaut: Wenn ein Paket oder API Key fehlt, meldet die CLI einen hilfreichen Fallback statt abzustürzen. Nach `pip install -r requirements.txt` nutzen Routing, Reflexion, Memory und Supervisor/Handoff LangGraph Graphs, Sequential nutzt LangChain Prompt Chains, ReAct nutzt LangChain `create_agent`, und die Deep Agents Demo nutzt `deepagents.create_deep_agent`.
