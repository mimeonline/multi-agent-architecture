import type {
  CodeSnippet,
  Complexity,
  DecisionGuide,
  Diagram,
  Domain,
  ExampleStep,
  Pattern,
  Related,
  Subdomain,
} from "../types/pattern";

type PatternInit = {
  name: string;
  domain: Domain;
  aliases: string[];
  idea: string;
  useWhen: string[];
  avoidWhen: string[];
  tradeoff: string;
  frameworks: string[];
  subdomain?: Subdomain;
  icon: string;
  complexity: Complexity;
  traits: string[];
  scenario: string;
  diagram: Diagram;
  code: CodeSnippet;
  related: Related[];
  example?: ExampleStep[];
};

const p = (init: PatternInit): Pattern => init;

export const patterns: Pattern[] = [
  p({
    name: "ReAct",
    domain: "Denken",
    aliases: ["Reason + Act", "Thought-Action-Observation Loop"],
    idea: "Der Agent wechselt iterativ zwischen Reasoning, Tool-Aufruf und Beobachtung. Statt einen Plan vorab festzulegen, denkt er nach jedem Tool-Ergebnis neu nach und entscheidet, welcher Schritt jetzt nötig ist. Diese enge Kopplung macht das Pattern robust gegen Überraschungen — ein unerwartetes Tool-Ergebnis beeinflusst die nächste Aktion direkt — kostet aber einen LLM-Call pro Iteration.",
    useWhen: ["Tool-Use ist nötig", "Pfad ist nicht vorab planbar", "Tool-Ergebnisse verändern den nächsten Schritt"],
    avoidWhen: ["Plan ist bekannt", "LLM-Calls sind streng limitiert", "Reine Generierung reicht"],
    tradeoff: "Hohe Adaptivität gegen höheren Call-Aufwand.",
    frameworks: ["LangGraph", "OpenAI Agents SDK", "Microsoft Agent Framework", "Google ADK", "AutoGen / AG2", "CrewAI"],
    icon: "Repeat",
    complexity: "Einsteiger",
    traits: ["Adaptiv", "Tool-lastig", "Token-hungry"],
    scenario:
      "Ein Recherche-Agent soll prüfen, ob ein Konkurrent einen neuen Tarif hat. Er denkt, ruft die Website ab, beobachtet das Ergebnis, denkt wieder — bis die Frage beantwortet ist.",
    diagram: { type: "loop", nodes: ["Thought", "Action", "Observation"], caption: "Iteratives Denken-Handeln-Beobachten." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `agent = Agent(
  instructions="Beantworte mit Tool-Use.",
  tools=[web_search, fetch_page]
)
# Loop ist eingebaut: jedes Tool-Result
# fließt in das nächste Reasoning.
result = await Runner.run(agent, query)`,
    },
    related: [
      { name: "Plan-and-Execute", kind: "contrasts", note: "Plant zuerst alles, statt iterativ zu reagieren." },
      { name: "ReWOO", kind: "contrasts", note: "Reduziert Beobachtungen, um Calls zu sparen." },
      { name: "Reflexion", kind: "combines", note: "Reflexion über die Loop-Ergebnisse erhöht Qualität." },
    ],
    example: [
      { step: "Thought 1", detail: "Frage zum Tarif → ich brauche die Preisseite des Konkurrenten." },
      { step: "Action 1", detail: "fetch_page(url='konkurrent.de/preise')" },
      { step: "Observation 1", detail: "HTML enthält Tarif 'Pro' für 29 € — aber kein Datum sichtbar." },
      { step: "Thought 2", detail: "Brauche das Veröffentlichungsdatum. Ich suche die Pressemeldung." },
      { step: "Action 2", detail: "web_search('konkurrent neuer Tarif 2026')" },
      { step: "Observation 2", detail: "Pressemitteilung vom 14.04.2026 gefunden." },
      { step: "Final", detail: "Antwort: 'Konkurrent hat seit 14.04.2026 den Tarif Pro für 29 €.'" },
    ],
  }),
  p({
    name: "Plan-and-Execute",
    domain: "Denken",
    aliases: ["Planner-Executor", "Plan then Act"],
    idea: "Der Agent trennt Planung und Ausführung sauber: Erst erzeugt ein Planner einen vollständigen Schrittplan, dann arbeitet ein Executor ihn ab. Dadurch wird der Lösungsweg vor der ersten Tool-Aktion sichtbar und prüfbar, was Audit und Steuerung erleichtert. Der Preis: Veraltet der Plan unterwegs, muss explizit replant werden — etwas, das ReAct emergent erledigt.",
    useWhen: ["Ziel ist zerlegbar", "Zwischenstände sollen prüfbar sein", "Steuerbarkeit ist wichtig"],
    avoidWhen: ["Umgebung ist stark dynamisch", "Tool-Ergebnisse können Plan kippen", "Planungsaufwand ist zu hoch"],
    tradeoff: "Bessere Struktur gegen Risiko veralteter Pläne.",
    frameworks: ["LangGraph", "CrewAI", "Google ADK", "Microsoft Agent Framework", "OpenAI Agents SDK"],
    icon: "ListChecks",
    complexity: "Fortgeschritten",
    traits: ["Kontrollierbar", "Erklärbar", "Stateful"],
    scenario:
      "Eine Marktanalyse für drei Konkurrenten. Der Planner erstellt erst die Liste der Schritte (Liste finden, Preise scrapen, Vergleich schreiben) und arbeitet sie dann ab.",
    diagram: { type: "linear", nodes: ["Plan", "Schritt 1", "Schritt 2", "Schritt 3"], caption: "Erst planen, dann sequentiell ausführen." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `class State(TypedDict):
  plan: list[str]
  done: list[str]
  result: str | None

graph = StateGraph(State)
graph.add_node("planner", make_plan)
graph.add_node("executor", run_step)
graph.add_edge("planner", "executor")
graph.add_conditional_edges(
  "executor",
  lambda s: "executor" if s["plan"] else END
)`,
    },
    related: [
      { name: "ReAct", kind: "contrasts", note: "ReAct plant on-the-fly statt vorab." },
      { name: "Orchestrator-Workers", kind: "similar", note: "Auch top-down, aber mit echten Sub-Agenten." },
      { name: "ReWOO", kind: "similar", note: "Plant ebenfalls vorab, aber bündelt Tool-Calls." },
    ],
    example: [
      { step: "Plan", detail: "1) Konkurrenten finden  2) Preise scrapen  3) Vergleich schreiben" },
      { step: "Step 1", detail: "Liste der drei Top-Konkurrenten in der Region erstellt." },
      { step: "Step 2", detail: "Preise je Konkurrent gescraped und tabelliert." },
      { step: "Step 3", detail: "Markdown-Vergleich erzeugt und zurückgegeben." },
    ],
  }),
  p({
    name: "ReWOO",
    domain: "Denken",
    aliases: ["Reasoning without Observation", "Planner-Solver Pattern"],
    idea: "Wie Plan-and-Execute getrennt in Planung und Ausführung, aber radikaler: Der Planner schreibt einen Variablen-DAG aller Tool-Aufrufe, ein Worker führt sie aus, ein Solver kombiniert die Ergebnisse in einem einzigen LLM-Call. Das spart Reasoning-Schritte zwischen den Tool-Calls — ideal, wenn vorab klar ist, was gebraucht wird, problematisch, wenn ein Zwischenergebnis den Pfad ändern müsste.",
    useWhen: ["Tool-Aufrufe sind erkennbar", "LLM-Calls sollen sinken", "Zwischenbeobachtungen verzweigen kaum"],
    avoidWhen: ["Tool-Ergebnisse verzweigen stark", "Fehlerbehandlung pro Schritt ist kritisch", "Interaktive Reaktion ist nötig"],
    tradeoff: "Niedrigere LLM-Kosten gegen geringere Adaptivität.",
    frameworks: ["LangGraph", "Google ADK", "OpenAI Agents SDK"],
    icon: "Layers",
    complexity: "Fortgeschritten",
    traits: ["Cost-bewusst", "Erklärbar"],
    scenario:
      "Statt für jede Faktenabfrage einen Reasoning-Schritt zu starten, plant der Agent alle benötigten Tool-Calls vorab, führt sie aus und löst die Frage einmalig mit allen Ergebnissen.",
    diagram: { type: "linear", nodes: ["Planner", "Tool 1", "Tool 2", "Solver"], caption: "Plan → parallel ausführen → einmal lösen." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `# Planner schreibt Variablen-DAG, z.B.
# #E1 = search("Bevölkerung Berlin")
# #E2 = search("Bevölkerung Hamburg")
# #E3 = compare(#E1, #E2)
plan = planner_llm.invoke(query)
results = run_all_tools(plan)
answer = solver_llm.invoke(query, results)`,
    },
    related: [
      { name: "Plan-and-Execute", kind: "similar", note: "Auch vorab geplant, aber ohne Variablen-DAG." },
      { name: "ReAct", kind: "contrasts", note: "ReAct beobachtet pro Schritt." },
      { name: "Map-Reduce", kind: "combines", note: "Tool-Calls können parallel gefan-out werden." },
    ],
  }),
  p({
    name: "Reflexion",
    domain: "Denken",
    aliases: ["Self-Reflection", "Self-Critique"],
    idea: "Der Agent erzeugt eine Antwort, kritisiert sie selbst gegen Kriterien wie Korrektheit oder Vollständigkeit und überarbeitet daraufhin. Anders als ein einzelner Generierungsschritt nutzt Reflexion das LLM für eine zweite, kühlere Bewertung — derselbe Mechanismus, den Menschen beim Korrekturlesen anwenden. Funktioniert gut, wenn Fehler im eigenen Output erkennbar sind; schwach, wenn das Modell denselben blinden Fleck zweimal hat.",
    useWhen: ["Qualität ist wichtiger als Latenz", "Fehler können durch Selbstprüfung auffallen", "Iteration ist möglich"],
    avoidWhen: ["Externe Validierung reicht", "Selbstbewertung ist unzuverlässig", "Budget ist eng"],
    tradeoff: "Mehr Qualität gegen zusätzliche Tokens.",
    frameworks: ["LangGraph", "AutoGen / AG2", "Microsoft Agent Framework", "Google ADK", "CrewAI"],
    icon: "Eye",
    complexity: "Fortgeschritten",
    traits: ["Robustheit", "Token-hungry"],
    scenario:
      "Ein Agent schreibt einen Vertragsentwurf, prüft ihn dann gegen interne Klauseln und überarbeitet schwache Stellen — bis er selbst zufrieden ist oder das Iterationsbudget erschöpft ist.",
    diagram: { type: "loop", nodes: ["Generator", "Reflektor", "Revision"], caption: "Selbstkritik als Schleife." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `def reflect_loop(state):
  draft = generator(state["task"])
  critique = reflector(draft)
  if critique["ok"] or state["round"] >= 3:
    return {"answer": draft}
  return {"task": critique["feedback"], "round": state["round"]+1}`,
    },
    related: [
      { name: "Evaluator-Optimizer (Generator-Critic)", kind: "similar", note: "Mit getrennten Rollen statt Selbstkritik." },
      { name: "Self-Consistency", kind: "contrasts", note: "Sampling + Mehrheit, kein Reflexionsschritt." },
      { name: "Iterative Refinement", kind: "combines", note: "Feedback-Quelle für die Iteration." },
    ],
  }),
  p({
    name: "Tree of Thoughts",
    domain: "Denken",
    aliases: ["ToT", "Branching Reasoning"],
    idea: "Statt linear einen Lösungsweg zu verfolgen, generiert der Agent an Entscheidungspunkten mehrere Reasoning-Pfade, bewertet sie und vertieft den vielversprechendsten. Sackgassen werden früh abgeschnitten, bevor sie Tokens verbrauchen. Der Aufwand explodiert mit Tiefe und Breite — nur sinnvoll, wenn der Suchraum groß und die Bewertung der Äste verlässlich ist.",
    useWhen: ["Mehrere Lösungswege existieren", "Frühe Entscheidungen wirken stark", "Suchraum ist bewertbar"],
    avoidWhen: ["Aufgabe ist direkt lösbar", "Kosten müssen niedrig bleiben", "Bewertung der Äste ist unklar"],
    tradeoff: "Breitere Exploration gegen stark steigenden Tokenaufwand.",
    frameworks: ["LangGraph", "AutoGen / AG2", "Google ADK"],
    icon: "Trees",
    complexity: "Production",
    traits: ["Token-hungry", "Robustheit"],
    scenario:
      "Bei einer kniffligen Optimierungsaufgabe explodiert der Lösungsraum. Der Agent erzeugt drei Strategien, bewertet sie, vertieft die beste und verwirft Sackgassen.",
    diagram: { type: "tree", nodes: ["Frage", "Strategie A", "Strategie B", "Strategie C"], caption: "Branch & evaluate." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `branches = [propose(state) for _ in range(3)]
scores = [evaluate(b) for b in branches]
best = branches[scores.index(max(scores))]
if not solved(best):
  state = expand(best)  # rekursiv vertiefen`,
    },
    related: [
      { name: "Self-Consistency", kind: "similar", note: "Sampelt auch mehrere Pfade, ohne Bewertung pro Knoten." },
      { name: "Plan-and-Execute", kind: "contrasts", note: "Linearer Plan statt Baumsuche." },
      { name: "Reflexion", kind: "combines", note: "Reflexion bewertet Äste." },
    ],
  }),
  p({
    name: "Self-Consistency",
    domain: "Denken",
    aliases: ["Majority Reasoning", "Sample-and-Vote"],
    idea: "Statt einer einzelnen Antwort werden mehrere unabhängige Läufe mit Temperatur > 0 gestartet und die häufigste Antwort genommen. Die Robustheit entsteht durch Modellvarianz: Korrekte Reasoning-Pfade konvergieren häufiger zu derselben Antwort als zufällige Fehler. Klassisches Sample-and-Vote für Aufgaben mit eindeutiger Antwort, schwach bei subjektiven oder kompositionellen Outputs.",
    useWhen: ["Robustheit ist wichtig", "Ergebnis ist abstimmbar", "Modellvarianz ist hilfreich"],
    avoidWhen: ["Objektive Validierung verfügbar ist", "Kosten streng limitiert sind", "Mehrheit falsche Sicherheit erzeugt"],
    tradeoff: "Robustere Antworten gegen mehrfachen Inferenzaufwand.",
    frameworks: ["Anthropic Cookbook", "Google ADK", "LangGraph", "Microsoft Agent Framework"],
    icon: "Vote",
    complexity: "Fortgeschritten",
    traits: ["Robustheit", "Token-hungry"],
    scenario:
      "Bei einer Klassifikation generiert der Agent fünf Antworten mit Temperatur > 0 und nimmt die Mehrheit. Robust gegen einzelne Ausreißer.",
    diagram: { type: "fanout", nodes: ["Frage", "Sample 1", "Sample 2", "Sample 3", "Mehrheit"], caption: "Mehrere Antworten, eine Mehrheit." },
    code: {
      framework: "Anthropic SDK",
      language: "python",
      snippet: `samples = [llm(query, temperature=0.7) for _ in range(5)]
counts = Counter(s.answer for s in samples)
final = counts.most_common(1)[0][0]`,
    },
    related: [
      { name: "Parallelization (Voting)", kind: "similar", note: "Gleicher Mechanismus, aber als Workflow-Pattern." },
      { name: "Tree of Thoughts", kind: "contrasts", note: "Bewertet Pfade statt sie nur abzustimmen." },
    ],
  }),
  p({
    name: "CodeAct",
    domain: "Denken",
    aliases: ["Code as Action", "Executable Reasoning"],
    idea: "Der Agent schreibt und führt Code (typischerweise Python) als seine primäre Handlung — Berechnungen, Datenmanipulation, API-Aufrufe — statt sie über fixe Function-Tools zu serialisieren. Code ist mächtiger als ein festes Toolset und reproduzierbar, braucht aber zwingend eine Sandbox, um keinen Schaden anzurichten. Besonders stark, wenn die Aufgabe quantitativ oder transformativ ist — schwach, wenn sie rein sprachlich bleibt.",
    useWhen: ["Berechnung nötig ist", "Zwischenergebnisse reproduzierbar sein sollen", "Programmatische Logik hilft"],
    avoidWhen: ["Ausführung nicht sandboxed ist", "Aufgabe rein sprachlich ist", "Codeausführung mehr Risiko erzeugt"],
    tradeoff: "Präzision gegen Sandbox- und Laufzeitaufwand.",
    frameworks: ["OpenAI Agents SDK", "AutoGen / AG2", "Microsoft Agent Framework", "LangGraph", "Google ADK"],
    icon: "Terminal",
    complexity: "Fortgeschritten",
    traits: ["Tool-lastig", "Sicherheit"],
    scenario:
      "Statt Zahlen im Prompt zu jonglieren, schreibt der Agent Python: berechnet die Quartalsumsätze, ruft Pandas auf, gibt das Ergebnis und das Snippet zurück.",
    diagram: { type: "loop", nodes: ["LLM", "Sandbox-Run", "Output"], caption: "Ausführbarer Code als Aktion." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `agent = Agent(
  tools=[code_interpreter],
  instructions="Berechne mit Python."
)
# Modell schreibt:
# > pd.read_csv(...).groupby("q").sum()
# Sandbox liefert das Ergebnis zurück.`,
    },
    related: [
      { name: "Sandbox Execution", kind: "combines", note: "Pflicht-Begleiter für sichere Ausführung." },
      { name: "Function Calling", kind: "contrasts", note: "Eingeschränkt auf vorgegebene Funktionen." },
    ],
  }),

  p({
    name: "Sequential Pipeline (Prompt Chaining)",
    domain: "Ablauf",
    aliases: ["Prompt Chaining", "Linear Workflow"],
    idea: "Eine fest definierte Kette von Schritten, jeder Schritt nimmt das Ergebnis des vorherigen und erzeugt den nächsten Input. Klassischer Workflow ohne Verzweigung — einfach zu verstehen, einfach zu testen, einfach zu monitoren. Wird brüchig, sobald ein Schritt entscheiden müsste, ob ein anderer Schritt überhaupt läuft.",
    useWhen: ["Aufgabe zerfällt klar in Phasen", "Zwischenprodukte sind prüfbar", "Kontrolle ist wichtiger als Autonomie"],
    avoidWhen: ["Ablauf verzweigt stark", "Ergebnisse erzeugen neue Ziele", "Parallelisierung liegt nahe"],
    tradeoff: "Hohe Verständlichkeit gegen geringe Flexibilität.",
    frameworks: ["Anthropic Cookbook", "CrewAI", "Google ADK", "Microsoft Agent Framework", "AWS Strands"],
    icon: "Workflow",
    complexity: "Einsteiger",
    traits: ["Kontrollierbar", "Erklärbar", "Stateless"],
    scenario:
      "Eingehende Mail wird zuerst klassifiziert, dann zusammengefasst, dann beantwortet. Drei Prompts, fest verkettet.",
    diagram: { type: "linear", nodes: ["Klassifizieren", "Zusammenfassen", "Antworten"], caption: "Lineare Schritte." },
    code: {
      framework: "Anthropic Cookbook",
      language: "python",
      snippet: `category = classify(email)
summary  = summarize(email)
reply    = compose(category, summary)
return reply`,
    },
    related: [
      { name: "Iterative Refinement", kind: "combines", note: "Letzter Schritt kann mit Iteration verbessert werden." },
      { name: "Routing", kind: "contrasts", note: "Routing wählt aus, Pipeline läuft immer gleich." },
    ],
  }),
  p({
    name: "Routing",
    domain: "Ablauf",
    aliases: ["Classifier Router", "Intent Routing"],
    idea: "Ein Klassifikator entscheidet anhand der Anfrage, welcher Pfad oder Spezialist sie bearbeitet. Spart Token gegenüber einem 'Mach-alles'-Prompt und erlaubt jedem Pfad eigene Tools, Modelle und Optimierungen. Die Krux liegt im Klassifikator selbst — Fehlrouting ist teuer und bleibt oft unbemerkt.",
    useWhen: ["Anfrageklassen verschiedene Behandlung brauchen", "Spezialisierte Prompts existieren", "Fehlpfade teuer sind"],
    avoidWhen: ["Alle Aufgaben denselben Ablauf nutzen", "Klassifikation instabil ist", "Routinglogik zu komplex wird"],
    tradeoff: "Präzisere Behandlung gegen Fehlrouting-Risiko.",
    frameworks: ["Anthropic Cookbook", "LangGraph", "Google ADK", "Microsoft Agent Framework", "AWS Strands"],
    icon: "Route",
    complexity: "Einsteiger",
    traits: ["Adaptiv", "Cost-bewusst"],
    scenario:
      "Support-Anfragen werden klassifiziert: Rechnungsfragen → Billing-Agent, technische Fragen → Tech-Agent, Reklamationen → Mensch.",
    diagram: { type: "branch", nodes: ["Router", "Billing-Agent", "Tech-Agent", "Mensch"], caption: "Eingang → Klassifikation → Pfad." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `def router(state):
  return classify(state["query"])  # 'billing' | 'tech' | 'human'

graph.add_conditional_edges("router", router, {
  "billing": "billing_agent",
  "tech":    "tech_agent",
  "human":   "handoff_human",
})`,
    },
    related: [
      { name: "Capability Routing", kind: "similar", note: "Routing nach Skill statt nach Intent." },
      { name: "Handoff", kind: "combines", note: "Routing-Ziel ist oft ein Handoff-Agent." },
      { name: "Sequential Pipeline (Prompt Chaining)", kind: "contrasts", note: "Pipeline ist statisch, Routing dynamisch." },
    ],
  }),
  p({
    name: "Parallelization (Sectioning)",
    domain: "Ablauf",
    aliases: ["Sectioned Parallelism", "Fan-out by Segment"],
    idea: "Die Eingabe wird in unabhängige Abschnitte zerlegt (z. B. Kapitel eines Dokuments), jeder Abschnitt parallel verarbeitet, anschließend zusammengeführt. Latenz fällt fast linear mit der Anzahl Threads — beste Wahl bei großen, segmentierbaren Eingaben. Funktioniert nur, wenn Abschnitte tatsächlich unabhängig sind; übergreifender Kontext geht verloren.",
    useWhen: ["Eingabe segmentierbar ist", "Teilaufgaben unabhängig sind", "Latenz sinken soll"],
    avoidWhen: ["Starke Abhängigkeiten bestehen", "Zusammenführung schwierig ist", "Globale Konsistenz wichtiger ist"],
    tradeoff: "Geringere Latenz gegen Integrationsaufwand.",
    frameworks: ["Anthropic Cookbook", "Google ADK", "Microsoft Agent Framework", "AWS Strands", "LangGraph"],
    icon: "Shuffle",
    complexity: "Fortgeschritten",
    traits: ["Adaptiv", "Cost-bewusst", "Async"],
    scenario:
      "Ein 200-Seiten-PDF wird in Kapitel zerlegt, jedes Kapitel parallel zusammengefasst, am Schluss zu einer Gesamtsumme verdichtet.",
    diagram: { type: "fanout", nodes: ["Input", "Kapitel 1", "Kapitel 2", "Kapitel 3", "Merge"], caption: "Aufteilen, parallel, zusammenführen." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `chunks = split_by_chapter(doc)
summaries = await asyncio.gather(*[
  summarize(c) for c in chunks
])
final = merge(summaries)`,
    },
    related: [
      { name: "Map-Reduce", kind: "similar", note: "Map-Reduce ist die generische Variante." },
      { name: "Parallelization (Voting)", kind: "contrasts", note: "Voting bearbeitet dieselbe Aufgabe mehrfach." },
    ],
  }),
  p({
    name: "Parallelization (Voting)",
    domain: "Ablauf",
    aliases: ["Voting Parallelism", "Ensemble Voting"],
    idea: "Dieselbe Aufgabe wird mehrfach unabhängig bearbeitet, ein Aggregator entscheidet aus den Antworten — per Mehrheit, Schwellenwert oder Synthese. Reduziert die Auswirkung einzelner Halluzinationen oder Bias, kostet aber multiplen Aufwand. Sinnvoll bei kritischen Klassifikationen, weniger bei kreativen Aufgaben, wo Aggregation den Glanz verwischt.",
    useWhen: ["Robustheit wichtig ist", "Antworten bewertbar sind", "Modellvarianz genutzt werden soll"],
    avoidWhen: ["Ergebnis objektiv validierbar ist", "Antwort nicht aggregierbar ist", "Latenz streng begrenzt ist"],
    tradeoff: "Höhere Robustheit gegen mehrfachen Aufwand.",
    frameworks: ["Anthropic Cookbook", "Google ADK", "Microsoft Agent Framework", "LangGraph"],
    icon: "Vote",
    complexity: "Fortgeschritten",
    traits: ["Robustheit", "Token-hungry"],
    scenario:
      "Bei einer Risikoeinstufung lassen drei Modell-Instanzen parallel laufen. Der Aggregator nimmt nur an, wenn mindestens zwei zustimmen.",
    diagram: { type: "fanout", nodes: ["Frage", "Run 1", "Run 2", "Run 3", "Aggregator"], caption: "Mehrfache Antworten, eine Entscheidung." },
    code: {
      framework: "Anthropic Cookbook",
      language: "python",
      snippet: `runs = await asyncio.gather(*[
  classify(item) for _ in range(3)
])
if Counter(runs).most_common(1)[0][1] >= 2:
  decision = Counter(runs).most_common(1)[0][0]
else:
  decision = "needs_review"`,
    },
    related: [
      { name: "Self-Consistency", kind: "similar", note: "Voting auf Reasoning-Ebene des einzelnen Agents." },
      { name: "Parallelization (Sectioning)", kind: "contrasts", note: "Sectioning teilt Eingabe statt zu replizieren." },
    ],
  }),
  p({
    name: "Loop",
    domain: "Ablauf",
    aliases: ["Control Loop", "Retry Loop"],
    idea: "Ein Schritt oder eine Schritt-Gruppe wird wiederholt, bis eine explizite Abbruchbedingung erfüllt ist — Qualitätsziel erreicht, Budget aufgebraucht, Validierung erfolgreich. Das universelle Konstrukt für 'verbessere, bis es passt'. Risiko: Ohne harte Obergrenze kann eine Loop endlos laufen oder Fehler aufschaukeln, statt sie auszubügeln.",
    useWhen: ["Ergebnis verbessert werden kann", "Validierung Wiederholung auslöst", "Tool-Ergebnisse Iteration erfordern"],
    avoidWhen: ["Keine stabile Abbruchbedingung existiert", "Kosten steigen unkontrolliert", "Fehler sich verstärken"],
    tradeoff: "Adaptive Verbesserung gegen Risiko teurer Schleifen.",
    frameworks: ["LangGraph", "CrewAI Flows", "Microsoft Agent Framework", "Google ADK", "AWS Strands"],
    icon: "Repeat",
    complexity: "Einsteiger",
    traits: ["Adaptiv", "Token-hungry"],
    scenario:
      "Ein Agent versucht, eine API-Antwort gegen ein Schema zu validieren. Schlägt sie fehl, korrigiert er und versucht es erneut — maximal dreimal.",
    diagram: { type: "loop", nodes: ["Schritt", "Prüfen", "Weiter?"], caption: "Wiederholen bis Bedingung." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `for attempt in range(MAX_TRIES):
  result = step(state)
  if validate(result):
    return result
state["error"] = "max retries reached"`,
    },
    related: [
      { name: "Iterative Refinement", kind: "similar", note: "Spezialfall der Loop für Texte/Pläne." },
      { name: "Evaluator-Optimizer (Generator-Critic)", kind: "combines", note: "Loop mit Bewertungsschritt." },
    ],
  }),
  p({
    name: "Evaluator-Optimizer (Generator-Critic)",
    domain: "Ablauf",
    aliases: ["Generator-Critic", "Critique and Revise"],
    idea: "Zwei spezialisierte Rollen: Ein Generator erzeugt einen Entwurf, ein Evaluator prüft gegen Kriterien und liefert Feedback, der Generator überarbeitet. Anders als Reflexion sind Generator und Critic getrennt — was Bias-Diversifikation und unterschiedliche Modelle pro Rolle erlaubt. Funktioniert nur so gut wie die Kriterien des Evaluators messbar formulierbar sind.",
    useWhen: ["Qualitätskriterien formulierbar sind", "Iteration messbar ist", "Komplexe Ausgaben geprüft werden"],
    avoidWhen: ["Evaluator unzuverlässig ist", "Schema-Validation reicht", "Budget keine Mehrfachläufe erlaubt"],
    tradeoff: "Bessere Qualität gegen Bewertungskomplexität.",
    frameworks: ["Anthropic Cookbook", "Google ADK", "LangGraph", "AutoGen / AG2", "Microsoft Agent Framework"],
    icon: "GitMerge",
    complexity: "Fortgeschritten",
    traits: ["Robustheit", "Token-hungry"],
    scenario:
      "Ein Generator schreibt einen technischen Blog-Post. Ein Evaluator prüft auf Klarheit, Beispiele und Fakten. Der Generator überarbeitet, bis der Evaluator OK gibt.",
    diagram: { type: "gen-critic", nodes: ["Generator", "Evaluator"], caption: "Schreiben ↔ Kritisieren bis OK." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `draft = generator(brief)
for _ in range(MAX_ROUNDS):
  verdict = evaluator(draft, criteria)
  if verdict.ok:
    return draft
  draft = generator(brief, feedback=verdict.notes)`,
    },
    related: [
      { name: "Reflexion", kind: "similar", note: "Reflexion ist Selbstkritik statt zweier Rollen." },
      { name: "Iterative Refinement", kind: "combines", note: "Iterative Refinement ist die einfache Variante ohne Evaluator." },
      { name: "LLM-as-Judge", kind: "combines", note: "Evaluator wird oft mit LLM-as-Judge implementiert." },
    ],
  }),
  p({
    name: "Iterative Refinement",
    domain: "Ablauf",
    aliases: ["Revise Loop", "Draft-Improve"],
    idea: "Ein Entwurf wird über mehrere Runden verbessert, jede Runde mit klarem Fokus (Struktur, dann Beispiele, dann Tonalität). Im Gegensatz zur generischen Loop steht jede Iteration unter einer expliziten Verbesserungsdimension — das verhindert ziellose Revisionen. Klassischer menschlicher Schreibprozess, übertragen auf Agenten.",
    useWhen: ["Qualität graduell steigt", "Feedback verfügbar ist", "Zwischenstände wichtig sind"],
    avoidWhen: ["Ein Schritt reicht", "Revisionen ohne klares Signal erfolgen", "Wiederholung Drift erzeugt"],
    tradeoff: "Verbesserte Qualität gegen längere Laufzeit.",
    frameworks: ["Google ADK", "LangGraph", "CrewAI Flows", "Microsoft Agent Framework"],
    icon: "Repeat",
    complexity: "Einsteiger",
    traits: ["Robustheit", "Token-hungry"],
    scenario:
      "Ein Pitch-Deck wird in drei Durchläufen geschärft: erst Struktur, dann Beispiele, dann Tonalität.",
    diagram: { type: "loop", nodes: ["Entwurf", "Verbessern", "Stop?"], caption: "Sukzessive Verbesserung." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `text = draft
for focus in ["structure", "examples", "tone"]:
  text = improve(text, focus=focus)
return text`,
    },
    related: [
      { name: "Loop", kind: "similar", note: "Iterative Refinement ist eine Loop mit klarem Verbesserungsziel." },
      { name: "Evaluator-Optimizer (Generator-Critic)", kind: "combines", note: "Mit Evaluator ist die Verbesserung messbar." },
    ],
  }),
  p({
    name: "Orchestrator-Workers",
    domain: "Ablauf",
    aliases: ["Coordinator-Workers", "Manager-Worker"],
    idea: "Anders als ein statischer Plan zerlegt der Orchestrator die Aufgabe zur Laufzeit in Subtasks und delegiert sie an spezialisierte Worker. Aggregation und finale Verantwortung bleiben zentral. Eignet sich für offene Aufgaben mit unbekannter Struktur — der Preis ist eine zusätzliche Steuerungsebene und das Risiko, dass der Orchestrator zum Engpass wird.",
    useWhen: ["Teilaufgaben erst zur Laufzeit erkennbar sind", "Worker spezialisiert sind", "Aggregation zentral bleibt"],
    avoidWhen: ["Statischer Workflow reicht", "Worker keine klare Verantwortung haben", "Orchestrator Engpass wird"],
    tradeoff: "Flexible Delegation gegen Koordinationsaufwand.",
    frameworks: ["Anthropic Cookbook", "LangGraph", "CrewAI", "Google ADK", "Microsoft Agent Framework", "AWS Strands"],
    icon: "Group",
    complexity: "Fortgeschritten",
    traits: ["Multi-Agent", "Adaptiv"],
    scenario:
      "Ein Coding-Agent zerlegt eine Issue zur Laufzeit in Subtasks (Tests, Implementation, Review) und delegiert sie an passende Spezialisten.",
    diagram: { type: "supervisor", nodes: ["Orchestrator", "Worker A", "Worker B", "Worker C"], caption: "Top-down Delegation." },
    code: {
      framework: "Anthropic Cookbook",
      language: "python",
      snippet: `tasks = orchestrator.decompose(brief)
results = await asyncio.gather(*[
  workers[t.kind].run(t) for t in tasks
])
return orchestrator.merge(results)`,
    },
    related: [
      { name: "Supervisor", kind: "similar", note: "Supervisor ist die Multi-Agent-Variante." },
      { name: "Plan-and-Execute", kind: "contrasts", note: "Statischer Plan, kein dynamisches Zerlegen." },
    ],
  }),
  p({
    name: "Map-Reduce",
    domain: "Ablauf",
    aliases: ["Fan-out/Fan-in", "Batch Decomposition"],
    idea: "Die Eingabemenge wird auf unabhängige Items abgebildet (Map), jedes wird gleich behandelt, am Ende werden die Ergebnisse zu einer Antwort verdichtet (Reduce). Skaliert quasi unbegrenzt horizontal — perfekt für Batch-Klassifikation, Extraktion und Aggregation. Verlustreich, wenn die Reduce-Funktion komplexe Beziehungen zwischen Items übergeht.",
    useWhen: ["Große Eingaben in Chunks zerlegbar sind", "Aggregation klar ist", "Durchsatz wichtig ist"],
    avoidWhen: ["Globale Abhängigkeiten bestehen", "Reduktion verlustreich wäre", "Zentraler Kontext nötig ist"],
    tradeoff: "Gute Skalierung gegen inkonsistente Teilresultate.",
    frameworks: ["LangGraph", "AWS Strands", "Google ADK", "Microsoft Agent Framework", "Anthropic Cookbook"],
    icon: "Boxes",
    complexity: "Fortgeschritten",
    traits: ["Async", "Cost-bewusst"],
    scenario:
      "Tausend Kundenrezensionen werden je einzeln klassifiziert (Map) und am Schluss zu einer Score-Verteilung zusammengefasst (Reduce).",
    diagram: { type: "fanout", nodes: ["Input", "Map 1", "Map 2", "Map 3", "Reduce"], caption: "Map alle, dann Reduce." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `mapped = await asyncio.gather(*[
  classify(item) for item in items
])
result = reduce_fn(mapped)`,
    },
    related: [
      { name: "Parallelization (Sectioning)", kind: "similar", note: "Spezialfall: Eingabe wird zerteilt." },
      { name: "Orchestrator-Workers", kind: "contrasts", note: "Map-Reduce ist datengetrieben statt aufgabengetrieben." },
    ],
  }),

  p({
    name: "Supervisor",
    domain: "Zusammenarbeit",
    aliases: ["Manager Agent", "Coordinator Agent"],
    idea: "Ein zentraler Agent betreut mehrere Spezialisten und entscheidet pro Schritt, wer als Nächstes dran ist — ein Hub-and-Spoke-Modell. Anders als statisches Routing kann der Supervisor je nach Zwischenergebnis weiter delegieren, abbrechen oder zurückspringen. Kontrolle bleibt zentral, Engpass und Single Point of Failure ebenfalls.",
    useWhen: ["Zentrale Kontrolle zählt", "Spezialisten koordiniert werden", "Aufgaben dynamisch delegiert werden"],
    avoidWhen: ["Dezentrale Kooperation nötig ist", "Supervisor Engpass wird", "Routing ausreicht"],
    tradeoff: "Klare Kontrolle gegen Koordinationsengpass.",
    frameworks: ["LangGraph", "CrewAI", "Microsoft Agent Framework", "Google ADK", "AWS Strands"],
    icon: "Users",
    complexity: "Fortgeschritten",
    traits: ["Multi-Agent", "Kontrollierbar"],
    scenario:
      "Ein Support-Supervisor empfängt jede Frage, fragt sich 'Wer kann das?' und ruft dann den Billing-, Technik- oder Versand-Agenten auf.",
    diagram: { type: "supervisor", nodes: ["Supervisor", "Billing", "Technik", "Versand"], caption: "Hub-and-Spoke." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `def supervisor(state):
  return llm.choose_next(
    options=["billing","tech","shipping","done"]
  )
graph.add_conditional_edges("supervisor", supervisor, {
  "billing": "billing", "tech": "tech",
  "shipping": "shipping", "done": END,
})`,
    },
    related: [
      { name: "Hierarchical Supervisor", kind: "similar", note: "Mehrere Ebenen statt einer." },
      { name: "Routing", kind: "contrasts", note: "Routing ist statisch, Supervisor entscheidet pro Schritt neu." },
      { name: "Handoff", kind: "combines", note: "Supervisor übergibt per Handoff." },
    ],
    example: [
      { step: "Empfang", detail: "Anfrage 'Warum kam Paket nicht an?'" },
      { step: "Decide", detail: "Supervisor wählt Versand-Agent." },
      { step: "Versand-Agent", detail: "Prüft Tracking, antwortet mit Status." },
      { step: "Decide", detail: "Supervisor stellt fest: keine weiteren Schritte → END." },
    ],
  }),
  p({
    name: "Hierarchical Supervisor",
    domain: "Zusammenarbeit",
    aliases: ["Multi-Level Supervisor", "Manager Hierarchy"],
    idea: "Mehrere Ebenen von Supervisoren strukturieren ein größeres Agentensystem: Top-Supervisor wählt das Team, Team-Supervisor wählt Spezialisten, Spezialisten arbeiten. Spiegelt klassische Organisationen wider und schafft lokale Verantwortung in komplexen Workflows. Bezahlt mit längeren Entscheidungswegen und mehr Agent-Hops pro Aufgabe.",
    useWhen: ["Agentenzahl groß wird", "Domänen getrennt werden", "Lokale Entscheidungen zusammengeführt werden"],
    avoidWhen: ["Wenige Agenten reichen", "Kommunikationswege kurz bleiben sollen", "Verantwortlichkeiten unscharf sind"],
    tradeoff: "Skalierbare Organisation gegen längere Entscheidungswege.",
    frameworks: ["CrewAI", "LangGraph", "Google ADK", "Microsoft Agent Framework"],
    icon: "Layers",
    complexity: "Production",
    traits: ["Multi-Agent", "Production"],
    scenario:
      "Ein Top-Supervisor entscheidet zwischen Research-Team und Engineering-Team. Jedes Team hat selbst einen Sub-Supervisor mit zwei Spezialisten.",
    diagram: { type: "tree", nodes: ["CEO", "Research-Lead", "Eng-Lead", "Ops-Lead"], caption: "Mehrstufige Delegation." },
    code: {
      framework: "CrewAI",
      language: "python",
      snippet: `top = Supervisor(members=[research_team, eng_team])
research_team = Supervisor(members=[searcher, analyst])
eng_team      = Supervisor(members=[coder, reviewer])`,
    },
    related: [
      { name: "Supervisor", kind: "similar", note: "Eine Ebene statt mehrere." },
      { name: "Graph-based Orchestration", kind: "contrasts", note: "Graph erlaubt frei modellierte Beziehungen." },
    ],
  }),
  p({
    name: "Handoff",
    domain: "Zusammenarbeit",
    aliases: ["Transfer of Control", "Agent Transfer"],
    idea: "Ein Agent erkennt, dass er die Aufgabe nicht weiterführen sollte, und übergibt — inklusive Kontext-Bundle — an einen Spezialisten, der ab jetzt mit dem Nutzer interagiert. Anders als beim Supervisor-Modell wechselt die volle Kontrolle, der ursprüngliche Agent verschwindet. Häufig in Triage-Mustern wie 'Empfang → Spezialist'.",
    useWhen: ["Zuständigkeit klar wechselt", "Nutzerinteraktion wechseln soll", "Tool-Grenzen gelten"],
    avoidWhen: ["Mehrere Agents gleichzeitig beitragen", "Kontrolle zentral bleiben muss", "Kontextübergabe unklar ist"],
    tradeoff: "Klare Übergabe gegen Kontextverlust.",
    frameworks: ["OpenAI Agents SDK", "Microsoft Agent Framework", "LangGraph", "Google ADK"],
    icon: "GitBranch",
    complexity: "Fortgeschritten",
    traits: ["Multi-Agent", "Adaptiv"],
    scenario:
      "Triage-Agent erkennt komplexe Frage und übergibt mit Kontext-Bundle an den Spezialisten — der Nutzer spricht ab da nur noch mit ihm.",
    diagram: { type: "handoff", nodes: ["Triage", "Spezialist A", "Spezialist B"], caption: "Kontextübergabe per Pass." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `triage = Agent(handoffs=[refund_agent, tech_agent])
# LLM entscheidet, an wen übergeben wird,
# Kontext (history, user-info) reist mit.
await Runner.run(triage, query)`,
    },
    related: [
      { name: "Routing", kind: "combines", note: "Routing entscheidet Ziel; Handoff ist die Übergabe." },
      { name: "Supervisor", kind: "contrasts", note: "Supervisor behält Kontrolle, Handoff gibt sie ab." },
    ],
  }),
  p({
    name: "Swarm",
    domain: "Zusammenarbeit",
    aliases: ["Decentralized Agents", "Peer Agent Swarm"],
    idea: "Mehrere gleichberechtigte Agenten teilen sich eine Aufgabe oder einen Pool und koordinieren sich ohne zentralen Manager — über lokale Regeln, Nachrichten oder ein gemeinsames Blackboard. Anpassungsfähig an dynamische Lasten, schwer vorhersagbar im Verhalten. Trade-off zwischen Emergenz und Nachvollziehbarkeit — die typische Schwarmintelligenz.",
    useWhen: ["Dezentrale Exploration gewünscht ist", "Aufgaben adaptiv verteilt werden", "Zentrale Steuerung zu starr ist"],
    avoidWhen: ["Strenge Nachvollziehbarkeit nötig ist", "Nachrichtenflut begrenzt werden muss", "Klare Verantwortung wichtiger ist"],
    tradeoff: "Hohe Anpassungsfähigkeit gegen geringe Vorhersagbarkeit.",
    frameworks: ["LangGraph Swarm", "AWS Strands Swarm", "Microsoft Agent Framework", "AutoGen / AG2"],
    icon: "Network",
    complexity: "Production",
    traits: ["Multi-Agent", "Adaptiv", "Async"],
    scenario:
      "Ein Schwarm aus Recherche-Agenten teilt sich eine Liste offener Quellen — wer frei ist, nimmt die nächste, kein zentraler Manager.",
    diagram: { type: "mesh", nodes: ["Agent A", "Agent B", "Agent C", "Agent D"], caption: "Peer-to-peer Koordination." },
    code: {
      framework: "LangGraph Swarm",
      language: "python",
      snippet: `swarm = Swarm(
  agents=[scout, scraper, summarizer],
  shared_state=task_pool,
)
# Jeder Agent zieht Aufgaben aus dem Pool
# und kann andere triggern.
await swarm.run()`,
    },
    related: [
      { name: "Blackboard", kind: "combines", note: "Blackboard ist häufiger Shared-State." },
      { name: "Supervisor", kind: "contrasts", note: "Zentral statt dezentral." },
    ],
  }),
  p({
    name: "Group Chat",
    domain: "Zusammenarbeit",
    aliases: ["Multi-Agent Chat", "Round-Robin Conversation"],
    idea: "Mehrere Agenten unterhalten sich in einem geteilten Konversationsraum, jeder kann auf jeden Beitrag reagieren. Eignet sich für offene Problemlösung, bei der unterschiedliche Perspektiven (Sicherheit, Performance, UX) sich gegenseitig schärfen. Tokenintensiv und schwer deterministisch zu machen — typischerweise braucht es einen Moderator-Agent, der die Runde steuert.",
    useWhen: ["Perspektiven zusammengeführt werden", "Diskussion Teil der Lösung ist", "Rollen flexibel interagieren"],
    avoidWhen: ["Determinismus wichtiger ist", "Tokenverbrauch niedrig bleiben muss", "Verantwortlichkeiten streng getrennt sind"],
    tradeoff: "Reichhaltige Interaktion gegen hohe Kosten.",
    frameworks: ["AutoGen / AG2", "Microsoft Agent Framework", "Google ADK", "LangGraph"],
    icon: "MessageSquare",
    complexity: "Production",
    traits: ["Multi-Agent", "Token-hungry"],
    scenario:
      "Ein Architektur-Review als Gruppen-Chat: Sicherheits-, Performance- und API-Agent diskutieren, ein Moderator-Agent fasst zusammen.",
    diagram: { type: "mesh", nodes: ["Sec", "Perf", "API", "Mod"], caption: "Geteilter Gesprächsraum." },
    code: {
      framework: "AutoGen / AG2",
      language: "python",
      snippet: `chat = GroupChat(
  agents=[security, performance, api, moderator],
  speaker_selection="auto",
)
manager = GroupChatManager(groupchat=chat)
await user.initiate_chat(manager, message=brief)`,
    },
    related: [
      { name: "Multi-Agent Debate", kind: "similar", note: "Debate ist eine zugespitzte Form mit Gegenargumenten." },
      { name: "Blackboard", kind: "contrasts", note: "Blackboard nutzt Shared State statt Chat." },
    ],
  }),
  p({
    name: "Multi-Agent Debate",
    domain: "Zusammenarbeit",
    aliases: ["Debate", "Adversarial Agents"],
    idea: "Agenten werden gezielt auf widersprüchliche Positionen angesetzt (Pro vs. Contra, optional ein Schiedsrichter). Strukturierte Gegenrede macht versteckte Annahmen sichtbar, die ein einzelner Agent — oder ein zustimmender Group Chat — überlesen würde. Funktioniert besonders bei kontroversen, einseitig kippbaren Entscheidungen, weniger bei Faktenfragen.",
    useWhen: ["Fragestellung kontrovers ist", "Gegenargumente Fehler sichtbar machen", "Entscheidung geprüft werden soll"],
    avoidWhen: ["Faktenlage einfach validierbar ist", "Debatte Scheinkonflikte erzeugt", "Tokenbudget knapp ist"],
    tradeoff: "Bessere Prüfung gegen Aufwand.",
    frameworks: ["AutoGen / AG2", "LangGraph", "Microsoft Agent Framework", "Google ADK"],
    icon: "MessageSquare",
    complexity: "Production",
    traits: ["Multi-Agent", "Robustheit", "Token-hungry"],
    scenario:
      "Bei Bauchplanungs-Entscheidungen treten Pro- und Contra-Agent gegen einen Schiedsrichter an. Der Schiedsrichter dokumentiert die Risiken vor der Empfehlung.",
    diagram: { type: "mesh", nodes: ["Pro", "Contra", "Judge"], caption: "Strukturierte Gegenrede." },
    code: {
      framework: "AutoGen / AG2",
      language: "python",
      snippet: `pro    = Agent("Argumentiere für die These.")
contra = Agent("Argumentiere gegen die These.")
judge  = Agent("Wäge ab und entscheide.")
debate(pro, contra, judge, rounds=3)`,
    },
    related: [
      { name: "Group Chat", kind: "similar", note: "Debate hat klare Rollen statt offen." },
      { name: "Self-Consistency", kind: "contrasts", note: "Statt Stimmen zu zählen, werden Argumente gewogen." },
    ],
  }),
  p({
    name: "Magentic",
    domain: "Zusammenarbeit",
    aliases: ["Magentic-One", "Composite Orchestration"],
    idea: "Composite-Architektur aus Microsofts Magentic-One: Ein Lead-Agent plant, hält ein Task Ledger und delegiert dynamisch an Spezialisten (WebSurfer, FileAgent, Coder, …). Bei Hindernissen wird replant statt abgebrochen. Gedacht für offene, lange laufende Aufgaben, die mit einem einzelnen Agenten nicht lösbar sind — entsprechend hoch sind Setup-Aufwand und Kosten.",
    useWhen: ["Aufgaben offen sind", "Spezialisten koordiniert handeln", "Autonomie über längere Horizonte nötig ist"],
    avoidWhen: ["Ein einfacher Workflow reicht", "Jeder Schritt deterministisch sein muss", "Betriebskosten eng begrenzt sind"],
    tradeoff: "Große Aufgabenabdeckung gegen hohe Komplexität.",
    frameworks: ["Microsoft Agent Framework", "AutoGen / AG2 Magentic-One", "LangGraph"],
    icon: "Sparkles",
    complexity: "Production",
    traits: ["Multi-Agent", "Production", "Token-hungry"],
    scenario:
      "Ein Produktivitätsassistent erhält eine offene Aufgabe ('Plane meinen Konferenzbesuch'). Magentic plant, delegiert an Web-, File- und Code-Spezialisten und repliziert bei Hindernissen.",
    diagram: { type: "supervisor", nodes: ["Magentic", "WebSurfer", "FileAgent", "Coder"], caption: "Lead + spezialisierter Schwarm." },
    code: {
      framework: "Microsoft Agent Framework",
      language: "python",
      snippet: `team = MagenticOne(
  llm=client,
  agents=[WebSurfer(), FileAgent(), Coder()],
)
plan = team.plan(task)
await team.execute(plan, max_steps=20)`,
    },
    related: [
      { name: "Plan-and-Execute", kind: "combines", note: "Magentic plant, kann aber replanen." },
      { name: "Supervisor", kind: "similar", note: "Magentic ist ein Supervisor mit Task-Ledger." },
    ],
  }),
  p({
    name: "Blackboard",
    domain: "Zusammenarbeit",
    aliases: ["Shared Workspace", "Shared State Coordination"],
    idea: "Statt direkt miteinander zu reden, schreiben Agenten Erkenntnisse, Hypothesen und Ergebnisse auf eine gemeinsame Tafel. Ein Agent, dessen Trigger-Bedingung erfüllt ist, übernimmt — auch ohne explizit gerufen worden zu sein. Klassisches KI-Muster für asynchrone Kollaboration; in modernen Agent-Systemen meist als geteilter State im Graph implementiert.",
    useWhen: ["Viele Agents asynchron beitragen", "Gemeinsamer Zustand wichtiger ist als Chat", "Zwischenergebnisse persistent sein sollen"],
    avoidWhen: ["Lineare Kontrolle nötig ist", "Zustandskonsistenz ungesichert ist", "Chat-Kontext reicht"],
    tradeoff: "Entkoppelte Zusammenarbeit gegen State-Management-Aufwand.",
    frameworks: ["LangGraph", "AWS Strands", "Microsoft Agent Framework", "AutoGen / AG2"],
    icon: "CircuitBoard",
    complexity: "Production",
    traits: ["Multi-Agent", "Stateful", "Async"],
    scenario:
      "Ein Logistik-System: Routing-, Bestand- und Forecast-Agent schreiben fortlaufend Erkenntnisse auf das Blackboard. Wer eine passende Bedingung erkennt, übernimmt.",
    diagram: { type: "agent-store", nodes: ["Agents", "Blackboard"], caption: "Geteilter Zustand statt direkte Calls." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `class Blackboard(TypedDict):
  facts: dict
  proposals: list

# Jeder Agent liest und schreibt Felder
# in derselben State-Map.`,
    },
    related: [
      { name: "Swarm", kind: "combines", note: "Swarm nutzt Blackboard für Koordination." },
      { name: "Group Chat", kind: "contrasts", note: "Chat persistiert nicht den Zustand." },
    ],
  }),
  p({
    name: "Contract Net",
    domain: "Zusammenarbeit",
    aliases: ["Task Bidding", "Contract Net Protocol"],
    idea: "Aufgaben werden ausgeschrieben, Worker bieten mit Selbstauskunft (Kapazität, ETA, Kosten), der Auftraggeber wählt das beste Gebot. Erlaubt dynamische Allokation in heterogenen Worker-Pools ohne harte Vorab-Zuteilung. Steht und fällt mit der Verlässlichkeit der Selbstauskünfte und den Kosten der Bietrunden.",
    useWhen: ["Aufgaben dynamisch verteilt werden", "Agenten unterschiedliche Kapazitäten haben", "Auswahlkriterien explizit sind"],
    avoidWhen: ["Delegation fest vorgegeben ist", "Bietlogik zu teuer ist", "Selbstauskünfte unzuverlässig sind"],
    tradeoff: "Flexible Verteilung gegen Aushandlungsaufwand.",
    frameworks: ["LangGraph", "AutoGen / AG2", "Microsoft Agent Framework"],
    icon: "HandCoins",
    complexity: "Production",
    traits: ["Multi-Agent", "Async"],
    scenario:
      "Ein Manager-Agent ruft 'Wer kann diese Datenanalyse in unter 5 Minuten?' aus. Drei Worker-Agenten antworten mit Geboten, der Manager wählt das beste.",
    diagram: { type: "supervisor", nodes: ["Auctioneer", "Bidder A", "Bidder B", "Bidder C"], caption: "Ausschreibung + Auswahl." },
    code: {
      framework: "AutoGen / AG2",
      language: "pseudo",
      snippet: `task = manager.announce(spec)
bids = [w.bid(task) for w in workers]
winner = pick_best(bids)
result = winner.execute(task)`,
    },
    related: [
      { name: "Market-based", kind: "similar", note: "Ähnliche Idee mit Preis statt Bid-Bedingungen." },
      { name: "Supervisor", kind: "contrasts", note: "Supervisor wählt direkt, Contract Net lässt bieten." },
    ],
  }),
  p({
    name: "Market-based",
    domain: "Zusammenarbeit",
    aliases: ["Market Mechanism", "Price-based Coordination"],
    idea: "Knappe Ressourcen werden über Preise, Budgets oder Nutzenfunktionen verteilt — wer mehr 'zahlt', bekommt sie. Skaliert in großen Agentenpopulationen, wo zentrale Allokation versagt. Anreizdesign ist tückisch: Falsche Nutzenfunktionen führen zu pathologischen Optimierungen ('cost hacking'), bei denen Agenten Schlupflöcher ausnutzen statt das Ziel zu lösen.",
    useWhen: ["Ressourcen knapp sind", "Priorisierung über Kosten erfolgen soll", "Viele Agenten konkurrieren"],
    avoidWhen: ["Compliance zentrale Vorgaben braucht", "Nutzenfunktion unklar ist", "Kein Ressourcenkonflikt besteht"],
    tradeoff: "Skalierbare Allokation gegen schwieriges Anreizdesign.",
    frameworks: ["LangGraph", "AWS Strands", "AutoGen / AG2"],
    icon: "HandCoins",
    complexity: "Production",
    traits: ["Multi-Agent", "Async"],
    scenario:
      "Mehrere Daten-Agenten konkurrieren um GPU-Slots. Wer mehr Nutzen pro Sekunde bietet (höhere Priorität), bekommt den Slot.",
    diagram: { type: "supervisor", nodes: ["Market", "Agent A", "Agent B", "Agent C"], caption: "Preise als Steuerungssignal." },
    code: {
      framework: "AWS Strands",
      language: "pseudo",
      snippet: `market = Market(resource="gpu_slot")
for agent in agents:
  market.offer(agent, price=agent.utility)
slot.assign(market.winner())`,
    },
    related: [
      { name: "Contract Net", kind: "similar", note: "Bid mit fester Spezifikation statt Preis." },
    ],
  }),
  p({
    name: "Agents-as-Tools",
    domain: "Zusammenarbeit",
    aliases: ["Callable Agents", "Specialist-as-Tool"],
    idea: "Spezialisten werden hinter einer typisierten Funktionsschnittstelle versteckt und vom Hauptagent wie normale Tools aufgerufen — der innere Reasoning-Loop des Spezialisten bleibt unsichtbar. Schafft Kapselung und Rechtebegrenzung, hält die Kontrolle zentral. Verliert die Eigenständigkeit echter Multi-Agent-Kooperation — bei langen autonomen Strecken ist Handoff oft passender.",
    useWhen: ["Spezialisten gekapselt genutzt werden", "Hauptagent Kontrolle behält", "Tool-Sets getrennt werden"],
    avoidWhen: ["Gleichberechtigte Kooperation nötig ist", "Spezialisten lange Autonomie brauchen", "Schnittstellen instabil sind"],
    tradeoff: "Gute Kapselung gegen begrenzte Eigenständigkeit.",
    frameworks: ["AWS Strands", "OpenAI Agents SDK", "LangGraph", "Microsoft Agent Framework", "Google ADK"],
    icon: "Plug",
    complexity: "Fortgeschritten",
    traits: ["Multi-Agent", "Kontrollierbar"],
    scenario:
      "Der Haupt-Agent ruft 'translate_agent(text, lang)' wie ein Tool auf — der Übersetzer hat eigene Logik, aber der Hauptagent steuert Aufruf und Ergebnis.",
    diagram: { type: "supervisor", nodes: ["Main", "Translator", "Coder", "Searcher"], caption: "Spezialisten als Funktionsaufrufe." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `translator = Agent(...)
main = Agent(
  tools=[translator.as_tool(name="translate")]
)
await Runner.run(main, query)`,
    },
    related: [
      { name: "Function Calling", kind: "similar", note: "Spezialisten als typisierte Funktionen." },
      { name: "Handoff", kind: "contrasts", note: "Handoff übergibt Kontrolle, Agents-as-Tools bleibt zentral." },
    ],
  }),
  p({
    name: "Graph-based Orchestration",
    domain: "Zusammenarbeit",
    aliases: ["Agent Graph", "State Graph Orchestration"],
    idea: "Anstatt impliziter Kontrolle (durch Prompt oder Konvention) werden Knoten und Kanten als Code modelliert — testbar, deterministisch, mit klar definierten Übergangsbedingungen. Ermöglicht Zyklen, Verzweigungen, Parallelität und HITL-Pausen als gewohnte Graph-Operationen. Modellierungsaufwand höher, dafür Steuerbarkeit und Observability deutlich besser — der Standardansatz für produktionsreife Multi-Agent-Systeme.",
    useWhen: ["Koordination testbar sein soll", "Zyklen und Handoffs modelliert werden", "Komplexe Flüsse stabil laufen"],
    avoidWhen: ["Linearer Workflow reicht", "Graphpflege zu teuer ist", "Emergenz wichtiger ist"],
    tradeoff: "Hohe Steuerbarkeit gegen Modellierungsaufwand.",
    frameworks: ["LangGraph", "AWS Strands Graph", "Microsoft Agent Framework", "Google ADK", "CrewAI Flows"],
    icon: "GitBranch",
    complexity: "Production",
    traits: ["Multi-Agent", "Kontrollierbar", "Erklärbar"],
    scenario:
      "Eine Customer-Onboarding-Pipeline mit Verzweigungen, Wartezuständen und HITL-Schritten ist als State Graph modelliert — testbar, wiederholbar, observierbar.",
    diagram: { type: "branch", nodes: ["Start", "Verify", "Notify", "End"], caption: "Knoten + Übergänge als Code." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `g = StateGraph(State)
g.add_node("verify", verify_user)
g.add_node("notify", send_welcome)
g.add_edge("verify", "notify")
g.add_edge("notify", END)
app = g.compile(checkpointer=mem)`,
    },
    related: [
      { name: "Workflow DAG / Durable Execution", kind: "similar", note: "DAG ist die persistente Variante." },
      { name: "Supervisor", kind: "combines", note: "Supervisor-Knoten häufig als Graph-Knoten." },
    ],
  }),
];

