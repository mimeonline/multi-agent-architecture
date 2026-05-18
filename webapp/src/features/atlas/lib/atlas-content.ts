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
    description: "Grundbausteine wie Context, Tool Calling, Memory und Evaluation verständlich einordnen.",
    role: "Bausteine verstehen",
    href: "/foundations",
    icon: Blocks,
  },
  {
    title: "Patterns",
    description: "Wiederverwendbare Lösungsmuster für typische Aufgaben in AI-Systemen.",
    role: "Lösungen strukturieren",
    href: "/patterns",
    icon: Network,
  },
  {
    title: "Architecture",
    description: "Systemgrenzen, Zustand, Ablaufsteuerung, Beobachtbarkeit, Zuverlässigkeit und Kosten.",
    role: "Systeme entwerfen",
    href: "/architecture",
    icon: GitBranch,
  },
  {
    title: "Governance",
    description: "Sicherheit, Datenschutz, EU AI Act, Nachvollziehbarkeit und menschliche Kontrolle.",
    role: "Risiken kontrollieren",
    href: "/governance",
    icon: ShieldCheck,
  },
  {
    title: "Decision Guides",
    description: "Entscheidungshilfen mit Optionen, Kriterien und pragmatischen Empfehlungen.",
    role: "Abwägungen klären",
    href: "/decision-guides",
    icon: Compass,
  },
  {
    title: "Reference Architectures",
    description: "Konkrete Beispielarchitekturen für Coding Agents und Research Assistants.",
    role: "Kontext anwenden",
    href: "/reference-architectures",
    icon: Landmark,
  },
];

