const p = (name, domain, aliases, idea, useWhen, avoidWhen, tradeoff, frameworks, subdomain) => ({
  name,
  domain,
  subdomain,
  aliases,
  idea,
  useWhen,
  avoidWhen,
  tradeoff,
  frameworks
});

const patterns = [
  p("ReAct", "Denken", ["Reason+Act", "Thought-Action-Observation Loop"], "Der Agent wechselt iterativ zwischen Reasoning, Tool-Aufruf und Beobachtung.", ["Tool-Use ist nötig", "Der Pfad ist nicht vorab planbar", "Tool-Ergebnisse verändern den nächsten Schritt"], ["Der Plan ist bekannt", "LLM-Calls sind streng limitiert", "Es geht nur um reine Generierung"], "Hohe Adaptivität gegen höheren Call-Aufwand.", ["LangGraph", "OpenAI Agents SDK", "Microsoft Agent Framework", "Google ADK", "AutoGen / AG2", "CrewAI"]),
  p("Plan-and-Execute", "Denken", ["Planner-Executor", "Plan then Act"], "Ein Agent erzeugt zuerst einen Plan und führt die Schritte danach kontrolliert aus.", ["Ziel ist in Teilaufgaben zerlegbar", "Zwischenstände sollen überprüfbar sein", "Steuerbarkeit ist wichtig"], ["Umgebung ist stark dynamisch", "Tool-Ergebnisse können den Plan kippen", "Planungsaufwand wäre größer als die Aufgabe"], "Bessere Struktur gegen Risiko veralteter Pläne.", ["LangGraph", "CrewAI", "Google ADK", "Microsoft Agent Framework", "OpenAI Agents SDK"]),
  p("ReWOO", "Denken", ["Reasoning without Observation", "Planner-Solver Pattern"], "Tool-Aufrufe werden vorab geplant, ausgeführt und gesammelt für die finale Antwort genutzt.", ["Tool-Aufrufe sind vorab erkennbar", "LLM-Calls sollen reduziert werden", "Zwischenbeobachtungen verzweigen kaum"], ["Tool-Ergebnisse verzweigen stark", "Fehlerbehandlung pro Schritt ist kritisch", "Interaktive Reaktion ist nötig"], "Niedrigere LLM-Kosten gegen geringere Adaptivität.", ["LangGraph", "Google ADK", "OpenAI Agents SDK"]),
  p("Reflexion", "Denken", ["Self-Reflection", "Self-Critique"], "Der Agent bewertet eigene Zwischenergebnisse und nutzt Kritik zur Verbesserung.", ["Qualität ist wichtiger als Latenz", "Fehler können durch Selbstprüfung auffallen", "Aufgaben erlauben iterative Verbesserung"], ["Externe Validierung ist verfügbar", "Selbstbewertung ist unzuverlässig", "Kosten sind eng begrenzt"], "Mehr Qualität gegen zusätzliche Tokens und mögliche Scheinsicherheit.", ["LangGraph", "AutoGen / AG2", "Microsoft Agent Framework", "Google ADK", "CrewAI"]),
  p("Tree of Thoughts", "Denken", ["ToT", "Branching Reasoning"], "Mehrere Reasoning-Pfade werden als Baum exploriert und bewertet.", ["Mehrere plausible Lösungswege existieren", "Frühe Entscheidungen haben hohe Folgewirkung", "Suchraum ist begrenzt bewertbar"], ["Aufgabe ist direkt lösbar", "Kosten oder Latenz müssen niedrig bleiben", "Bewertung der Äste ist unklar"], "Breitere Exploration gegen stark steigenden Tokenaufwand.", ["LangGraph", "AutoGen / AG2", "Google ADK"]),
  p("Self-Consistency", "Denken", ["Majority Reasoning", "Sample-and-Vote"], "Mehrere unabhängige Reasoning-Ausgaben werden erzeugt und per Konsens zusammengeführt.", ["Antwort soll robust gegen Fehlpfade werden", "Ergebnis ist abstimmbar", "Modellvarianz ist hilfreich"], ["Aufgabe ist objektiv validierbar", "Kosten sind streng limitiert", "Mehrheit kann falsche Sicherheit erzeugen"], "Robustere Antworten gegen mehrfachen Inferenzaufwand.", ["Anthropic Cookbook", "Google ADK", "LangGraph", "Microsoft Agent Framework"]),
  p("CodeAct", "Denken", ["Code-as-Action", "Executable Reasoning"], "Der Agent nutzt ausführbaren Code als Handlungs- und Reasoning-Medium.", ["Berechnungen oder Transformationen nötig sind", "Zwischenergebnisse reproduzierbar sein sollen", "Programmatische Logik hilft"], ["Ausführung nicht sandboxed ist", "Aufgabe rein sprachlich ist", "Codeausführung mehr Risiko erzeugt"], "Präzision gegen Sandbox-, Sicherheits- und Laufzeitaufwand.", ["OpenAI Agents SDK", "AutoGen / AG2", "Microsoft Agent Framework", "LangGraph", "Google ADK"]),

  p("Sequential Pipeline (Prompt Chaining)", "Ablauf", ["Prompt Chaining", "Linear Workflow"], "Mehrere Schritte laufen in fester Reihenfolge und nutzen jeweils das vorherige Ergebnis.", ["Aufgabe zerfällt klar in Phasen", "Jeder Schritt liefert ein prüfbares Artefakt", "Kontrolle ist wichtiger als Autonomie"], ["Ablauf verzweigt stark", "Ergebnisse erzeugen neue Ziele", "Parallelisierung wäre naheliegend"], "Hohe Verständlichkeit gegen geringe Flexibilität.", ["Anthropic Cookbook", "CrewAI", "Google ADK", "Microsoft Agent Framework", "AWS Strands"]),
  p("Routing", "Ablauf", ["Classifier Router", "Intent Routing"], "Eine Anfrage wird an passenden Pfad, Prompt, Agent oder Tool weitergeleitet.", ["Anfrageklassen brauchen verschiedene Behandlung", "Spezialisierte Prompts oder Tools existieren", "Fehlpfade sind teuer"], ["Alle Aufgaben nutzen denselben Ablauf", "Klassifikation ist instabil", "Routinglogik wird komplexer als die Aufgabe"], "Präzisere Behandlung gegen Fehlrouting-Risiko.", ["Anthropic Cookbook", "LangGraph", "Google ADK", "Microsoft Agent Framework", "AWS Strands"]),
  p("Parallelization (Sectioning)", "Ablauf", ["Sectioned Parallelism", "Fan-out by Segment"], "Unabhängige Teilbereiche einer Aufgabe werden parallel bearbeitet und zusammengeführt.", ["Eingabe ist natürlich segmentierbar", "Teilaufgaben sind unabhängig", "Latenz soll sinken"], ["Starke Abhängigkeiten bestehen", "Zusammenführung ist schwierig", "Globale Konsistenz ist wichtiger"], "Geringere Latenz gegen Integrationsaufwand.", ["Anthropic Cookbook", "Google ADK", "Microsoft Agent Framework", "AWS Strands", "LangGraph"]),
  p("Parallelization (Voting)", "Ablauf", ["Voting Parallelism", "Ensemble Voting"], "Mehrere unabhängige Läufe bearbeiten dieselbe Aufgabe und ein Aggregator wählt oder synthetisiert.", ["Robustheit ist wichtiger als Einzelkosten", "Antworten sind bewertbar", "Modellvarianz soll genutzt werden"], ["Ergebnis ist objektiv validierbar", "Antwort ist nicht aggregierbar", "Latenz ist streng begrenzt"], "Höhere Robustheit gegen mehrfachen Ausführungsaufwand.", ["Anthropic Cookbook", "Google ADK", "Microsoft Agent Framework", "LangGraph"]),
  p("Loop", "Ablauf", ["Control Loop", "Retry Loop"], "Schritte werden wiederholt, bis Abbruchbedingung, Qualitätsziel oder Budget erreicht ist.", ["Ergebnis kann schrittweise verbessert werden", "Validierung kann Wiederholung auslösen", "Tool-Ergebnisse erfordern Iteration"], ["Keine stabile Abbruchbedingung existiert", "Kosten unkontrollierbar steigen", "Fehler sich verstärken"], "Adaptive Verbesserung gegen Risiko teurer Schleifen.", ["LangGraph", "CrewAI Flows", "Microsoft Agent Framework", "Google ADK", "AWS Strands"]),
  p("Evaluator-Optimizer (Generator-Critic)", "Ablauf", ["Generator-Critic", "Critique and Revise"], "Ein Generator erstellt ein Ergebnis, ein Evaluator bewertet und der Generator verbessert.", ["Qualitätskriterien sind formulierbar", "Iterative Verbesserung ist messbar", "Komplexe Ausgaben müssen geprüft werden"], ["Evaluator liefert keine verlässlichen Signale", "Schema-Validation reicht", "Budget erlaubt keine Mehrfachläufe"], "Bessere Qualität gegen zusätzliche Bewertungskomplexität.", ["Anthropic Cookbook", "Google ADK", "LangGraph", "AutoGen / AG2", "Microsoft Agent Framework"]),
  p("Iterative Refinement", "Ablauf", ["Revise Loop", "Draft-Improve"], "Ein Ergebnis wird über kontrollierte Revisionen verbessert.", ["Qualität graduell steigt", "Feedback verfügbar ist", "Zwischenstände erhalten bleiben sollen"], ["Ein Schritt reicht", "Revisionen ohne klares Signal erfolgen", "Wiederholung Drift erzeugt"], "Verbesserte Qualität gegen längere Laufzeit und mögliche Drift.", ["Google ADK", "LangGraph", "CrewAI Flows", "Microsoft Agent Framework"]),
  p("Orchestrator-Workers", "Ablauf", ["Coordinator-Workers", "Manager-Worker"], "Ein Orchestrator zerlegt eine Aufgabe dynamisch und weist Teilaufgaben an Worker zu.", ["Teilaufgaben erst zur Laufzeit erkennbar sind", "Worker spezialisiert arbeiten", "Aggregation zentral gesteuert werden soll"], ["Ein statischer Workflow reicht", "Worker keine klare Verantwortung haben", "Orchestrator zum Engpass wird"], "Flexible Delegation gegen Koordinationsaufwand.", ["Anthropic Cookbook", "LangGraph", "CrewAI", "Google ADK", "Microsoft Agent Framework", "AWS Strands"]),
  p("Map-Reduce", "Ablauf", ["Fan-out/Fan-in", "Batch Decomposition"], "Eine Aufgabe wird auf unabhängige Einheiten gemappt und danach aggregiert.", ["Große Eingaben sind in Chunks zerlegbar", "Aggregation ist klar definierbar", "Durchsatz ist wichtig"], ["Globale Abhängigkeiten bestehen", "Reduktion wäre verlustreich", "Ein zentraler Kontext ist nötig"], "Gute Skalierung gegen Risiko inkonsistenter Teilresultate.", ["LangGraph", "AWS Strands", "Google ADK", "Microsoft Agent Framework", "Anthropic Cookbook"]),

  p("Supervisor", "Zusammenarbeit", ["Manager Agent", "Coordinator Agent"], "Ein zentraler Agent entscheidet, welcher Agent oder welches Tool als Nächstes arbeitet.", ["Zentrale Kontrolle zählt", "Mehrere Spezialisten koordiniert werden", "Aufgaben dynamisch delegiert werden"], ["Dezentrale Kooperation nötig ist", "Supervisor zum Engpass wird", "Delegation statisch genug für Routing ist"], "Klare Kontrolle gegen Koordinationsengpass.", ["LangGraph", "CrewAI", "Microsoft Agent Framework", "Google ADK", "AWS Strands"]),
  p("Hierarchical Supervisor", "Zusammenarbeit", ["Multi-Level Supervisor", "Manager Hierarchy"], "Mehrere Supervisoren organisieren Agenten in Ebenen oder Teams.", ["Agentenzahl groß wird", "Domänen in Subteams organisiert werden", "Lokale Entscheidungen zusammengeführt werden"], ["Wenige Agenten ausreichen", "Kommunikationswege kurz bleiben sollen", "Verantwortlichkeiten unscharf sind"], "Skalierbare Organisation gegen längere Entscheidungswege.", ["CrewAI", "LangGraph", "Google ADK", "Microsoft Agent Framework"]),
  p("Handoff", "Zusammenarbeit", ["Transfer of Control", "Agent Transfer"], "Ein Agent übergibt Kontrolle und relevanten Kontext an einen anderen Agenten.", ["Zuständigkeit klar wechselt", "Nutzerinteraktion an Spezialisten wechseln soll", "Tool-Grenzen pro Agent gelten"], ["Mehrere Agents gleichzeitig beitragen sollen", "Kontrolle zentral bleiben muss", "Kontextübergabe nicht begrenzbar ist"], "Klare Verantwortungsübergabe gegen Risiko von Kontextverlust.", ["OpenAI Agents SDK", "Microsoft Agent Framework", "LangGraph", "Google ADK"]),
  p("Swarm", "Zusammenarbeit", ["Decentralized Agents", "Peer Agent Swarm"], "Mehrere Agenten koordinieren sich dezentral über lokale Regeln, Nachrichten oder Ziele.", ["Dezentrale Exploration gewünscht ist", "Aufgaben adaptiv verteilt werden können", "Zentrale Steuerung zu starr wäre"], ["Strenge Nachvollziehbarkeit nötig ist", "Nachrichtenflut begrenzt werden muss", "Klare Verantwortlichkeit wichtiger ist"], "Hohe Anpassungsfähigkeit gegen geringere Vorhersagbarkeit.", ["LangGraph Swarm", "AWS Strands Swarm", "Microsoft Agent Framework", "AutoGen / AG2"]),
  p("Group Chat", "Zusammenarbeit", ["Multi-Agent Chat", "Round-Robin Conversation"], "Mehrere Agents kommunizieren in einem gemeinsamen Gesprächsraum.", ["Perspektiven sichtbar zusammengeführt werden", "Diskussion Teil der Lösung ist", "Rollen flexibel interagieren"], ["Determinismus wichtiger ist", "Tokenverbrauch niedrig bleiben muss", "Verantwortlichkeiten streng getrennt sind"], "Reichhaltige Interaktion gegen hohe Kosten und Steuerungsaufwand.", ["AutoGen / AG2", "Microsoft Agent Framework", "Google ADK", "LangGraph"]),
  p("Multi-Agent Debate", "Zusammenarbeit", ["Debate", "Adversarial Agents"], "Mehrere Agenten vertreten oder prüfen unterschiedliche Positionen vor einer Entscheidung.", ["Fragestellung kontrovers ist", "Gegenargumente Fehler sichtbar machen", "Entscheidung geprüft werden soll"], ["Faktenlage einfach validierbar ist", "Debatte Scheinkonflikte erzeugt", "Tokenbudget knapp ist"], "Bessere Prüfung gegen Aufwand und mögliches Überargumentieren.", ["AutoGen / AG2", "LangGraph", "Microsoft Agent Framework", "Google ADK"]),
  p("Magentic (Composite Orchestration)", "Zusammenarbeit", ["Magentic-One", "Composite Agent Orchestration"], "Ein Verbund spezialisierter Agenten löst offene Aufgaben durch Planning, Task Ledger, Replanning und Delegation.", ["Aufgaben offen und tool-intensiv sind", "Spezialisten koordiniert handeln müssen", "Autonomie über längere Horizonte nötig ist"], ["Ein einfacher Workflow reicht", "Jeder Schritt deterministisch sein muss", "Betriebskosten eng begrenzt sind"], "Große Aufgabenabdeckung gegen hohe Betriebs- und Steuerungskomplexität.", ["Microsoft Agent Framework", "AutoGen / AG2 Magentic-One", "LangGraph"]),
  p("Blackboard", "Zusammenarbeit", ["Shared Workspace", "Shared State Coordination"], "Agents koordinieren indirekt über eine gemeinsame Zustandsfläche.", ["Viele Agents asynchron beitragen", "Gemeinsamer Zustand wichtiger ist als Chat", "Zwischenergebnisse persistent nutzbar sein sollen"], ["Strikte lineare Kontrolle nötig ist", "Zustandskonsistenz ungesichert bleibt", "Ein Chat-Kontext reicht"], "Entkoppelte Zusammenarbeit gegen anspruchsvolles State Management.", ["LangGraph", "AWS Strands", "Microsoft Agent Framework", "AutoGen / AG2"]),
  p("Contract Net", "Zusammenarbeit", ["Task Bidding", "Contract Net Protocol"], "Ein Agent schreibt Aufgaben aus und andere Agenten bieten auf Basis ihrer Fähigkeiten oder Kosten.", ["Aufgaben dynamisch verteilt werden", "Agenten unterschiedliche Kapazitäten haben", "Auswahlkriterien explizit sind"], ["Delegation fest vorgegeben ist", "Bietlogik zu teuer ist", "Selbstauskünfte unzuverlässig sind"], "Flexible Ressourcenverteilung gegen Aushandlungsaufwand.", ["LangGraph", "AutoGen / AG2", "Microsoft Agent Framework"]),
  p("Market-based", "Zusammenarbeit", ["Market Mechanism", "Price-based Coordination"], "Agenten koordinieren Aufgaben und Ressourcen über Preise, Budgets oder Nutzen.", ["Ressourcen knapp sind", "Priorisierung über Kosten erfolgen soll", "Viele Agenten konkurrierende Aufgaben bearbeiten"], ["Compliance zentrale Vorgaben braucht", "Nutzenfunktion unklar ist", "Kleine Systeme ohne Ressourcenkonflikt vorliegen"], "Skalierbare Allokation gegen schwieriges Anreizdesign.", ["LangGraph", "AWS Strands", "AutoGen / AG2"]),
  p("Agents-as-Tools", "Zusammenarbeit", ["Callable Agents", "Specialist-as-Tool"], "Ein Agent ruft andere Agenten wie Tools mit klarer Schnittstelle auf.", ["Spezialisten gekapselt genutzt werden", "Hauptagent Kontrolle behält", "Tool-Sets getrennt werden müssen"], ["Gleichberechtigte Kooperation nötig ist", "Spezialisten längere Autonomie brauchen", "Schnittstellen instabil sind"], "Gute Kapselung gegen begrenzte Eigenständigkeit.", ["AWS Strands", "OpenAI Agents SDK", "LangGraph", "Microsoft Agent Framework", "Google ADK"]),
  p("Graph-based Orchestration", "Zusammenarbeit", ["Agent Graph", "State Graph Orchestration"], "Agenten, Tools, Zustände und Kontrollübergänge werden als expliziter Graph modelliert.", ["Koordination testbar sein soll", "Zyklen und Handoffs modelliert werden", "Komplexe Flüsse stabil laufen müssen"], ["Ein linearer Workflow reicht", "Graphpflege zu teuer ist", "Emergenz wichtiger ist"], "Hohe Steuerbarkeit gegen Modellierungsaufwand.", ["LangGraph", "AWS Strands Graph", "Microsoft Agent Framework", "Google ADK", "CrewAI Flows"]),

  p("Conversational Memory", "Systembetrieb", ["Chat History", "Conversation Buffer"], "Relevante Gesprächshistorie bleibt für spätere Turns verfügbar.", ["Nutzerkontext erhalten bleiben muss", "Bezugnahmen erwartet werden", "Gesprächsfluss wichtig ist"], ["Datenschutz Speicherung verbietet", "Historie Tokens verschwendet", "Aufgaben zustandslos sind"], "Besserer Kontext gegen Kosten und Datenschutzaufwand.", ["LangChain", "LangGraph", "OpenAI Agents SDK", "Microsoft Agent Framework", "AutoGen / AG2"], "Memory Architecture"),
  p("Episodic Memory", "Systembetrieb", ["Experience Memory", "Task Episode Store"], "Abgeschlossene Interaktionen werden als Episoden gespeichert und wiederverwendet.", ["Frühere Fälle hilfreich sind", "Wiederkehrende Aufgaben auftreten", "Zeit, Ziel und Ergebnis relevant sind"], ["Fälle veraltet sind", "Personendaten problematisch sind", "Semantische Wissensbasis reicht"], "Erfahrungsbasierte Anpassung gegen Kurationsaufwand.", ["LangGraph", "AutoGen / AG2", "Microsoft Agent Framework", "CrewAI"], "Memory Architecture"),
  p("Semantic Memory", "Systembetrieb", ["Knowledge Memory", "Long-Term Knowledge"], "Dauerhaftes Wissen wird unabhängig von einzelnen Gesprächen gespeichert.", ["Domänenwissen langfristig genutzt wird", "Fakten wiederverwendet werden", "Retrieval über Sitzungen nötig ist"], ["Wissen schnell veraltet", "Governance fehlt", "Prompt-Kontext reicht"], "Wiederverwendbares Wissen gegen Qualitäts- und Aktualisierungsrisiken.", ["LangChain", "LangGraph", "OpenAI Agents SDK", "Microsoft Agent Framework", "Google ADK"], "Memory Architecture"),
  p("Working Memory / Scratchpad", "Systembetrieb", ["Scratchpad", "Task State"], "Temporärer Arbeitszustand hält Zwischenschritte und Tool-Ergebnisse während einer Ausführung.", ["Mehrschrittige Aufgaben Zustand brauchen", "Tool-Ergebnisse referenziert werden", "Ausführung nachvollziehbar sein soll"], ["Aufgabe atomar ist", "Zwischengedanken nicht gespeichert werden dürfen", "Persistenz über Läufe nötig ist"], "Bessere Steuerbarkeit gegen zusätzliche State-Verwaltung.", ["LangGraph State", "OpenAI Agents SDK", "Microsoft Agent Framework", "AutoGen / AG2", "Google ADK"], "Memory Architecture"),
  p("Vector Memory", "Systembetrieb", ["Vector Store Memory", "RAG Memory"], "Inhalte werden als Embeddings gespeichert und per semantischer Ähnlichkeit abgerufen.", ["Große Wissensmengen gesucht werden", "Wortlaut variieren kann", "RAG benötigt wird"], ["Exakte relationale Abfragen zentral sind", "Aktualität schwer kontrollierbar ist", "Ähnlichkeit falsche Treffer erzeugt"], "Flexibles Retrieval gegen Ranking- und Frischeprobleme.", ["LangChain", "LangGraph", "OpenAI Vector Stores", "Microsoft Agent Framework", "Google ADK"], "Memory Architecture"),
  p("Graph Memory", "Systembetrieb", ["Knowledge Graph Memory", "Entity-Relation Memory"], "Entitäten, Beziehungen und Ereignisse werden als Graph gespeichert und abgefragt.", ["Beziehungen entscheidend sind", "Herkunft erklärbar sein muss", "Agenten über Fakten navigieren"], ["Unstrukturierter Abruf genügt", "Graphschema unklar ist", "Pflege zu teuer ist"], "Hohe Erklärbarkeit gegen Modellierungsaufwand.", ["LangGraph", "Microsoft Agent Framework", "Google ADK", "AWS Strands"], "Memory Architecture"),
  p("Compressed Context Memory", "Systembetrieb", ["Context Compression", "Rolling Summary"], "Langer Kontext wird zusammengefasst, damit relevante Information im Kontextfenster bleibt.", ["Gespräche lange laufen", "Tokenbudget begrenzt ist", "Alte Information relevant bleibt"], ["Wortlaut exakt bleiben muss", "Zusammenfassung Verlust erzeugt", "Kurze Kontexte reichen"], "Größerer nutzbarer Verlauf gegen Detailverlust.", ["LangChain", "LangGraph", "AutoGen / AG2", "Microsoft Agent Framework", "CrewAI"], "Memory Architecture"),

  p("Function Calling", "Systembetrieb", ["Tool Calling", "Structured Tool Use"], "Das Modell ruft definierte Funktionen mit validierbaren Argumenten auf.", ["Externe Aktionen kontrolliert eingebunden werden", "Argumente validierbar sein müssen", "Tool-Use beobachtbar bleiben soll"], ["Aufgabe ohne externe Aktion lösbar ist", "Tool-Schema instabil ist", "Freitextinteraktion geeigneter ist"], "Strukturierte Kontrolle gegen Schema- und Integrationsaufwand.", ["OpenAI Agents SDK", "LangGraph", "Microsoft Agent Framework", "Google ADK", "AutoGen / AG2"], "Tool Integration"),
  p("Tool Registry", "Systembetrieb", ["Capability Catalog", "Tool Catalog"], "Verfügbare Tools werden mit Schema, Beschreibung, Berechtigungen und Metadaten registriert.", ["Viele Tools verwaltet werden", "Versionierung wichtig ist", "Tools von mehreren Agenten genutzt werden"], ["Wenige statische Tools existieren", "Registry nicht gepflegt wird", "Beschreibungen schlechte Auswahl erzeugen"], "Bessere Tool-Governance gegen Pflegeaufwand.", ["OpenAI Agents SDK", "LangGraph", "Microsoft Agent Framework", "Google ADK", "AWS Strands"], "Tool Integration"),
  p("MCP (Model Context Protocol)", "Systembetrieb", ["MCP-based Tool Integration", "MCP Server"], "Externe Ressourcen und Tools werden über MCP standardisiert verfügbar gemacht.", ["Tools frameworkübergreifend nutzbar sein sollen", "Lokale oder externe Systeme angebunden werden", "Kontextzugriff standardisiert werden soll"], ["Direkte SDK-Integration einfacher reicht", "Sicherheitsmodell ungeklärt ist", "Protokollbetrieb mehr Komplexität bringt"], "Interoperabilität gegen Betriebs- und Berechtigungsaufwand.", ["OpenAI Agents SDK", "LangGraph", "Microsoft Agent Framework", "Claude Desktop"], "Tool Integration"),
  p("Adapter Pattern", "Systembetrieb", ["Tool Adapter", "API Wrapper"], "Externe APIs werden in stabile, agentengerechte Schnittstellen übersetzt.", ["APIs uneinheitlich sind", "Agenten einfache Tool-Verträge brauchen", "Fehlerlogik gekapselt werden soll"], ["Native SDKs passen", "Adapter nur Durchreichung wäre", "Abstraktion Semantik versteckt"], "Stabilere Schnittstellen gegen zusätzliche Wartung.", ["OpenAI Agents SDK", "LangGraph", "Google ADK", "Microsoft Agent Framework", "AWS Strands"], "Tool Integration"),
  p("Capability Routing", "Systembetrieb", ["Tool Selection", "Skill Routing"], "Anfragen werden anhand benötigter Fähigkeiten an passende Tools, Agenten oder Services geleitet.", ["Viele Fähigkeiten verfügbar sind", "Auswahl Policy braucht", "Fehlende Fähigkeiten erkannt werden müssen"], ["Toolauswahl trivial ist", "Beschreibungen unpräzise sind", "Routing nicht getestet wird"], "Flexiblere Auswahl gegen Fehlzuordnung.", ["LangGraph", "OpenAI Agents SDK", "Microsoft Agent Framework", "Google ADK", "AWS Strands"], "Tool Integration"),
  p("Permission-scoped Tools", "Systembetrieb", ["Scoped Tools", "Permissioned Tools"], "Tools werden mit expliziten minimalen Berechtigungen pro Agent, Aufgabe oder Lauf bereitgestellt.", ["Tools sensitive Aktionen ausführen", "Agenten unterschiedliche Rechte brauchen", "Compliance relevant ist"], ["Alle Aktionen unkritisch sind", "Rechte nicht modellierbar sind", "Fragmentierung Bedienbarkeit senkt"], "Bessere Sicherheit gegen Verwaltungsaufwand.", ["OpenAI Agents SDK", "Microsoft Agent Framework", "Google ADK", "AWS Strands", "LangGraph"], "Tool Integration"),

  p("Actor Model", "Systembetrieb", ["Actor-based Runtime", "Agent Actors"], "Agenten oder Komponenten kapseln Zustand und kommunizieren über Nachrichten.", ["Nebenläufigkeit wichtig ist", "Agenten eigenen Zustand besitzen", "Skalierung über Einheiten erfolgen soll"], ["Synchroner Workflow reicht", "Nachrichtenmodell unnötig ist", "Globale Transaktionen zentral sind"], "Gute Isolation gegen komplexere Fehlersemantik.", ["Microsoft Agent Framework", "AutoGen / AG2", "AWS Strands", "LangGraph"], "Runtime Architecture"),
  p("Event-driven Choreography", "Systembetrieb", ["Event Choreography", "Event-driven Agents"], "Komponenten reagieren auf Ereignisse statt zentral gesteuert zu werden.", ["Systeme lose gekoppelt sein sollen", "Ereignisse aus mehreren Quellen eintreffen", "Erweiterbarkeit wichtig ist"], ["Globaler Ablauf streng kontrolliert werden muss", "Eventual Consistency nicht akzeptabel ist", "Tracing fehlt"], "Hohe Entkopplung gegen schwierigere globale Kontrolle.", ["AWS Strands", "Microsoft Agent Framework", "LangGraph", "Google ADK"], "Runtime Architecture"),
  p("Saga / Compensation", "Systembetrieb", ["Saga Pattern", "Compensating Action"], "Mehrschrittige Aktionen werden durch Ausgleichsschritte abgesichert.", ["Agenten Nebenwirkungen auslösen", "Verteilte Transaktionen fehlen", "Rücknahme fachlich möglich ist"], ["Aktionen nicht kompensierbar sind", "Atomare Konsistenz erforderlich ist", "Freigabe Fehler besser verhindert"], "Robustere Langläufer gegen komplexe Kompensation.", ["AWS Strands Workflow", "Microsoft Agent Framework", "LangGraph", "Workflow Engines"], "Runtime Architecture"),
  p("Workflow DAG / Durable Execution", "Systembetrieb", ["Durable Workflow", "DAG Orchestration"], "Workflows laufen als persistente Ausführungsgraphen mit Retry und Wiederaufnahme.", ["Läufe lange dauern oder fehlschlagen", "Zustände robust verwaltet werden müssen", "Produktion Nachvollziehbarkeit verlangt"], ["Aufgaben kurz und zustandslos sind", "Persistenz unnötig wäre", "Graphmodell nicht passt"], "Produktionsrobustheit gegen Infrastrukturaufwand.", ["LangGraph", "AWS Strands Workflow", "Google ADK", "Microsoft Agent Framework", "CrewAI Flows"], "Runtime Architecture"),
  p("Checkpointing / Resumability", "Systembetrieb", ["State Checkpointing", "Resume from State"], "Ausführungszustand wird gespeichert, damit Läufe fortgesetzt werden können.", ["Agentenläufe lang sind", "Externe Systeme ausfallen können", "Manuelle Prüfung zwischen Schritten nötig ist"], ["Schritte billig wiederholbar sind", "Sensitive Daten unnötig persistiert würden", "Wiederaufnahme fachlich nicht sinnvoll ist"], "Höhere Ausfallsicherheit gegen Speicher- und Konsistenzaufwand.", ["LangGraph", "Microsoft Agent Framework", "AWS Strands Workflow", "Google ADK"], "Runtime Architecture"),
  p("Pub/Sub Agent Mesh", "Systembetrieb", ["Agent Mesh", "Message Bus Coordination"], "Agenten kommunizieren über Topics, Events oder Nachrichtenbusse.", ["Viele Agenten lose gekoppelt werden", "Ereignisse mehrere Empfänger haben", "Erweiterbarkeit wichtig ist"], ["Direkter Aufruf reicht", "Zustellung ungeklärt ist", "Beobachtbarkeit fehlt"], "Skalierbare Entkopplung gegen komplexeres Debugging.", ["AWS", "Microsoft Agent Framework", "LangGraph", "Google ADK"], "Runtime Architecture"),

  p("Human-in-the-Loop Approval Gate", "Systembetrieb", ["HITL", "Human Approval"], "Kritische Schritte werden vor Ausführung durch einen Menschen freigegeben.", ["Aktionen irreversible Folgen haben", "Compliance menschliche Entscheidung verlangt", "Modellunsicherheit sichtbar werden soll"], ["Niedrigrisiko-Aktionen automatisch laufen können", "Freigaben nur symbolisch sind", "Latenz menschliche Prüfung ausschließt"], "Höhere Kontrolle gegen langsamere Abläufe.", ["Google ADK", "OpenAI Agents SDK", "LangGraph", "Microsoft Agent Framework", "CrewAI"], "Governance & Safety"),
  p("Output Validation / Schema Enforcement", "Systembetrieb", ["Structured Output Validation", "Schema Validation"], "Modellantworten werden gegen Schemata, Typen oder fachliche Regeln validiert.", ["Downstream-Systeme strukturierte Daten erwarten", "Fehler früh erkannt werden müssen", "Automatisierte Verarbeitung folgt"], ["Freiformtext Ziel ist", "Schema Antwort einschränkt", "Validierung fachlich blind ist"], "Höhere Zuverlässigkeit gegen weniger Ausdrucksfreiheit.", ["OpenAI Structured Outputs", "LangGraph", "Microsoft Agent Framework", "Google ADK", "Anthropic Tool Use"], "Governance & Safety"),
  p("Sandbox Execution", "Systembetrieb", ["Isolated Execution", "Code Sandbox"], "Modellgenerierter oder agentisch ausgewählter Code läuft isoliert.", ["Agenten Code oder Shell ausführen", "Untrusted Inputs verarbeitet werden", "Seiteneffekte begrenzt werden müssen"], ["Keine Ausführung stattfindet", "Sandbox nicht kontrolliert ist", "Geprüfte Tools besser passen"], "Sichere Ausführung gegen Infrastrukturaufwand.", ["OpenAI Code Interpreter", "AutoGen / AG2", "Microsoft Agent Framework", "LangGraph"], "Governance & Safety"),
  p("Least Privilege Agent", "Systembetrieb", ["Minimal Permission Agent", "Scoped Agent"], "Jeder Agent erhält nur Tools, Daten und Rechte, die seine Aufgabe erfordert.", ["Agenten unterschiedliche Vertrauenszonen haben", "Sensitive Daten beteiligt sind", "Sicherheitsgrenzen sichtbar sein sollen"], ["Rollen unklar sind", "Berechtigungsmodell Pflege verhindert", "Einschränkung Kernfunktionen blockiert"], "Geringere Angriffsfläche gegen Rollenaufwand.", ["OpenAI Agents SDK", "Microsoft Agent Framework", "Google ADK", "AWS Strands", "LangGraph"], "Governance & Safety"),
  p("Audit Trail", "Systembetrieb", ["Execution Log", "Decision Log"], "Entscheidungen, Tool-Aufrufe, Eingaben, Ausgaben und Freigaben werden protokolliert.", ["Compliance Nachvollziehbarkeit verlangt", "Agenten externe Aktionen auslösen", "Analysen möglich sein sollen"], ["Logs sensitive Daten ungeschützt speichern", "Aufbewahrung ungeklärt ist", "Logging nur Rauschen erzeugt"], "Nachvollziehbarkeit gegen Datenschutz- und Speicheraufwand.", ["OpenAI Agents SDK Tracing", "LangSmith", "Microsoft Agent Framework", "Google ADK", "AWS Observability"], "Governance & Safety"),
  p("Multimodal Guardrails", "Systembetrieb", ["Multimodal Safety Filters", "Media Validation"], "Text-, Bild-, Audio- oder Videoeingaben und Ausgaben werden modalitätsspezifisch geprüft.", ["Agenten multimodale Daten verarbeiten", "Medien Compliance-Risiken tragen", "Mehrere Modalitäten kontrolliert werden müssen"], ["System rein textuell bleibt", "Guardrails Modalitäten nicht abdecken", "Prüfung relevante Inhalte blockiert"], "Bessere Sicherheit gegen Latenz und Fehlklassifikationen.", ["OpenAI Moderation", "Azure AI Content Safety", "Vertex AI Safety", "AWS Bedrock Guardrails"], "Governance & Safety"),

  p("Distributed Tracing", "Systembetrieb", ["Agent Tracing", "End-to-End Trace"], "Agentenläufe, Tool-Aufrufe und Subprozesse werden als zusammenhängende Traces sichtbar.", ["Mehrere Komponenten beteiligt sind", "Fehlerursachen analysiert werden müssen", "Produktionsbetrieb beobachtet werden muss"], ["System minimal lokal bleibt", "Trace-Daten Datenschutzrisiken erzeugen", "Telemetriekosten den Nutzen übersteigen"], "Tiefe Diagnosefähigkeit gegen Telemetrieaufwand.", ["OpenAI Agents SDK Tracing", "LangSmith", "Microsoft Agent Framework", "AWS X-Ray", "Google Cloud Trace"], "Observability & Evaluation"),
  p("Token / Cost Tracking", "Systembetrieb", ["Usage Tracking", "Cost Observability"], "Tokenverbrauch, Modellkosten und Tool-Ausgaben werden pro Lauf, Agent oder Workflow gemessen.", ["Kosten begrenzt werden müssen", "Agenten autonom Schleifen ausführen", "Patterns optimiert werden sollen"], ["Budget irrelevant ist", "Messdaten nicht handlungsrelevant sind", "Kosten außerhalb nicht erfassbar sind"], "Bessere Budgetkontrolle gegen Messaufwand.", ["OpenAI Usage APIs", "LangSmith", "Microsoft Agent Framework", "Google Cloud Monitoring", "AWS Cost"], "Observability & Evaluation"),
  p("LLM-as-Judge", "Systembetrieb", ["Model Judge", "AI Evaluator"], "Ein Modell bewertet Ausgaben anhand von Kriterien, Rubrics oder Vergleichsbeispielen.", ["Bewertung skalieren muss", "Qualitätskriterien sprachlich formulierbar sind", "Regressionen erkannt werden sollen"], ["Objektive Tests verfügbar sind", "Judge denselben Bias hat", "Hohe rechtliche Verbindlichkeit nötig ist"], "Skalierbare Bewertung gegen Kalibrierungsbedarf.", ["LangSmith", "OpenAI Evals", "Microsoft Agent Framework", "Google ADK", "AutoGen / AG2"], "Observability & Evaluation"),
  p("Integration Tests für Agents", "Systembetrieb", ["Agent Integration Tests", "Scenario Tests"], "Agenten werden über realistische Szenarien, Tools, Speicher und Kontrollflüsse getestet.", ["Agenten produktionsnah handeln", "Tool- und Workflow-Grenzen geprüft werden", "Regressionen sichtbar werden sollen"], ["Nur ein Prompt exploriert wird", "Bewertung nicht deterministisch ist", "Testumgebung externe Systeme gefährdet"], "Höhere Betriebssicherheit gegen Testdaten- und Mock-Aufwand.", ["LangSmith", "OpenAI Evals", "Microsoft Agent Framework", "Google ADK", "CrewAI", "AutoGen / AG2"], "Observability & Evaluation")
];

