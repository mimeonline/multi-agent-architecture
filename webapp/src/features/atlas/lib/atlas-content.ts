import {
  Blocks,
  BookOpen,
  Compass,
  GitBranch,
  Landmark,
  Network,
  ShieldCheck,
  Layers,
  Workflow,
  Briefcase,
  Code2,
  GraduationCap,
  Users,
} from "lucide-react";
import type {
  AtlasDomain,
  AtlasItem,
  ImplementationLabGroup,
  ReferenceArchitecture,
  ToolingCompatibility,
} from "../types/atlas";

export const atlasDomains: AtlasDomain[] = [
  {
    title: "Foundations",
    description: "Architecture Primitives wie Context, Tool Calling, Memory und Evaluation.",
    role: "Bausteine verstehen",
    href: "/foundations",
    icon: Blocks,
  },
  {
    title: "Patterns",
    description: "Die bestehende Agent Pattern Landscape als wiederverwendbare Lösungsstruktur.",
    role: "Lösungsformen wählen",
    href: "/patterns",
    icon: Network,
  },
  {
    title: "Architecture",
    description: "Systemgrenzen, State, Orchestration, Observability, Reliability und Cost.",
    role: "Systeme entwerfen",
    href: "/architecture",
    icon: GitBranch,
  },
  {
    title: "Governance",
    description: "AI Security, Datenschutz, EU AI Act, Auditability und Human Oversight.",
    role: "Risiken kontrollieren",
    href: "/governance",
    icon: ShieldCheck,
  },
  {
    title: "Decision Guides",
    description: "Architekturentscheidungen mit Optionen, Kriterien und Default-Empfehlungen.",
    role: "Trade-offs klären",
    href: "/decision-guides",
    icon: Compass,
  },
  {
    title: "Reference Architectures",
    description: "Konkrete Systemkompositionen für Coding Agents und Research Assistants.",
    role: "Kontext anwenden",
    href: "/reference-architectures",
    icon: Landmark,
  },
];

export const foundationItems: AtlasItem[] = [
  {
    title: "LLMs",
    type: "Foundation",
    tag: "Model Boundary",
    summary: "LLMs sind probabilistische Reasoning- und Generierungsdienste, keine deterministischen Business Services.",
    whyItMatters: "Architektur muss Unsicherheit, Kosten, Latenz, Modellwechsel und Validierung als normale Systemkräfte behandeln.",
    tradeoffs: "Hohe Ausdruckskraft gegen begrenzte Steuerbarkeit und schwankende Laufzeitkosten.",
    failureModes: ["Halluzination", "Instabile Klassifikation", "Nicht reproduzierbare Outputs"],
    related: ["Structured Outputs", "Evaluation", "Cost Control"],
  },
  {
    title: "Context Windows",
    type: "Foundation",
    tag: "State Boundary",
    summary: "Das Context Window ist ein flüchtiger Arbeitsraum, nicht automatisch Memory oder Datenbank.",
    whyItMatters: "Context-Design entscheidet, welche Informationen ein AI-System wirklich zur Laufzeit nutzen kann.",
    tradeoffs: "Mehr Kontext erhöht Reichweite, aber auch Kosten, Latenz und Ablenkungsrisiko.",
    failureModes: ["Context Drift", "Verdrängte Anforderungen", "Prompt-Bloat"],
    related: ["Memory", "Retrieval Patterns", "Cost Control"],
  },
  {
    title: "Tool Calling",
    type: "Foundation",
    tag: "Action Boundary",
    summary: "Tool Calling verbindet Modellentscheidungen mit echten Systemaktionen über strukturierte Schnittstellen.",
    whyItMatters: "Jeder Tool-Aufruf erzeugt eine Trust Boundary zwischen Sprache, Berechtigung, Validierung und Nebenwirkung.",
    tradeoffs: "Mehr Handlungsfähigkeit gegen höhere Sicherheits- und Fehlerbehandlungsanforderungen.",
    failureModes: ["Falsches Tool", "Unsichere Argumente", "Unkontrollierte Nebenwirkung"],
    related: ["ReAct", "Permission Scoped Tools", "Prompt Injection"],
  },
  {
    title: "Structured Outputs",
    type: "Foundation",
    tag: "Contract Boundary",
    summary: "Strukturierte Outputs machen Modellantworten für nachgelagerte Systeme validierbar.",
    whyItMatters: "Ohne Output-Verträge bleibt Integration fragil, besonders bei Workflows, Routing und Automation.",
    tradeoffs: "Bessere Integration gegen Schema-Design, Validierungslogik und mögliche Expressivitätsgrenzen.",
    failureModes: ["Schema-Mismatch", "Semantisch gültiger Unsinn", "Silent Fallbacks"],
    related: ["Output Validation", "Workflow Orchestration", "Evaluation"],
  },
  {
    title: "Memory",
    type: "Foundation",
    tag: "Continuity Boundary",
    summary: "Memory ist bewusst modellierter Zustand, nicht einfach ein langer Chatverlauf.",
    whyItMatters: "Produktionssysteme brauchen klare Regeln für Speicherung, Verdichtung, Zugriff, Löschung und Herkunft.",
    tradeoffs: "Personalisierung und Kontinuität gegen Datenschutz, Drift und komplexe State-Verwaltung.",
    failureModes: ["Veraltete Fakten", "Unerlaubte Speicherung", "Falsche Erinnerung"],
    related: ["State Management", "Privacy & Data Protection", "Graph Memory"],
  },
  {
    title: "Evaluation",
    type: "Foundation",
    tag: "Quality Boundary",
    summary: "Evaluation macht Qualität, Regressionen und Risikoannahmen beobachtbar.",
    whyItMatters: "AI-Systeme lassen sich nicht zuverlässig betreiben, wenn Qualität nur im Demo-Gefühl sichtbar wird.",
    tradeoffs: "Bessere Steuerbarkeit gegen Aufwand für Testdaten, Metriken und Review-Prozesse.",
    failureModes: ["Scheingenauigkeit", "Schwache Testsets", "LLM-as-Judge Bias"],
    related: ["Observability", "LLM-as-Judge", "Audit Trails"],
  },
];

