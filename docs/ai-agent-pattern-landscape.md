# AI Agent Pattern Landscape

Dieses Dokument ist ein persönliches Referenzmodell für AI-Agent-Architektur. Es ordnet wiederkehrende Architekturbausteine in vier Pattern-Domänen und ergänzt sie um zwei Querschnittssichten. "Pattern" wird hier pragmatisch verstanden, nicht streng im GoF-Sinn: Neben klassischen Patterns enthält das Dokument auch Capabilities, Mechanismen und Betriebsbausteine, sofern sie wiederkehrende Architekturentscheidungen beschreiben. Die vier Domänen beschreiben Denken, Ablauf, Zusammenarbeit und Systembetrieb. Die Querschnittssichten verbinden diese Bausteine mit Frameworks und einer Decision-Heuristik. Das Dokument kann linear gelesen oder als Lookup für konkrete Architekturentscheidungen genutzt werden.

## 🧭 Modell

Das Modell trennt vier Pattern-Domänen: Denken, Ablauf, Zusammenarbeit und Systembetrieb. Ergänzt werden sie durch zwei Querschnittssichten: Framework-Mapping und Decision-Heuristik. Patterns operieren auf unterschiedlichen Abstraktionsebenen, etwa als internes Reasoning-Verhalten, als Workflow-Kontrollfluss, als Multi-Agent-Koordination oder als produktionsrelevante Laufzeitfähigkeit. Die Domäne Systembetrieb ist zusätzlich in Subdomänen gegliedert: Memory, Tool Integration, Runtime, Governance und Observability. Die Domänen und Subdomänen sichern diese Trennung, damit ähnliche Begriffe nicht vermischt werden.

## 🧠 Domäne 1: Denken

Cognitive und Reasoning Patterns beschreiben, wie ein einzelner Agent intern schlussfolgert. Sie betreffen die Struktur des Denkprozesses, nicht primär die Systemarchitektur.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es das interne Reasoning-Verhalten eines einzelnen Agenten beschreibt, unabhängig von Koordination mit anderen Agenten.

### ReAct

- Domäne: Denken
- Aliase: Reason+Act, Thought-Action-Observation Loop
- Kernidee: Der Agent wechselt iterativ zwischen Reasoning-Schritt und Tool-Aufruf, bis das Ziel erreicht ist.
- Einsetzen, wenn:
  - Aufgabe Tool-Use erfordert
  - Pfad nicht vorab planbar ist
  - Adaptive Reaktion auf Tool-Ergebnisse nötig ist
- Nicht einsetzen, wenn:
  - Plan vorab bekannt ist
  - Kosten pro LLM-Call kritisch sind
  - Aufgabe reine Generierung ohne externe Information ist
- Trade-off: Hohe Adaptivität gegen höheren Call-Aufwand pro Schritt.
- Frameworks: LangGraph, OpenAI Agents SDK, Microsoft Agent Framework, Google ADK, AutoGen / AG2, CrewAI.
- Verwandt mit: Plan-and-Execute als Alternative bei bekanntem Plan, ReWOO als Kostenoptimierung, Reflexion als Erweiterung mit Selbst-Kritik.

### Plan-and-Execute

- Domäne: Denken
- Aliase: Planner-Executor, Plan then Act, Task Planning
- Kernidee: Ein Agent erzeugt zuerst einen Plan und führt die Schritte danach sequenziell oder kontrolliert aus.
- Einsetzen, wenn:
  - Ziel in Teilaufgaben zerlegt werden kann
  - Ausführung nachvollziehbar und steuerbar sein soll
  - Zwischenstände überprüft werden müssen
- Nicht einsetzen, wenn:
  - Umgebung stark dynamisch ist
  - Tool-Ergebnisse den Plan fundamental verändern können
  - Planungsaufwand größer als die Aufgabe ist
- Trade-off: Bessere Struktur und Prüfbarkeit gegen Risiko veralteter Pläne.
- Frameworks: LangGraph, CrewAI, Google ADK, Microsoft Agent Framework, OpenAI Agents SDK.
- Verwandt mit: ReAct als adaptivere Alternative, Sequential Pipeline als deterministische Workflow-Variante, Orchestrator-Workers bei delegierter Ausführung.

### ReWOO

- Domäne: Denken
- Aliase: Reasoning without Observation, Planner-Solver Pattern
- Kernidee: Der Agent plant Tool-Aufrufe vorab, führt sie aus und nutzt die Ergebnisse gesammelt für die finale Antwort.
- Einsetzen, wenn:
  - Tool-Aufrufe vorab erkennbar sind
  - LLM-Calls reduziert werden sollen
  - Beobachtungen nicht nach jedem Schritt neu geplant werden müssen
- Nicht einsetzen, wenn:
  - Tool-Ergebnisse stark verzweigen
  - Fehlerbehandlung pro Zwischenschritt kritisch ist
  - Aufgabe interaktive Reaktion erfordert
- Trade-off: Niedrigere LLM-Kosten gegen geringere Adaptivität während der Ausführung.
- Frameworks: LangGraph als custom graph, Google ADK als Planner-Workflow, OpenAI Agents SDK mit expliziter Tool-Orchestrierung.
- Verwandt mit: ReAct als adaptivere Alternative, Plan-and-Execute als allgemeineres Planungsmuster, Map-Reduce bei unabhängigen Teilabfragen.

### Reflexion

- Domäne: Denken
- Aliase: Self-Reflection, Self-Critique, Reflection Loop
- Kernidee: Der Agent bewertet eigene Zwischenergebnisse und nutzt Kritik zur Verbesserung weiterer Schritte.
- Einsetzen, wenn:
  - Qualität wichtiger als minimale Latenz ist
  - Fehler durch Selbstprüfung erkannt werden können
  - Aufgaben iterative Verbesserung erlauben
- Nicht einsetzen, wenn:
  - Harte externe Validierung verfügbar ist
  - Selbstbewertung zu unzuverlässig ist
  - Latenz oder Kosten eng begrenzt sind
- Trade-off: Höhere Ergebnisqualität gegen zusätzliche Tokens und mögliche Scheinsicherheit.
- Frameworks: LangGraph, AutoGen / AG2, Microsoft Agent Framework, Google ADK, CrewAI.
- Verwandt mit: Evaluator-Optimizer als Workflow-Variante desselben Kritikprinzips, LLM-as-Judge als Evaluationsbaustein, Iterative Refinement als Ablaufmuster.

### Tree of Thoughts

- Domäne: Denken
- Aliase: ToT, Branching Reasoning, Search over Thoughts
- Kernidee: Der Agent exploriert mehrere Reasoning-Pfade als Baum und wählt vielversprechende Pfade weiter aus.
- Einsetzen, wenn:
  - Problem mehrere plausible Lösungswege hat
  - Frühe Entscheidungen hohe Folgewirkung haben
  - Suchraum begrenzt und bewertbar ist
- Nicht einsetzen, wenn:
  - Aufgabe direkt lösbar ist
  - Kosten oder Latenz niedrig bleiben müssen
  - Bewertung der Äste unklar ist
- Trade-off: Breitere Exploration gegen stark steigenden Rechen- und Tokenaufwand.
- Frameworks: LangGraph als Suchgraph, AutoGen / AG2 als custom conversation pattern, Google ADK als Composite Pattern.
- Verwandt mit: Self-Consistency als flachere Mehrfachstichprobe, Multi-Agent Debate als soziale Variante, Routing bei expliziter Pfadauswahl.

### Self-Consistency

- Domäne: Denken
- Aliase: Majority Reasoning, Sample-and-Vote, Consensus Sampling
- Kernidee: Mehrere unabhängige Reasoning-Ausgaben werden erzeugt und per Konsens oder Voting zusammengeführt.
- Einsetzen, wenn:
  - Antwort robust gegen einzelne Fehlpfade werden soll
  - Ergebnis verifizierbar oder abstimmbar ist
  - Stochastische Vielfalt hilfreich ist
- Nicht einsetzen, wenn:
  - Aufgabe deterministisch validiert werden kann
  - Kosten pro Anfrage streng limitiert sind
  - Mehrheitsentscheidung falsche Sicherheit erzeugt
- Trade-off: Robustere Antworten gegen mehrfachen Inferenzaufwand.
- Frameworks: Anthropic Cookbook, Google ADK, LangGraph, Microsoft Agent Framework.
- Verwandt mit: Parallelization (Voting) als Ablaufmuster, Tree of Thoughts als strukturiertere Suche, LLM-as-Judge als Bewertungsinstanz.

### CodeAct

- Domäne: Denken
- Aliase: Code-as-Action, Programmatic Action, Executable Reasoning
- Kernidee: Der Agent nutzt ausführbaren Code als Handlungs- und Reasoning-Medium.
- Einsetzen, wenn:
  - Berechnungen, Transformationen oder Tool-Aufrufe präzise ausführbar sind
  - Zwischenergebnisse reproduzierbar sein sollen
  - Aufgaben von Programmierlogik profitieren
- Nicht einsetzen, wenn:
  - Ausführung nicht sicher sandboxed werden kann
  - Aufgabe reine Sprache oder Einschätzung ist
  - Codeausführung mehr Risiko als Nutzen erzeugt
- Trade-off: Präzision und Reproduzierbarkeit gegen Sandbox-, Sicherheits- und Laufzeitaufwand.
- Frameworks: OpenAI Agents SDK, AutoGen / AG2, Microsoft Agent Framework, LangGraph, Google ADK.
- Verwandt mit: Sandbox Execution als Voraussetzung, Function Calling als strukturierter Tool-Kanal, ReAct als allgemeiner Tool-Use Loop.

## 🔁 Domäne 2: Ablauf

Workflow und Control Flow Patterns beschreiben, wie Arbeitsschritte kontrolliert, verbunden und sequenziert werden. Sie strukturieren LLM-Aufrufe und Komponenten zu nachvollziehbaren Abläufen.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es den Kontrollfluss zwischen LLM-Aufrufen oder Komponenten in einem deterministischen oder semi-deterministischen Workflow beschreibt.

### Sequential Pipeline (Prompt Chaining)

- Domäne: Ablauf
- Aliase: Prompt Chaining, Linear Workflow, Sequential Process
- Kernidee: Mehrere Schritte werden in fester Reihenfolge ausgeführt, wobei jeder Schritt das Ergebnis des vorherigen nutzt.
- Einsetzen, wenn:
  - Aufgabe klar in Phasen zerfällt
  - Jeder Schritt ein prüfbares Zwischenprodukt liefert
  - Kontrolle wichtiger als Autonomie ist
