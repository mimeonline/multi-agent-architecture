# AI Systems Atlas Product Architecture

Dieses Dokument beschreibt den evolutionären Produkt- und Architekturrahmen für die Weiterentwicklung der bestehenden AI Agent Pattern Landscape zum AI Systems Atlas. Es ist kein Implementierungsplan für einen Rewrite, sondern ein Refactoring-Kompass: Bestehende Assets bleiben erhalten, bekommen aber klarere Rollen im größeren Produktmodell.

## Produktziel

AI Systems Atlas ist eine hochwertige Knowledge Platform für AI Systems Architecture.

Das Produkt erklärt nicht nur Agent Patterns, sondern ordnet Foundations, Patterns, Architecture, Governance, Decision Guides und Reference Architectures zu einer mentalen Landkarte für robuste AI-Systeme.

Positionierungsprinzip:

> Architecture first. Implementation proves it. Frameworks support it.

Der Atlas ist keine generische AI Tutorial Site, kein Awesome-List-Verzeichnis und kein Framework-Katalog. Der Wert liegt in System Thinking, Architecture, Enterprise Reality und AI Engineering.

## Zielgruppe

- Software Architects
- Enterprise Architects
- Staff Engineers
- AI Engineers
- Technisch orientierte Entscheider

## Produktmodell

```text
AI Systems Atlas

Primary Domains:
- Foundations
- Patterns
- Architecture
- Governance
- Decision Guides
- Reference Architectures

Capability Layer:
- Implementation Lab
- Tooling Compatibility

Internal / Repo Artifacts:
- docs/
- webapp/
- code/
- presentation/
```

Produktmodell und Repo-Struktur sind bewusst getrennt. Die Produktnavigation folgt nicht automatisch der Ordnerstruktur im Repository.

## Primary Domains

### Foundations

Foundations beschreiben zentrale Architekturprimitive von AI-Systemen.

Sie beantworten nicht nur "Was ist das?", sondern vor allem:

- Welche Architekturimplikationen entstehen daraus?
- Welche Systemgrenzen, Fehlerklassen oder Trade-offs werden sichtbar?
- Welche Patterns und Architecture Topics hängen davon ab?

V1-Kandidaten:

- LLMs
- Context Windows
- Embeddings
- Tool Calling
- Structured Outputs
- Memory
- Evaluation

### Patterns

Patterns beschreiben wiederverwendbare Lösungsstrukturen.

Die bestehende AI Agent Pattern Landscape bleibt der Kern dieses Bereichs. Die vorhandenen Domänen bleiben in V1 erhalten:

- Denken
- Ablauf
- Zusammenarbeit
- Systembetrieb

Langfristig wird geprüft, welche Systembetrieb-Einträge eher Architecture, Governance oder Tooling Compatibility zugeordnet werden sollten. Diese Migration erfolgt kuratiert und nicht als Big Bang.

### Architecture

Architecture beschreibt Systemdesign, Runtime-Mechanik und produktionsrelevante Betriebsfähigkeit.

Sie beantwortet:

- Wie werden AI-Komponenten zu robusten Systemen zusammengesetzt?
- Wo liegen Service Boundaries?
- Wie werden State, Orchestration, Observability, Reliability und Cost kontrolliert?

V1-Kandidaten:

- Service Boundaries
- State Management
- Orchestration
- Observability
- Reliability
- Cost Control
- Scalability

### Governance

Governance beschreibt Kontroll-, Risiko-, Nachweis- und Compliance-Perspektiven für AI-Systeme.

Governance wird in Subdomänen geschnitten, damit sie nicht zu einem Sammelbecken wird.

V1-Struktur:

- AI Security
  - Prompt Injection
- Privacy & Data Protection
  - DSGVO / GDPR
  - PII Handling
- Regulation & Compliance
  - EU AI Act
- Auditability & Accountability
  - Audit Trails
- Human Oversight
  - Approval
  - Escalation
  - Review