export const foundationItems: AtlasItem[] = [
  {
    title: "LLMs",
    type: "Foundation",
    tag: "Modellgrenze",
    summary: "LLMs erzeugen Antworten auf Basis von Wahrscheinlichkeiten. Sie sind keine klassischen Dienste mit immer gleichem Ergebnis.",
    explanation: "Ein LLM ist der Teil des Systems, der Sprache versteht, Antworten formuliert, Muster erkennt und Vorschläge erzeugt. Es wirkt intelligent, bleibt aber ein Modell mit Unsicherheit.",
    projectQuestion: "Welches Modell ist gut genug, schnell genug, zuverlässig genug und bezahlbar genug für diesen konkreten Zweck?",
    example: "Ein Support-Assistent nutzt ein LLM, um eine Kundenfrage zu verstehen und eine Antwort vorzuschlagen. Ob die Antwort fachlich stimmt, muss das System trotzdem prüfen oder absichern.",
    whyItMatters: "Architektur muss Unsicherheit, Kosten, Antwortzeit, Modellwechsel und Prüfung der Ergebnisse von Anfang an berücksichtigen.",
    tradeoffs: "Sehr flexible Antworten, aber begrenzte Steuerbarkeit und schwankende Laufzeitkosten.",
    failureModes: ["Halluzination", "Instabile Klassifikation", "Nicht reproduzierbare Antworten"],
    related: ["Strukturierte Antworten", "Qualitätsprüfung", "Kostenkontrolle"],
  },
  {
    title: "Context Windows",
    type: "Foundation",
    tag: "Arbeitskontext",
    summary: "Das Context Window ist ein flüchtiger Arbeitsraum, nicht automatisch Memory oder Datenbank.",
    explanation: "Das Context Window ist alles, was das Modell in einer Anfrage gerade sehen kann: Systemanweisungen, Nutzerfrage, Dokumentauszüge, Zwischenergebnisse und Tool-Rückgaben.",
    projectQuestion: "Welche Informationen müssen wirklich in die Anfrage, und welche sollten besser gesucht, zusammengefasst oder weggelassen werden?",
    example: "Ein Vertragsassistent braucht nur die relevanten Klauseln, nicht den gesamten Datenraum. Zu viel Kontext kann wichtige Hinweise verdrängen und die Antwort schlechter machen.",
    whyItMatters: "Context-Design entscheidet, welche Informationen ein AI-System während einer Anfrage wirklich nutzen kann.",
    tradeoffs: "Mehr Kontext erhöht Reichweite, aber auch Kosten, Latenz und Ablenkungsrisiko.",
    failureModes: ["Kontext driftet vom Ziel weg", "Verdrängte Anforderungen", "Zu langer Prompt"],
    related: ["Memory", "Wissenssuche", "Kostenkontrolle"],
  },
  {
    title: "Tool Calling",
    type: "Foundation",
    tag: "Systemaktionen",
    summary: "Tool Calling verbindet Modellentscheidungen mit echten Systemaktionen über strukturierte Schnittstellen.",
    explanation: "Tool Calling bedeutet, dass das Modell nicht nur Text erzeugt, sondern Funktionen anstoßen kann: Suche, Datenbankabfrage, Ticketanlage, Kalenderänderung oder Code-Ausführung.",
    projectQuestion: "Welche Aktionen darf das Modell selbst auslösen, welche brauchen Prüfung, und welche sind zu riskant für Automatisierung?",
    example: "Ein Reiseassistent darf verfügbare Flüge suchen. Eine Buchung sollte er aber erst nach klarer Nutzerbestätigung und Preisprüfung auslösen.",
    whyItMatters: "Jeder Tool-Aufruf braucht klare Regeln für Berechtigung, Prüfung der Eingaben und mögliche Nebenwirkungen.",
    tradeoffs: "Mehr Handlungsfähigkeit, aber höhere Anforderungen an Sicherheit und Fehlerbehandlung.",
    failureModes: ["Falsches Tool", "Unsichere Argumente", "Unkontrollierte Nebenwirkung"],
    related: ["ReAct", "Werkzeuge mit Berechtigungen", "Prompt Injection"],
  },
  {
    title: "Structured Outputs",
    type: "Foundation",
    tag: "Antwortformat",
    summary: "Strukturierte Outputs machen Modellantworten für nachgelagerte Systeme validierbar.",
    explanation: "Strukturierte Outputs legen fest, in welcher Form das Modell antworten soll, zum Beispiel als JSON mit Pflichtfeldern statt als freier Fließtext.",
    projectQuestion: "Welches Antwortformat braucht das nächste System, damit es zuverlässig prüfen, speichern, routen oder weiterarbeiten kann?",
    example: "Ein Klassifikationsschritt liefert nicht nur 'klingt dringend', sondern ein Feld `priority` mit erlaubten Werten wie `low`, `medium` oder `high`.",
    whyItMatters: "Ohne Output-Verträge bleibt Integration fragil, besonders bei Workflows, Routing und Automation.",
    tradeoffs: "Bessere Integration, aber zusätzlicher Aufwand für Schema-Design, Validierung und Fehlerfälle.",
    failureModes: ["Antwort passt nicht zum Schema", "Formal gültiger Unsinn", "Unbemerkte Ersatzlogik"],
    related: ["Antwortvalidierung", "Workflow-Steuerung", "Qualitätsprüfung"],
  },
  {
    title: "Memory",
    type: "Foundation",
    tag: "Gespeicherter Zustand",
    summary: "Memory ist bewusst modellierter Zustand, nicht einfach ein langer Chatverlauf.",
    explanation: "Memory beschreibt, was ein AI-System über eine einzelne Anfrage hinaus behalten darf: Präferenzen, Fakten, Zusammenfassungen, Entscheidungen oder Arbeitsfortschritt.",
    projectQuestion: "Was darf gespeichert werden, wie lange gilt es, wer darf es sehen, und wie kann es korrigiert oder gelöscht werden?",
    example: "Ein Lernassistent merkt sich, dass eine Person lieber kurze Übungen bekommt. Er sollte aber keine sensiblen Daten ungefragt dauerhaft speichern.",
    whyItMatters: "Produktionssysteme brauchen klare Regeln für Speicherung, Verdichtung, Zugriff, Löschung und Herkunft.",
    tradeoffs: "Mehr Personalisierung und Kontinuität, aber höhere Anforderungen an Datenschutz, Aktualität und Zustandsverwaltung.",
    failureModes: ["Veraltete Fakten", "Unerlaubte Speicherung", "Falsche Erinnerung"],
    related: ["Zustandsverwaltung", "Datenschutz", "Graph Memory"],
  },
  {
    title: "Evaluation",
    type: "Foundation",
    tag: "Qualitätsprüfung",
    summary: "Evaluation macht Qualität, Regressionen und Risikoannahmen beobachtbar.",
    explanation: "Evaluation prüft, ob ein AI-System zuverlässig besser wird oder ob Änderungen unbemerkt Qualität, Sicherheit oder Kosten verschlechtern.",
    projectQuestion: "Woran erkennen wir, ob das System gute Antworten liefert, Risiken vermeidet und nach Änderungen nicht schlechter geworden ist?",
    example: "Vor einem Modellwechsel laufen typische Nutzerfragen gegen alte und neue Version. Das Team vergleicht Trefferquote, Halluzinationen, Kosten und Antwortzeit.",
    whyItMatters: "AI-Systeme lassen sich nicht zuverlässig betreiben, wenn Qualität nur im Demo-Gefühl sichtbar wird.",
    tradeoffs: "Bessere Steuerbarkeit, aber Aufwand für Testdaten, Metriken und Review-Prozesse.",
    failureModes: ["Scheingenauigkeit", "Schwache Testsets", "Verzerrte Modellbewertung"],
    related: ["Beobachtbarkeit", "Modellgestützte Bewertung", "Prüfprotokolle"],
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
  { value: "4", label: "Wissensbereiche", hint: "Grundlagen, Muster, Architektur und Governance" },
  { value: "30+", label: "Architekturthemen", hint: "Bausteine, Entscheidungen, Risiken und Beispiele" },
  { value: "25+", label: "Code-Demos", hint: "Denken, Ablauf, Zusammenarbeit und Betrieb" },
  { value: "100%", label: "Open Source", hint: "MIT-lizenziert auf GitHub, offen erweiterbar" },
];

export const atlasSteps = [
  {
    step: "01",
    title: "Grundlagen verstehen",
    description: "Starte mit LLMs, Context, Tool Calling, Memory und Evaluation. Erst die Bausteine, dann das Zusammenspiel.",
    icon: Layers,
    href: "/foundations",
  },
  {
    step: "02",
    title: "Lösungsmuster auswählen",
    description: "Nutze die Pattern-Übersicht, um passende Strukturen für Denken, Abläufe und Zusammenarbeit zu finden.",
    icon: Workflow,
    href: "/patterns",
  },
  {
    step: "03",
    title: "Architektur entwerfen",
    description: "Lege Systemgrenzen, Zustand, Ablaufsteuerung, Beobachtbarkeit und Kosten bewusst fest.",
    icon: GitBranch,
    href: "/architecture",
  },
  {
    step: "04",
    title: "Governance verankern",
    description: "Verbinde Sicherheit, Datenschutz, EU AI Act, Prüfprotokolle und menschliche Kontrolle von Anfang an mit der Architektur.",
    icon: ShieldCheck,
    href: "/governance",
  },
];

export const atlasPersonas = [
  {
    title: "AI / Software Architects",
    icon: Briefcase,
    description: "Eine klare Sprache für Architekturentscheidungen, unabhängig von einzelnen Frameworks oder Demos.",
    accent: "denken" as const,
  },
  {
    title: "Engineering Teams",
    icon: Code2,
    description: "Wiederverwendbare Lösungsmuster, Beispielarchitekturen und ausführbare Python-Demos.",
    accent: "ablauf" as const,
  },
  {
    title: "Tech Leads & PMs",
    icon: Users,
    description: "Verständliche Abwägungen, typische Risiken und Governance-Hinweise für belastbare Roadmap-Diskussionen.",
    accent: "system" as const,
  },
  {
    title: "Lernende & Researcher",
    icon: GraduationCap,
    description: "Ein strukturierter Lernweg durch AI-Konzepte mit Quellenverweisen und einem konsistenten mentalen Modell.",
    accent: "zusammen" as const,
  },
];

export const atlasQuote = {
  text: "Ein Lösungsmuster ist nicht der Code selbst, sondern die wiederverwendbare Architekturentscheidung dahinter.",
  attribution: "Leitgedanke des Atlas",
  context: "Erst verstehen, dann implementieren, dann passende Werkzeuge wählen.",
};

export const atlasFaq = [
  {
    question: "Was unterscheidet den Atlas von einem Tool-Katalog?",
    answer:
      "Der Atlas ist eine Landkarte für Architekturentscheidungen, kein reiner Tool-Vergleich. Frameworks werden dort eingeordnet, wo sie helfen, aber sie bestimmen nicht die Struktur.",
  },
  {
    question: "Für welche AI-Systeme ist der Atlas gedacht?",
    answer:
      "Für Systeme, die LLMs mit Werkzeugen, Abläufen oder Produkten verbinden. Das kann ein einfacher Assistant sein oder ein produktives Multi-Agent-System. Der Fokus liegt auf robusten Architekturen jenseits von Prototypen.",
  },
  {
    question: "Brauche ich Vorwissen, um zu starten?",
    answer:
      "Wenn du Begriffe wie Prompting und Tool Calling grob kennst, kannst du sofort einsteigen. Die Grundlagen bauen das mentale Modell auf, Lösungsmuster liefern bewährte Strukturen und Referenzarchitekturen zeigen vollständige Systembeispiele.",
  },
  {
    question: "Wie aktuell sind die Inhalte?",
    answer:
      "Der Atlas ist ein lebendiges Repository auf GitHub. Lösungsmuster, Grundlagen und Governance werden weiter ausgebaut. Das Implementation Lab zeigt Konzepte mit lauffähigem Python-Code und hilfreichem Offline-Fallback.",
  },
  {
    question: "Welche Rolle spielen die Code-Demos?",
    answer:
      "Sie sind Belege, nicht der Mittelpunkt. Jede Demo zeigt ein Lösungsmuster oder einen Betriebsmechanismus in kleiner Form, damit du Theorie und Praxis verbinden kannst, ohne einen ganzen Stack zu übernehmen.",
  },
];

export const capabilityNotes = [
  {
    title: "Implementation Lab",
    icon: BookOpen,
    text: "Die Python-Demos zeigen ausgewählte Lösungsmuster und Betriebsmechanismen mit hilfreichem Offline-Fallback.",
    href: "/implementation-lab",
  },
  {
    title: "Tooling Compatibility",
    icon: Compass,
    text: "Werkzeuge und Frameworks werden nach ihrem architektonischen Nutzen eingeordnet, nicht nach Marken sortiert.",
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
