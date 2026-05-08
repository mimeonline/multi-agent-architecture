Erstelle eine neue Markdown-Datei: ai-agent-pattern-landscape.md

Sprache: Deutsch. Technische Begriffe (Pattern-Namen, Framework-Namen) bleiben englisch.

Formatierungsregeln:

- Nur ein einziges H1 (#) ganz oben
- Keine Em-Dashes oder Gedankenstriche im generierten Text
- Anrede: niemals
- Keine Phrasen wie "kein Rückschritt" oder ähnliche relativierende Formulierungen

Struktur der Datei:

# AI Agent Pattern Landscape

Kurze Einleitung (3-5 Sätze): Was dieses Dokument ist (persönliches Referenzmodell für AI-Agent-Architektur), wie es aufgebaut ist (vier Pattern-Domänen plus zwei Querschnittssichten), wie es gelesen werden kann (linear oder als Lookup).

## Modell

Beschreibung des Aufbaus in einem kurzen Absatz: Vier Pattern-Domänen (Denken, Ablauf, Zusammenarbeit, Systembetrieb), zwei Querschnittssichten (Framework-Mapping, Decision-Heuristik). Hinweis darauf, dass Patterns auf unterschiedlichen Abstraktionsebenen operieren und die Domänen genau diese Trennung sichern.

## Domäne 1: Denken

Definition (1-2 Sätze): Cognitive und Reasoning Patterns. Wie ein einzelner Agent intern schlussfolgert.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es das interne Reasoning-Verhalten eines einzelnen Agenten beschreibt, unabhängig von Koordination mit anderen Agenten.

Patterns in dieser Domäne (Format unten anwenden):

- ReAct
- Plan-and-Execute
- ReWOO
- Reflexion
- Tree of Thoughts
- Self-Consistency
- CodeAct

## Domäne 2: Ablauf

Definition: Workflow und Control Flow Patterns. Wie Arbeitsschritte kontrolliert, verbunden und sequenziert werden.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es den Kontrollfluss zwischen LLM-Aufrufen oder Komponenten in einem deterministischen oder semi-deterministischen Workflow beschreibt.

Patterns:

- Sequential Pipeline (Prompt Chaining)
- Routing
- Parallelization (Sectioning)
- Parallelization (Voting)
- Loop
- Evaluator-Optimizer (Generator-Critic)
- Iterative Refinement
- Orchestrator-Workers
- Map-Reduce

## Domäne 3: Zusammenarbeit

Definition: Multi-Agent Coordination Patterns. Wie mehrere autonome Agenten miteinander koordinieren.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es mehrere autonome Agenten voraussetzt und beschreibt, wie sie Kontrolle, Information oder Verantwortung zwischen sich austauschen.

Patterns:

- Supervisor
- Hierarchical Supervisor
- Handoff
- Swarm
- Group Chat
- Multi-Agent Debate
- Magentic
- Blackboard
- Contract Net
- Market-based
- Agents-as-Tools
- Graph-based Orchestration

## Domäne 4: Systembetrieb

Definition: Runtime, Memory, Tool Integration, Governance, Observability. Was Agentensysteme produktionsfähig macht.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es eine Querschnittsfähigkeit beschreibt, die unabhängig vom konkreten Reasoning- oder Koordinationsmuster gelöst werden muss.

Untergruppen mit Patterns:

### Memory Architecture

- Conversational Memory
- Episodic Memory
- Semantic Memory
- Working Memory / Scratchpad
- Vector Memory
- Graph Memory
- Compressed Context Memory

### Tool Integration

- Function Calling
- Tool Registry
- MCP (Model Context Protocol)
- Adapter Pattern
- Capability Routing
- Permission-scoped Tools

### Runtime Architecture

- Actor Model
- Event-driven Choreography
- Saga / Compensation
- Workflow DAG / Durable Execution
- Checkpointing / Resumability
- Pub/Sub Agent Mesh

### Governance & Safety

- Human-in-the-Loop Approval Gate
- Output Validation / Schema Enforcement
- Sandbox Execution
- Least Privilege Agent
- Audit Trail
- Multimodal Guardrails

### Observability & Evaluation

- Distributed Tracing
- Token / Cost Tracking
- LLM-as-Judge
- Integration Tests für Agents

## Querschnittssicht 1: Framework-Mapping

Tabelle mit Spalten: Framework, Native Patterns, Stärke, Schwäche.

Frameworks:

- Anthropic Cookbook (5 Workflow-Patterns als Minimal-Code)
- LangGraph (Supervisor, Swarm, Graph-based)
- CrewAI (Sequential, Hierarchical Process, Flows)
- AutoGen / AG2 (GroupChat, Two-Agent-Chat, Nested Chats)
- Microsoft Agent Framework (Sequential, Concurrent, Group Chat, Handoff, Magentic)
- Google ADK (8 Patterns: Sequential Pipeline, Coordinator, Parallel, Hierarchical, Generator-Critic, Iterative, HITL, Composite)
- AWS Strands (Graph, Swarm, Workflow, Agents-as-Tools)
- OpenAI Agents SDK (Handoff)

## Querschnittssicht 2: Decision-Heuristik

Als verzweigte Fragekette, nicht als lineare Reifeleiter:

1. Reicht ein einzelner Prompt mit gutem Prompt-Engineering?
   Ja: Direkter Modell-Call. Stop.
   Nein: weiter.

2. Braucht es Tool-Use?
   Nein: strukturierte Generierung mit Schema.
   Ja: weiter.

3. Ist der Ablauf vorhersagbar?
   Ja: Workflow-Pattern aus Domäne Ablauf wählen.
   Nein: weiter.

4. Reicht ein autonomer Agent?
   Ja: Single Agent mit ReAct oder Plan-and-Execute.
   Nein: weiter.

5. Sind echte Spezialisten nötig (eigene Sicherheitsgrenzen, eigene Tool-Sets)?
   Ja: Multi-Agent-Pattern aus Domäne Zusammenarbeit wählen.
   Nein: Single Agent mit gutem Tool-Design.

6. Müssen mehrere Agenten autonom kooperieren ohne festen Plan?
   Ja: Magentic, Group Chat oder Blackboard prüfen.
   Nein: Supervisor oder Handoff reichen.

7. Production-Kontext?
   Ja: Patterns aus Domäne Systembetrieb sind verpflichtend, nicht optional.

## Pattern-Format (Lookup-Modus)

Jedes einzelne Pattern in den vier Domänen wird nach folgendem Schema beschrieben:

### Patternname

- Domäne: (Denken / Ablauf / Zusammenarbeit / Systembetrieb)
- Aliase: alternative Namen aus der Literatur
- Kernidee: ein Satz
- Einsetzen, wenn: 1-3 Bullets
- Nicht einsetzen, wenn: 1-3 Bullets
- Trade-off: ein Satz
- Frameworks: Liste der Frameworks mit nativer Unterstützung
- Verwandt mit: Liste verwandter Patterns mit kurzem Hinweis auf die Beziehung (z.B. "Spezialfall von X", "Voraussetzung für Y", "Konfligiert mit Z")

Beispiel zur Orientierung (für ReAct, das in Domäne 1 erscheint):

### ReAct

- Domäne: Denken
- Aliase: Reason+Act, Thought-Action-Observation Loop
- Kernidee: Agent wechselt iterativ zwischen Reasoning-Schritt und Tool-Aufruf, bis Ziel erreicht ist.
- Einsetzen, wenn:
  - Aufgabe Tool-Use erfordert
  - Pfad nicht vorab planbar
  - Adaptive Reaktion auf Tool-Ergebnisse nötig
- Nicht einsetzen, wenn:
  - Plan vorab bekannt (besser: Plan-and-Execute)
  - Kosten kritisch (besser: ReWOO)
  - Reine Reasoning-Aufgabe ohne Tools
- Trade-off: Hohe Adaptivität gegen LLM-Call pro Schritt.
- Frameworks: LangGraph (create_react_agent), nahezu jedes Agent-Framework als Default.
- Verwandt mit: Plan-and-Execute (Alternative bei bekanntem Plan), ReWOO (Optimierung für Kosten), Reflexion (Erweiterung mit Selbst-Kritik)

## Quellen

Liste der wichtigsten Quellen:

- Anthropic, Building Effective Agents (anthropic.com/research/building-effective-agents)
- Anthropic, Building Effective AI Agents Guide (resources.anthropic.com)
- Microsoft, AI Agent Orchestration Patterns (Azure Architecture Center)
- Google, Developer's Guide to Multi-Agent Patterns in ADK (developers.googleblog.com)
- AWS, Multi-Agent Patterns in Strands Agents (strandsagents.com/docs)
- Lu et al., Agent Design Pattern Catalogue (arxiv.org/abs/2405.10467)
- Confluent, Four Design Patterns for Event-Driven Multi-Agent Systems
- LangChain Multi-Agent Guide (docs.langchain.com)

## Hinweise

Kurzer Abschnitt am Ende:

- Dieses Dokument ist die Referenz-Sicht. Eine Infografik-Version mit drei horizontalen Ebenen (Agent Intelligence, Orchestration, Production Architecture) und seitlicher Entscheidungsleiter folgt separat.
- Pattern-Einträge werden iterativ vertieft, nicht einmalig finalisiert.
- Beziehungen zwischen Patterns sind bewusst als "Verwandt mit"-Feld erfasst, um spätere Überführung in ein Graph-Modell (Nexonoma) zu erleichtern.

---

Wichtig für Codex:

- Datei in einem Zug erstellen, alle Patterns vollständig nach dem Lookup-Schema ausfüllen
- Pro Pattern realistische, präzise Inhalte, keine Platzhalter
- Bei Unsicherheit zur Klassifikation eines Patterns: in den Anmerkungen am Ende der Datei dokumentieren statt raten
- Datei am Ende zur Review zurückgeben