export const systemPatterns: Pattern[] = [
  p({
    name: "Conversational Memory",
    domain: "Systembetrieb",
    aliases: ["Chat History", "Conversation Buffer"],
    idea: "Die bisherige Konversation wird zwischengespeichert und bei jedem neuen Turn in den LLM-Call gepackt, damit der Agent Bezugnahmen wie 'wie eben gesagt' versteht. Einfachste Form von Memory — im Prinzip nur ein wachsendes Array. Kollidiert irgendwann mit dem Kontextfenster und mit dem Tokenbudget — dann braucht es Compressed Context oder Episodic Memory.",
    useWhen: ["Nutzerkontext erhalten bleibt", "Bezugnahmen erwartet werden", "Gesprächsfluss wichtig ist"],
    avoidWhen: ["Datenschutz Speicherung verbietet", "Historie Tokens verschwendet", "Aufgaben zustandslos sind"],
    tradeoff: "Besserer Kontext gegen Datenschutz- und Tokenaufwand.",
    frameworks: ["LangChain", "LangGraph", "OpenAI Agents SDK", "Microsoft Agent Framework"],
    subdomain: "Memory Architecture",
    icon: "MessageSquare",
    complexity: "Einsteiger",
    traits: ["Stateful"],
    scenario:
      "Ein Chatbot erinnert sich, dass der Nutzer drei Turns vorher seinen Wohnort genannt hat — und kann passende Folgefragen stellen.",
    diagram: { type: "agent-store", nodes: ["Agent", "Chat-Historie"], caption: "Turn-für-Turn Speicher." },
    code: {
      framework: "LangChain",
      language: "python",
      snippet: `memory = ConversationBufferMemory()
chain = ConversationChain(
  llm=llm, memory=memory
)
chain.run("Was war meine letzte Frage?")`,
    },
    related: [
      { name: "Compressed Context Memory", kind: "combines", note: "Verdichtet alte Turns, wenn der Verlauf wächst." },
      { name: "Episodic Memory", kind: "contrasts", note: "Episodic speichert ganze Aufgaben, nicht nur Turns." },
    ],
  }),
  p({
    name: "Episodic Memory",
    domain: "Systembetrieb",
    aliases: ["Experience Memory", "Task Episode Store"],
    idea: "Vollständige Aufgaben oder Konversationen werden als 'Episoden' (mit Ziel, Verlauf, Ausgang, Zeitpunkt) abgelegt und beim Auftauchen ähnlicher Fälle abgerufen. Vergleichbar mit menschlichem Erfahrungsgedächtnis: 'Beim letzten Mal hat X funktioniert.' Pflegeaufwand und Datenschutz begrenzen, was sinnvoll persistiert werden kann — alte oder fehlerhafte Episoden vergiften neue Entscheidungen.",
    useWhen: ["Frühere Fälle hilfreich sind", "Aufgaben wiederkehren", "Zeit, Ziel und Ergebnis relevant sind"],
    avoidWhen: ["Fälle veraltet sind", "Personendaten problematisch sind", "Semantische Wissensbasis reicht"],
    tradeoff: "Erfahrungswissen gegen Kurationsaufwand.",
    frameworks: ["LangGraph", "AutoGen / AG2", "Microsoft Agent Framework", "CrewAI"],
    subdomain: "Memory Architecture",
    icon: "Database",
    complexity: "Fortgeschritten",
    traits: ["Stateful", "Erklärbar"],
    scenario:
      "Ein Service-Agent merkt sich erfolgreich gelöste Beschwerden mit Kontext, Lösung und Ausgang. Beim nächsten ähnlichen Fall greift er darauf zurück.",
    diagram: { type: "agent-store", nodes: ["Agent", "Episoden-Store"], caption: "Episoden als Erinnerungen." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `class Episode(TypedDict):
  task: str; outcome: str; ts: datetime

# Bei Aufgabenstart: relevante Episoden
# per Embedding-Suche laden.
hits = store.search(task, k=3)`,
    },
    related: [
      { name: "Vector Memory", kind: "combines", note: "Episoden werden meist über Embeddings gefunden." },
      { name: "Conversational Memory", kind: "contrasts", note: "Conversational ist Turn-Level, nicht Aufgabenlevel." },
    ],
  }),
  p({
    name: "Semantic Memory",
    domain: "Systembetrieb",
    aliases: ["Knowledge Memory", "Long-Term Knowledge"],
    idea: "Faktenwissen, Domänenkonzepte und Policies werden langfristig gespeichert — losgelöst von einer einzelnen Konversation oder Aufgabe. Der Abruf läuft typischerweise über Embedding-Suche oder strukturierte Queries als RAG-Backend. Pflege und Aktualität sind die Kernfragen; veraltetes 'Wissen' richtet mehr Schaden als Nutzen an.",
    useWhen: ["Domänenwissen langfristig genutzt wird", "Fakten wiederverwendet werden", "Retrieval über Sitzungen nötig ist"],
    avoidWhen: ["Wissen schnell veraltet", "Governance fehlt", "Prompt-Kontext reicht"],
    tradeoff: "Wiederverwendbares Wissen gegen Qualitätsrisiken.",
    frameworks: ["LangChain", "LangGraph", "OpenAI Agents SDK", "Google ADK"],
    subdomain: "Memory Architecture",
    icon: "Database",
    complexity: "Fortgeschritten",
    traits: ["Stateful", "Erklärbar"],
    scenario:
      "Eine interne Wissensbasis mit Produktdaten, FAQs und Policies wird semantisch durchsuchbar gemacht — alle Agenten ziehen daraus.",
    diagram: { type: "agent-store", nodes: ["Agent", "Knowledge Base"], caption: "Faktenwissen über Sitzungen hinweg." },
    code: {
      framework: "LangChain",
      language: "python",
      snippet: `kb = VectorStore.from_documents(docs)
context = kb.similarity_search(query, k=4)
answer = llm.invoke(prompt(query, context))`,
    },
    related: [
      { name: "Vector Memory", kind: "similar", note: "Semantic Memory wird häufig als Vector Memory umgesetzt." },
      { name: "Graph Memory", kind: "contrasts", note: "Graph speichert Beziehungen statt Texte." },
    ],
  }),
  p({
    name: "Working Memory / Scratchpad",
    domain: "Systembetrieb",
    aliases: ["Scratchpad", "Task State"],
    idea: "Pro Aufgabe ein flüchtiger Notizblock: Tool-Ergebnisse, Zwischengedanken, lokale Variablen. Lebt nur während eines Laufs und wird mit Aufgabenende verworfen. Pflicht-Komponente für jeden mehrschrittigen Agenten, in modernen Frameworks meist als Graph-State umgesetzt — das technische Pendant zum Kurzzeitgedächtnis.",
    useWhen: ["Mehrschrittige Aufgaben Zustand brauchen", "Tool-Ergebnisse referenziert werden", "Ausführung nachvollziehbar sein soll"],
    avoidWhen: ["Aufgabe atomar ist", "Zwischengedanken nicht gespeichert werden dürfen", "Persistenz über Läufe nötig ist"],
    tradeoff: "Steuerbarkeit gegen State-Verwaltung.",
    frameworks: ["LangGraph State", "OpenAI Agents SDK", "Microsoft Agent Framework"],
    subdomain: "Memory Architecture",
    icon: "Save",
    complexity: "Einsteiger",
    traits: ["Stateful"],
    scenario:
      "Ein ReAct-Agent führt einen Notizblock mit allen Tool-Ergebnissen und Zwischenüberlegungen — pro Aufgabe, nicht pro Sitzung.",
    diagram: { type: "agent-store", nodes: ["Agent", "Scratchpad"], caption: "Lokaler Arbeitsspeicher pro Lauf." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `class State(TypedDict):
  notes: list[str]
  tool_results: dict
# Jeder Knoten liest/schreibt diese Felder
# innerhalb eines Laufs.`,
    },
    related: [
      { name: "Checkpointing / Resumability", kind: "combines", note: "Checkpointing macht Working Memory persistent." },
    ],
  }),
  p({
    name: "Vector Memory",
    domain: "Systembetrieb",
    aliases: ["Vector Store Memory", "RAG Memory"],
    idea: "Inhalte werden in Embedding-Vektoren überführt und über Ähnlichkeit (Cosinus, Dot-Product) wiedergefunden — Wortlaut spielt keine Rolle, Bedeutung schon. Die Standardimplementierung für Semantic Memory und RAG. Schwächen: schlechtes Ranking bei polysemen Termini, Drift bei Modell- oder Embedder-Updates, falsche Treffer durch oberflächliche Ähnlichkeit.",
    useWhen: ["Große Wissensmengen gesucht werden", "Wortlaut variieren kann", "RAG benötigt wird"],
    avoidWhen: ["Exakte relationale Abfragen zentral sind", "Aktualität schwer kontrollierbar ist", "Ähnlichkeit falsche Treffer erzeugt"],
    tradeoff: "Flexibles Retrieval gegen Ranking-Probleme.",
    frameworks: ["LangChain", "LangGraph", "OpenAI Vector Stores"],
    subdomain: "Memory Architecture",
    icon: "Search",
    complexity: "Einsteiger",
    traits: ["Stateful"],
    scenario:
      "Beim Onboarding-Bot werden alle Mitarbeiter-Handbücher embedded und durchsuchbar — die Agenten finden Antworten unabhängig vom Wortlaut der Frage.",
    diagram: { type: "agent-store", nodes: ["Agent", "Vector DB"], caption: "Embedding-basierte Suche." },
    code: {
      framework: "LangChain",
      language: "python",
      snippet: `index = Chroma.from_documents(docs, embedder)
hits = index.similarity_search(query, k=5)
ctx = "\\n".join(h.page_content for h in hits)`,
    },
    related: [
      { name: "Semantic Memory", kind: "similar", note: "Vector Memory ist die Implementierung dafür." },
      { name: "Graph Memory", kind: "contrasts", note: "Graph nutzt Beziehungen statt Ähnlichkeit." },
    ],
  }),
  p({
    name: "Graph Memory",
    domain: "Systembetrieb",
    aliases: ["Knowledge Graph Memory", "Entity-Relation Memory"],
    idea: "Statt Texte werden Entitäten und ihre typisierten Beziehungen modelliert — Personen, Firmen, Dokumente und ihre Verbindungen. Ermöglicht Multi-Hop-Queries ('Wer arbeitet bei einer Tochterfirma von X?'), die Vector Search nicht beantworten kann. Hoher Modellierungs- und Pflegeaufwand, lohnt sich bei beziehungsschweren Domänen wie Compliance, Forschung oder CRM.",
    useWhen: ["Beziehungen entscheidend sind", "Herkunft erklärbar sein muss", "Agenten über Fakten navigieren"],
    avoidWhen: ["Unstrukturierter Abruf genügt", "Graphschema unklar ist", "Pflege zu teuer ist"],
    tradeoff: "Erklärbarkeit gegen Modellierungsaufwand.",
    frameworks: ["LangGraph", "Microsoft Agent Framework", "Google ADK"],
    subdomain: "Memory Architecture",
    icon: "Network",
    complexity: "Production",
    traits: ["Stateful", "Erklärbar"],
    scenario:
      "Ein Compliance-Agent navigiert über (Person)–[arbeitet_bei]→(Firma)–[Tochter_von]→(Konzern), um Konflikte zu erkennen, die ein Vector Search nicht findet.",
    diagram: { type: "agent-store", nodes: ["Agent", "Graph DB"], caption: "Entitäten + Beziehungen." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `# Cypher-Query gegen Neo4j
query = """
MATCH (p:Person)-[:WORKS_AT]->(c:Company)
WHERE p.name = $name RETURN c
"""`,
    },
    related: [
      { name: "Vector Memory", kind: "contrasts", note: "Beziehungen statt Ähnlichkeit." },
    ],
  }),
  p({
    name: "Compressed Context Memory",
    domain: "Systembetrieb",
    aliases: ["Context Compression", "Rolling Summary"],
    idea: "Wenn die Konversation länger wird als das Kontextfenster, werden ältere Teile zu einer Zusammenfassung verdichtet, neuere bleiben wortgenau. Hält den effektiv nutzbaren Verlauf weit über das physische Window hinaus. Verlustig: Wortlaut, exakte Zitate und subtile Details — was, je nach Aufgabe, akzeptabel oder kritisch ist.",
    useWhen: ["Gespräche lange laufen", "Tokenbudget begrenzt ist", "Alte Information relevant bleibt"],
    avoidWhen: ["Wortlaut exakt bleiben muss", "Zusammenfassung Verlust erzeugt", "Kurze Kontexte reichen"],
    tradeoff: "Mehr nutzbarer Verlauf gegen Detailverlust.",
    frameworks: ["LangChain", "LangGraph", "AutoGen / AG2"],
    subdomain: "Memory Architecture",
    icon: "Layers",
    complexity: "Fortgeschritten",
    traits: ["Cost-bewusst"],
    scenario:
      "Bei einem 50-Turn-Gespräch wird alles vor dem zehntletzten Turn als Rolling Summary verdichtet — das Window bleibt klein.",
    diagram: { type: "linear", nodes: ["Verlauf", "Summarize", "Summary + neue Turns"], caption: "Verdichten statt streichen." },
    code: {
      framework: "LangChain",
      language: "python",
      snippet: `memory = ConversationSummaryBufferMemory(
  llm=llm, max_token_limit=2000
)`,
    },
    related: [
      { name: "Conversational Memory", kind: "combines", note: "Wird auf Conversational Memory aufgesetzt." },
    ],
  }),

  p({
    name: "Function Calling",
    domain: "Systembetrieb",
    aliases: ["Tool Calling", "Structured Tool Use"],
    idea: "Das Modell gibt nicht Freitext aus, sondern eine strukturierte Aufruf-Spezifikation: Funktionsname plus typisierte Argumente. Die Argumentvalidierung passiert auf Schemaebene, bevor irgendwas ausgeführt wird. Standard-Mechanismus für Tool-Use bei allen großen Anbietern — schemastreng, observable und sicherer als Freitext-Parsing.",
    useWhen: ["Externe Aktionen kontrolliert eingebunden werden", "Argumente validierbar sein müssen", "Tool-Use beobachtbar bleibt"],
    avoidWhen: ["Aufgabe ohne Aktion lösbar ist", "Tool-Schema instabil ist", "Freitext besser passt"],
    tradeoff: "Kontrolle gegen Schema-Aufwand.",
    frameworks: ["OpenAI Agents SDK", "LangGraph", "Microsoft Agent Framework"],
    subdomain: "Tool Integration",
    icon: "Hammer",
    complexity: "Einsteiger",
    traits: ["Tool-lastig", "Kontrollierbar", "Sicherheit"],
    scenario:
      "Statt 'rufe diese URL ab' im Prompt liefert das Modell `{name: 'fetch', args: {url: '...'}}` — typsicher, validierbar, observierbar.",
    diagram: { type: "supervisor", nodes: ["LLM", "Tool A", "Tool B", "Tool C"], caption: "Strukturierter Tool-Aufruf." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `@function_tool
def fetch(url: str) -> str:
  return requests.get(url).text

agent = Agent(tools=[fetch])`,
    },
    related: [
      { name: "MCP (Model Context Protocol)", kind: "similar", note: "MCP ist standardisiertes Function Calling über Prozessgrenzen." },
      { name: "Tool Registry", kind: "combines", note: "Registry verwaltet viele Function-Tools." },
    ],
  }),
  p({
    name: "Tool Registry",
    domain: "Systembetrieb",
    aliases: ["Capability Catalog", "Tool Catalog"],
    idea: "Statt Tools per Hand pro Agent zu konfigurieren, werden sie in einem zentralen Katalog gepflegt — mit Schema, Versionierung, Berechtigungen und Beschreibungen. Agenten ziehen die für sie sichtbaren Tools daraus. Pflicht ab ein paar Dutzend Tools; Schmerzen entstehen, wenn die Beschreibungen schlecht sind und die Auswahl daran scheitert.",
    useWhen: ["Viele Tools verwaltet werden", "Versionierung wichtig ist", "Tools von mehreren Agenten genutzt werden"],
    avoidWhen: ["Wenige statische Tools existieren", "Registry nicht gepflegt wird", "Beschreibungen schlechte Auswahl erzeugen"],
    tradeoff: "Governance gegen Pflegeaufwand.",
    frameworks: ["OpenAI Agents SDK", "LangGraph", "Google ADK"],
    subdomain: "Tool Integration",
    icon: "Boxes",
    complexity: "Fortgeschritten",
    traits: ["Production", "Sicherheit"],
    scenario:
      "Eine zentrale Registry hält 80 Tools mit Schema, Beschreibung und Rollenrechten. Agenten ziehen die für sie sichtbaren Tools beim Start.",
    diagram: { type: "agent-store", nodes: ["Agent", "Tool Registry"], caption: "Zentraler Katalog." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `registry = ToolRegistry()
registry.register(fetch, scope="reader")
registry.register(write_db, scope="admin")
agent = Agent(tools=registry.for_role(role))`,
    },
    related: [
      { name: "Permission-scoped Tools", kind: "combines", note: "Registry trägt Rechte je Tool." },
      { name: "Capability Routing", kind: "combines", note: "Routing nutzt Registry zur Auswahl." },
    ],
  }),
  p({
    name: "MCP (Model Context Protocol)",
    domain: "Systembetrieb",
    aliases: ["MCP-based Tool Integration", "MCP Server"],
    idea: "Model Context Protocol ist ein offener Standard, über den Modelle Tools und Kontextquellen frameworkübergreifend einbinden — ein einmal gebauter MCP-Server für Jira funktioniert mit jedem MCP-fähigen Client. Reduziert das N×M-Connector-Problem zu N+M und schafft echte Interoperabilität. Operative Komplexität (Auth, Sandboxing, Versionierung) ist allerdings nicht trivial.",
    useWhen: ["Tools frameworkübergreifend nutzbar sein sollen", "Lokale Systeme angebunden werden", "Kontextzugriff standardisiert wird"],
    avoidWhen: ["Direkte SDK-Integration reicht", "Sicherheitsmodell ungeklärt ist", "Protokollbetrieb zu komplex ist"],
    tradeoff: "Interoperabilität gegen Betriebsaufwand.",
    frameworks: ["OpenAI Agents SDK", "LangGraph", "Claude Desktop"],
    subdomain: "Tool Integration",
    icon: "Plug",
    complexity: "Fortgeschritten",
    traits: ["Production", "Tool-lastig"],
    scenario:
      "Statt jeder Agent-Plattform einen eigenen Connector zu schreiben, wird ein MCP-Server für Jira gebaut — alle Frameworks nutzen ihn ohne Anpassung.",
    diagram: { type: "supervisor", nodes: ["Client", "MCP Server", "Resource A", "Resource B"], caption: "Standardisierter Tool-Bus." },
    code: {
      framework: "MCP SDK",
      language: "typescript",
      snippet: `server.tool("get_issue", {
  schema: { id: z.string() },
  handler: async ({ id }) => jira.fetch(id)
})`,
    },
    related: [
      { name: "Function Calling", kind: "similar", note: "MCP ist Function Calling über Prozessgrenzen." },
      { name: "Adapter Pattern", kind: "combines", note: "Adapter mappt interne APIs auf MCP." },
    ],
  }),
  p({
    name: "Adapter Pattern",
    domain: "Systembetrieb",
    aliases: ["Tool Adapter", "API Wrapper"],
    idea: "Eine Schicht zwischen Agent und externer API normalisiert unterschiedliche API-Stile, Fehlerlogik und Datenformate auf eine konsistente Tool-Schnittstelle. Der Agent muss APIs nicht kennen — er kennt nur 'get_weather(city, when)'. Klassisches GoF-Adapter-Pattern, übertragen auf Tool-Use; bezahlt wird mit einer zusätzlichen Wartungsschicht.",
    useWhen: ["APIs uneinheitlich sind", "Agenten einfache Tool-Verträge brauchen", "Fehlerlogik gekapselt werden soll"],
    avoidWhen: ["Native SDKs passen", "Adapter nur Durchreichung wäre", "Abstraktion Semantik versteckt"],
    tradeoff: "Stabilität gegen Wartungsschicht.",
    frameworks: ["OpenAI Agents SDK", "LangGraph", "Google ADK"],
    subdomain: "Tool Integration",
    icon: "Plug",
    complexity: "Einsteiger",
    traits: ["Sicherheit"],
    scenario:
      "Drei verschiedene Wetter-APIs werden hinter einem 'get_weather(city, when)'-Adapter versteckt. Der Agent kennt nur die einheitliche Form.",
    diagram: { type: "linear", nodes: ["Agent", "Adapter", "Externe API"], caption: "Stabile Schnittstelle vor instabiler API." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `def get_weather(city: str, when: date):
  if region(city) == "EU":
    return openmeteo(city, when)
  return weatherapi(city, when)`,
    },
    related: [
      { name: "Function Calling", kind: "combines", note: "Adapter wird oft als Function-Tool exposed." },
    ],
  }),
  p({
    name: "Capability Routing",
    domain: "Systembetrieb",
    aliases: ["Tool Selection", "Skill Routing"],
    idea: "Vor dem eigentlichen LLM-Call wird klassifiziert, welche Fähigkeiten die Anfrage braucht, und nur das passende Tool-Subset bereitgestellt. Hält den Tool-Katalog im Prompt überschaubar (5 statt 50 Tools), beschleunigt Auswahl und reduziert Fehlrouting. Der Klassifikator ist der Engpass — falsche Auswahl ist im LLM nicht mehr korrigierbar, weil das Tool nicht im Prompt steht.",
    useWhen: ["Viele Fähigkeiten verfügbar sind", "Auswahl Policy braucht", "Fehlende Fähigkeiten erkannt werden müssen"],
    avoidWhen: ["Toolauswahl trivial ist", "Beschreibungen unpräzise sind", "Routing nicht getestet wird"],
    tradeoff: "Flexibilität gegen Fehlzuordnung.",
    frameworks: ["LangGraph", "OpenAI Agents SDK", "Microsoft Agent Framework"],
    subdomain: "Tool Integration",
    icon: "Route",
    complexity: "Fortgeschritten",
    traits: ["Adaptiv"],
    scenario:
      "Bei großem Tool-Set wird vorgeschaltet entschieden, welche Subset von Tools für die Anfrage exposed wird — das Modell sieht nur 5 statt 50.",
    diagram: { type: "branch", nodes: ["Capability Router", "Skill A", "Skill B", "Skill C"], caption: "Skill-basierte Pfadwahl." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `def select_tools(query):
  needed = classify_capabilities(query)
  return registry.filter(needed)`,
    },
    related: [
      { name: "Routing", kind: "similar", note: "Routing auf Tool-Ebene statt Pfad-Ebene." },
      { name: "Tool Registry", kind: "combines", note: "Registry liefert die Auswahl." },
    ],
  }),
  p({
    name: "Permission-scoped Tools",
    domain: "Systembetrieb",
    aliases: ["Scoped Tools", "Permissioned Tools"],
    idea: "Tools tragen Berechtigungs-Scopes; ein Agent darf ein Tool nur aufrufen, wenn sein Run-Context den passenden Scope hat. Erzwingt das Least-Privilege-Prinzip auf Tool-Ebene — ein Read-only-Agent kann technisch keine destruktive Aktion auslösen. Kommt typischerweise mit Tool Registry und Audit Trail im Paket; Pflicht in Compliance- und Multi-Tenant-Szenarien.",
    useWhen: ["Tools sensitive Aktionen ausführen", "Agenten unterschiedliche Rechte brauchen", "Compliance relevant ist"],
    avoidWhen: ["Aktionen unkritisch sind", "Rechte nicht modellierbar sind", "Fragmentierung Bedienbarkeit senkt"],
    tradeoff: "Sicherheit gegen Verwaltungsaufwand.",
    frameworks: ["OpenAI Agents SDK", "Microsoft Agent Framework", "LangGraph"],
    subdomain: "Tool Integration",
    icon: "Lock",
    complexity: "Fortgeschritten",
    traits: ["Sicherheit", "Production"],
    scenario:
      "Ein Read-only-Agent darf 'list_orders', ein Admin-Agent zusätzlich 'cancel_order' — durchgesetzt im Tool-Layer, nicht im Prompt.",
    diagram: { type: "gate", nodes: ["Agent", "Permission Gate", "Tool"], caption: "Rechte vor Toolaufruf prüfen." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `@function_tool
def cancel_order(id: str, ctx: Context):
  require(ctx.role in {"admin"})
  api.cancel(id)`,
    },
    related: [
      { name: "Tool Registry", kind: "combines", note: "Registry hält Rechte je Tool." },
      { name: "Least Privilege Agent", kind: "similar", note: "Permission-scoped Tools setzen Least Privilege um." },
    ],
  }),

  p({
    name: "Actor Model",
    domain: "Systembetrieb",
    aliases: ["Actor-based Runtime", "Agent Actors"],
    idea: "Jede Einheit ist ein isolierter Actor mit eigenem Zustand und einer Mailbox; Kommunikation läuft ausschließlich über asynchrone Nachrichten — kein Shared Memory. Skaliert auf tausende parallele Agenten, jeder mit eigener Lebenszeit und Crash-Isolation. Klassisches Erlang-/Akka-Muster, in Agent-Systemen z. B. mit Microsoft Agent Framework oder AutoGen umgesetzt.",
    useWhen: ["Nebenläufigkeit wichtig ist", "Agenten eigenen Zustand besitzen", "Skalierung über Einheiten erfolgen soll"],
    avoidWhen: ["Synchroner Workflow reicht", "Nachrichtenmodell unnötig ist", "Globale Transaktionen zentral sind"],
    tradeoff: "Isolation gegen Fehlersemantik.",
    frameworks: ["Microsoft Agent Framework", "AutoGen / AG2", "AWS Strands"],
    subdomain: "Runtime Architecture",
    icon: "Cpu",
    complexity: "Production",
    traits: ["Async", "Stateful", "Production"],
    scenario:
      "Tausende Order-Agenten leben parallel als Actors, jeder mit seinem Bestell-Zustand. Sie tauschen nur Messages, kein Shared Memory.",
    diagram: { type: "mesh", nodes: ["Actor 1", "Actor 2", "Actor 3", "Actor 4"], caption: "Isolierte Akteure + Messages." },
    code: {
      framework: "Microsoft Agent Framework",
      language: "python",
      snippet: `class OrderActor(Actor):
  state: OrderState
  async def on_message(self, msg):
    self.state = reduce(self.state, msg)`,
    },
    related: [
      { name: "Pub/Sub Agent Mesh", kind: "combines", note: "Actors hängen oft an einem Pub/Sub-Bus." },
      { name: "Event-driven Choreography", kind: "similar", note: "Beide nachrichtenbasiert." },
    ],
  }),
  p({
    name: "Event-driven Choreography",
    domain: "Systembetrieb",
    aliases: ["Event Choreography", "Event-driven Agents"],
    idea: "Statt eines Orchestrators reagieren Komponenten auf Events: 'OrderPlaced' triggert Inventory- und Shipment-Agenten unabhängig voneinander. Lose Kopplung erlaubt nachträgliches Hinzufügen neuer Reagenten ohne Codeänderung an bestehenden. Die Kehrseite: Es gibt keinen einzelnen Ort, an dem 'der gesamte Ablauf' steht — Tracing und Debugging werden zur Detektivarbeit.",
    useWhen: ["Systeme lose gekoppelt sein sollen", "Ereignisse aus mehreren Quellen eintreffen", "Erweiterbarkeit wichtig ist"],
    avoidWhen: ["Globaler Ablauf streng kontrolliert werden muss", "Eventual Consistency nicht akzeptabel ist", "Tracing fehlt"],
    tradeoff: "Entkopplung gegen globale Kontrollschwierigkeit.",
    frameworks: ["AWS Strands", "Microsoft Agent Framework", "LangGraph"],
    subdomain: "Runtime Architecture",
    icon: "Radio",
    complexity: "Production",
    traits: ["Async", "Production"],
    scenario:
      "OrderPlaced → InventoryAgent reserviert, dann ShipmentAgent erstellt Versandauftrag — niemand orchestriert, alle hören mit.",
    diagram: { type: "branch", nodes: ["Event Bus", "Inventory", "Shipping", "Notify"], caption: "Reaktion auf Events." },
    code: {
      framework: "AWS Strands",
      language: "pseudo",
      snippet: `bus.on("OrderPlaced", inventory.reserve)
bus.on("OrderPlaced", shipping.schedule)
bus.on("InventoryReserved", notify.send)`,
    },
    related: [
      { name: "Pub/Sub Agent Mesh", kind: "combines", note: "Pub/Sub ist die typische Implementierung." },
      { name: "Actor Model", kind: "similar", note: "Beide reagieren auf Messages." },
    ],
  }),
  p({
    name: "Saga / Compensation",
    domain: "Systembetrieb",
    aliases: ["Saga Pattern", "Compensating Action"],
    idea: "Bei verteilten Aktionen ohne globale Transaktionen wird jede Aktion mit ihrer Kompensation gepaart (cancel_hotel, cancel_flight). Schlägt ein späterer Schritt fehl, werden frühere zurückgerollt — fachlich, nicht atomar. Pflichtmuster, sobald irreversible externe Aktionen im Spiel sind und sich die Welt nicht einfach atomar zurückdrehen lässt.",
    useWhen: ["Nebenwirkungen entstehen", "Verteilte Transaktionen fehlen", "Rücknahme fachlich möglich ist"],
    avoidWhen: ["Aktionen nicht kompensierbar sind", "Atomare Konsistenz erforderlich ist", "Freigabe Fehler besser verhindert"],
    tradeoff: "Robustheit gegen Kompensationslogik.",
    frameworks: ["AWS Strands Workflow", "Microsoft Agent Framework", "LangGraph"],
    subdomain: "Runtime Architecture",
    icon: "GitMerge",
    complexity: "Production",
    traits: ["Production", "Sicherheit"],
    scenario:
      "Bei Reisebuchung: Hotel buchen → Flug buchen → Auto buchen. Schlägt Auto fehl, kompensiert das System: Flug stornieren, Hotel stornieren.",
    diagram: { type: "linear", nodes: ["Step 1", "Step 2", "Step 3", "Compensate"], caption: "Vorwärts oder Rollback." },
    code: {
      framework: "AWS Strands Workflow",
      language: "pseudo",
      snippet: `saga = Saga()
saga.step(book_hotel, cancel_hotel)
saga.step(book_flight, cancel_flight)
saga.step(book_car, cancel_car)
saga.run()`,
    },
    related: [
      { name: "Workflow DAG / Durable Execution", kind: "combines", note: "Saga läuft typischerweise auf einem durable Workflow." },
    ],
  }),
  p({
    name: "Workflow DAG / Durable Execution",
    domain: "Systembetrieb",
    aliases: ["Durable Workflow", "DAG Orchestration"],
    idea: "Der Workflow läuft als gerichteter, kreisfreier Graph auf einer durable Execution-Engine: Zustand wird nach jedem Knoten persistiert, Crashes oder Wartezeiten unterbrechen den Lauf nicht final. Lange Läufe (Stunden, Tage, Wochen) werden produktionsfähig. Die nötige Infrastruktur — Postgres, Temporal, LangGraph Checkpointer — ist Pflicht, kein Beiwerk.",
    useWhen: ["Läufe lange dauern", "Zustände robust verwaltet werden", "Produktion Nachvollziehbarkeit verlangt"],
    avoidWhen: ["Aufgaben kurz sind", "Persistenz unnötig wäre", "Graphmodell nicht passt"],
    tradeoff: "Produktionsrobustheit gegen Infrastrukturaufwand.",
    frameworks: ["LangGraph", "AWS Strands Workflow", "Google ADK"],
    subdomain: "Runtime Architecture",
    icon: "Workflow",
    complexity: "Production",
    traits: ["Production", "Stateful"],
    scenario:
      "Ein Onboarding läuft Tage. Selbst wenn der Server neu startet, wird der Lauf vom letzten Knoten fortgesetzt — der Status liegt im Store.",
    diagram: { type: "linear", nodes: ["Verify", "Notify", "Wait", "Activate"], caption: "Persistierter Ausführungsgraph." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `app = graph.compile(checkpointer=postgres_saver)
config = {"configurable": {"thread_id": "user-42"}}
await app.ainvoke(payload, config=config)
# nach Crash: Lauf wird wiederaufgenommen.`,
    },
    related: [
      { name: "Checkpointing / Resumability", kind: "combines", note: "Macht den Workflow durable." },
      { name: "Saga / Compensation", kind: "combines", note: "Saga oft auf durable Workflow gebaut." },
    ],
  }),
  p({
    name: "Checkpointing / Resumability",
    domain: "Systembetrieb",
    aliases: ["State Checkpointing", "Resume from State"],
    idea: "Nach jedem Schritt (oder Knoten im Graph) wird der vollständige Zustand serialisiert und gespeichert. Beim nächsten Aufruf wird er hydratisiert und der Lauf fortgesetzt — auch nach Tagen Pause oder einem Server-Neustart. Grundlage für Durable Workflows und HITL-Pausen; Kosten sind Speicherbedarf, Schemastabilität und Datenschutz.",
    useWhen: ["Agentenläufe lang sind", "Externe Systeme ausfallen können", "Manuelle Prüfung nötig ist"],
    avoidWhen: ["Schritte billig wiederholbar sind", "Sensitive Daten unnötig persistiert würden", "Wiederaufnahme fachlich nicht sinnvoll ist"],
    tradeoff: "Ausfallsicherheit gegen Speicheraufwand.",
    frameworks: ["LangGraph", "Microsoft Agent Framework", "AWS Strands Workflow"],
    subdomain: "Runtime Architecture",
    icon: "Save",
    complexity: "Fortgeschritten",
    traits: ["Production", "Stateful"],
    scenario:
      "Ein Approval-Workflow wartet 3 Tage auf einen Freigeber. Der Lauf wird zwischendurch aus dem Memory gelöscht und beim Click neu hydratisiert.",
    diagram: { type: "loop", nodes: ["Schritt", "Checkpoint", "Pause / Resume"], caption: "State persistiert nach jedem Schritt." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `app = graph.compile(checkpointer=PostgresSaver(...))
# Pause:
state = app.get_state(config)
# Resume:
await app.ainvoke(None, config=config)`,
    },
    related: [
      { name: "Workflow DAG / Durable Execution", kind: "similar", note: "Checkpointing ist Bestandteil." },
      { name: "Human-in-the-Loop Approval Gate", kind: "combines", note: "HITL nutzt Pausen via Checkpoint." },
    ],
  }),
  p({
    name: "Pub/Sub Agent Mesh",
    domain: "Systembetrieb",
    aliases: ["Publish / Subscribe", "Message Bus Coordination"],
    idea: "Publisher schreiben in Topics, Subscriber empfangen — die beiden Seiten kennen einander nicht. Ein neuer Reporting-Agent abonniert 'OrderShipped' und ist sofort eingebunden, ohne dass bestehender Code angefasst wird. Skaliert exzellent, kostet aber bei Debugging: Welche Subscriber gibt es überhaupt für dieses Event, und in welcher Reihenfolge laufen sie?",
    useWhen: ["Viele Agenten lose gekoppelt werden", "Ereignisse mehrere Empfänger haben", "Erweiterbarkeit wichtig ist"],
    avoidWhen: ["Direkter Aufruf reicht", "Zustellung ungeklärt ist", "Beobachtbarkeit fehlt"],
    tradeoff: "Entkopplung gegen Debugging-Aufwand.",
    frameworks: ["AWS", "Microsoft Agent Framework", "LangGraph"],
    subdomain: "Runtime Architecture",
    icon: "Radio",
    complexity: "Production",
    traits: ["Async", "Production"],
    scenario:
      "Ein neuer Reporting-Agent abonniert das Topic 'OrderShipped' — kein bestehender Code wird angefasst, der Bus zustellt automatisch.",
    diagram: { type: "fanout", nodes: ["Publisher", "Sub A", "Sub B", "Sub C", "Bus"], caption: "Entkoppelte Verteilung." },
    code: {
      framework: "AWS",
      language: "pseudo",
      snippet: `bus.publish("OrderShipped", payload)
# anderswo:
bus.subscribe("OrderShipped", reporting_agent)`,
    },
    related: [
      { name: "Event-driven Choreography", kind: "similar", note: "Choreographie-Stil aufgesetzt auf Pub/Sub." },
      { name: "Actor Model", kind: "combines", note: "Actors abonnieren Topics." },
    ],
  }),

  p({
    name: "Human-in-the-Loop Approval Gate",
    domain: "Systembetrieb",
    aliases: ["HITL", "Human Approval"],
    idea: "Der Agent pausiert vor irreversiblen oder hochriskanten Aktionen und wartet auf eine menschliche Freigabe (oder Veto). Der pausierte State liegt im Checkpoint, der Approver bekommt Begründung, Risiko und Vorschlag. Nicht-verhandelbar bei Aktionen mit Geld-, Compliance- oder Sicherheitsdimension.",
    useWhen: ["Aktionen irreversible Folgen haben", "Compliance menschliche Entscheidung verlangt", "Unsicherheit sichtbar werden soll"],
    avoidWhen: ["Niedrigrisiko-Aktionen automatisch laufen können", "Freigaben symbolisch sind", "Latenz Prüfung ausschließt"],
    tradeoff: "Kontrolle gegen langsamere Abläufe.",
    frameworks: ["Google ADK", "OpenAI Agents SDK", "LangGraph"],
    subdomain: "Governance & Safety",
    icon: "ShieldCheck",
    complexity: "Production",
    traits: ["Sicherheit", "Production"],
    scenario:
      "Bevor der Agent eine Erstattung über 500 € auslöst, pausiert der Lauf — ein Mensch sieht Begründung und Höhe und gibt frei.",
    diagram: { type: "gate", nodes: ["Agent", "Approval Gate", "Approved", "Rejected"], caption: "Pausen + menschliche Freigabe." },
    code: {
      framework: "LangGraph",
      language: "python",
      snippet: `if action.risky:
  await pause_for_approval(action)
  if not approved(action):
    return abort()
execute(action)`,
    },
    related: [
      { name: "Checkpointing / Resumability", kind: "combines", note: "Pause + Resume nutzt Checkpoints." },
      { name: "Audit Trail", kind: "combines", note: "Freigaben werden protokolliert." },
    ],
  }),
  p({
    name: "Output Validation / Schema Enforcement",
    domain: "Systembetrieb",
    aliases: ["Structured Output Validation", "Schema Validation"],
    idea: "Die Modellantwort wird gegen ein striktes Schema (Pydantic, Zod, JSON Schema) geprüft, bevor sie in den Workflow weitergereicht wird. Fehlt ein Feld oder hat es den falschen Typ, wird der Schritt wiederholt — meist mit dem Validierungsfehler als Feedback. Erstickt halbgare Outputs früh und macht Downstream-Code radikal einfacher, weil er nur sauber strukturierte Daten sieht.",
    useWhen: ["Downstream-Systeme strukturierte Daten erwarten", "Fehler früh erkannt werden", "Automatisierte Verarbeitung folgt"],
    avoidWhen: ["Freiformtext Ziel ist", "Schema Antwort einschränkt", "Validierung fachlich blind ist"],
    tradeoff: "Zuverlässigkeit gegen weniger Ausdrucksfreiheit.",
    frameworks: ["OpenAI Structured Outputs", "LangGraph", "Google ADK"],
    subdomain: "Governance & Safety",
    icon: "CheckCircle2",
    complexity: "Einsteiger",
    traits: ["Sicherheit", "Kontrollierbar"],
    scenario:
      "Ein Agent muss eine Adresse extrahieren. Statt Freitext fordert das Schema {street, zip, city} — Validierung schlägt sofort fehl, wenn ein Feld fehlt.",
    diagram: { type: "gate", nodes: ["LLM", "Schema Check", "Pass", "Retry"], caption: "Strukturierte Antwort + Validation." },
    code: {
      framework: "OpenAI Structured Outputs",
      language: "python",
      snippet: `class Address(BaseModel):
  street: str; zip: str; city: str

reply = client.responses.parse(
  model="...", input=...,
  text_format=Address
)`,
    },
    related: [
      { name: "Function Calling", kind: "similar", note: "Auch schemabasiert, aber für Tools." },
      { name: "Loop", kind: "combines", note: "Bei Validierungsfehler Loop zurück zum Modell." },
    ],
  }),
  p({
    name: "Sandbox Execution",
    domain: "Systembetrieb",
    aliases: ["Isolated Execution", "Code Sandbox"],
    idea: "Vom Agenten generierter Code läuft in einer abgeschotteten Umgebung — Container, WASM, Firecracker — mit harten Limits für Memory, CPU, Netzzugriff und Laufzeit. Pflicht-Begleiter von CodeAct und allen Patterns mit `eval()`-Charakter. Ohne Sandbox ist 'Agent kann Code ausführen' eine offene Einladung zur Kompromittierung.",
    useWhen: ["Agenten Code oder Shell ausführen", "Untrusted Inputs verarbeitet werden", "Seiteneffekte begrenzt werden müssen"],
    avoidWhen: ["Keine Ausführung stattfindet", "Sandbox nicht kontrolliert ist", "Geprüfte Tools besser passen"],
    tradeoff: "Sicherheit gegen Infrastrukturaufwand.",
    frameworks: ["OpenAI Code Interpreter", "AutoGen / AG2", "LangGraph"],
    subdomain: "Governance & Safety",
    icon: "Terminal",
    complexity: "Production",
    traits: ["Sicherheit", "Production"],
    scenario:
      "Ein CodeAct-Agent darf Python ausführen — aber nur in einem Container ohne Netzzugriff und mit 256 MB RAM und 5 Sekunden Timeout.",
    diagram: { type: "agent-store", nodes: ["Agent", "Sandbox"], caption: "Isolierte Ausführung." },
    code: {
      framework: "OpenAI Code Interpreter",
      language: "python",
      snippet: `result = sandbox.run(
  code=snippet,
  timeout=5, memory_mb=256,
  network=False
)`,
    },
    related: [
      { name: "CodeAct", kind: "combines", note: "Sandbox ist Pflichtbegleiter von CodeAct." },
      { name: "Least Privilege Agent", kind: "similar", note: "Beide minimieren Angriffsfläche." },
    ],
  }),
  p({
    name: "Least Privilege Agent",
    domain: "Systembetrieb",
    aliases: ["Minimal Permission Agent", "Scoped Agent"],
    idea: "Jeder Agent kennt nur die Tools und Daten, die er zwingend braucht — alles andere ist unsichtbar oder verweigert. Kommen mehrere Agenten zusammen, müssen sie sich gegenseitig per Handoff einbinden, statt fremde Capabilities einfach zu nutzen. Reduziert den Blast Radius bei Fehlverhalten dramatisch — erfordert aber sauber definierte Rollen und Vertrauenszonen.",
    useWhen: ["Vertrauenszonen getrennt sind", "Sensitive Daten beteiligt sind", "Sicherheitsgrenzen sichtbar sein sollen"],
    avoidWhen: ["Rollen unklar sind", "Berechtigungsmodell Pflege verhindert", "Einschränkung Kernfunktionen blockiert"],
    tradeoff: "Geringere Angriffsfläche gegen Rollenaufwand.",
    frameworks: ["OpenAI Agents SDK", "Microsoft Agent Framework", "LangGraph"],
    subdomain: "Governance & Safety",
    icon: "Lock",
    complexity: "Fortgeschritten",
    traits: ["Sicherheit", "Production"],
    scenario:
      "Der Such-Agent kennt nur 'web_search'; der Mail-Agent nur 'send_mail'. Sie müssen sich gegenseitig per Handoff einbinden, statt fremde Tools zu sehen.",
    diagram: { type: "branch", nodes: ["Identity", "Search-Agent", "Mail-Agent", "DB-Agent"], caption: "Rollenbasierte Toolwelten." },
    code: {
      framework: "OpenAI Agents SDK",
      language: "python",
      snippet: `search_agent = Agent(tools=[web_search])
mail_agent   = Agent(tools=[send_mail])
db_agent     = Agent(tools=[read_db, write_db])`,
    },
    related: [
      { name: "Permission-scoped Tools", kind: "similar", note: "Tools bekommen Scopes statt Agenten Rollen." },
      { name: "Sandbox Execution", kind: "combines", note: "Beide reduzieren Blast Radius." },
    ],
  }),
  p({
    name: "Audit Trail",
    domain: "Systembetrieb",
    aliases: ["Execution Log", "Decision Log"],
    idea: "Alle relevanten Entscheidungen, Tool-Aufrufe, Freigaben und Outputs werden in einem unveränderlichen, append-only Log erfasst — mit Zeitstempel, Akteur und Begründung. Compliance, forensische Analyse und Debugging hängen davon ab. Logging-Kosten und Datenschutz (PII!) sind die wiederkehrenden Designfragen — was darf rein, wie lange bleibt es liegen.",
    useWhen: ["Compliance Nachvollziehbarkeit verlangt", "Agenten externe Aktionen auslösen", "Analysen möglich sein sollen"],
    avoidWhen: ["Logs sensitive Daten ungeschützt speichern", "Aufbewahrung ungeklärt ist", "Logging Rauschen erzeugt"],
    tradeoff: "Nachvollziehbarkeit gegen Datenschutzaufwand.",
    frameworks: ["OpenAI Agents SDK Tracing", "LangSmith", "Google ADK"],
    subdomain: "Governance & Safety",
    icon: "Activity",
    complexity: "Fortgeschritten",
    traits: ["Production", "Sicherheit", "Erklärbar"],
    scenario:
      "Bei jeder kostenpflichtigen Aktion wird {timestamp, agent, action, args, decision, approver} unveränderlich gespeichert — Compliance kann später jeden Schritt rekonstruieren.",
    diagram: { type: "linear", nodes: ["Aktion", "Logger", "Append-only Store"], caption: "Unveränderliche Protokolle." },
    code: {
      framework: "LangSmith",
      language: "python",
      snippet: `with tracer.span("cancel_order") as span:
  span.log({"order_id": id, "reason": r})
  api.cancel(id)`,
    },
    related: [
      { name: "Distributed Tracing", kind: "similar", note: "Tracing ist die operative, Audit die rechtliche Sicht." },
    ],
  }),
  p({
    name: "Multimodal Guardrails",
    domain: "Systembetrieb",
    aliases: ["Multimodal Safety Filters", "Media Validation"],
    idea: "Vor und nach LLM-Calls werden Inputs und Outputs durch modalitätsspezifische Filter geleitet — Text auf Toxicity und PII, Bilder auf NSFW oder Gewalt, Audio auf Stimmenklon-Versuche. Notwendig in offenen Systemen, weil ein Textfilter ein hochgeladenes Bild nicht abfängt. False Positives kosten UX, False Negatives kosten Reputation — die Kalibrierung ist permanent Arbeit.",
    useWhen: ["Agenten multimodale Daten verarbeiten", "Medien Compliance-Risiken tragen", "Mehrere Modalitäten kontrolliert werden"],
    avoidWhen: ["System rein textuell bleibt", "Guardrails Modalitäten nicht abdecken", "Prüfung Inhalte blockiert"],
    tradeoff: "Sicherheit gegen Latenz und Fehlklassifikation.",
    frameworks: ["OpenAI Moderation", "Azure AI Content Safety", "AWS Bedrock Guardrails"],
    subdomain: "Governance & Safety",
    icon: "ShieldCheck",
    complexity: "Production",
    traits: ["Sicherheit", "Production"],
    scenario:
      "Ein Customer-Bot empfängt Bilder. Ein Bild-Guardrail blockt erotische und gewaltvolle Inhalte, ein Text-Guardrail die Antwort darauf.",
    diagram: { type: "gate", nodes: ["Input", "Guardrail", "Pass", "Block"], caption: "Filter pro Modalität." },
    code: {
      framework: "OpenAI Moderation",
      language: "python",
      snippet: `vio = moderation.check(image=img)
txt = moderation.check(text=prompt)
if vio.blocked or txt.blocked:
  return policy_response()`,
    },
    related: [
      { name: "Output Validation / Schema Enforcement", kind: "similar", note: "Beide prüfen, aber Schema vs. Inhalt." },
    ],
  }),

  p({
    name: "Distributed Tracing",
    domain: "Systembetrieb",
    aliases: ["Agent Tracing", "End-to-End Trace"],
    idea: "Jeder Lauf wird als Baum verschachtelter Spans aufgezeichnet — Tool-Calls, LLM-Calls, Sub-Agenten — mit Latenzen, Inputs, Outputs und Tokens. Macht das 'Was hat der Agent eigentlich gemacht?' debug- und analysierbar. Ohne Tracing ist Agent-Debugging ein blinder Flug; mit Tracing wird es zum normalen Engineering-Problem.",
    useWhen: ["Mehrere Komponenten beteiligt sind", "Fehlerursachen analysiert werden", "Produktionsbetrieb beobachtet wird"],
    avoidWhen: ["System minimal lokal bleibt", "Trace-Daten Datenschutzrisiken erzeugen", "Telemetriekosten überwiegen"],
    tradeoff: "Diagnosefähigkeit gegen Telemetrieaufwand.",
    frameworks: ["OpenAI Agents SDK Tracing", "LangSmith", "AWS X-Ray"],
    subdomain: "Observability & Evaluation",
    icon: "Activity",
    complexity: "Fortgeschritten",
    traits: ["Production", "Erklärbar"],
    scenario:
      "Bei einer langen Latenz zeigt der Trace: 80 % der Zeit floss in einen einzelnen Tool-Call mit 12 Retries — Root Cause sofort sichtbar.",
    diagram: { type: "linear", nodes: ["LLM Span", "Tool Span", "Tool Span", "LLM Span"], caption: "Verschachtelte Spans." },
    code: {
      framework: "LangSmith",
      language: "python",
      snippet: `with tracing.run("agent_run") as run:
  thought = llm(...)
  result  = tool(...)
  run.attach({"latency_ms": 1234})`,
    },
    related: [
      { name: "Audit Trail", kind: "similar", note: "Trace-Stück ist oft Audit-Quelle." },
      { name: "Token / Cost Tracking", kind: "combines", note: "Tracing trägt oft Tokens und Kosten." },
    ],
  }),
  p({
    name: "Token / Cost Tracking",
    domain: "Systembetrieb",
    aliases: ["Usage Tracking", "Cost Observability"],
    idea: "Pro Aufruf, Lauf, Agent und Workflow werden Tokens und Kosten aggregiert und mit Budgets verglichen. Bei Überschreitung kann der Agent abgebrochen, gedrosselt oder auf ein günstigeres Modell zurückgestuft werden. Pflicht in autonomen Schleifen — sonst frisst eine fehlerhafte Loop in Sekunden ein Tagesbudget, ohne dass es jemand merkt.",
    useWhen: ["Kosten begrenzt werden müssen", "Agenten autonom Schleifen ausführen", "Patterns optimiert werden sollen"],
    avoidWhen: ["Budget irrelevant ist", "Messdaten nicht handlungsrelevant sind", "Kosten außerhalb nicht erfassbar sind"],
    tradeoff: "Budgetkontrolle gegen Messaufwand.",
    frameworks: ["OpenAI Usage APIs", "LangSmith", "AWS Cost"],
    subdomain: "Observability & Evaluation",
    icon: "Activity",
    complexity: "Einsteiger",
    traits: ["Cost-bewusst", "Production"],
    scenario:
      "Ein Agent darf max. 50 Cent pro Aufgabe verbrauchen. Cost-Tracker zählt mit, bricht ab, sobald Budget gerissen wird.",
    diagram: { type: "gate", nodes: ["Aufruf", "Cost Meter", "OK", "Abort"], caption: "Verbrauch + Budget-Gate." },
    code: {
      framework: "LangSmith",
      language: "python",
      snippet: `total = 0
def llm_call(*a, **kw):
  global total
  r = client.create(*a, **kw)
  total += r.usage.cost
  if total > BUDGET: raise BudgetExceeded()
  return r`,
    },
    related: [
      { name: "Distributed Tracing", kind: "combines", note: "Tracing trägt die Kostendaten." },
    ],
  }),
  p({
    name: "LLM-as-Judge",
    domain: "Systembetrieb",
    aliases: ["Large Language Model as Judge", "AI Evaluator"],
    idea: "Ein zweites Modell bewertet die Ausgaben des ersten anhand schriftlich fixierter Kriterien oder Rubrics — schneller und billiger als menschliche Bewertung, skalierbar auf tausende Beispiele. Funktioniert nur, wenn Judge und System unterschiedliche Bias haben und die Rubric kalibriert ist (z. B. gegen 50 menschlich bewertete Beispiele). Sonst zertifiziert das Modell sich selbst — und alle freuen sich über grüne Dashboards.",
    useWhen: ["Bewertung skalieren muss", "Qualitätskriterien sprachlich formulierbar sind", "Regressionen erkannt werden sollen"],
    avoidWhen: ["Objektive Tests verfügbar sind", "Judge denselben Bias hat", "Hohe rechtliche Verbindlichkeit nötig ist"],
    tradeoff: "Skalierbare Bewertung gegen Kalibrierungsbedarf.",
    frameworks: ["LangSmith", "OpenAI Evals", "Google ADK"],
    subdomain: "Observability & Evaluation",
    icon: "Eye",
    complexity: "Fortgeschritten",
    traits: ["Robustheit", "Production"],
    scenario:
      "Tausend generierte Antworten werden vom Judge-Modell auf 'hilfreich, korrekt, höflich' bewertet — schneller als Menschen, kalibriert mit 50 Beispielen.",
    diagram: { type: "gen-critic", nodes: ["Generator", "Judge"], caption: "Modell prüft Modell." },
    code: {
      framework: "OpenAI Evals",
      language: "python",
      snippet: `def judge(ans, ref):
  return llm(prompt=f"""
  Antwort: {ans}
  Referenz: {ref}
  Bewerte Korrektheit (0-5):
  """).score`,
    },
    related: [
      { name: "Evaluator-Optimizer (Generator-Critic)", kind: "combines", note: "Judge ist der Evaluator-Teil." },
    ],
  }),
  p({
    name: "Integration Tests für Agents",
    domain: "Systembetrieb",
    aliases: ["Agent Integration Tests", "Scenario Tests"],
    idea: "End-to-End-Tests fahren reproduzierbare Szenarien gegen das gesamte Agentensystem (mit gemockten oder isolierten Tools) und prüfen Verlauf, Outputs und Side Effects. Im Gegensatz zu reinen Prompt-Tests messen sie das tatsächliche Verhalten unter Multi-Step- und Tool-Bedingungen. Werden bei jedem Deploy ausgeführt — sonst ist 'es läuft auf meinem Laptop' das beste, was man ehrlich behaupten kann.",
    useWhen: ["Agenten produktionsnah handeln", "Tool- und Workflow-Grenzen geprüft werden", "Regressionen sichtbar werden"],
    avoidWhen: ["Nur ein Prompt exploriert wird", "Bewertung nicht deterministisch ist", "Testumgebung externe Systeme gefährdet"],
    tradeoff: "Betriebssicherheit gegen Testaufwand.",
    frameworks: ["LangSmith", "OpenAI Evals", "Microsoft Agent Framework"],
    subdomain: "Observability & Evaluation",
    icon: "CheckCircle2",
    complexity: "Production",
    traits: ["Production", "Robustheit"],
    scenario:
      "20 Szenarien (Refund, Address-Update, Beschwerde) laufen nightly gegen das Agent-System mit gemockten Tools — Regressionen werden vor Deploy gefangen.",
    diagram: { type: "fanout", nodes: ["Szenarien", "Run 1", "Run 2", "Run 3", "Report"], caption: "Wiederholbare End-to-End-Tests." },
    code: {
      framework: "LangSmith",
      language: "python",
      snippet: `for scenario in scenarios:
  result = run_agent(scenario.input)
  judge(scenario.expected, result)`,
    },
    related: [
      { name: "LLM-as-Judge", kind: "combines", note: "Bewertung pro Szenario." },
      { name: "Distributed Tracing", kind: "combines", note: "Tests produzieren Traces." },
    ],
  }),
];