const decisionSteps = [
  {
    question: "Reicht ein einzelner Prompt mit gutem Prompt-Engineering?",
    yes: "Direkter Modell-Call. Stop.",
    no: "Weiter prüfen: braucht die Aufgabe externe Daten, Tools oder mehr Struktur?",
    recommendation: ["Direct Model Call", "Self-Consistency", "Reflexion"]
  },
  {
    question: "Braucht es externe Interaktion oder Datenzugriff?",
    yes: "Tool-enabled Design prüfen: Function Calling, ReAct oder MCP (Model Context Protocol).",
    no: "Reasoning Pattern prüfen: Self-Consistency, Tree of Thoughts oder Reflexion.",
    recommendation: ["Function Calling", "ReAct", "MCP (Model Context Protocol)"]
  },
  {
    question: "Ist der Ablauf vorhersagbar?",
    yes: "Workflow-Pattern wählen: Sequential Pipeline, Routing, Map-Reduce oder Evaluator-Optimizer.",
    no: "Agentisches Design prüfen: ReAct, Plan-and-Execute oder Multi-Agent-Koordination.",
    recommendation: ["Sequential Pipeline", "Routing", "Map-Reduce"]
  },
  {
    question: "Reicht ein autonomer Agent?",
    yes: "Single Agent mit ReAct oder Plan-and-Execute ist meist ausreichend.",
    no: "Zusammenarbeit modellieren: Supervisor, Handoff, Group Chat oder Blackboard.",
    recommendation: ["ReAct", "Plan-and-Execute", "Supervisor"]
  },
  {
    question: "Sind echte Spezialisten nötig, etwa eigene Sicherheitsgrenzen oder Tool-Sets?",
    yes: "Multi-Agent-Pattern nutzen und anschließend den Kooperationstyp prüfen.",
    no: "Single Agent mit gutem Tool-Design und Capability Routing bevorzugen.",
    recommendation: ["Handoff", "Supervisor", "Function Calling"]
  },
  {
    question: "Wenn Multi-Agent gewählt wurde: müssen mehrere Agents autonom ohne festen Plan kooperieren?",
    yes: "Magentic, Group Chat oder Blackboard prüfen.",
    no: "Supervisor oder Handoff reichen meist.",
    recommendation: ["Group Chat", "Blackboard", "Supervisor"]
  },
  {
    question: "Geht es in Richtung Production?",
    yes: "Systembetrieb ist verpflichtend: Memory, Runtime, Governance, Observability und Evaluation.",
    no: "Für Prototypen bewusst schlank bleiben, aber Risiken dokumentieren.",
    recommendation: ["Workflow DAG / Durable Execution", "Human-in-the-Loop Approval Gate", "Distributed Tracing", "Output Validation / Schema Enforcement"]
  }
];