export const architectureItems: AtlasItem[] = [
  {
    title: "Service Boundaries",
    type: "Architecture",
    tag: "System Design",
    summary: "AI-Fähigkeiten brauchen klare Grenzen zwischen UI, Orchestration, Tools, Daten und Policies.",
    whyItMatters: "Unklare Boundaries machen Agenten schwer testbar, schwer austauschbar und riskant zu betreiben.",
    tradeoffs: "Saubere Trennung gegen mehr Schnittstellen und explizite Verträge.",
    failureModes: ["Prompt enthält Business-Logik", "Tool-Zugriff ohne Policy", "Modellwechsel bricht Verhalten"],
    related: ["Tool Calling", "Structured Outputs", "AI Security"],
  },
  {
    title: "State Management",
    type: "Architecture",
    tag: "Runtime",
    summary: "State umfasst Run-Zustand, User-Kontext, Memory, Checkpoints und externe Systemdaten.",
    whyItMatters: "Robuste AI-Systeme brauchen expliziten Zustand, besonders bei langen Workflows und Human Oversight.",
    tradeoffs: "Fortsetzbarkeit und Transparenz gegen Konsistenz- und Datenschutzaufwand.",
    failureModes: ["Lost Progress", "Stale State", "State Leakage"],
    related: ["Memory", "Checkpointing", "Human Oversight"],
  },
  {
    title: "Orchestration",
    type: "Architecture",
    tag: "Control Flow",
    summary: "Orchestration entscheidet, ob Arbeit deterministisch, agentisch, graphbasiert oder ereignisgetrieben läuft.",
    whyItMatters: "Die Orchestration bestimmt Kontrollierbarkeit, Debugging, Parallelität und Recovery.",
    tradeoffs: "Autonomie und Flexibilität gegen Nachvollziehbarkeit und Kostenkontrolle.",
    failureModes: ["Endlose Loops", "Unklare Ownership", "Schwer reproduzierbare Fehler"],
    related: ["Workflow vs Autonomous Agents", "LangGraph", "Supervisor"],
  },
  {
    title: "Observability",
    type: "Architecture",
    tag: "Operations",
    summary: "Observability macht Prompts, Tool-Aufrufe, Latenz, Kosten, Fehler und Qualitätsindikatoren sichtbar.",
    whyItMatters: "Ohne Traces und Events bleibt ein AI-System nach dem ersten Nutzerkontakt schwer erklärbar.",
    tradeoffs: "Bessere Diagnose gegen Telemetrieaufwand und sensible Trace-Daten.",
    failureModes: ["Black-Box Incidents", "Unmessbare Regression", "PII in Traces"],
    related: ["Distributed Tracing", "Audit Trails", "Evaluation"],
  },
  {
    title: "Cost Control",
    type: "Architecture",
    tag: "Economics",
    summary: "Cost Control behandelt Tokens, Modellwahl, Caching, Parallelität und Abbruchbedingungen als Designparameter.",
    whyItMatters: "Agentische Systeme können Kosten dynamisch vervielfachen, wenn Loops und Fan-out unkontrolliert bleiben.",
    tradeoffs: "Qualität und Robustheit gegen Budget, Latenz und Nutzererwartung.",
    failureModes: ["Token-Spikes", "Unbounded Fan-out", "Zu teures Standardmodell"],
    related: ["Context Windows", "ReWOO", "Workflow Orchestration"],
  },
];

