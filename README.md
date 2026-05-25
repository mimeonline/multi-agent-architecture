# AI Systems Atlas

Eine architecture-first Knowledge Platform für robuste AI-Systeme. Das Projekt entwickelt die bestehende AI Agent Pattern Landscape evolutionär zum AI Systems Atlas weiter und verbindet Theorie, Infografik, Reveal.js Slides, praktische Code-Demos und eine Webapp zu einer navigierbaren Architektur-Landkarte.

## Inhalt

- `docs/ai-systems-atlas-product-architecture.md`: Produkt- und Refactoring-Rahmen für den AI Systems Atlas
- `docs/ai-agent-pattern-landscape.md`: ausführliches deutsches Referenzmodell mit vier Domänen und zwei Querschnittssichten
- `docs/ai-agen-pattern-landscape.png`: Infografik zur Pattern Landscape, nach Pattern-Erweiterungen neu zu bauen
- `presentation/`: Reveal.js Präsentation für Talks, Workshops und Veröffentlichungen
- `code/`: praktische Python-Demos mit LangChain, LangGraph, LangSmith und Deep Agents
- `webapp/`: interaktive Atlas-Webapp mit Foundations, Patterns, Architecture, Governance, Decision Guides, Reference Architectures, Implementation Lab und Tooling Compatibility

Die Webapp ist eine reine Next.js App Router Anwendung. Die frühere statische Webapp unter `webapp/index.html` wurde entfernt.

## Leitidee

Der Atlas folgt dem Prinzip: Architecture first. Implementation proves it. Frameworks support it.

"Pattern" wird pragmatisch verstanden: Neben klassischen Patterns werden auch wiederkehrende Capabilities, Integrationsmechanismen und Betriebsbausteine sichtbar gemacht. Ziel ist nicht eine akademisch perfekte Taxonomie, sondern ein nutzbares Referenzmodell für Architekturentscheidungen.

## Schnellstart

```bash
# Präsentation
cd presentation
npm install
npm run dev

# Webapp
cd ../webapp
npm install
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

Das Projekt ist so gedacht, dass die Webapp als Einstieg dient, die Slides als Kommunikationsartefakt funktionieren und der Code als Implementation Lab darunterliegt. Die Markdown-Referenz bleibt die ausführliche Quelle für spätere Erweiterungen.

## Lizenz

MIT, siehe `LICENSE`.