- Nicht einsetzen, wenn:
  - Ablauf stark verzweigt
  - Ergebnisse dynamisch neue Ziele erzeugen
  - Parallelisierung ohne Abhängigkeiten möglich ist
- Trade-off: Hohe Verständlichkeit gegen geringe Flexibilität.
- Frameworks: Anthropic Cookbook, CrewAI, Google ADK, Microsoft Agent Framework, AWS Strands.
- Verwandt mit: Plan-and-Execute als agentische Variante, Workflow DAG / Durable Execution als produktionsreife Ausführung, Loop bei wiederholter Sequenz.

### Routing

- Domäne: Ablauf
- Aliase: Classifier Router, Intent Routing, Conditional Branching
- Kernidee: Ein Klassifikations- oder Entscheidungsmodul leitet eine Anfrage an den passenden Pfad, Prompt, Agenten oder Tool weiter.
- Einsetzen, wenn:
  - Unterschiedliche Anfrageklassen verschiedene Behandlung brauchen
  - Spezialisierte Prompts oder Tools existieren
  - Fehlpfade teuer oder riskant sind
- Nicht einsetzen, wenn:
  - Alle Aufgaben denselben Ablauf nutzen
  - Klassifikation instabil oder nicht beobachtbar ist
  - Routinglogik komplexer als die Aufgabe wird
- Trade-off: Präzisere Behandlung gegen zusätzliche Entscheidungslogik und Fehlrouting-Risiko.
- Frameworks: Anthropic Cookbook, LangGraph, Google ADK, Microsoft Agent Framework, AWS Strands.
- Verwandt mit: Capability Routing als Tool-Variante, Handoff als Multi-Agent-Variante, Supervisor als dynamischer Router.

### Parallelization (Sectioning)

- Domäne: Ablauf
- Aliase: Sectioned Parallelism, Fan-out by Segment, Divide and Process
- Kernidee: Unabhängige Teilbereiche einer Aufgabe werden parallel bearbeitet und anschließend zusammengeführt.
- Einsetzen, wenn:
  - Eingabe natürlich segmentierbar ist
  - Teilaufgaben unabhängig voneinander sind
  - Latenz durch Parallelität sinken soll
- Nicht einsetzen, wenn:
  - Starke Abhängigkeiten zwischen Segmenten bestehen
  - Zusammenführung semantisch schwierig ist
  - Konsistenz über alle Segmente wichtiger als Tempo ist
- Trade-off: Geringere Latenz gegen Integrationsaufwand.
- Frameworks: Anthropic Cookbook, Google ADK, Microsoft Agent Framework, AWS Strands, LangGraph.
- Verwandt mit: Map-Reduce als formalisierte Aggregation, Orchestrator-Workers als agentische Delegation, Parallelization (Voting) bei redundanter Bearbeitung.

### Parallelization (Voting)

- Domäne: Ablauf
- Aliase: Voting Parallelism, Ensemble Voting, Majority Selection
- Kernidee: Mehrere unabhängige Läufe bearbeiten dieselbe Aufgabe und ein Aggregator wählt oder synthetisiert das beste Ergebnis.
- Einsetzen, wenn:
  - Robustheit wichtiger als Einzelkosten ist
  - Bewertbare Antworten erwartet werden
  - Modellvarianz genutzt werden soll
- Nicht einsetzen, wenn:
  - Ergebnis objektiv validierbar ist
  - Antwort nicht sinnvoll aggregierbar ist
  - Latenz und Kosten streng begrenzt sind
- Trade-off: Höhere Robustheit gegen mehrfachen Ausführungsaufwand.
- Frameworks: Anthropic Cookbook, Google ADK, Microsoft Agent Framework, LangGraph.
- Verwandt mit: Self-Consistency als Reasoning-Variante, LLM-as-Judge als Bewertungsbaustein, Multi-Agent Debate als diskursive Variante.

### Loop

- Domäne: Ablauf
- Aliase: Control Loop, Retry Loop, Agent Loop
- Kernidee: Ein oder mehrere Schritte werden wiederholt, bis eine Abbruchbedingung, ein Qualitätsziel oder ein Budget erreicht ist.
- Einsetzen, wenn:
  - Ergebnis schrittweise verbessert werden kann
  - Externe Validierung eine Wiederholung auslösen kann
  - Tool-Ergebnisse neue Iterationen erfordern
- Nicht einsetzen, wenn:
  - Keine stabile Abbruchbedingung existiert
  - Kosten unkontrollierbar steigen können
  - Fehler sich durch Wiederholung verstärken
- Trade-off: Adaptive Verbesserung gegen Risiko endloser oder teurer Schleifen.
- Frameworks: LangGraph, CrewAI Flows, Microsoft Agent Framework, Google ADK, AWS Strands.
- Verwandt mit: ReAct als Spezialfall eines Reasoning-Loops, Iterative Refinement als Qualitätsloop, Checkpointing / Resumability für robuste Ausführung.

### Evaluator-Optimizer (Generator-Critic)

- Domäne: Ablauf
- Aliase: Generator-Critic, Critique and Revise, Evaluate-Improve
- Kernidee: Ein Generator erstellt ein Ergebnis, ein Evaluator bewertet es und der Generator optimiert auf Basis der Rückmeldung.
- Einsetzen, wenn:
  - Qualitätskriterien formulierbar sind
  - Iterative Verbesserung messbar ist
  - Kreative oder komplexe Ausgaben geprüft werden sollen
- Nicht einsetzen, wenn:
  - Evaluator keine verlässlichen Signale liefern kann
  - Aufgabe mit Schema-Validation ausreichend geprüft ist
  - Budget keine Mehrfachläufe erlaubt
- Trade-off: Bessere Qualität gegen zusätzliche Bewertungskomplexität.
- Frameworks: Anthropic Cookbook, Google ADK, LangGraph, AutoGen / AG2, Microsoft Agent Framework.
- Verwandt mit: Reflexion als Single-Agent-Variante desselben Kritikprinzips, LLM-as-Judge als Evaluator, Iterative Refinement als allgemeiner Wiederholungsrahmen.

### Iterative Refinement

- Domäne: Ablauf
- Aliase: Revise Loop, Draft-Improve, Progressive Refinement
- Kernidee: Ein Ergebnis wird über mehrere kontrollierte Revisionen verbessert, oft anhand expliziter Kriterien.
- Einsetzen, wenn:
  - Ergebnisqualität graduell steigt
  - Feedback aus Regeln, Tests oder Nutzern verfügbar ist
  - Zwischenstände erhalten bleiben sollen
- Nicht einsetzen, wenn:
  - Ein valides Ergebnis in einem Schritt entsteht
  - Revisionen ohne klares Signal erfolgen
  - Konsistenz durch wiederholtes Umschreiben leidet
- Trade-off: Verbesserte Qualität gegen längere Laufzeit und mögliche Drift.
- Frameworks: Google ADK, LangGraph, CrewAI Flows, Microsoft Agent Framework.
- Verwandt mit: Evaluator-Optimizer als spezialisierte Variante, Reflexion als internes Kritikmuster, Human-in-the-Loop Approval Gate für externe Freigaben.

### Orchestrator-Workers

- Domäne: Ablauf
- Aliase: Coordinator-Workers, Manager-Worker, Dynamic Task Decomposition
- Kernidee: Ein Orchestrator zerlegt eine Aufgabe dynamisch und weist Teilaufgaben an Worker zu.
- Einsetzen, wenn:
  - Teilaufgaben erst zur Laufzeit erkennbar sind
  - Worker spezialisierte Funktionen übernehmen
  - Aggregation zentral gesteuert werden soll
- Nicht einsetzen, wenn:
  - Ein statischer Workflow ausreicht
  - Worker keine klaren Verantwortungen haben
  - Orchestrator zum Engpass wird
- Trade-off: Flexible Delegation gegen Koordinations- und Integrationsaufwand.
- Frameworks: Anthropic Cookbook, LangGraph, CrewAI, Google ADK, Microsoft Agent Framework, AWS Strands.
- Verwandt mit: Supervisor als Multi-Agent-Kontrollmuster, Map-Reduce als strukturierte Variante, Agents-as-Tools bei gekapselten Workern.

### Map-Reduce

- Domäne: Ablauf
- Aliase: Fan-out/Fan-in, Map Aggregate, Batch Decomposition
- Kernidee: Eine Aufgabe wird auf viele unabhängige Einheiten gemappt und anschließend zu einem Ergebnis reduziert.
- Einsetzen, wenn:
  - Große Eingaben in unabhängige Chunks zerlegt werden können
  - Aggregation klar definierbar ist
  - Skalierbarkeit und Durchsatz wichtig sind
- Nicht einsetzen, wenn:
  - Globale Abhängigkeiten zwischen Chunks bestehen
  - Reduktion semantisch verlustreich wäre
  - Ein zentraler Kontext nötig ist
- Trade-off: Gute Skalierung gegen Risiko inkonsistenter Teilresultate.
- Frameworks: LangGraph, AWS Strands, Google ADK, Microsoft Agent Framework, Anthropic Cookbook.
- Verwandt mit: Parallelization (Sectioning) als einfachere Form, Compressed Context Memory für große Kontexte, Workflow DAG / Durable Execution für robuste Batch-Läufe.

## 🤝 Domäne 3: Zusammenarbeit

Multi-Agent Coordination Patterns beschreiben, wie mehrere autonome Agenten miteinander koordinieren. Sie behandeln Kontrolle, Kommunikation und Verantwortungsverteilung zwischen Agenten.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es mehrere autonome Agenten voraussetzt und beschreibt, wie sie Kontrolle, Information oder Verantwortung zwischen sich austauschen.

### Supervisor

- Domäne: Zusammenarbeit
- Aliase: Manager Agent, Coordinator Agent, Central Controller
- Kernidee: Ein zentraler Agent entscheidet, welcher Agent oder welches Tool als Nächstes arbeitet.
- Einsetzen, wenn:
  - Zentrale Kontrolle und Nachvollziehbarkeit wichtig sind
  - Mehrere Spezialisten koordiniert werden müssen
  - Aufgaben dynamisch delegiert werden
- Nicht einsetzen, wenn:
  - Vollständig dezentrale Kooperation benötigt wird
  - Supervisor zum Single Point of Failure wird
  - Delegation statisch genug für Routing ist