export const governanceItems: AtlasItem[] = [
  {
    title: "Prompt Injection",
    type: "Governance",
    tag: "AI Security",
    summary: "Prompt Injection ist ein Angriff auf die Instruktions- und Tool-Trust-Boundary eines AI-Systems.",
    whyItMatters: "Sobald Modelle Tools, Daten oder Aktionen steuern, wird Injection zu einem Systemrisiko.",
    tradeoffs: "Mehr Autonomie gegen stärkere Isolation, Validierung und Least-Privilege-Design.",
    failureModes: ["Instruction Override", "Data Exfiltration", "Unsafe Tool Use"],
    related: ["Tool Calling", "Permission Scoped Tools", "Service Boundaries"],
  },
  {
    title: "PII Handling",
    type: "Governance",
    tag: "Privacy & Data Protection",
    summary: "PII Handling operationalisiert DSGVO-Anforderungen in Prompts, Memory, Retrieval, Logs und Traces.",
    whyItMatters: "AI-Systeme verarbeiten personenbezogene Daten oft quer über mehrere technische Schichten.",
    tradeoffs: "Personalisierung und Supportqualität gegen Minimierung, Löschung und Zweckbindung.",
    failureModes: ["PII in Traces", "Unklare Rechtsgrundlage", "Memory ohne Löschpfad"],
    related: ["Memory", "Observability", "Audit Trails"],
  },
  {
    title: "EU AI Act",
    type: "Governance",
    tag: "Regulation & Compliance",
    summary: "Der EU AI Act verlangt eine risikobasierte Einordnung und passende Pflichten für AI-Systeme.",
    whyItMatters: "Architektur muss früh klären, ob ein System nur assistiert, entscheidet oder regulierte Risiken erzeugt.",
    tradeoffs: "Compliance-Sicherheit gegen Dokumentations-, Kontroll- und Prozessaufwand.",
    failureModes: ["Falsche Risikoklasse", "Fehlende Nachweise", "Unklare Provider-Deployer-Rolle"],
    related: ["Auditability", "Human Oversight", "Reference Architectures"],
  },
  {
    title: "Audit Trails",
    type: "Governance",
    tag: "Auditability & Accountability",
    summary: "Audit Trails dokumentieren Entscheidungen, Inputs, Tool-Aufrufe, Freigaben und relevante Systemzustände.",
    whyItMatters: "Enterprise-Systeme brauchen nachvollziehbare Evidenz, nicht nur gute Antworten.",
    tradeoffs: "Nachvollziehbarkeit gegen Speicheraufwand, Datenschutzrisiken und Review-Komplexität.",
    failureModes: ["Unvollständige Runs", "Nicht erklärbare Freigaben", "Sensible Logs"],
    related: ["Observability", "Human Oversight", "Evaluation"],
  },
  {
    title: "Human Oversight",
    type: "Governance",
    tag: "Control Mechanism",
    summary: "Human Oversight setzt gezielte Prüf-, Freigabe- und Eskalationspunkte in AI-Workflows.",
    whyItMatters: "Nicht jede riskante Entscheidung sollte autonom laufen, aber nicht jeder Schritt braucht manuelle Kontrolle.",
    tradeoffs: "Kontrolle und Verantwortlichkeit gegen Latenz, Prozesskosten und UX-Reibung.",
    failureModes: ["Rubber Stamping", "Falscher Eskalationspunkt", "Nicht fortsetzbare Workflows"],
    related: ["Human-in-the-loop", "State Management", "EU AI Act"],
  },
];