Human Approval ist dabei kein festes Einzelthema nur in Governance. Je nach Kontext kann es Pattern, Architecture Concern oder Governance Control sein.

### Decision Guides

Decision Guides sind der Premium Layer des Atlas. Sie übersetzen Wissen in Architekturentscheidungen.

Sie beantworten:

- Welche Entscheidung steht an?
- Welche Optionen gibt es?
- Welche Kräfte und Trade-offs bestimmen die Entscheidung?
- Was ist die Default-Empfehlung und wann gilt sie nicht?

V1-Guides:

- Single Agent vs Multi-Agent
- RAG vs GraphRAG
- Workflow vs Autonomous Agents

### Reference Architectures

Reference Architectures zeigen realistische Systemkompositionen.

Sie sind keine generischen Use-Case-Tutorials. Sie verbinden Foundations, Patterns, Architecture, Governance, Implementation Lab und Tooling Compatibility zu nachvollziehbaren Architekturansichten.

V1-Kandidaten:

- Coding Agent Reference Architecture
- Research Assistant Reference Architecture

## Capability Layer

### Implementation Lab

Das bestehende `code/`-Verzeichnis wird als Implementation Lab verstanden.

Rolle:

- ausführbare Proofs für ausgewählte Patterns und Architekturmechanismen
- kleine, fokussierte Demos statt monolithischer Agentenplattform
- hilfreicher Offline- oder Dry-Run-Modus ohne API Key

Nicht jedes Atlas Item braucht Code. Manche Themen brauchen Diagramme, Failure Modes, Checklisten oder Decision Matrices statt einer Demo.

### Tooling Compatibility

Tooling ist keine Hauptnavigation.

Frameworks und Tools werden als unterstützende Dimension an Items geführt, zum Beispiel:

- native Unterstützung
- gut modellierbar
- nur custom / indirekt
- unklar oder nicht sinnvoll

Ziel ist Architekturorientierung, kein Framework-Wettbewerb.

## Bestehende Assets und Zielrollen

| Bestehendes Asset | Zielrolle im AI Systems Atlas |
| --- | --- |
| `docs/ai-agent-pattern-landscape.md` | Canonical source für Patterns |
| `docs/ai-agen-pattern-landscape.png` | bestehende visuelle Landkarte |
| `webapp/src/features/landscape/` | bestehender Patterns-Bereich |
| `PatternExplorer` | wiederverwendbares Explorer-Modell |
| `DecisionGuide` | Grundlage für Decision Guides |
| `FrameworkTable` | spätere Tooling Compatibility View |
| `code/` | Implementation Lab |
| `presentation/` | Kommunikationsartefakt, nicht Produktdomain |
| `README.md` | späterer Einstieg in Produktmodell und Repo-Rollen |

## Wiederverwendung

Übernehmen:

- bestehende Pattern-Domänen
- Pattern Explorer
- Pattern Detail View
- Compare-Funktion
- Decision-Heuristik als UX-Idee
- Infografik
- Python-Demos mit Offline-Fallback
- Atomic-Design-Struktur der Webapp

Refactoren:

- Systembetrieb-Einträge auf Architecture, Governance und Tooling Compatibility prüfen
- Framework-Mapping in Tooling Compatibility überführen
- Pattern-spezifisches Schema langfristig in ein Atlas-Content-Modell einbetten
- Startseite von Pattern-Landingpage zu Atlas Overview entwickeln

Nicht übernehmen:

- Repo-Struktur als Produktnavigation
- Slides als Produktbereich
- References als Produktbereich
- Tooling als prominenter Hauptbereich

## Minimaler Content Model Ansatz

V1 startet mit einem kleinen gemeinsamen Modell.

Universal Core:

- title
- type
- summary
- whyItMatters
- tradeoffs
- failureModes
- related

Spezialisierung Pattern:

- domain
- useWhen
- avoidWhen
- structure
- codeDemoSlug

Spezialisierung Foundation:

- definition
- architectureImplications
- commonMisconceptions