- Trade-off: Klare Kontrolle gegen möglichen Koordinationsengpass.
- Frameworks: LangGraph, CrewAI Hierarchical Process, Microsoft Agent Framework, Google ADK, AWS Strands.
- Verwandt mit: Hierarchical Supervisor für größere Teams, Handoff bei Kontrollübergabe, Orchestrator-Workers als Workflow-Variante.

### Hierarchical Supervisor

- Domäne: Zusammenarbeit
- Aliase: Multi-Level Supervisor, Manager Hierarchy, Hierarchical Teams
- Kernidee: Mehrere Supervisoren organisieren Agenten in Ebenen oder Teams mit delegierter Verantwortung.
- Einsetzen, wenn:
  - Agentenzahl groß wird
  - Domänen in Subteams organisiert werden sollen
  - Lokale Entscheidungen zentral zusammengeführt werden müssen
- Nicht einsetzen, wenn:
  - Wenige Agenten ausreichen
  - Kommunikationswege kurz bleiben sollen
  - Verantwortlichkeiten nicht sauber trennbar sind
- Trade-off: Skalierbare Organisation gegen höhere Komplexität und längere Entscheidungswege.
- Frameworks: CrewAI, LangGraph, Google ADK, Microsoft Agent Framework.
- Verwandt mit: Supervisor als Basisform, Graph-based Orchestration für explizite Struktur, Blackboard als alternative gemeinsame Koordination.

### Handoff

- Domäne: Zusammenarbeit
- Aliase: Transfer of Control, Agent Transfer, Delegated Turn
- Kernidee: Ein Agent übergibt die Kontrolle und relevanten Kontext an einen anderen Agenten.
- Einsetzen, wenn:
  - Zuständigkeit klar zwischen Spezialisten wechselt
  - Nutzerinteraktion an den passenden Agenten wechseln soll
  - Sicherheits- oder Tool-Grenzen pro Agent gelten
- Nicht einsetzen, wenn:
  - Mehrere Agenten gleichzeitig beitragen sollen
  - Kontrolle zentral beim Supervisor bleiben muss
  - Kontextübergabe nicht zuverlässig begrenzt werden kann
- Trade-off: Klare Verantwortungsübergabe gegen Risiko von Kontextverlust.
- Frameworks: OpenAI Agents SDK, Microsoft Agent Framework, LangGraph, Google ADK.
- Verwandt mit: Supervisor als alternative Steuerung, Routing als nicht-agentische Variante, Least Privilege Agent bei getrennten Berechtigungen.

### Swarm

- Domäne: Zusammenarbeit
- Aliase: Decentralized Agents, Peer Agent Swarm, Emergent Coordination
- Kernidee: Mehrere Agenten koordinieren sich dezentral über lokale Regeln, Nachrichten oder geteilte Ziele.
- Einsetzen, wenn:
  - Dezentrale Exploration gewünscht ist
  - Aufgaben parallel und adaptiv verteilt werden können
  - Zentrale Steuerung zu starr wäre
- Nicht einsetzen, wenn:
  - Strenge Nachvollziehbarkeit erforderlich ist
  - Kosten und Nachrichtenflut eng kontrolliert werden müssen
  - Klare Verantwortlichkeit wichtiger als Emergenz ist
- Trade-off: Hohe Anpassungsfähigkeit gegen geringere Vorhersagbarkeit.
- Frameworks: LangGraph Swarm, AWS Strands Swarm, Microsoft Agent Framework, AutoGen / AG2.
- Verwandt mit: Group Chat als expliziter Kommunikationsraum, Blackboard als geteilte Zustandsfläche, Supervisor als zentralisierte Alternative.

### Group Chat

- Domäne: Zusammenarbeit
- Aliase: Multi-Agent Chat, Round-Robin Conversation, Shared Conversation
- Kernidee: Mehrere Agenten kommunizieren in einem gemeinsamen Gesprächsraum und bauen aufeinander auf.
- Einsetzen, wenn:
  - Perspektiven sichtbar zusammengeführt werden sollen
  - Diskussion und Abstimmung Teil der Lösung sind
  - Rollen flexibel interagieren müssen
- Nicht einsetzen, wenn:
  - Deterministischer Ablauf wichtiger ist
  - Tokenverbrauch niedrig bleiben muss
  - Verantwortlichkeiten streng getrennt sein müssen
- Trade-off: Reichhaltige Interaktion gegen hohe Kosten und schwerere Steuerbarkeit.
- Frameworks: AutoGen / AG2, Microsoft Agent Framework, Google ADK, LangGraph.
- Verwandt mit: Multi-Agent Debate als kontroversere Form, Magentic als zusammengesetzte Orchestrierung, Blackboard als stärker zustandsorientierte Alternative.

### Multi-Agent Debate

- Domäne: Zusammenarbeit
- Aliase: Debate, Adversarial Agents, Deliberation
- Kernidee: Mehrere Agenten vertreten oder prüfen unterschiedliche Positionen, bevor ein Ergebnis ausgewählt wird.
- Einsetzen, wenn:
  - Fragestellung kontroverse Einschätzungen erlaubt
  - Fehler durch Gegenargumente sichtbar werden
  - Entscheidung vor Abgabe geprüft werden soll
- Nicht einsetzen, wenn:
  - Faktenlage einfach validierbar ist
  - Debatte Scheinkonflikte erzeugt
  - Latenz oder Tokenbudget knapp ist
- Trade-off: Bessere Prüfung schwieriger Entscheidungen gegen Aufwand und mögliches Überargumentieren.
- Frameworks: AutoGen / AG2, LangGraph, Microsoft Agent Framework, Google ADK.
- Verwandt mit: Self-Consistency als nicht-dialogische Variante, LLM-as-Judge als Entscheider, Group Chat als allgemeiner Gesprächsraum.

### Magentic (Composite orchestration pattern)

- Domäne: Zusammenarbeit
- Aliase: Magentic-One Style Orchestration, Generalist Multi-Agent Team, Composite Agent Orchestration
- Kernidee: Ein orchestrierter Verbund spezialisierter Agenten löst offene Aufgaben durch Planning, Task Ledger, Replanning, Delegation und Rückkopplung.
- Einsetzen, wenn:
  - Aufgaben offen, mehrstufig und tool-intensiv sind
  - Mehrere Spezialisten koordiniert handeln müssen
  - Autonomie über längere Horizonte benötigt wird
- Nicht einsetzen, wenn:
  - Ein einfacher Workflow reicht
  - Auditierbarkeit jeden Schritt deterministisch erzwingen muss
  - Betriebskosten eng begrenzt sind
- Trade-off: Große Aufgabenabdeckung gegen hohe Betriebs- und Steuerungskomplexität.
- Frameworks: Microsoft Agent Framework, AutoGen / AG2 Magentic-One, LangGraph als custom graph.
- Verwandt mit: Supervisor als Kontrollkern, Group Chat als Kommunikationsform, Graph-based Orchestration für explizite Flüsse.

### Blackboard

- Domäne: Zusammenarbeit
- Aliase: Shared Workspace, Blackboard Architecture, Shared State Coordination
- Kernidee: Agenten koordinieren indirekt über eine gemeinsame Zustandsfläche, auf der Ergebnisse, Hypothesen und Aufgaben abgelegt werden.
- Einsetzen, wenn:
  - Viele Agenten asynchron beitragen
  - Gemeinsamer Zustand wichtiger als direkte Unterhaltung ist
  - Zwischenergebnisse persistent nutzbar sein sollen
- Nicht einsetzen, wenn:
  - Strikte lineare Kontrolle nötig ist
  - Zustandskonsistenz nicht gesichert werden kann
  - Ein einfacher Chat-Kontext ausreicht
- Trade-off: Entkoppelte Zusammenarbeit gegen anspruchsvolles State Management.
- Frameworks: LangGraph mit Shared State, AWS Strands, Microsoft Agent Framework, AutoGen / AG2 als custom shared memory.
- Verwandt mit: Graph Memory als Speicherbasis, Pub/Sub Agent Mesh für Ereignisverteilung, Group Chat als direkte Kommunikationsalternative.

### Contract Net

- Domäne: Zusammenarbeit
- Aliase: Task Bidding, Contract Net Protocol, Auctioned Task Allocation
- Kernidee: Ein Agent schreibt Aufgaben aus und andere Agenten bieten auf Basis ihrer Fähigkeiten oder Kosten darauf.
- Einsetzen, wenn:
  - Aufgaben dynamisch verteilt werden müssen
  - Agenten unterschiedliche Fähigkeiten oder Kapazitäten haben
  - Auswahlkriterien explizit formulierbar sind
- Nicht einsetzen, wenn:
  - Delegation fest vorgegeben ist
  - Bietlogik mehr Aufwand als Nutzen erzeugt
  - Vertrauen in Selbstauskünfte der Agenten fehlt
- Trade-off: Flexible Ressourcenverteilung gegen zusätzlichen Aushandlungsaufwand.
- Frameworks: Native: keine klare native Standardunterstützung in den gelisteten Frameworks; Implementierbar als: LangGraph custom protocol, AutoGen / AG2 custom conversation, Microsoft Agent Framework custom workflow.
- Verwandt mit: Market-based als ökonomischere Variante, Supervisor als zentralere Alternative, Capability Routing als einfachere Auswahlform.

### Market-based

- Domäne: Zusammenarbeit
- Aliase: Market Mechanism, Price-based Coordination, Auction-based Agents
- Kernidee: Agenten koordinieren Aufgaben und Ressourcen über Preise, Budgets, Nutzen oder marktähnliche Signale.
- Einsetzen, wenn:
  - Ressourcen knapp oder teuer sind
  - Priorisierung über Nutzen und Kosten erfolgen soll
  - Viele Agenten konkurrierende Aufgaben bearbeiten
- Nicht einsetzen, wenn:
  - Fairness, Sicherheit oder Compliance zentrale Vorgaben brauchen
  - Nutzenfunktion schwer definierbar ist
  - Kleine Systeme ohne Ressourcenkonflikt vorliegen
- Trade-off: Skalierbare Allokation gegen schwieriges Design der Anreizstruktur.
- Frameworks: Native: keine klare native Standardunterstützung in den gelisteten Frameworks; Implementierbar als: LangGraph custom coordination, AWS Strands custom multi-agent workflow, AutoGen / AG2 custom protocol.
- Verwandt mit: Contract Net als konkrete Auktionsform, Token / Cost Tracking als Datengrundlage, Supervisor als regelbasierte Alternative.

### Agents-as-Tools