export const referenceArchitectures: ReferenceArchitecture[] = [
  {
    title: "Coding Agent Reference Architecture",
    scenario: "Ein Agent plant Codeänderungen, nutzt Tools, führt Tests aus und eskaliert riskante Änderungen zur Freigabe.",
    components: ["Planner", "Tool Registry", "Sandbox", "Repository Context", "Test Runner", "Audit Trail"],
    keyDecisions: ["Workflow vs Autonomie", "Tool-Berechtigungen", "Checkpointing", "Test- und Review-Gates"],
    governanceConcerns: ["Prompt Injection über Repo-Inhalte", "Secret Handling", "Nachvollziehbare Tool-Aktionen"],
  },
  {
    title: "Research Assistant Reference Architecture",
    scenario: "Ein Assistant recherchiert Quellen, bewertet Evidenz, synthetisiert Ergebnisse und zeigt Unsicherheiten explizit.",
    components: ["Query Planner", "Retrieval Layer", "Source Store", "Evaluator", "Citation Renderer", "Trace Store"],
    keyDecisions: ["RAG vs GraphRAG", "Source Ranking", "Evaluation", "Cost Control"],
    governanceConcerns: ["Quellenqualität", "Copyright-nahe Ausgabe", "PII in Such- und Trace-Daten"],
  },
];

export const heroStats = [
  { value: "4", label: "Wissensdomänen", hint: "Foundations · Patterns · Architecture · Governance" },
  { value: "30+", label: "Architektur-Items", hint: "Foundations, Architecture, Governance & Decisions" },
  { value: "25+", label: "Pattern-Demos", hint: "Reasoning, Workflow, Collaboration, Runtime" },
  { value: "100%", label: "Open Source", hint: "MIT-lizenziert auf GitHub, offen erweiterbar" },
];

export const atlasSteps = [
  {
    step: "01",
    title: "Foundations verstehen",
    description: "Starte mit LLM-Boundary, Context, Tool Calling, Memory und Evaluation. Erst die Bausteine, dann die Komposition.",
    icon: Layers,
    href: "/foundations",
  },
  {
    step: "02",
    title: "Patterns auswählen",
    description: "Nutze die Pattern Landscape, um Reasoning-, Workflow- und Kollaborationsformen passend zur Aufgabe zu wählen.",
    icon: Workflow,
    href: "/patterns",
  },
  {
    step: "03",
    title: "Architecture entwerfen",
    description: "Definiere Service Boundaries, State, Orchestration, Observability und Cost als bewusste Designentscheidungen.",
    icon: GitBranch,
    href: "/architecture",
  },
  {
    step: "04",
    title: "Governance verankern",
    description: "Verbinde AI Security, Datenschutz, EU AI Act, Audit Trails und Human Oversight von Anfang an mit der Architektur.",
    icon: ShieldCheck,
    href: "/governance",
  },
];

export const atlasPersonas = [
  {
    title: "AI / Software Architects",
    icon: Briefcase,
    description: "Strukturierte Entscheidungssprache für AI-Systeme jenseits einzelner Frameworks oder Demos.",
    accent: "denken" as const,
  },
  {
    title: "Engineering Teams",
    icon: Code2,
    description: "Wiederverwendbare Patterns, Reference Architectures und ausführbare Implementation-Lab-Demos als Belege.",
    accent: "ablauf" as const,
  },
  {
    title: "Tech Leads & PMs",
    icon: Users,
    description: "Verständliche Trade-offs, klare Failure Modes und Governance-Hinweise für tragfähige Roadmap-Diskussionen.",
    accent: "system" as const,
  },
  {
    title: "Lernende & Researcher",
    icon: GraduationCap,
    description: "Architektur-erste Lernreise durch AI-Konzepte mit Quellenverweisen und einem konsistenten mentalen Modell.",
    accent: "zusammen" as const,
  },
];

