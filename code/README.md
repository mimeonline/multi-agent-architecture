# AI Agent Patterns Demo Suite

Practical Python demos under one CLI for common agent patterns using LangChain, LangGraph,
LangSmith tracing, and Deep Agents.

Every demo has a deterministic offline fallback, so the suite is useful even before API keys
or optional packages are installed.

## Patterns Included

- ReAct / tool calling with LangChain `create_agent`
- Sequential pipeline with LangChain prompt chains
- Routing with LangGraph conditional edges
- Supervisor / handoff as a LangGraph state graph
- Reflection / evaluator loop as a LangGraph state graph
- Memory with LangGraph checkpointer or local fallback
- Deep Agents coordinator with `create_deep_agent`, tools, and subagent specs

## Install

```bash
cd code
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .
```

The `requirements.txt` path installs the full demo set, including Deep Agents. The editable install
adds the local `agent-patterns` CLI.

## Configure

```bash
cp .env.example .env
```

Set one provider key and choose a provider:

```bash
export AGENT_PROVIDER=openai
export OPENAI_API_KEY=...
```

Supported provider envs:

- `OPENAI_API_KEY` with `AGENT_MODEL_OPENAI`
- `ANTHROPIC_API_KEY` with `AGENT_MODEL_ANTHROPIC`
- `OPENROUTER_API_KEY` with `AGENT_MODEL_OPENROUTER`
- `OLLAMA_BASE_URL` with `AGENT_MODEL_OLLAMA`

Use `AGENT_PROVIDER=offline` or leave all keys unset for graceful fallback mode.

## LangSmith

LangSmith tracing is controlled entirely by env:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=...
export LANGSMITH_PROJECT=ai-agent-patterns-demo
```

No code changes are needed. LangChain and LangGraph will emit traces when tracing is enabled.

## CLI

List demos:

```bash
agent-patterns list
```

Run all demos:

```bash
agent-patterns run all
```

Run one demo:

```bash
agent-patterns run react "Find 12 * 7 and summarize the tool result."
agent-patterns run sequential "Draft a launch note for a memory feature."
agent-patterns run routing "I need this Python traceback explained."
agent-patterns run graph "Plan a tiny agent architecture."
agent-patterns run reflection "Write a two sentence product update."
agent-patterns run memory "My name is Michael and I like concise demos."
agent-patterns run deepagents "Research how agent handoffs should be documented."
```

Run directly without installing:

```bash
python -m ai_agent_patterns.cli run all
```

## Notes

The LangChain v1 agent examples use `langchain.agents.create_agent` and model provider strings
such as `openai:gpt-4.1-mini`, `openrouter:openai/gpt-4o-mini`, or `ollama:llama3.1`.

The Deep Agents demo follows the LangChain Deep Agents architecture: a main coordinator plans the
task, uses tools, can delegate to named subagents, and can be extended with file-system-backed
context, memory, permissions, stores, and checkpointers through `create_deep_agent`.

The demos are defensive: if a package or API key is missing, the CLI reports a helpful fallback
instead of crashing. After `pip install -r requirements.txt`, Routing, Reflection, Memory, and
Supervisor/Handoff use LangGraph graphs, Sequential uses LangChain prompt chains, ReAct uses
LangChain `create_agent`, and the Deep Agents demo uses `deepagents.create_deep_agent`.