- Domäne: Zusammenarbeit
- Aliase: Agent Tools, Callable Agents, Specialist-as-Tool
- Kernidee: Ein Agent ruft andere Agenten wie Tools mit klarer Schnittstelle auf.
- Einsetzen, wenn:
  - Spezialisten gekapselt und kontrolliert genutzt werden sollen
  - Hauptagent Kontrolle behalten soll
  - Tool-Sets und Sicherheitsgrenzen getrennt werden müssen
- Nicht einsetzen, wenn:
  - Gleichberechtigte Kooperation nötig ist
  - Spezialisten längere Autonomie brauchen
  - Schnittstellen nicht stabil formulierbar sind
- Trade-off: Gute Kapselung gegen begrenzte Eigenständigkeit der Spezialisten.
- Frameworks: AWS Strands, OpenAI Agents SDK, LangGraph, Microsoft Agent Framework, Google ADK.
- Verwandt mit: Function Calling als technische Basis, Handoff bei vollständiger Kontrollübergabe, Least Privilege Agent für Berechtigungsgrenzen.

### Graph-based Orchestration

- Domäne: Zusammenarbeit
- Aliase: Agent Graph, State Graph, State Graph Orchestration
- Kernidee: Agenten, Tools, Zustände und Kontrollübergänge werden als expliziter State Graph mit Knoten und Kanten modelliert.
- Einsetzen, wenn:
  - Koordination nachvollziehbar und testbar sein soll
  - Zyklen, Bedingungen und Handoffs modelliert werden müssen
  - Komplexe Multi-Agent-Flüsse stabil betrieben werden sollen
- Nicht einsetzen, wenn:
  - Ein linearer Workflow reicht
  - Graphpflege mehr Aufwand als Nutzen erzeugt
  - Autonome Emergenz wichtiger als explizite Steuerung ist
- Trade-off: Hohe Steuerbarkeit gegen Modellierungsaufwand.
- Frameworks: LangGraph, AWS Strands Graph, Microsoft Agent Framework, Google ADK, CrewAI Flows.
- Verwandt mit: Workflow DAG / Durable Execution als Laufzeitbasis mit Fokus auf Persistenz, Supervisor als Knotenrolle, Swarm als weniger explizite Alternative.

## ⚙️ Domäne 4: Systembetrieb

Runtime, Memory, Tool Integration, Governance und Observability machen Agentensysteme produktionsfähig. Diese Patterns und Capabilities lösen Querschnittsfähigkeiten, die unabhängig vom konkreten Reasoning- oder Koordinationsmuster benötigt werden.

Abgrenzungskriterium: Ein Pattern gehört hierhin, wenn es eine Querschnittsfähigkeit beschreibt, die unabhängig vom konkreten Reasoning- oder Koordinationsmuster gelöst werden muss.

**Memory Architecture**

### Conversational Memory

- Domäne: Systembetrieb
- Subdomäne: Memory Architecture
- Aliase: Chat History, Conversation Buffer, Dialogue Memory
- Kernidee: Relevante Gesprächshistorie wird für spätere Turns verfügbar gehalten.
- Einsetzen, wenn:
  - Nutzerkontext über mehrere Turns erhalten bleiben muss
  - Bezugnahmen auf frühere Aussagen erwartet werden
  - Gesprächsfluss wichtiger als isolierte Antworten ist
- Nicht einsetzen, wenn:
  - Datenschutz keine Speicherung erlaubt
  - Historie irrelevante Tokens verbraucht
  - Aufgaben zustandslos beantwortet werden können
- Trade-off: Besserer Gesprächskontext gegen Kosten, Datenschutz- und Kontextfensterbelastung.
- Frameworks: LangChain / LangGraph, OpenAI Agents SDK, Microsoft Agent Framework, AutoGen / AG2, CrewAI.
- Verwandt mit: Compressed Context Memory zur Verdichtung, Working Memory / Scratchpad für kurzfristige Aufgaben, Audit Trail bei revisionssicherer Historie.

### Episodic Memory

- Domäne: Systembetrieb
- Subdomäne: Memory Architecture
- Aliase: Experience Memory, Task Episode Store, Interaction Memory
- Kernidee: Abgeschlossene Interaktionen oder Aufgaben werden als Episoden gespeichert und später wiederverwendet.
- Einsetzen, wenn:
  - Agent aus früheren Fällen lernen soll
  - Wiederkehrende Aufgaben ähnliche Lösungswege nutzen
  - Kontext mit Zeit, Ziel und Ergebnis relevant ist
- Nicht einsetzen, wenn:
  - Frühere Fälle veraltet oder irreführend sind
  - Speicherung personenbezogener Daten problematisch ist
  - Semantische Wissensbasis ausreicht
- Trade-off: Erfahrungsbasierte Anpassung gegen Kurations- und Datenschutzaufwand.
- Frameworks: LangGraph mit Speicherbackend, AutoGen / AG2 Memory, Microsoft Agent Framework, CrewAI Memory.
- Verwandt mit: Semantic Memory für entkoppeltes Wissen, Vector Memory für Retrieval, Audit Trail für unveränderliche Ereignishistorie.

### Semantic Memory

- Domäne: Systembetrieb
- Subdomäne: Memory Architecture
- Aliase: Knowledge Memory, Long-Term Knowledge, Fact Store
- Kernidee: Dauerhaftes Wissen wird unabhängig von einzelnen Gesprächen strukturiert oder semantisch abrufbar gespeichert.
- Einsetzen, wenn:
  - Agent domänenspezifisches Wissen langfristig nutzen soll
  - Fakten und Präferenzen wiederverwendet werden
  - Retrieval über viele Sitzungen nötig ist
- Nicht einsetzen, wenn:
  - Wissen schnell veraltet
  - Keine klare Governance für Speicherinhalte existiert
  - Prompt-Kontext ausreicht
- Trade-off: Wiederverwendbares Wissen gegen Aktualisierungs- und Qualitätsrisiken.
- Frameworks: LangChain / LangGraph, OpenAI Agents SDK mit Vector Stores, Microsoft Agent Framework, Google ADK, CrewAI.
- Verwandt mit: Vector Memory als Implementierung, Graph Memory für Beziehungen, Output Validation / Schema Enforcement für strukturierte Einträge.

### Working Memory / Scratchpad

- Domäne: Systembetrieb
- Subdomäne: Memory Architecture
- Aliase: Scratchpad, Short-Term State, Task State
- Kernidee: Temporärer Arbeitszustand hält Zwischenschritte, Variablen und offene Aufgaben während einer Ausführung.
- Einsetzen, wenn:
  - Mehrschrittige Aufgaben Zwischenzustand benötigen
  - Tool-Ergebnisse später referenziert werden
  - Reasoning und Ausführung getrennt nachvollziehbar sein sollen
- Nicht einsetzen, wenn:
  - Aufgabe atomar ist
  - Zwischengedanken nicht gespeichert werden dürfen
  - Persistenz über Läufe nötig ist
- Trade-off: Bessere Steuerbarkeit während eines Laufs gegen zusätzliche State-Verwaltung.
- Frameworks: LangGraph State, OpenAI Agents SDK Run Context, Microsoft Agent Framework, AutoGen / AG2, Google ADK.
- Verwandt mit: ReAct als typischer Nutzer, Checkpointing / Resumability für Persistenz, Blackboard als geteilte Multi-Agent-Version.

### Vector Memory

- Domäne: Systembetrieb
- Subdomäne: Memory Architecture
- Aliase: Vector Store Memory, Embedding Memory, RAG Memory
- Kernidee: Inhalte werden als Embeddings gespeichert und per semantischer Ähnlichkeit abgerufen.
- Einsetzen, wenn:
  - Große Wissensmengen semantisch gesucht werden
  - Wortlaut variieren kann
  - Retrieval-Augmented Generation benötigt wird
- Nicht einsetzen, wenn:
  - Exakte relationale Abfragen zentral sind
  - Aktualität oder Löschung schwer kontrollierbar ist
  - Ähnlichkeitssuche falsche Treffer erzeugt
- Trade-off: Flexibles semantisches Retrieval gegen Ranking-, Frische- und Erklärbarkeitsprobleme.
- Frameworks: LangChain / LangGraph, OpenAI Vector Stores, Microsoft Agent Framework, Google ADK, CrewAI.
- Verwandt mit: Semantic Memory als Wissensschicht, Compressed Context Memory zur Kontextreduktion, Graph Memory bei beziehungsreichen Daten.

### Graph Memory

- Domäne: Systembetrieb
- Subdomäne: Memory Architecture
- Aliase: Knowledge Graph Memory, Entity-Relation Memory, Graph Store
- Kernidee: Entitäten, Beziehungen und Ereignisse werden als Graph gespeichert und abgefragt.
- Einsetzen, wenn:
  - Beziehungen zwischen Objekten entscheidend sind
  - Herkunft und Pfade erklärbar sein müssen
  - Agenten über verknüpfte Fakten navigieren
- Nicht einsetzen, wenn:
  - Unstrukturierter semantischer Abruf genügt
  - Graphschema unklar bleibt
  - Pflege der Beziehungen zu teuer ist
- Trade-off: Hohe Erklärbarkeit und Struktur gegen Modellierungs- und Pflegeaufwand.
- Frameworks: LangGraph mit Graphdatenbanken, Microsoft Agent Framework über externe Stores, Google ADK über Tools, AWS Strands über externe Memory.
- Verwandt mit: Blackboard als gemeinsamer Zustand, Semantic Memory als Wissensebene, Graph-based Orchestration als Kontrollgraph.

### Compressed Context Memory

- Domäne: Systembetrieb
- Subdomäne: Memory Architecture
- Aliase: Context Compression, Summary Memory, Rolling Summary
- Kernidee: Langer Kontext wird zusammengefasst oder verdichtet, damit relevante Information im Kontextfenster bleibt.
- Einsetzen, wenn:
  - Gespräche oder Aufgaben lange laufen
  - Tokenbudget begrenzt ist
  - Alte Information relevant bleibt, aber nicht vollständig benötigt wird
- Nicht einsetzen, wenn:
  - Wortlaut rechtlich oder fachlich exakt bleiben muss
  - Zusammenfassungen Informationsverlust erzeugen
  - Kurze Kontexte ausreichen
- Trade-off: Größerer nutzbarer Verlauf gegen Verlust von Details.
- Frameworks: LangChain / LangGraph, AutoGen / AG2, Microsoft Agent Framework, CrewAI, OpenAI Agents SDK.
- Verwandt mit: Conversational Memory als Quelle, Vector Memory als Alternative, Checkpointing / Resumability bei langen Läufen.

**Tool Integration**