export const atlasQuote = {
  text: "Patterns sind nicht der Code, sondern die wiederverwendbare Architekturentscheidung dahinter. Wer Pattern und Implementierung verwechselt, baut AI-Systeme auf Treibsand.",
  attribution: "Leitgedanke des Atlas",
  context: "Architecture first. Implementation proves it. Frameworks support it.",
};

export const atlasFaq = [
  {
    question: "Was unterscheidet den Atlas von einem Framework-Katalog?",
    answer:
      "Der Atlas ist eine Landkarte für Architekturentscheidungen, kein Tooling-Vergleich. Frameworks tauchen als unterstützende Metadaten auf, nicht als Taxonomie. So bleibt die Struktur stabil, auch wenn sich der Tool-Markt bewegt.",
  },
  {
    question: "Für welche AI-Systeme ist der Atlas gedacht?",
    answer:
      "Für jedes System, das LLMs in Tools, Workflows oder Produkte integriert. Vom einfachen Tool-using Assistant bis zum produktiven Multi-Agent-System. Der Fokus liegt auf robusten Architekturen jenseits von Prototypen.",
  },
  {
    question: "Brauche ich Vorwissen, um zu starten?",
    answer:
      "Wenn du AI-Konzepte wie Prompting und Tool Calling grob kennst, kannst du sofort einsteigen. Foundations bauen das mentale Modell auf, Patterns liefern bewährte Strukturen, und Reference Architectures zeigen vollständige Systemkompositionen.",
  },
  {
    question: "Wie aktuell sind die Inhalte?",
    answer:
      "Der Atlas ist ein lebendiges Repository auf GitHub. Patterns, Foundations und Governance werden weiter ausgebaut, das Implementation Lab demonstriert die Konzepte mit lauffähigem Python-Code und Offline-Fallback.",
  },
  {
    question: "Welche Rolle spielen die Code-Demos?",
    answer:
      "Sie sind Belege, nicht der Star. Jede Demo zeigt ein Pattern oder eine Runtime-Mechanik in minimaler Form, damit du Theorie und Praxis verbinden kannst — ohne einen ganzen Stack zu adoptieren.",
  },
];

export const capabilityNotes = [
  {
    title: "Implementation Lab",
    icon: BookOpen,
    text: "Die Python-Demos bleiben ausführbare Proofs unter der Theorie. Sie zeigen ausgewählte Patterns und Runtime-Mechaniken mit hilfreichem Offline-Fallback.",
    href: "/implementation-lab",
  },
  {
    title: "Tooling Compatibility",
    icon: Compass,
    text: "Frameworks bleiben unterstützende Metadaten pro Item. Der Atlas organisiert Wissen nach Architekturentscheidungen, nicht nach Toolmarken.",
    href: "/tooling-compatibility",
  },
];

export const implementationLabGroups: ImplementationLabGroup[] = [
  {
    title: "Reasoning Demos",
    description: "Einzelagenten-Patterns für Denken, Planen, Reflexion und Tool-Use.",
    path: "code/src/ai_agent_patterns/demos/denken",
    examples: ["react", "plan-and-execute", "rewoo", "reflexion", "tree-of-thoughts"],
    architectureValue: "Zeigt, wie Reasoning-Verhalten von Orchestration und Runtime getrennt werden kann.",
  },
  {
    title: "Workflow Demos",
    description: "Kontrollfluss, Routing, Parallelisierung, Loops und Evaluator-Optimizer.",
    path: "code/src/ai_agent_patterns/demos/ablauf",
    examples: ["routing", "map-reduce", "loop", "orchestrator-workers", "evaluator-optimizer"],
    architectureValue: "Macht deterministische und semi-deterministische Steuerung sichtbar.",
  },
  {
    title: "Collaboration Demos",
    description: "Koordination mehrerer Agents über Supervisor, Handoff, Debate und Agent Graphs.",
    path: "code/src/ai_agent_patterns/demos/zusammenarbeit",
    examples: ["supervisor", "handoff", "multi-agent-debate", "blackboard", "agents-as-tools"],
    architectureValue: "Hilft, Koordinationskosten und Ownership zwischen Agents realistisch einzuschätzen.",
  },
  {
    title: "Runtime & Governance Demos",
    description: "Memory, Tool Integration, Runtime, Governance, Observability und Evaluation.",
    path: "code/src/ai_agent_patterns/demos/systembetrieb",
    examples: ["function-calling", "audit-trail", "distributed-tracing", "least-privilege-agent", "human-in-the-loop-approval-gate"],
    architectureValue: "Verbindet Pattern-Denken mit Production Concerns wie Tracing, Berechtigungen und Freigaben.",
  },
];