const demos = {
  react: `async function reactLoop(goal, tools, model) {
  const trace = [];

  while (!done(trace)) {
    const next = await model.reason({ goal, trace });

    if (next.type === "final") return next.answer;

    const observation = await tools[next.tool].call(next.args);
    trace.push({ thought: next.summary, action: next.tool, observation });
  }

  throw new Error("Budget exceeded");
}`,
  router: `const routes = {
  billing: billingAgent,
  research: researchWorkflow,
  coding: codingAgent
};

async function routeRequest(input, classifier) {
  const { intent, confidence } = await classifier.classify(input);

  if (confidence < 0.72) return humanTriage(input);
  return routes[intent].run(input);
}`,
  approval: `async function runWithApproval(step, approver) {
  const risk = assessRisk(step);

  if (risk.requiresHuman) {
    const decision = await approver.review({
      action: step.name,
      arguments: step.args,
      reason: risk.reason
    });

    if (!decision.approved) return { status: "blocked", decision };
  }

  return execute(step);
}`
};

let selectedDomain = "Alle";
let selectedPattern = patterns[0];

const listEl = document.querySelector("#pattern-list");
const detailEl = document.querySelector("#pattern-detail");
const searchEl = document.querySelector("#search");
const filterButtons = [...document.querySelectorAll(".filter")];
const decisionButtons = [...document.querySelectorAll("[data-step]")];
const decisionDetail = document.querySelector("#decision-detail");
const demoButtons = [...document.querySelectorAll("[data-demo]")];
const demoCode = document.querySelector("#demo-code");