### Function Calling

- Domäne: Systembetrieb
- Subdomäne: Tool Integration
- Aliase: Tool Calling, Structured Tool Use, Function Invocation
- Kernidee: Das Modell nutzt einen strukturierten Integrationsmechanismus, um definierte Funktionen mit validierbaren Argumenten aufzurufen.
- Einsetzen, wenn:
  - Externe Aktionen oder Datenquellen kontrolliert eingebunden werden
  - Argumente validierbar sein müssen
  - Tool-Use beobachtbar und begrenzbar sein soll
- Nicht einsetzen, wenn:
  - Aufgabe ohne externe Aktion lösbar ist
  - Tool-Schema instabil oder unklar ist
  - Freitextinteraktion geeigneter ist
- Trade-off: Strukturierte Kontrolle gegen Schema- und Integrationsaufwand.
- Frameworks: OpenAI Agents SDK, LangGraph, Microsoft Agent Framework, Google ADK, AutoGen / AG2, CrewAI.
- Verwandt mit: Tool Registry als Verwaltungsstruktur, MCP (Model Context Protocol) als Protokollschicht, ReAct als typischer Steuerungsloop.

### Tool Registry

- Domäne: Systembetrieb
- Subdomäne: Tool Integration
- Aliase: Capability Catalog, Tool Catalog, Function Registry
- Kernidee: Verfügbare Tools werden zentral mit Schema, Beschreibung, Berechtigungen und Metadaten registriert.
- Einsetzen, wenn:
  - Viele Tools verwaltet werden
  - Auswahl, Versionierung oder Berechtigungen wichtig sind
  - Tools von mehreren Agenten genutzt werden
- Nicht einsetzen, wenn:
  - Nur wenige statische Tools existieren
  - Registry nicht gepflegt werden kann
  - Toolbeschreibung schlechte Auswahl erzeugt
- Trade-off: Bessere Tool-Governance gegen Pflegeaufwand.
- Frameworks: OpenAI Agents SDK, LangGraph, Microsoft Agent Framework, Google ADK, AWS Strands.
- Verwandt mit: Capability Routing für Auswahl, Permission-scoped Tools für Zugriffskontrolle, MCP (Model Context Protocol) als interoperabler Tool-Standard.

### MCP (Model Context Protocol)

- Domäne: Systembetrieb
- Subdomäne: Tool Integration
- Aliase: MCP-based Tool Integration, MCP Server, MCP-based Tool Discovery
- Kernidee: Externe Ressourcen und Tools werden über das Model Context Protocol als standardisierte Integrationsschicht verfügbar gemacht.
- Einsetzen, wenn:
  - Tools und Datenquellen frameworkübergreifend nutzbar sein sollen
  - Lokale oder externe Systeme angebunden werden
  - Kontextzugriff standardisiert werden soll
- Nicht einsetzen, wenn:
  - Direkte SDK-Integration einfacher und ausreichend ist
  - Sicherheitsmodell nicht geklärt ist
  - Protokollbetrieb mehr Komplexität als Nutzen bringt
- Trade-off: Interoperabilität gegen zusätzlichen Betriebs- und Berechtigungsaufwand.
- Frameworks: OpenAI Agents SDK, LangGraph über Adapter, Microsoft Agent Framework über Connector-Integration, Claude Desktop und kompatible MCP-Clients.
- Verwandt mit: Adapter Pattern für Einbindung, Tool Registry für Katalogisierung, Permission-scoped Tools für sichere Freigabe.

### Adapter Pattern

- Domäne: Systembetrieb
- Subdomäne: Tool Integration
- Aliase: Tool Adapter, API Wrapper, Integration Adapter
- Kernidee: Externe APIs werden in stabile, agentengerechte Schnittstellen übersetzt.
- Einsetzen, wenn:
  - APIs uneinheitlich oder instabil sind
  - Agenten einfache Tool-Verträge brauchen
  - Sicherheits- und Fehlerlogik gekapselt werden soll
- Nicht einsetzen, wenn:
  - Native SDKs bereits passende Tool-Schnittstellen bieten
  - Adapter nur Durchreichung ohne Mehrwert wäre
  - Abstraktion wichtige Semantik versteckt
- Trade-off: Stabilere Agentenschnittstellen gegen zusätzliche Wartungsschicht.
- Frameworks: Alle Agent-Frameworks über Custom Tools, besonders OpenAI Agents SDK, LangGraph, Google ADK, Microsoft Agent Framework, AWS Strands.
- Verwandt mit: Function Calling als Aufrufkanal, MCP (Model Context Protocol) als standardisierter Adapterraum, Least Privilege Agent bei begrenzten API-Rechten.

### Capability Routing

- Domäne: Systembetrieb
- Subdomäne: Tool Integration
- Aliase: Tool Selection, Capability Matching, Skill Routing
- Kernidee: Anfragen werden anhand benötigter Fähigkeiten an passende Tools, Agenten oder Services geleitet.
- Einsetzen, wenn:
  - Viele Fähigkeiten verfügbar sind
  - Auswahl anhand Metadaten oder Policy erfolgen soll
  - Fehlende Fähigkeiten explizit erkannt werden müssen
- Nicht einsetzen, wenn:
  - Toolauswahl trivial ist
  - Fähigkeitsbeschreibungen unpräzise sind
  - Routing nicht beobachtbar getestet wird
- Trade-off: Flexiblere Auswahl gegen Fehlzuordnung und Policy-Komplexität.
- Frameworks: LangGraph, OpenAI Agents SDK, Microsoft Agent Framework, Google ADK, AWS Strands.
- Verwandt mit: Routing als Workflow-Pattern, Tool Registry als Datengrundlage, Agents-as-Tools bei agentischen Fähigkeiten.

### Permission-scoped Tools

- Domäne: Systembetrieb
- Subdomäne: Tool Integration
- Aliase: Scoped Tools, Permissioned Tools, Least-Privilege Tools
- Kernidee: Tools werden mit expliziten, minimalen Berechtigungen pro Agent, Aufgabe oder Lauf bereitgestellt.
- Einsetzen, wenn:
  - Tools sensitive Aktionen ausführen
  - Agenten unterschiedliche Rechte brauchen
  - Compliance und Auditierbarkeit relevant sind
- Nicht einsetzen, wenn:
  - Alle Aktionen rein lesend und unkritisch sind
  - Rechte nicht sauber modelliert werden können
  - Übermäßige Fragmentierung Bedienbarkeit verschlechtert
- Trade-off: Bessere Sicherheit gegen höheren Verwaltungsaufwand.
- Frameworks: OpenAI Agents SDK, Microsoft Agent Framework, Google ADK, AWS Strands, LangGraph.
- Verwandt mit: Least Privilege Agent als Rollenprinzip, Human-in-the-Loop Approval Gate für riskante Aktionen, Audit Trail für Nachvollziehbarkeit.

**Runtime Architecture**

### Actor Model

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Actor-based Runtime, Agent Actors, Message Actors
- Kernidee: Agenten oder Komponenten laufen als unabhängige Actors, die Zustand kapseln und über Nachrichten kommunizieren.
- Einsetzen, wenn:
  - Nebenläufigkeit und Isolation wichtig sind
  - Agenten eigenen Zustand besitzen
  - Skalierung über unabhängige Einheiten erfolgen soll
- Nicht einsetzen, wenn:
  - Einfacher synchroner Workflow reicht
  - Nachrichtenmodell unnötige Komplexität erzeugt
  - Globale Transaktionen zentral sind
- Trade-off: Gute Isolation und Skalierung gegen komplexere Nachrichten- und Fehlersemantik.
- Frameworks: Microsoft Agent Framework, AutoGen / AG2, AWS Strands über Laufzeitarchitektur, LangGraph mit externem Actor Runtime.
- Verwandt mit: Pub/Sub Agent Mesh für Verteilung, Event-driven Choreography für entkoppelte Abläufe, Checkpointing / Resumability für Zustandssicherung.

### Event-driven Choreography

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Event Choreography, Event-driven Agents, Choreographed Workflow
- Kernidee: Komponenten reagieren auf Ereignisse, statt von einem zentralen Orchestrator direkt gesteuert zu werden.
- Einsetzen, wenn:
  - Systeme lose gekoppelt sein sollen
  - Ereignisse aus mehreren Quellen eintreffen
  - Skalierung und Erweiterbarkeit wichtig sind
- Nicht einsetzen, wenn:
  - Globaler Ablauf streng nachvollziehbar sein muss
  - Eventual Consistency nicht akzeptabel ist
  - Debugging ohne Tracing schwierig wäre
- Trade-off: Hohe Entkopplung gegen schwierigere globale Kontrolle.
- Frameworks: AWS Strands, Microsoft Agent Framework, LangGraph mit Event Runtime, Google ADK über Integrationen.
- Verwandt mit: Pub/Sub Agent Mesh als Infrastruktur, Saga / Compensation für Fehlerbehandlung, Distributed Tracing als Pflichtfähigkeit.

### Saga / Compensation

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Saga Pattern, Compensating Action, Transactional Workflow
- Kernidee: Mehrschrittige Aktionen werden durch Ausgleichsschritte abgesichert, wenn spätere Schritte fehlschlagen.
- Einsetzen, wenn:
  - Agenten externe Nebenwirkungen auslösen
  - Verteilte Transaktionen nicht verfügbar sind
  - Fehlerrücknahme fachlich möglich ist
- Nicht einsetzen, wenn:
  - Aktionen nicht kompensierbar sind
  - Harte atomare Konsistenz erforderlich ist
  - Fehler besser durch Freigabe verhindert werden
- Trade-off: Robustere Langläufer gegen komplexe Kompensationslogik.
- Frameworks: Workflow-Engines mit Agent-Integration, AWS Strands Workflow, Microsoft Agent Framework, LangGraph mit Durable Runtime.
- Verwandt mit: Workflow DAG / Durable Execution als Ausführungsbasis, Human-in-the-Loop Approval Gate vor irreversiblen Schritten, Audit Trail für Nachweis.

### Workflow DAG / Durable Execution

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Durable Workflow, DAG Orchestration, Resumable Workflow
- Kernidee: Workflows werden als persistente Ausführungsgraphen mit Wiederaufnahme, Retry und Zustandsverlauf betrieben.
- Einsetzen, wenn:
  - Läufe lange dauern oder fehlschlagen können
  - Zustände und Wiederholungen robust verwaltet werden müssen
  - Produktion Nachvollziehbarkeit verlangt