export const allPatterns = [...patterns, ...systemPatterns];

export const domains: Array<Domain | "Alle"> = [
  "Alle",
  "Denken",
  "Ablauf",
  "Zusammenarbeit",
  "Systembetrieb",
];

export const decisionGuides: DecisionGuide[] = [
  {
    id: "pattern-choice",
    kicker: "Pattern-Wahl",
    title: "Vom Problem zum Pattern-Kandidaten.",
    intro:
      "Beantworte die Leitfragen der Reihe nach. Du sammelst pro Antwort wahrscheinliche Kandidaten – keine Festlegung, sondern eine Auswahl.",
    whenToUse:
      "Wenn ein neues AI-Feature ansteht und unklar ist, ob ein Prompt, ein Workflow oder ein Agenten-Setup passt.",
    whenNotToUse:
      "Reines Prompt-Tuning oder rein klassische Software – hier hilft der Atlas nicht weiter.",
    steps: [
      {
        id: "prompt-only",
        question: "Reicht ein einzelner Prompt mit gutem Prompt-Engineering?",
        yes: "Direkter Modell-Call. Stop – Komplexität wäre nicht gerechtfertigt.",
        no: "Externe Daten, Tools oder Struktur sind nötig. Weiter prüfen.",
        recommendations: [
          { pattern: "Self-Consistency", note: "Mehrere Samples + Mehrheitsentscheid bei wackliger Antwortqualität." },
          { pattern: "Reflexion", note: "Selbstkritik-Loop, wenn ein Schuss zu unzuverlässig ist." },
          { pattern: "Tree of Thoughts", note: "Wenn der Lösungsraum explizit erkundet werden muss." },
        ],
      },
      {
        id: "tools-needed",
        question: "Braucht es externe Interaktion oder Datenzugriff?",
        yes: "Tool-enabled Design – Function Calling, ReAct oder MCP.",
        no: "Reasoning-Pattern reicht – kein Tool-Layer einziehen.",
        recommendations: [
          { pattern: "Function Calling", note: "Schmalste Variante, wenn die Toolauswahl klein und stabil ist." },
          { pattern: "ReAct", note: "Reasoning + Acting im Loop, wenn das Modell Tools dynamisch wählen soll." },
          { pattern: "MCP (Model Context Protocol)", note: "Wenn Tools/Datenquellen standardisiert und wiederverwendbar sein müssen." },
        ],
      },
      {
        id: "predictable",
        question: "Ist der Ablauf vorhersagbar?",
        yes: "Workflow-Pattern aus Domäne Ablauf – billig, testbar, betreibbar.",
        no: "Agentisches Design prüfen – nur wenn der Autonomie-Bedarf echt ist.",
        recommendations: [
          { pattern: "Sequential Pipeline (Prompt Chaining)", note: "Schritte sind fest, Output je Stufe klar definiert." },
          { pattern: "Routing", note: "Eingabe verzweigt deterministisch in mehrere Spezialisten-Pfade." },
          { pattern: "Map-Reduce", note: "Große Inputs parallel verarbeiten und aggregieren." },
        ],
      },
      {
        id: "single-agent",
        question: "Reicht ein autonomer Agent?",
        yes: "Single Agent mit ReAct oder Plan-and-Execute genügt meist.",
        no: "Zusammenarbeit modellieren – aber bewusst, nicht reflexhaft.",
        recommendations: [
          { pattern: "ReAct", note: "Schritt-für-Schritt-Autonomie mit Tool Use." },
          { pattern: "Plan-and-Execute", note: "Trennt Planen und Ausführen – planbarer, besser debuggbar." },
          { pattern: "ReWOO", note: "Plan ohne Beobachtungen – günstiger bei teuren Modellen." },
        ],
      },
      {
        id: "specialists",
        question: "Sind echte Spezialisten nötig?",
        yes: "Multi-Agent-Pattern aus Domäne Zusammenarbeit.",
        no: "Single Agent + Capability Routing oder Agents-as-Tools.",
        recommendations: [
          { pattern: "Supervisor", note: "Ein Orchestrator delegiert an klar spezialisierte Worker." },
          { pattern: "Handoff", note: "Sequentielle Übergabe wenn der nächste Schritt eine andere Rolle braucht." },
          { pattern: "Agents-as-Tools", note: "Andere Agents werden vom Hauptagent wie Tools aufgerufen." },
        ],
      },
      {
        id: "open-coordination",
        question: "Müssen mehrere Agents autonom ohne festen Plan kooperieren?",
        yes: "Offene Koordination – Magentic, Group Chat oder Blackboard.",
        no: "Supervisor oder Handoff reichen.",
        recommendations: [
          { pattern: "Magentic", note: "Dynamische Plan-Anpassung mit zentraler Koordination." },
          { pattern: "Group Chat", note: "Mehrere Agents diskutieren – Vorsicht bei Kosten und Latenz." },
          { pattern: "Blackboard", note: "Geteilter Speicher als Koordinationspunkt – sehr lose Kopplung." },
        ],
      },
      {
        id: "production",
        question: "Geht es in Richtung Production?",
        yes: "Systembetrieb ist Pflicht – Runtime, Memory, Governance, Observability, Evaluation.",
        no: "Prototyp bewusst schlank halten und Risiken dokumentieren.",
        recommendations: [
          { pattern: "Workflow DAG / Durable Execution", note: "Wiederaufnehmbare, idempotente Läufe – Pflicht für Long-Running-Agenten." },
          { pattern: "Human-in-the-Loop Approval Gate", note: "Eingriffspunkt bevor irreversible Aktionen ausgeführt werden." },
          { pattern: "Distributed Tracing", note: "Ohne Traces ist Multi-Agent-Debugging hoffnungslos." },
        ],
      },
    ],
  },
  {
    id: "memory-strategy",
    kicker: "Memory-Strategie",
    title: "Welcher Memory-Layer passt zum Agenten?",
    intro:
      "Memory ist selten ein einzelnes Pattern – meist ein Stack. Diese Fragen helfen, den richtigen Layer zuerst zu setzen.",
    whenToUse:
      "Wenn ein Agent über mehrere Turns oder Sessions hinweg sinnvoll handeln soll und unklar ist, was er sich merken muss.",
    whenNotToUse:
      "Reine Single-Shot-Anfragen oder Workflows ohne State – hier ist Memory unnötiger Overhead.",
    steps: [
      {
        id: "multi-turn",
        question: "Hält der Agent Konversation über mehrere Turns?",
        yes: "Conversational Memory oder ein Scratchpad fürs aktuelle Reasoning.",
        no: "Stateless reicht – keinen Memory-Layer einführen.",
        recommendations: [
          { pattern: "Conversational Memory", note: "Standard für Chat-Setups – Vorsicht bei wachsendem Kontext." },
          { pattern: "Working Memory / Scratchpad", note: "Temporäre Notizen innerhalb eines Tasks." },
        ],
      },
      {
        id: "external-knowledge",
        question: "Soll der Agent auf externes, wachsendes Wissen zugreifen?",
        yes: "Retrieval-basierter Memory mit Embeddings oder semantischem Layer.",
        no: "Modellwissen + Prompt-Kontext reichen.",
        recommendations: [
          { pattern: "Vector Memory", note: "Dichte-Embeddings + Ähnlichkeitssuche – Standardansatz für RAG." },
          { pattern: "Semantic Memory", note: "Strukturierte Fakten/Konzepte über Sessions hinweg." },
        ],
      },
      {
        id: "relationships",
        question: "Sind die Wissenseinheiten stark vernetzt (Entitäten, Beziehungen)?",
        yes: "Graph-basiertes Memory bevorzugen – Joins über Hops.",
        no: "Vector/Semantic reicht – nicht overengineeren.",
        recommendations: [
          { pattern: "Graph Memory", note: "Wenn Pfadabfragen oder Hierarchien wichtiger sind als Ähnlichkeit." },
        ],
      },
      {
        id: "long-history",
        question: "Wächst die Historie länger als ein Kontextfenster sinnvoll trägt?",
        yes: "Verdichten oder episodisch ablegen statt blind anhängen.",
        no: "Working Memory reicht.",
        recommendations: [
          { pattern: "Compressed Context Memory", note: "Rolling Summary, wenn Vollständigkeit unnötig ist." },
          { pattern: "Episodic Memory", note: "Vergangene Tasks/Sessions als Erfahrungs-Snapshots." },
        ],
      },
    ],
  },
];

export const frameworkRows = [
  ["Anthropic Cookbook", "5 Workflow-Patterns", "Minimal, gut erklärbar"],
  ["LangGraph", "Supervisor, Swarm, Graph-based", "Kontrollierte Graph-Orchestrierung"],
  ["CrewAI", "Sequential, Hierarchical Process, Flows", "Rollen und Prozesse"],
  ["AutoGen / AG2", "GroupChat, Two-Agent-Chat, Nested Chats", "Multi-Agent-Kommunikation"],
  ["Microsoft Agent Framework", "Sequential, Concurrent, Handoff, Magentic", "Breite Orchestrierung"],
  ["Google ADK", "Pipeline, Coordinator, Parallel, HITL, Composite", "Breite Pattern-Abdeckung"],
  ["AWS Strands", "Graph, Swarm, Workflow, Agents-as-Tools", "Agent Runtime und AWS-Integration"],
  ["OpenAI Agents SDK", "Handoff, Tools, Guardrails", "Nahe Modell- und Tool-Integration"],
];