function matchesQuery(pattern, query) {
  const haystack = [
    pattern.name,
    pattern.domain,
    pattern.subdomain,
    pattern.idea,
    pattern.tradeoff,
    ...pattern.aliases,
    ...pattern.useWhen,
    ...pattern.avoidWhen,
    ...pattern.frameworks
  ].filter(Boolean).join(" ").toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function renderList() {
  const query = searchEl.value.trim();
  const filtered = patterns.filter((pattern) => {
    const domainMatch = selectedDomain === "Alle" || pattern.domain === selectedDomain;
    return domainMatch && (!query || matchesQuery(pattern, query));
  });

  if (!filtered.includes(selectedPattern)) selectedPattern = filtered[0] || patterns[0];

  listEl.innerHTML = filtered.map((pattern) => `
    <button class="pattern-row ${pattern.name === selectedPattern.name ? "is-selected" : ""}" type="button" data-pattern="${pattern.name}">
      <span>
        <strong>${pattern.name}</strong>
        <small>${pattern.subdomain ? `${pattern.domain} · ${pattern.subdomain}` : pattern.domain}</small>
      </span>
      <em>${pattern.frameworks.slice(0, 2).join(", ")}</em>
    </button>
  `).join("") || `<p class="empty">Kein Pattern gefunden. Suchbegriff etwas breiter wählen.</p>`;

  [...listEl.querySelectorAll("[data-pattern]")].forEach((button) => {
    button.addEventListener("click", () => {
      selectedPattern = patterns.find((pattern) => pattern.name === button.dataset.pattern);
      renderList();
      renderDetail();
    });
  });
}

function renderDetail() {
  const pattern = selectedPattern;
  detailEl.innerHTML = `
    <p class="detail-domain">${pattern.subdomain ? `${pattern.domain} · ${pattern.subdomain}` : pattern.domain}</p>
    <h3>${pattern.name}</h3>
    <p class="detail-idea">${pattern.idea}</p>
    <dl>
      <dt>Aliase</dt>
      <dd>${pattern.aliases.join(", ")}</dd>
      <dt>Einsetzen, wenn</dt>
      <dd>${pattern.useWhen.map((item) => `<span>${item}</span>`).join("")}</dd>
      <dt>Nicht einsetzen, wenn</dt>
      <dd>${pattern.avoidWhen.map((item) => `<span>${item}</span>`).join("")}</dd>
      <dt>Trade-off</dt>
      <dd>${pattern.tradeoff}</dd>
      <dt>Frameworks</dt>
      <dd>${pattern.frameworks.map((item) => `<span>${item}</span>`).join("")}</dd>
    </dl>
  `;
}

function renderDecision(stepIndex = 0) {
  const step = decisionSteps[stepIndex];
  decisionDetail.innerHTML = `
    <p class="decision-count">Frage ${stepIndex + 1} von ${decisionSteps.length}</p>
    <h3>${step.question}</h3>
    <div class="answer-grid">
      <div><strong>Ja</strong><p>${step.yes}</p></div>
      <div><strong>Nein</strong><p>${step.no}</p></div>
    </div>
    <p class="recommendation-label">Typische Kandidaten</p>
    <div class="recommendations">${step.recommendation.map((item) => `<span>${item}</span>`).join("")}</div>
  `;
}

function setDemo(name) {
  demoCode.textContent = demos[name];
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedDomain = button.dataset.domain;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderList();
    renderDetail();
  });
});

searchEl.addEventListener("input", () => {
  renderList();
  renderDetail();
});

decisionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    decisionButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderDecision(Number(button.dataset.step));
  });
});

demoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    demoButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    setDemo(button.dataset.demo);
  });
});

renderList();
renderDetail();
renderDecision();
setDemo("react");