- Nicht einsetzen, wenn:
  - Aufgaben kurz und zustandslos sind
  - Persistenz unnötigen Betrieb erzeugt
  - Graphmodell den Ablauf nicht passend ausdrückt
- Trade-off: Produktionsrobustheit gegen Infrastruktur- und Modellierungsaufwand.
- Frameworks: LangGraph, AWS Strands Workflow, Google ADK, Microsoft Agent Framework, CrewAI Flows.
- Verwandt mit: Graph-based Orchestration als Agentenstruktur mit Fokus auf Kontrollzustände, Checkpointing / Resumability als Kernfähigkeit, Sequential Pipeline als einfacher Ablauf.

### Checkpointing / Resumability

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: State Checkpointing, Resume from State, Persistent Run State
- Kernidee: Ausführungszustand wird regelmäßig gespeichert, damit Läufe nach Fehlern oder Unterbrechungen fortgesetzt werden können.
- Einsetzen, wenn:
  - Agentenläufe lang oder teuer sind
  - Externe Systeme zeitweise ausfallen können
  - Manuelle Prüfung zwischen Schritten nötig ist
- Nicht einsetzen, wenn:
  - Schritte atomar und billig wiederholbar sind
  - Zustand sensitive Daten unnötig persistiert
  - Wiederaufnahme fachlich nicht sinnvoll ist
- Trade-off: Höhere Ausfallsicherheit gegen Speicher-, Datenschutz- und Konsistenzaufwand.
- Frameworks: LangGraph, Microsoft Agent Framework, AWS Strands Workflow, Google ADK.
- Verwandt mit: Workflow DAG / Durable Execution als Laufzeitrahmen, Working Memory / Scratchpad als zu sichernder Zustand, Audit Trail als ergänzende Historie.

### Pub/Sub Agent Mesh

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Agent Mesh, Publish-Subscribe Agents, Message Bus Coordination
- Kernidee: Agenten kommunizieren über Topics, Events oder Nachrichtenbusse statt über direkte Kopplung.
- Einsetzen, wenn:
  - Viele Agenten oder Services lose gekoppelt werden
  - Ereignisse an mehrere Empfänger gehen
  - Erweiterbarkeit ohne zentrale Abhängigkeit wichtig ist
- Nicht einsetzen, wenn:
  - Direkter synchroner Aufruf reicht
  - Nachrichtenreihenfolge und Zustellung ungeklärt sind
  - Beobachtbarkeit nicht aufgebaut ist
- Trade-off: Skalierbare Entkopplung gegen komplexere Zustellung, Debugging und Governance.
- Frameworks: AWS Event- und Agent-Architekturen, Microsoft Agent Framework, LangGraph mit Messaging-Infrastruktur, Google ADK über Cloud-Integrationen.
- Verwandt mit: Event-driven Choreography als Ablaufstil, Actor Model als Laufzeitmodell, Blackboard als zustandsorientierte Alternative.

**Governance & Safety**

### Human-in-the-Loop Approval Gate

- Domäne: Systembetrieb
- Subdomäne: Governance & Safety
- Aliase: HITL, Human Approval, Manual Review Gate
- Kernidee: Kritische Schritte werden vor Ausführung durch einen Menschen geprüft und freigegeben.
- Einsetzen, wenn:
  - Aktionen irreversible oder teure Folgen haben
  - Compliance menschliche Entscheidung verlangt
  - Modellunsicherheit sichtbar gemacht werden soll
- Nicht einsetzen, wenn:
  - Niedrigrisiko-Aktionen vollautomatisch laufen können
  - Freigaben nur symbolisch sind
  - Latenzanforderungen menschliche Prüfung ausschließen
- Trade-off: Höhere Kontrolle gegen langsamere Abläufe.
- Frameworks: Google ADK, OpenAI Agents SDK, LangGraph, Microsoft Agent Framework, CrewAI.
- Verwandt mit: Permission-scoped Tools für Vorbegrenzung, Saga / Compensation für Rücknahme, Audit Trail für Nachweis.

### Output Validation / Schema Enforcement

- Domäne: Systembetrieb
- Subdomäne: Governance & Safety
- Aliase: Structured Output Validation, Schema Validation, Guarded Output
- Kernidee: Modellantworten werden gegen Schemata, Typen oder fachliche Regeln validiert.
- Einsetzen, wenn:
  - Downstream-Systeme strukturierte Daten erwarten
  - Fehler früh erkannt werden müssen
  - Automatisierte Verarbeitung folgt
- Nicht einsetzen, wenn:
  - Freiformtext das Ziel ist
  - Schema die eigentliche Antwort unzulässig einschränkt
  - Validierung nur syntaktisch und fachlich blind ist
- Trade-off: Höhere Zuverlässigkeit gegen Einschränkung der Ausdrucksfreiheit.
- Frameworks: OpenAI Structured Outputs, LangGraph, Microsoft Agent Framework, Google ADK, Anthropic Tool Use.
- Verwandt mit: Function Calling für strukturierte Argumente, Evaluator-Optimizer für Qualitätsprüfung, Sandbox Execution bei ausführbaren Outputs.

### Sandbox Execution

- Domäne: Systembetrieb
- Subdomäne: Governance & Safety
- Aliase: Isolated Execution, Code Sandbox, Secure Runtime
- Kernidee: Modellgenerierter oder agentisch ausgewählter Code wird in einer isolierten Umgebung ausgeführt.
- Einsetzen, wenn:
  - Agenten Code, Shell oder Browseraktionen ausführen
  - Untrusted Inputs verarbeitet werden
  - Seiteneffekte begrenzt werden müssen
- Nicht einsetzen, wenn:
  - Keine Ausführung stattfindet
  - Sandbox Ausbruch oder Datenzugriff nicht kontrolliert werden kann
  - Externe Aktionen besser über geprüfte Tools laufen
- Trade-off: Sichere Ausführung gegen Infrastruktur- und Performance-Aufwand.
- Frameworks: OpenAI Code Interpreter / sandboxed tools, AutoGen / AG2, Microsoft Agent Framework, LangGraph über Runtime-Integration.
- Verwandt mit: CodeAct als Hauptnutzer, Permission-scoped Tools für Rechte, Audit Trail für Ausführungsnachweis.

### Least Privilege Agent

- Domäne: Systembetrieb
- Subdomäne: Governance & Safety
- Aliase: Minimal Permission Agent, Scoped Agent, Role-limited Agent
- Kernidee: Jeder Agent erhält nur die Tools, Daten und Berechtigungen, die seine Aufgabe erfordert.
- Einsetzen, wenn:
  - Mehrere Agenten unterschiedliche Vertrauenszonen haben
  - Sensitive Daten oder Aktionen beteiligt sind
  - Sicherheitsgrenzen architektonisch sichtbar sein sollen
- Nicht einsetzen, wenn:
  - Agentenrollen nicht klar getrennt sind
  - Berechtigungsmodell Pflege verhindert
  - Falsche Einschränkung Kernfunktionen blockiert
- Trade-off: Geringere Angriffsfläche gegen höheren Rollen- und Berechtigungsaufwand.
- Frameworks: OpenAI Agents SDK, Microsoft Agent Framework, Google ADK, AWS Strands, LangGraph.
- Verwandt mit: Permission-scoped Tools als technische Umsetzung, Handoff bei getrennten Zuständigkeiten, Agents-as-Tools für gekapselte Spezialisten.

### Audit Trail

- Domäne: Systembetrieb
- Subdomäne: Governance & Safety
- Aliase: Execution Log, Decision Log, Trace Log
- Kernidee: Entscheidungen, Tool-Aufrufe, Eingaben, Ausgaben und Freigaben werden nachvollziehbar protokolliert.
- Einsetzen, wenn:
  - Compliance oder Debugging Nachvollziehbarkeit verlangt
  - Agenten externe Aktionen auslösen
  - Qualitäts- und Sicherheitsanalysen möglich sein sollen
- Nicht einsetzen, wenn:
  - Protokolle sensitive Daten ohne Schutz speichern würden
  - Aufbewahrungsregeln ungeklärt sind
  - Logging nur Rauschen ohne Nutzung erzeugt
- Trade-off: Nachvollziehbarkeit gegen Datenschutz-, Speicher- und Governance-Aufwand.
- Frameworks: OpenAI Agents SDK Tracing, LangSmith / LangGraph, Microsoft Agent Framework, Google ADK, AWS Observability.
- Verwandt mit: Distributed Tracing für technische Flüsse, Human-in-the-Loop Approval Gate für Freigaben, Token / Cost Tracking als Metrikspur.

### Multimodal Guardrails

- Domäne: Systembetrieb
- Subdomäne: Governance & Safety
- Aliase: Multimodal Safety Filters, Cross-modal Guardrails, Media Validation
- Kernidee: Text-, Bild-, Audio- oder Videoeingaben und Ausgaben werden mit modalitätsspezifischen Sicherheitsregeln geprüft.
- Einsetzen, wenn:
  - Agenten multimodale Daten verarbeiten
  - Medieninhalte Compliance- oder Sicherheitsrisiken tragen
  - Ausgaben in mehreren Modalitäten kontrolliert werden müssen
- Nicht einsetzen, wenn:
  - System rein textuell bleibt
  - Guardrails Modalitäten nicht zuverlässig abdecken
  - Prüfung relevante Inhalte systematisch blockiert
- Trade-off: Bessere Sicherheit in Medienflüssen gegen zusätzliche Latenz und Fehlklassifikationen.
- Frameworks: OpenAI Moderation und multimodale Modelle, Microsoft Azure AI Content Safety, Google Vertex AI Safety, AWS Bedrock Guardrails.
- Verwandt mit: Output Validation / Schema Enforcement für strukturierte Ausgaben, Sandbox Execution für aktive Inhalte, Audit Trail für Prüfverläufe.

**Observability & Evaluation**

### Distributed Tracing

- Domäne: Systembetrieb
- Subdomäne: Observability & Evaluation
- Aliase: Agent Tracing, End-to-End Trace, Span-based Observability
- Kernidee: Agentenläufe, Tool-Aufrufe und Subprozesse werden als zusammenhängende Traces sichtbar gemacht.
- Einsetzen, wenn:
  - Mehrere Komponenten an einer Antwort beteiligt sind
  - Fehlerursachen und Latenzen analysiert werden müssen
  - Produktionsbetrieb kontinuierliche Beobachtung braucht
- Nicht einsetzen, wenn:
  - System minimal und lokal bleibt
  - Trace-Daten Datenschutzrisiken ohne Schutz erzeugen
  - Kosten der Telemetrie den Nutzen übersteigen