export const toolingCompatibility: ToolingCompatibility[] = [
  {
    tool: "LangGraph",
    level: "Native",
    bestFor: "Graphbasierte Orchestration, State, Checkpointing, Human-in-the-loop und kontrollierte Agent Workflows.",
    watchOut: "Braucht bewusstes State- und Node-Design. Für einfache Prompt Chains oft mehr Struktur als nötig.",
    related: ["Orchestration", "State Management", "Workflow vs Autonomous Agents"],
  },
  {
    tool: "LangChain",
    level: "Composable",
    bestFor: "Tools, Chains, Retrieval, Provider-Integration und schnelle Demos im Implementation Lab.",
    watchOut: "Architekturgrenzen sollten nicht in Chain-Kompositionen verschwinden.",
    related: ["Tool Calling", "Retrieval Patterns", "Implementation Lab"],
  },
  {
    tool: "OpenAI Agents SDK",
    level: "Native",
    bestFor: "Tool-using Agents, Hand-offs, Guardrails und produktnahe Agent Runtime mit hosted Models.",
    watchOut: "Provider-Nähe bewusst als Architekturentscheidung behandeln.",
    related: ["ReAct", "Tool Calling", "Least Privilege Agent"],
  },
  {
    tool: "CrewAI",
    level: "Composable",
    bestFor: "Rollenbasierte Multi-Agent-Kollaboration und explorative Team-Workflows.",
    watchOut: "Nicht jede Aufgabe profitiert von mehreren Rollen. Koordinationskosten früh prüfen.",
    related: ["Supervisor", "Multi-Agent Collaboration", "Single Agent vs Multi-Agent"],
  },
  {
    tool: "PydanticAI",
    level: "Composable",
    bestFor: "Typed Agent Interfaces, strukturierte Outputs und Python-nahe Integrationslogik.",
    watchOut: "Nicht als komplette Runtime missverstehen, wenn langlebiger State oder komplexe Graphen nötig sind.",
    related: ["Structured Outputs", "Service Boundaries", "Evaluation"],
  },
  {
    tool: "OpenTelemetry",
    level: "Supporting",
    bestFor: "Vendor-neutrale Traces, Metriken und Logs für AI-Systeme und Tool-Aufrufe.",
    watchOut: "Semantische AI-Events müssen sauber modelliert werden, sonst bleiben Traces nur Infrastrukturrauschen.",
    related: ["Observability", "Audit Trails", "Cost Control"],
  },
  {
    tool: "Neo4j",
    level: "Supporting",
    bestFor: "Graph Retrieval, Beziehungen, Herkunftspfade und Knowledge Graph Memory.",
    watchOut: "GraphRAG lohnt nur, wenn Beziehungen und Traversal-Fragen echten Mehrwert bringen.",
    related: ["GraphRAG", "Graph Memory", "RAG vs GraphRAG"],
  },
  {
    tool: "Qdrant",
    level: "Supporting",
    bestFor: "Vector Search, semantische Suche und Retrieval-Layer mit klaren Filter- und Payload-Modellen.",
    watchOut: "Vector Search ersetzt keine Information Architecture und keine Evaluation.",
    related: ["Embeddings", "Retrieval Patterns", "Evaluation"],
  },
];
