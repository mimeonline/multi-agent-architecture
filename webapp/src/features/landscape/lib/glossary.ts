import type { GlossaryEntry } from "../types/pattern";

export const glossary: Record<string, GlossaryEntry> = {
  ReAct: {
    term: "ReAct",
    full: "Reason + Act",
    definition:
      "Schleife aus Reasoning-Schritt, Tool-Aufruf und Beobachtung. Der Agent entscheidet anhand der Observation, was als Nächstes passiert.",
  },
  ReWOO: {
    term: "ReWOO",
    full: "Reasoning Without Observation",
    definition:
      "Tool-Aufrufe werden vorab geplant und gesammelt ausgewertet, statt iterativ pro Schritt zu beobachten. Senkt LLM-Calls.",
  },
  ToT: {
    term: "ToT",
    full: "Tree of Thoughts",
    definition:
      "Mehrere Reasoning-Pfade werden als Baum exploriert und bewertet, bevor ein Weg weiterverfolgt wird.",
  },
  RAG: {
    term: "RAG",
    full: "Retrieval-Augmented Generation",
    definition:
      "Vor der Generierung werden relevante Inhalte aus einer Wissensbasis (oft Vector Store) abgerufen und in den Prompt gepackt.",
  },
  MCP: {
    term: "MCP",
    full: "Model Context Protocol",
    definition:
      "Offener Standard, über den Modelle Tools und Kontextquellen einheitlich anbinden — frameworkübergreifend.",
  },
  HITL: {
    term: "HITL",
    full: "Human-in-the-Loop",
    definition:
      "Menschliche Freigabe oder Korrektur an festgelegten Punkten im Agent-Lauf. Pflicht bei irreversiblen Aktionen.",
  },
  DAG: {
    term: "DAG",
    full: "Directed Acyclic Graph",
    definition:
      "Gerichteter, kreisfreier Graph. Modelliert Abläufe mit Verzweigungen, aber ohne Schleifen — ideal für Workflow-Engines.",
  },
  LLM: {
    term: "LLM",
    full: "Large Language Model",
    definition:
      "Großes Sprachmodell, z. B. Claude, GPT, Gemini. Reine Inferenz; Tools, Memory und Kontrolle baut der Agent drumherum.",
  },
  SDK: {
    term: "SDK",
    full: "Software Development Kit",
    definition:
      "Bibliothek eines Anbieters für eine Plattform. Hier z. B. OpenAI Agents SDK oder Anthropic SDK.",
  },
  ADK: {
    term: "ADK",
    full: "Agent Development Kit",
    definition:
      "Googles Agent-Framework mit breitem Pattern-Katalog: Pipeline, Coordinator, Parallel, HITL, Composite.",
  },
  MAF: {
    term: "MAF",
    full: "Microsoft Agent Framework",
    definition:
      "Microsofts Orchestrierungs-Framework für Sequential, Concurrent, Handoff und Magentic. Nachfolger/Verschmelzung mit AutoGen.",
  },
  AG2: {
    term: "AG2",
    full: "AutoGen 2",
    definition:
      "Multi-Agent-Framework mit Group Chat, Two-Agent-Chat und Nested Chats. Vorlage für Magentic-One.",
  },
  Magentic: {
    term: "Magentic",
    full: "Magentic-One",
    definition:
      "Composite-Orchestrierung mit Planner, Task Ledger, Replanning und spezialisierten Agenten. Für offene Langläufer.",
  },
  Saga: {
    term: "Saga",
    definition:
      "Pattern, das mehrstufige Aktionen über kompensierende Schritte rollback-fähig macht. Ersatz für verteilte Transaktionen.",
  },
  PubSub: {
    term: "Pub/Sub",
    full: "Publish / Subscribe",
    definition:
      "Nachrichtenmuster: Publisher schicken Events an Topics, Subscriber empfangen sie entkoppelt.",
  },
  Embedding: {
    term: "Embedding",
    definition:
      "Vektorrepräsentation eines Inhalts. Ähnliche Inhalte liegen im Vektorraum nah beieinander — Grundlage für semantische Suche.",
  },
  Tracing: {
    term: "Tracing",
    definition:
      "Verkettete Aufzeichnung aller Schritte eines Laufs (LLM-Calls, Tools, Latenz). Macht Agents debuggbar.",
  },
  Tool: {
    term: "Tool",
    definition:
      "Funktion mit definiertem Schema, die ein Agent aufrufen kann — von API-Aufruf bis Datenbankquery.",
  },
  Sandbox: {
    term: "Sandbox",
    definition:
      "Isolierte Ausführungsumgebung. Kapselt Codeausführung gegen Host-System ab; Pflicht für CodeAct und untrusted Code.",
  },
  Checkpoint: {
    term: "Checkpoint",
    definition:
      "Persistierter Ausführungszustand. Erlaubt es, einen Lauf nach Crash, Pause oder externer Verzögerung fortzusetzen.",
  },
  Trace: {
    term: "Trace",
    definition:
      "Eine zusammenhängende Folge von Spans, die einen Agent-Lauf abbildet. Wird für Debugging, Latenz- und Kostenanalyse genutzt.",
  },
  Span: {
    term: "Span",
    definition:
      "Einzelner Schritt innerhalb eines Trace — z. B. ein LLM-Call oder Tool-Aufruf, mit Start- und Endzeit.",
  },
  Guardrail: {
    term: "Guardrail",
    definition:
      "Schutzregel, die Eingaben oder Ausgaben gegen Inhalts-, Format- oder Policy-Vorgaben prüft.",
  },
};

export function findGlossaryTerm(text: string): GlossaryEntry | undefined {
  const upper = text.trim();
  if (glossary[upper]) return glossary[upper];
  const found = Object.values(glossary).find(
    (g) => g.term.toLowerCase() === upper.toLowerCase(),
  );
  return found;
}