- Trade-off: Tiefe Diagnosefähigkeit gegen Telemetrie- und Datenschutzaufwand.
- Frameworks: OpenAI Agents SDK Tracing, LangSmith / LangGraph, Microsoft Agent Framework, AWS X-Ray / OpenTelemetry, Google Cloud Trace.
- Verwandt mit: Audit Trail als fachliche Historie, Token / Cost Tracking als Metrikergänzung, Event-driven Choreography mit besonderem Bedarf.

### Token / Cost Tracking

- Domäne: Systembetrieb
- Subdomäne: Observability & Evaluation
- Aliase: Usage Tracking, Cost Observability, Budget Monitoring
- Kernidee: Tokenverbrauch, Modellkosten und toolbezogene Ausgaben werden pro Lauf, Agent oder Workflow gemessen.
- Einsetzen, wenn:
  - Kosten begrenzt oder zugeordnet werden müssen
  - Agenten autonom Schleifen ausführen
  - Optimierung von Modellen und Patterns nötig ist
- Nicht einsetzen, wenn:
  - Prototypen ohne Budgetrelevanz laufen
  - Messdaten nicht handlungsrelevant sind
  - Kosten außerhalb des Systems nicht erfassbar sind
- Trade-off: Bessere Budgetkontrolle gegen zusätzlichen Mess- und Aggregationsaufwand.
- Frameworks: OpenAI Usage APIs, LangSmith, Microsoft Agent Framework, Google Cloud Monitoring, AWS Cost and Usage Integrationen.
- Verwandt mit: Loop wegen Budgetgrenzen, Market-based als Allokationsgrundlage, ReWOO als Kostenoptimierung.

### LLM-as-Judge

- Domäne: Systembetrieb
- Subdomäne: Observability & Evaluation
- Aliase: Model Judge, AI Evaluator, LLM Evaluator
- Kernidee: Ein Modell bewertet Ausgaben anhand von Kriterien, Rubrics oder Vergleichsbeispielen.
- Einsetzen, wenn:
  - Menschliche Bewertung skaliert werden muss
  - Qualitätskriterien sprachlich formulierbar sind
  - Regressionen in Agentenantworten erkannt werden sollen
- Nicht einsetzen, wenn:
  - Objektive Tests verfügbar sind
  - Bewertungsmodell denselben Bias wie Generator hat
  - Hohe rechtliche Verbindlichkeit gefordert ist
- Trade-off: Skalierbare Bewertung gegen Unsicherheit und Kalibrierungsbedarf.
- Frameworks: LangSmith, OpenAI Evals, Microsoft Agent Framework, Google ADK Evaluation, AutoGen / AG2.
- Verwandt mit: Evaluator-Optimizer als Nutzung im Workflow, Self-Consistency für Auswahl, Integration Tests für Agents als härtere Prüfung.

### Integration Tests für Agents

- Domäne: Systembetrieb
- Subdomäne: Observability & Evaluation
- Aliase: Agent Integration Tests, Scenario Tests, End-to-End Agent Tests
- Kernidee: Agenten werden über realistische Szenarien, Tools, Speicher und Kontrollflüsse hinweg getestet.
- Einsetzen, wenn:
  - Agenten produktionsnah handeln
  - Tool- und Workflow-Grenzen geprüft werden müssen
  - Regressionen über Versionen sichtbar werden sollen
- Nicht einsetzen, wenn:
  - Nur ein isolierter Prompt exploriert wird
  - Tests nicht deterministisch genug bewertet werden können
  - Testumgebung externe Systeme gefährdet
- Trade-off: Höhere Betriebssicherheit gegen aufwendige Testdaten, Mocks und Bewertungslogik.
- Frameworks: LangSmith, OpenAI Evals, Microsoft Agent Framework, Google ADK, CrewAI Test Patterns, AutoGen / AG2.
- Verwandt mit: Output Validation / Schema Enforcement für harte Checks, Distributed Tracing für Diagnose, Sandbox Execution für sichere Testläufe.

### Goal Setting and Monitoring

- Domäne: Systembetrieb
- Subdomäne: Observability & Evaluation
- Aliase: Objective Tracking, Goal Monitoring, Progress Monitoring
- Kernidee: Ziele, Erfolgskriterien und Fortschritt werden explizit modelliert und während eines Agentenlaufs überwacht.
- Einsetzen, wenn:
  - Agenten über mehrere Schritte hinweg ein messbares Ziel verfolgen
  - Fortschritt, Abbruchkriterien und Zielabweichungen sichtbar sein müssen
  - Autonome Agenten nicht nur Aufgaben, sondern Outcomes steuern sollen
- Nicht einsetzen, wenn:
  - Die Aufgabe in einem einzelnen deterministischen Schritt lösbar ist
  - Zielkriterien nicht operationalisierbar sind
  - Monitoring nur zusätzliche Bürokratie erzeugt
- Trade-off: Bessere Zieltreue gegen zusätzlichen Modellierungs- und Messaufwand.
- Frameworks: LangGraph State, OpenAI Agents SDK Tracing, LangSmith, Google ADK, Microsoft Agent Framework.
- Verwandt mit: Plan-and-Execute für Zielzerlegung, Distributed Tracing für Laufbeobachtung, LLM-as-Judge für qualitative Zielprüfung.

### Exception Handling and Recovery

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Error Recovery, Retry and Fallback, Failure Handling
- Kernidee: Fehler werden als erwartbare Laufzeitzustände behandelt, mit Retry, Fallback, Eskalation oder kontrolliertem Abbruch.
- Einsetzen, wenn:
  - Tools, APIs oder Modelle temporär ausfallen können
  - Agenten über mehrere Schritte hinweg robuste Recovery brauchen
  - Externe Side Effects nicht doppelt oder inkonsistent ausgeführt werden dürfen
- Nicht einsetzen, wenn:
  - Fehler besser direkt sichtbar scheitern sollen
  - Retry Nebenwirkungen mehrfach auslösen kann
  - Fallbacks schlechtere Antworten als klare Fehlermeldungen erzeugen
- Trade-off: Höhere Robustheit gegen komplexere Zustands- und Fehlerlogik.
- Frameworks: LangGraph, Temporal, Durable Functions, Microsoft Agent Framework, AWS Step Functions.
- Verwandt mit: Saga / Compensation für rückgängig machbare Side Effects, Checkpointing / Resumability für Wiederaufnahme, Human-in-the-Loop Approval Gate für Eskalation.

### Resource-Aware Optimization

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Budget-Aware Execution, Resource-Aware Scheduling, Cost-Latency Optimization
- Kernidee: Modellwahl, Tool-Nutzung, Parallelität und Abbruch werden an verfügbare Ressourcen wie Budget, Latenz, Tokens, Quoten oder Rechenzeit gekoppelt.
- Einsetzen, wenn:
  - Agenten unter Kosten-, Latenz- oder Quotenlimits laufen
  - Mehrere Tasks um knappe Ressourcen konkurrieren
  - Modell- und Tool-Auswahl dynamisch optimiert werden soll
- Nicht einsetzen, wenn:
  - Ressourcen praktisch unbegrenzt oder irrelevant sind
  - Optimierungslogik die eigentliche Aufgabe überlagert
  - Messdaten zu ungenau für Entscheidungen sind
- Trade-off: Effizienterer Betrieb gegen zusätzliche Steuerungslogik und mögliche Qualitätsverluste.
- Frameworks: LangGraph, LangSmith, OpenAI Usage APIs, Google Cloud Monitoring, AWS Cost and Usage Integrationen.
- Verwandt mit: Token / Cost Tracking als Messgrundlage, Market-based für Allokation, ReWOO für Call-Reduktion.

### Prioritization

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Task Prioritization, Priority Queue, Importance Scheduling
- Kernidee: Aufgaben werden nach Wichtigkeit, Deadline, Risiko, Nutzerwert oder Abhängigkeiten geordnet, bevor Agenten oder Tools sie bearbeiten.
- Einsetzen, wenn:
  - Mehrere Aufgaben gleichzeitig anstehen
  - Dringlichkeit, Risiko oder Geschäftswert unterschiedlich sind
  - Agenten Arbeitspakete unter Ressourcenknappheit wählen müssen
- Nicht einsetzen, wenn:
  - Aufgaben strikt sequenziell oder gleichwertig sind
  - Prioritätsregeln politisch oder fachlich ungeklärt sind
  - Falsche Priorisierung schwerer wiegt als einfache FIFO-Verarbeitung
- Trade-off: Bessere Ressourcennutzung gegen Prioritätsbias und Regelpflege.
- Frameworks: Queue-Systeme, LangGraph State, CrewAI Processes, Microsoft Agent Framework, AWS Step Functions.
- Verwandt mit: Resource-Aware Optimization als Optimierungsrahmen, Market-based als ökonomische Variante, Orchestrator-Workers für Aufgabenverteilung.

### Learning and Adaptation

- Domäne: Systembetrieb
- Subdomäne: Observability & Evaluation
- Aliase: Feedback Adaptation, Continuous Improvement, Adaptive Agent
- Kernidee: Feedback aus Nutzerreaktionen, Bewertungen, Traces oder Fehlern wird genutzt, um Prompts, Policies, Memories oder Routing über Zeit anzupassen.
- Einsetzen, wenn:
  - Agenten wiederholt ähnliche Aufgaben bearbeiten
  - Feedback systematisch verfügbar und auswertbar ist
  - Anpassungen kontrolliert ausgerollt und geprüft werden können
- Nicht einsetzen, wenn:
  - Feedback verrauscht, manipulativ oder nicht repräsentativ ist
  - Änderungen ungeprüft produktive Agenten beeinflussen
  - Compliance stabile, nachvollziehbare Policies verlangt
- Trade-off: Kontinuierliche Verbesserung gegen Drift, Governance-Aufwand und Regressionsrisiko.
- Frameworks: LangSmith Datasets, OpenAI Evals, Memory Stores, Feature Flags, Experiment-Plattformen.
- Verwandt mit: Reflexion als kurzfristige Selbstverbesserung, LLM-as-Judge als Feedbackquelle, Integration Tests für Agents als Regressionsschutz.

### Exploration and Discovery

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Autonomous Discovery, Search and Explore, Hypothesis Exploration
- Kernidee: Ein Agent erkundet Lösungsräume, Datenquellen oder Hypothesen aktiv, statt nur einem vorgegebenen Plan zu folgen.
- Einsetzen, wenn:
  - Der Lösungsraum unklar oder offen ist
  - Neue Optionen, Quellen oder Strategien gefunden werden sollen
  - Exploration durch Budgets, Stop-Kriterien und Bewertung kontrolliert werden kann
