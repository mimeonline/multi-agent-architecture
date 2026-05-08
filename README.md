# AI Agent Pattern Landscape

Ein veröffentlichbares Lern- und Referenzprojekt für moderne AI-Agent-Architektur. Es verbindet Theorie, Infografik, Reveal.js Slides, praktische Code-Demos und eine Webapp zu einem navigierbaren Landscape-Projekt.

## Inhalt

- `docs/ai-agent-pattern-landscape.md`: ausführliches deutsches Referenzmodell mit vier Domänen und zwei Querschnittssichten
- `docs/ai-agen-pattern-landscape.png`: Infografik zur Pattern Landscape
- `presentation/`: Reveal.js Präsentation für Talks, Workshops und Veröffentlichungen
- `code/`: praktische Python-Demos mit LangChain, LangGraph, LangSmith und Deep Agents
- `webapp/`: interaktive Lernwebapp mit Theorie, Infografik, Slides und Codepfaden

## Leitidee

"Pattern" wird in diesem Projekt pragmatisch verstanden: Neben klassischen Patterns werden auch wiederkehrende Capabilities, Integrationsmechanismen und Betriebsbausteine sichtbar gemacht. Ziel ist nicht eine akademisch perfekte Taxonomie, sondern ein nutzbares Referenzmodell für Architekturentscheidungen.

## Schnellstart

```bash
# Präsentation
cd presentation
npm install
npm run dev

# Webapp
cd ../webapp
npm run dev

# Code-Demos
cd ../code
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e ".[dev]"
cp .env.example .env
agent-patterns --help
```

## Modellprovider

Die Code-Demos sind ENV-basiert vorbereitet. Unterstützt sind je nach installierten Integrationen und Keys:

- OpenAI über `OPENAI_API_KEY`
- Anthropic über `ANTHROPIC_API_KEY`
- OpenRouter über `OPENROUTER_API_KEY`
- Ollama oder LM Studio über OpenAI-kompatible Base URLs
- LangSmith Tracing über `LANGSMITH_API_KEY` und `LANGSMITH_TRACING=true`

## Veröffentlichungsstruktur

Das Projekt ist so gedacht, dass die Webapp als Einstieg dient, die Slides als Vortragsebene funktionieren und der Code als praktische Werkbank darunterliegt. Die Markdown-Referenz bleibt die ausführliche Quelle für spätere Erweiterungen.

## Lizenz

MIT, siehe `LICENSE`.