Spezialisierung Architecture Topic:

- systemForces
- designOptions
- operationalSignals

Spezialisierung Governance Topic:

- subdomain
- risk
- controls
- evidence

Spezialisierung Decision Guide:

- question
- options
- criteria
- defaultRecommendation
- exceptions

Spezialisierung Reference Architecture:

- scenario
- systemContext
- components
- keyDecisions
- relevantPatterns
- governanceConcerns
- implementationLinks

## V1 Scope

V1 enthält:

- Atlas-Reframing
- bestehende Pattern Landscape
- 5 bis 8 Foundations
- 5 bis 8 Architecture Topics
- 3 bis 5 Governance Topics
- 3 Decision Guides
- 2 Reference Architectures
- Implementation Lab als verlinkte Capability
- Tooling Compatibility als Metadimension

V1 enthält nicht:

- neues Framework-Verzeichnis
- große Tool-Vergleiche
- vollständige Governance-Enzyklopädie
- viele Reference Architectures
- Blog-System
- umfassendes CMS
- UI-Rewrite
- vollständige Migration aller Patterns in ein neues Schema

## Phasenplan

### Phase 0: Produktmodell einfrieren

Ziel:

- Namen, Domänen, Bounded Contexts und V1-Scope finalisieren.

Output:

- dieses Produktarchitektur-Dokument

Stop-Kriterium:

- keine neue Domain ohne Entfernen, Zusammenlegen oder klaren Capability-Layer-Status einer bestehenden Domain

### Phase 1: Asset Mapping dokumentieren

Ziel:

- bestehende Dateien, Features und Inhalte auf das neue Modell mappen.

Output:

- Mapping zwischen Repo-Artefakten und Produktrollen

Stop-Kriterium:

- jedes bestehende Asset hat genau eine primäre Rolle

### Phase 2: Content Model minimal definieren

Ziel:

- Universal Core und Spezialfelder pro Item-Typ definieren.

Output:

- schlankes Atlas-Content-Modell

Stop-Kriterium:

- kein Item-Typ bekommt mehr Felder als für V1 nötig

### Phase 3: Information Architecture vorbereiten

Ziel:

- Zielnavigation und Inhaltsbeziehungen der Webapp beschreiben.

Output:

- Target IA und mögliche Routenstruktur

Stop-Kriterium:

- bestehender Pattern Explorer bleibt als Kernfeature erhalten

### Phase 4: V1-Content kuratieren

Ziel:

- wenige, starke Inhalte für Foundations, Architecture, Governance, Decision Guides und Reference Architectures erstellen.

Output:

- kuratierter V1-Content

Stop-Kriterium:

- Qualität vor Vollständigkeit

### Phase 5: Webapp evolutionär umbauen

Ziel:

- Atlas Overview ergänzen und bestehende Landscape in das größere Modell einbetten.

Output:

- Webapp wirkt wie AI Systems Atlas, ohne bestehende Pattern-Funktionalität zu verlieren

Stop-Kriterium:

- kein Rewrite und keine Entfernung funktionierender Bestandteile ohne explizite Entscheidung

### Phase 6: Implementation Lab anbinden

Ziel:

- ausgewählte Atlas Items mit passenden Demos verbinden.

Output:

- semantische Links zwischen Wissenseinträgen und Demo-Slugs

Stop-Kriterium:

- nicht jedes Item braucht Code

## Anti-Scope-Regeln

- Kein neues Thema ohne klare Architekturentscheidung, die dadurch besser wird.
- Kein Tooling-Content ohne Bezug zu Pattern, Architecture Topic oder Decision Guide.
- Keine Foundation als generisches Tutorial schreiben.
- Keine Reference Architecture als bloßen Use Case beschreiben.
- Governance immer einer Subdomäne zuordnen.
- Bestehende Pattern-Funktionalität nicht während des Reframings beschädigen.
- Kein Big-Bang-Refactor.
- Keine Vollständigkeit vor Kohärenz.