- Nicht einsetzen, wenn:
  - Eine bekannte Pipeline zuverlässig ausreicht
  - Exploration unkontrollierte Kosten oder Seiteneffekte erzeugt
  - Ergebnisse ohne Bewertung nicht verwertbar sind
- Trade-off: Mehr Lösungsabdeckung gegen höhere Kosten und schwerere Reproduzierbarkeit.
- Frameworks: LangGraph, AutoGen / AG2, Google ADK Composite Patterns, CrewAI.
- Verwandt mit: Tree of Thoughts für Reasoning-Suche, Swarm für dezentrale Exploration, LLM-as-Judge für Bewertung.

### Inter-Agent Communication (A2A)

- Domäne: Systembetrieb
- Subdomäne: Runtime Architecture
- Aliase: Agent-to-Agent Communication, A2A Messaging, Agent Protocol
- Kernidee: Agenten tauschen Nachrichten, Fähigkeiten, Status und Ergebnisse über explizite Kommunikationsprotokolle statt impliziter Prompt-Konventionen aus.
- Einsetzen, wenn:
  - Agenten organisations-, prozess- oder systemübergreifend kooperieren
  - Nachrichtenformate, Identität und Fähigkeiten vertraglich stabil sein müssen
  - Interoperabilität wichtiger als eine einzelne Framework-Implementierung ist
- Nicht einsetzen, wenn:
  - Agenten nur innerhalb eines lokalen Workflows laufen
  - Ein einfacher Graph oder Supervisor genügt
  - Protokollaufwand mehr Komplexität als Nutzen erzeugt
- Trade-off: Interoperabilität und Entkopplung gegen Protokoll-, Sicherheits- und Versionierungsaufwand.
- Frameworks: Google A2A, MCP in Kombination mit Agent-Runtime, Microsoft Agent Framework, LangGraph über Custom Channels.
- Verwandt mit: Pub/Sub Agent Mesh für Transport, Group Chat für einfache Konversation, Blackboard für Shared-State-Kommunikation.

> Hinweis: Die Pattern-Liste wurde nach der vorhandenen Infografik erweitert. `docs/ai-agen-pattern-landscape.png`, die Webapp-Kopie und die Präsentationsgrafik müssen nachgezogen werden, sobald die neue Taxonomie visuell final ist.

## 🗺️ Querschnittssicht 1: Framework-Mapping

| Framework | Native Patterns | Stärke | Schwäche |
|---|---|---|---|
| Anthropic Cookbook | 5 Workflow-Patterns als Minimal-Code | Sehr klare, kleine Referenzmuster für Workflows | Wenig Fokus auf Multi-Agent-Betrieb |
| LangGraph | Supervisor, Swarm, Graph-based | Flexible Graph-Orchestrierung mit guter Kontrolle | Lernkurve und Modellierungsaufwand |
| CrewAI | Sequential, Hierarchical Process, Flows | Einfacher Einstieg für Teams, Rollen und Prozesse | Weniger Low-Level-Kontrolle als Graph-Frameworks |
| AutoGen / AG2 | GroupChat, Two-Agent-Chat, Nested Chats | Starke Multi-Agent-Kommunikation und Experimente | Komplexe Gespräche können schwer deterministisch werden |
| Microsoft Agent Framework | Sequential, Concurrent, Group Chat, Handoff, Magentic | Enterprise-Integration und breite Orchestrierungsabdeckung | Ökosystem und APIs entwickeln sich noch |
| Google ADK | Sequential Pipeline, Coordinator, Parallel, Hierarchical, Generator-Critic, Iterative, HITL, Composite | Breite Pattern-Abdeckung mit expliziten Developer-Guides | Weniger OSS-Reife als ältere Frameworks |
| AWS Strands | Graph, Swarm, Workflow, Agents-as-Tools | Gute AWS-Integration und skalierbare Runtime-Perspektive | Stärkere Bindung an AWS-Konzepte |
| OpenAI Agents SDK | Handoff | Nahtlose Modell-, Tool- und Tracing-Integration | Weniger explizite Pattern-Taxonomie als Graph-Frameworks |

## 🧩 Querschnittssicht 2: Decision-Heuristik

Verzweigte Fragekette:

- Reicht ein einzelner Prompt mit gutem Prompt-Engineering?
  - Ja: Direkter Modell-Call. Stop.
  - Nein: Braucht es externe Interaktion oder Datenzugriff?

- Braucht es externe Interaktion oder Datenzugriff?
  - Nein: reines Reasoning Pattern prüfen, etwa Self-Consistency, Tree of Thoughts oder Reflexion.
  - Ja: Ist der Ablauf vorhersagbar?

- Ist der Ablauf vorhersagbar?
  - Ja: Workflow-Pattern aus Domäne Ablauf wählen.
  - Nein: Reicht ein autonomer Agent?

- Reicht ein autonomer Agent?
  - Ja: Single Agent mit ReAct oder Plan-and-Execute.
  - Nein: Sind echte Spezialisten nötig, etwa eigene Sicherheitsgrenzen oder eigene Tool-Sets?

- Sind echte Spezialisten nötig, etwa eigene Sicherheitsgrenzen oder eigene Tool-Sets?
  - Ja: Multi-Agent-Pattern aus Domäne Zusammenarbeit wählen und Kooperationstyp prüfen.
  - Nein: Single Agent mit gutem Tool-Design.

- Wenn Multi-Agent gewählt wurde: Müssen mehrere Agenten autonom kooperieren ohne festen Plan?
  - Ja: Magentic (Composite orchestration pattern), Group Chat oder Blackboard prüfen.
  - Nein: Supervisor oder Handoff reichen.

- Production-Kontext?
  - Ja: Patterns aus Domäne Systembetrieb sind verpflichtend, nicht optional.
  - Nein: Prototyp bewusst schlank halten und Annahmen dokumentieren.

## 🔎 Pattern-Format (Lookup-Modus)

Jeder Architekturbaustein in den vier Domänen wird nach folgendem Schema beschrieben:

### Patternname

- Domäne: Denken / Ablauf / Zusammenarbeit / Systembetrieb
- Subdomäne: nur bei Systembetrieb, etwa Memory Architecture, Tool Integration, Runtime Architecture, Governance & Safety oder Observability & Evaluation
- Aliase: alternative Namen aus der Literatur
- Kernidee: ein Satz
- Einsetzen, wenn: 1 bis 3 Kriterien
- Nicht einsetzen, wenn: 1 bis 3 Kriterien
- Trade-off: ein Satz
- Frameworks: Frameworks mit nativer oder gut etablierter Unterstützung; bei unscharfer Unterstützung explizit zwischen "Native" und "Implementierbar als" trennen
- Verwandt mit: verwandte Patterns mit kurzem Hinweis auf die Beziehung und möglichst typisierbarer Relation

Relationstypen für spätere Graph-Modellierung:

- `IS_A`: Spezialfall oder Oberklasse, etwa ReAct ist ein Spezialfall von Loop.
- `USES`: technische oder konzeptionelle Voraussetzung, etwa CodeAct nutzt Sandbox Execution.
- `ALTERNATIVE_TO`: alternative Wahl bei ähnlichem Ziel, etwa ReAct und Plan-and-Execute.
- `VARIANT_OF`: gleiche Grundidee auf anderer Abstraktionsebene, etwa Reflexion und Evaluator-Optimizer.
- `SUPPORTS`: Betriebsbaustein unterstützt ein anderes Pattern, etwa Checkpointing unterstützt Loop.

## 📚 Quellen

- Anthropic, Building Effective Agents
- Anthropic, Building Effective AI Agents Guide
- Microsoft, AI Agent Orchestration Patterns, Azure Architecture Center
- Google, Developer's Guide to Multi-Agent Patterns in ADK
- AWS, Multi-Agent Patterns in Strands Agents
- Lu et al., Agent Design Pattern Catalogue
- Confluent, Four Design Patterns for Event-Driven Multi-Agent Systems
- LangChain Multi-Agent Guide

## 📝 Hinweise

- Dieses Dokument ist die Referenz-Sicht. Eine Infografik-Version mit drei horizontalen Ebenen, Agent Intelligence, Orchestration und Production Architecture, sowie seitlicher Entscheidungsleiter folgt separat.
- Pattern-Einträge werden iterativ vertieft, nicht einmalig finalisiert.
- Beziehungen zwischen Patterns sind bewusst als "Verwandt mit"-Feld erfasst, um spätere Überführung in ein Graph-Modell, Nexonoma, zu erleichtern. Die nächste Modellierungsstufe typisiert diese Beziehungen, etwa als `IS_A`, `USES`, `ALTERNATIVE_TO`, `VARIANT_OF` oder `SUPPORTS`.
- Anmerkungen zur Klassifikation: Magentic ist als Composite orchestration pattern eingeordnet, weil es Planning, Task Ledger, Replanning und Delegation kombiniert. Graph-based Orchestration ist als Zusammenarbeit eingeordnet, wenn der Graph Agentenrollen und Kontrollübergaben modelliert, während Workflow DAG / Durable Execution in Systembetrieb liegt, wenn der Fokus auf Laufzeit, Persistenz und Wiederaufnahme liegt. Function Calling und MCP (Model Context Protocol) sind bewusst als Capabilities geführt, weil das Dokument "Pattern" pragmatisch als wiederkehrenden Architekturbaustein versteht. Agents-as-Tools liegt in Zusammenarbeit, weil agentische Spezialisten gekapselt werden, technisch stützt es sich aber auf Tool Integration Patterns.
- Framework-Hinweis: Die Framework-Zuordnungen sind konservativ zu lesen. "Native" meint erkennbare direkte Unterstützung durch Framework-Konzepte oder Dokumentation. "Implementierbar als" meint, dass ein Pattern mit Custom Graphs, Custom Protocols oder eigenen Workflows gebaut werden kann, aber dadurch nicht automatisch ein idiomatischer Framework-Use Case ist.
- Stil-Hinweis: Die Emoji-Marker dienen der Arbeitsreferenz und schnellen Orientierung. Für eine stärker redaktionelle Publikationsfassung können die Marker entfernt werden, ohne die Struktur zu verändern.
- Reihenfolge-Hinweis: Die Pattern-Reihenfolge innerhalb der Domänen priorisiert häufige Praxisentscheidungen vor rein taxonomischer Vollständigkeit.
