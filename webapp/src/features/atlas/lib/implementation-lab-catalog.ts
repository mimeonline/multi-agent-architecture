import type { ReferenceArchitecture } from "../types/atlas";

export type ImplementationDemoGroupId = "denken" | "ablauf" | "zusammenarbeit" | "systembetrieb";

export type ImplementationDemo = {
  slug: string;
  name: string;
  group: ImplementationDemoGroupId;
  groupLabel: string;
  domain: string;
  idea: string;
  frameworks: string[];
  steps: string[];
  snippet: string;
  prompt: string;
  sourcePath: string;
  notebookPath: string;
  githubUrl: string;
  notebookUrl: string;
  colabUrl: string;
  runCommand: string;
};

export type ImplementationDemoGroup = {
  id: ImplementationDemoGroupId;
  label: string;
  description: string;
};

export type ImplementationArchitectureNotebook = {
  slug: ReferenceArchitecture["slug"];
  title: string;
  tagline: string;
  scenario: string;
  notebookPath: string;
  notebookUrl: string;
  colabUrl: string;
  pageUrl: string;
};

export const implementationDemoGroups: ImplementationDemoGroup[] = [
  {
    "id": "denken",
    "label": "Denken",
    "description": "Reasoning-Patterns: Wie ein einzelner Agent plant, reflektiert, Werkzeuge nutzt oder mehrere Denkpfade bewertet."
  },
  {
    "id": "ablauf",
    "label": "Ablauf",
    "description": "Workflow-Patterns: Wie Aufgaben sequenziell, parallel, iterativ oder arbeitsteilig gesteuert werden."
  },
  {
    "id": "zusammenarbeit",
    "label": "Zusammenarbeit",
    "description": "Multi-Agent-Patterns: Wie mehrere spezialisierte Agenten koordinieren, delegieren und Ergebnisse zusammenführen."
  },
  {
    "id": "systembetrieb",
    "label": "Systembetrieb",
    "description": "Betriebs-Patterns: Memory, Tool-Integration, Governance, Observability und robuste Runtime-Mechaniken."
  }
];

export const implementationDemos: ImplementationDemo[] = [
  {
    "slug": "react",
    "name": "ReAct",
    "group": "denken",
    "groupLabel": "Denken",
    "domain": "Denken",
    "idea": "Der Agent wechselt iterativ zwischen Reasoning, Tool-Aufruf und Beobachtung.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run react \"Find 12 * 7 and summarize the tool result.\"",
    "prompt": "Find 12 * 7 and summarize the tool result.",
    "sourcePath": "code/src/ai_agent_patterns/demos/denken/react.py",
    "notebookPath": "code/notebooks/patterns/denken/react.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/denken/react.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/react.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/react.ipynb",
    "runCommand": "agent-patterns run react \"Find 12 * 7 and summarize the tool result.\""
  },
  {
    "slug": "plan-and-execute",
    "name": "Plan-and-Execute",
    "group": "denken",
    "groupLabel": "Denken",
    "domain": "Denken",
    "idea": "Ein Agent erstellt zuerst einen Plan und arbeitet die Schritte danach kontrolliert ab.",
    "frameworks": [
      "LangGraph",
      "LangChain",
      "OpenAI Agents SDK"
    ],
    "steps": [
      "Plan mit drei Teilaufgaben erzeugen",
      "Jeden Schritt mit explizitem Zwischenergebnis ausführen",
      "Finale Antwort aus Plan und Ergebnissen zusammensetzen"
    ],
    "snippet": "plan = planner.invoke({\"goal\": prompt})\nfor step in plan.steps:\n    observations.append(executor.invoke({\"step\": step}))\nfinal = synthesizer.invoke({\"plan\": plan, \"observations\": observations})",
    "prompt": "Plan a small customer support automation in three steps.",
    "sourcePath": "code/src/ai_agent_patterns/demos/denken/plan_and_execute.py",
    "notebookPath": "code/notebooks/patterns/denken/plan-and-execute.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/denken/plan_and_execute.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/plan-and-execute.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/plan-and-execute.ipynb",
    "runCommand": "agent-patterns run plan-and-execute \"Plan a small customer support automation in three steps.\""
  },
  {
    "slug": "rewoo",
    "name": "ReWOO",
    "group": "denken",
    "groupLabel": "Denken",
    "domain": "Denken",
    "idea": "Der Agent plant Tool-Aufrufe vorab und löst erst nach gebündelter Beobachtung die Aufgabe.",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "steps": [
      "Tool-Bedarf aus dem Prompt ableiten",
      "Unabhängige Tool-Aufrufe gesammelt ausführen",
      "Solver fasst alle Beobachtungen in einem finalen Schritt zusammen"
    ],
    "snippet": "tool_plan = [\"search_docs\", \"read_examples\", \"summarize_constraints\"]\nobservations = {tool: tools[tool].invoke(prompt) for tool in tool_plan}\nanswer = solver.invoke({\"prompt\": prompt, \"observations\": observations})",
    "prompt": "Find the cost drivers for a small AI workflow and summarize them.",
    "sourcePath": "code/src/ai_agent_patterns/demos/denken/rewoo.py",
    "notebookPath": "code/notebooks/patterns/denken/rewoo.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/denken/rewoo.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/rewoo.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/rewoo.ipynb",
    "runCommand": "agent-patterns run rewoo \"Find the cost drivers for a small AI workflow and summarize them.\""
  },
  {
    "slug": "reflexion",
    "name": "Reflexion",
    "group": "denken",
    "groupLabel": "Denken",
    "domain": "Denken",
    "idea": "Der Agent erzeugt eine Antwort, kritisiert sie selbst und überarbeitet daraufhin.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run reflexion \"Write a two sentence product update.\"",
    "prompt": "Write a two sentence product update.",
    "sourcePath": "code/src/ai_agent_patterns/demos/denken/reflexion.py",
    "notebookPath": "code/notebooks/patterns/denken/reflexion.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/denken/reflexion.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/reflexion.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/reflexion.ipynb",
    "runCommand": "agent-patterns run reflexion \"Write a two sentence product update.\""
  },
  {
    "slug": "tree-of-thoughts",
    "name": "Tree of Thoughts",
    "group": "denken",
    "groupLabel": "Denken",
    "domain": "Denken",
    "idea": "Mehrere Reasoning-Pfade werden als Baum exploriert und bewertet.",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "steps": [
      "Drei alternative Lösungsäste generieren",
      "Jeden Ast mit einer einfachen Rubrik bewerten",
      "Besten Ast weiter ausbauen und finalisieren"
    ],
    "snippet": "branches = [model.invoke(f\"Propose path {i}: {prompt}\") for i in range(3)]\nranked = sorted(branches, key=score_branch, reverse=True)\nanswer = model.invoke(f\"Continue the strongest branch: {ranked[0]}\")",
    "prompt": "Compare three solution paths for an agent onboarding flow.",
    "sourcePath": "code/src/ai_agent_patterns/demos/denken/tree_of_thoughts.py",
    "notebookPath": "code/notebooks/patterns/denken/tree-of-thoughts.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/denken/tree_of_thoughts.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/tree-of-thoughts.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/tree-of-thoughts.ipynb",
    "runCommand": "agent-patterns run tree-of-thoughts \"Compare three solution paths for an agent onboarding flow.\""
  },
  {
    "slug": "self-consistency",
    "name": "Self-Consistency",
    "group": "denken",
    "groupLabel": "Denken",
    "domain": "Denken",
    "idea": "Mehrere unabhängige Antworten werden erzeugt und per Konsens zusammengeführt.",
    "frameworks": [
      "LangChain",
      "LangGraph"
    ],
    "steps": [
      "Mehrere unabhängige Samples mit leicht unterschiedlicher Perspektive erzeugen",
      "Antworten normalisieren und gruppieren",
      "Mehrheits- oder Konsensantwort zurückgeben"
    ],
    "snippet": "samples = [model.invoke(prompt) for _ in range(5)]\nwinner = majority_vote(normalize(sample) for sample in samples)\nreturn winner",
    "prompt": "Answer whether a lightweight router or supervisor is better for support triage.",
    "sourcePath": "code/src/ai_agent_patterns/demos/denken/self_consistency.py",
    "notebookPath": "code/notebooks/patterns/denken/self-consistency.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/denken/self_consistency.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/self-consistency.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/self-consistency.ipynb",
    "runCommand": "agent-patterns run self-consistency \"Answer whether a lightweight router or supervisor is better for support triage.\""
  },
  {
    "slug": "codeact",
    "name": "CodeAct",
    "group": "denken",
    "groupLabel": "Denken",
    "domain": "Denken",
    "idea": "Der Agent schreibt Python als primäre Handlung statt fixe Tool-Funktionen zu serialisieren.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run codeact \"Calculate the average of 4, 8 and 12.\"",
    "prompt": "Calculate the average of 4, 8 and 12.",
    "sourcePath": "code/src/ai_agent_patterns/demos/denken/codeact.py",
    "notebookPath": "code/notebooks/patterns/denken/codeact.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/denken/codeact.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/codeact.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/denken/codeact.ipynb",
    "runCommand": "agent-patterns run codeact \"Calculate the average of 4, 8 and 12.\""
  },
  {
    "slug": "sequential-pipeline",
    "name": "Sequential Pipeline (Prompt Chaining)",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Fest definierte Schrittfolge, jeder Schritt nimmt den vorherigen Output.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run sequential-pipeline \"Draft a launch note for a memory feature.\"",
    "prompt": "Draft a launch note for a memory feature.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/sequential_pipeline.py",
    "notebookPath": "code/notebooks/patterns/ablauf/sequential-pipeline.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/sequential_pipeline.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/sequential-pipeline.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/sequential-pipeline.ipynb",
    "runCommand": "agent-patterns run sequential-pipeline \"Draft a launch note for a memory feature.\""
  },
  {
    "slug": "routing",
    "name": "Routing",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Ein Klassifikator entscheidet anhand der Anfrage, welcher Spezialistenpfad sie bearbeitet.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run routing \"I need this Python traceback explained.\"",
    "prompt": "I need this Python traceback explained.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/routing.py",
    "notebookPath": "code/notebooks/patterns/ablauf/routing.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/routing.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/routing.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/routing.ipynb",
    "runCommand": "agent-patterns run routing \"I need this Python traceback explained.\""
  },
  {
    "slug": "parallelization-sectioning",
    "name": "Parallelization (Sectioning)",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Unabhängige Segmente werden parallel verarbeitet und danach zusammengeführt.",
    "frameworks": [
      "LangGraph",
      "LangChain RunnableParallel"
    ],
    "steps": [
      "Input in Segmente teilen",
      "Segmente parallel bearbeiten",
      "Ergebnisse konsolidieren"
    ],
    "snippet": "sections = split_into_sections(prompt)\npartial = RunnableParallel({s.id: worker for s in sections}).invoke(sections)\nanswer = reducer.invoke(partial)",
    "prompt": "Summarize three independent sections of an agent architecture note.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/parallelization_sectioning.py",
    "notebookPath": "code/notebooks/patterns/ablauf/parallelization-sectioning.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/parallelization_sectioning.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/parallelization-sectioning.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/parallelization-sectioning.ipynb",
    "runCommand": "agent-patterns run parallelization-sectioning \"Summarize three independent sections of an agent architecture note.\""
  },
  {
    "slug": "parallelization-voting",
    "name": "Parallelization (Voting)",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Mehrere Läufe bearbeiten dieselbe Aufgabe und ein Aggregator wählt das beste Ergebnis.",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "steps": [
      "Drei Kandidaten generieren",
      "Kandidaten bewerten",
      "Gewinner oder Synthese zurückgeben"
    ],
    "snippet": "candidates = [chain.invoke(prompt) for _ in range(3)]\nscores = judge.batch(candidates)\nanswer = candidates[max(range(len(scores)), key=scores.__getitem__)]",
    "prompt": "Choose the best short title for an AI agent pattern guide.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/parallelization_voting.py",
    "notebookPath": "code/notebooks/patterns/ablauf/parallelization-voting.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/parallelization_voting.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/parallelization-voting.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/parallelization-voting.ipynb",
    "runCommand": "agent-patterns run parallelization-voting \"Choose the best short title for an AI agent pattern guide.\""
  },
  {
    "slug": "loop",
    "name": "Loop",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Ein Schritt wird bis zu einer Abbruchbedingung wiederholt.",
    "frameworks": [
      "LangGraph",
      "CrewAI Flows"
    ],
    "steps": [
      "Ergebnis erzeugen",
      "Qualität oder Status prüfen",
      "Bei Bedarf erneut ausführen"
    ],
    "snippet": "while attempts < max_attempts:\n    draft = worker.invoke(prompt)\n    if validator.invoke(draft).passed:\n        break\n    attempts += 1",
    "prompt": "Improve this answer until it passes a simple quality check.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/loop.py",
    "notebookPath": "code/notebooks/patterns/ablauf/loop.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/loop.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/loop.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/loop.ipynb",
    "runCommand": "agent-patterns run loop \"Improve this answer until it passes a simple quality check.\""
  },
  {
    "slug": "evaluator-optimizer",
    "name": "Evaluator-Optimizer (Generator-Critic)",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Ein Generator erzeugt ein Ergebnis, ein Evaluator bewertet es und ein Optimizer verbessert es.",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "steps": [
      "Entwurf generieren",
      "Entwurf gegen Rubrik bewerten",
      "Bei Bedarf optimierte Version erzeugen"
    ],
    "snippet": "draft = generator.invoke(prompt)\nscore = evaluator.invoke({\"draft\": draft, \"rubric\": rubric})\nanswer = optimizer.invoke({\"draft\": draft, \"score\": score})",
    "prompt": "Generate and critique a concise feature announcement.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/evaluator_optimizer.py",
    "notebookPath": "code/notebooks/patterns/ablauf/evaluator-optimizer.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/evaluator_optimizer.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/evaluator-optimizer.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/evaluator-optimizer.ipynb",
    "runCommand": "agent-patterns run evaluator-optimizer \"Generate and critique a concise feature announcement.\""
  },
  {
    "slug": "iterative-refinement",
    "name": "Iterative Refinement",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Ein Ergebnis wird über kontrollierte Revisionen schrittweise verbessert.",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "steps": [
      "Entwurf erzeugen",
      "Feedback anwenden",
      "Finale Version nach Budget oder Qualitätsziel liefern"
    ],
    "snippet": "draft = generator.invoke(prompt)\nfor _ in range(2):\n    feedback = reviewer.invoke(draft)\n    draft = reviser.invoke({\"draft\": draft, \"feedback\": feedback})",
    "prompt": "Refine a rough release note into a polished version.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/iterative_refinement.py",
    "notebookPath": "code/notebooks/patterns/ablauf/iterative-refinement.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/iterative_refinement.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/iterative-refinement.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/iterative-refinement.ipynb",
    "runCommand": "agent-patterns run iterative-refinement \"Refine a rough release note into a polished version.\""
  },
  {
    "slug": "orchestrator-workers",
    "name": "Orchestrator-Workers",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Ein Orchestrator zerlegt Arbeit dynamisch und verteilt Teilaufgaben an Worker.",
    "frameworks": [
      "LangGraph",
      "Anthropic Cookbook",
      "Google ADK"
    ],
    "steps": [
      "Teilaufgaben erkennen",
      "Worker pro Teilaufgabe starten",
      "Antworten zentral aggregieren"
    ],
    "snippet": "tasks = orchestrator.invoke({\"goal\": prompt})\nresults = [workers[task.kind].invoke(task) for task in tasks]\nanswer = orchestrator.invoke({\"goal\": prompt, \"results\": results})",
    "prompt": "Break a research task into specialist worker assignments.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/orchestrator_workers.py",
    "notebookPath": "code/notebooks/patterns/ablauf/orchestrator-workers.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/orchestrator_workers.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/orchestrator-workers.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/orchestrator-workers.ipynb",
    "runCommand": "agent-patterns run orchestrator-workers \"Break a research task into specialist worker assignments.\""
  },
  {
    "slug": "map-reduce",
    "name": "Map-Reduce",
    "group": "ablauf",
    "groupLabel": "Ablauf",
    "domain": "Ablauf",
    "idea": "Viele unabhängige Chunks werden gemappt und anschließend reduziert.",
    "frameworks": [
      "LangGraph",
      "LangChain"
    ],
    "steps": [
      "Dokumente oder Einheiten chunken",
      "Map-Funktion pro Chunk ausführen",
      "Reduce-Funktion aggregiert"
    ],
    "snippet": "mapped = mapper.batch(split(prompt))\nanswer = reducer.invoke({\"partials\": mapped})",
    "prompt": "Aggregate insights from multiple short architecture notes.",
    "sourcePath": "code/src/ai_agent_patterns/demos/ablauf/map_reduce.py",
    "notebookPath": "code/notebooks/patterns/ablauf/map-reduce.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/ablauf/map_reduce.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/map-reduce.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/ablauf/map-reduce.ipynb",
    "runCommand": "agent-patterns run map-reduce \"Aggregate insights from multiple short architecture notes.\""
  },
  {
    "slug": "supervisor",
    "name": "Supervisor",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Zentraler Agent betreut Spezialisten und entscheidet pro Schritt, wer als nächstes dran ist.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run supervisor \"Route a task between a researcher and a builder.\"",
    "prompt": "Route a task between a researcher and a builder.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/supervisor.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/supervisor.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/supervisor.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/supervisor.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/supervisor.ipynb",
    "runCommand": "agent-patterns run supervisor \"Route a task between a researcher and a builder.\""
  },
  {
    "slug": "hierarchical-supervisor",
    "name": "Hierarchical Supervisor",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Supervisoren koordinieren Subteams und verdichten Ergebnisse nach oben.",
    "frameworks": [
      "LangGraph",
      "CrewAI"
    ],
    "steps": [
      "Top-Level-Ziel an Team-Supervisor geben",
      "Subteams arbeiten unabhängig",
      "Top-Level-Supervisor aggregiert"
    ],
    "snippet": "frontend_plan = frontend_supervisor.invoke(prompt)\nbackend_plan = backend_supervisor.invoke(prompt)\nfinal = lead_supervisor.invoke({\"frontend\": frontend_plan, \"backend\": backend_plan})",
    "prompt": "Coordinate two teams for building an agent demo suite.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/hierarchical_supervisor.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/hierarchical-supervisor.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/hierarchical_supervisor.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/hierarchical-supervisor.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/hierarchical-supervisor.ipynb",
    "runCommand": "agent-patterns run hierarchical-supervisor \"Coordinate two teams for building an agent demo suite.\""
  },
  {
    "slug": "handoff",
    "name": "Handoff",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Ein Agent erkennt, dass er nicht weiterführen sollte, und übergibt Kontrolle und Kontext vollständig.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run handoff \"Transfer a user request from intake to a permission-scoped specialist.\"",
    "prompt": "Transfer a user request from intake to a permission-scoped specialist.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/handoff.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/handoff.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/handoff.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/handoff.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/handoff.ipynb",
    "runCommand": "agent-patterns run handoff \"Transfer a user request from intake to a permission-scoped specialist.\""
  },
  {
    "slug": "swarm",
    "name": "Swarm",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Agents koordinieren sich dezentral über lokale Regeln und geteilte Ziele.",
    "frameworks": [
      "LangGraph Swarm",
      "AWS Strands"
    ],
    "steps": [
      "Ziel in gemeinsamen Raum stellen",
      "Peers schlagen nächste Aktionen vor",
      "Stoppen, wenn Konsens oder Budget erreicht ist"
    ],
    "snippet": "while budget.remaining:\n    proposals = [agent.propose(shared_state) for agent in peers]\n    shared_state = apply_best_local_moves(shared_state, proposals)",
    "prompt": "Let several peers propose next steps for exploring a broad topic.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/swarm.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/swarm.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/swarm.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/swarm.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/swarm.ipynb",
    "runCommand": "agent-patterns run swarm \"Let several peers propose next steps for exploring a broad topic.\""
  },
  {
    "slug": "group-chat",
    "name": "Group Chat",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Mehrere Agents kommunizieren in einem gemeinsamen Gesprächsraum.",
    "frameworks": [
      "AutoGen / AG2",
      "Microsoft Agent Framework"
    ],
    "steps": [
      "Rollen initialisieren",
      "Beiträge round-robin sammeln",
      "Moderator fasst Ergebnis zusammen"
    ],
    "snippet": "messages = [user_message(prompt)]\nfor agent in [researcher, critic, builder]:\n    messages.append(agent.invoke(messages))\nanswer = moderator.invoke(messages)",
    "prompt": "Have product, engineering, and safety discuss a new tool feature.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/group_chat.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/group-chat.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/group_chat.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/group-chat.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/group-chat.ipynb",
    "runCommand": "agent-patterns run group-chat \"Have product, engineering, and safety discuss a new tool feature.\""
  },
  {
    "slug": "multi-agent-debate",
    "name": "Multi-Agent Debate",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Agents prüfen eine Entscheidung aus gegensätzlichen Perspektiven.",
    "frameworks": [
      "AutoGen / AG2",
      "LangGraph"
    ],
    "steps": [
      "Pro- und Contra-Agent erzeugen",
      "Argumente austauschen",
      "Judge entscheidet anhand Rubrik"
    ],
    "snippet": "pro = pro_agent.invoke(prompt)\ncontra = contra_agent.invoke(prompt)\nverdict = judge.invoke({\"pro\": pro, \"contra\": contra, \"rubric\": rubric})",
    "prompt": "Debate whether to use Handoff or Supervisor for customer support.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/multi_agent_debate.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/multi-agent-debate.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/multi_agent_debate.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/multi-agent-debate.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/multi-agent-debate.ipynb",
    "runCommand": "agent-patterns run multi-agent-debate \"Debate whether to use Handoff or Supervisor for customer support.\""
  },
  {
    "slug": "magentic",
    "name": "Magentic",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Lead-Agent plant mit Task-Ledger, delegiert dynamisch an Spezialisten und replant bei Hindernissen.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run magentic \"Research how agent handoffs should be documented.\"",
    "prompt": "Research how agent handoffs should be documented.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/magentic.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/magentic.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/magentic.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/magentic.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/magentic.ipynb",
    "runCommand": "agent-patterns run magentic \"Research how agent handoffs should be documented.\""
  },
  {
    "slug": "blackboard",
    "name": "Blackboard",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Agents koordinieren indirekt über eine gemeinsame Zustandsfläche.",
    "frameworks": [
      "LangGraph",
      "AWS Strands"
    ],
    "steps": [
      "Shared State initialisieren",
      "Agents lesen und schreiben Hypothesen",
      "Synthesizer liest finalen Zustand"
    ],
    "snippet": "blackboard[\"goal\"] = prompt\nfor agent in agents:\n    blackboard.update(agent.invoke(blackboard))\nanswer = synthesizer.invoke(blackboard)",
    "prompt": "Coordinate agents through a shared investigation workspace.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/blackboard.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/blackboard.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/blackboard.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/blackboard.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/blackboard.ipynb",
    "runCommand": "agent-patterns run blackboard \"Coordinate agents through a shared investigation workspace.\""
  },
  {
    "slug": "contract-net",
    "name": "Contract Net",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Agents bieten auf ausgeschriebene Aufgaben und der beste Anbieter erhält den Auftrag.",
    "frameworks": [
      "LangGraph custom protocol",
      "AutoGen / AG2 custom conversation"
    ],
    "steps": [
      "Aufgabe ausschreiben",
      "Bids mit Fähigkeit und Kosten sammeln",
      "Gewinner beauftragen"
    ],
    "snippet": "bids = [agent.bid(task) for agent in agents]\nwinner = min(bids, key=lambda bid: (bid.cost, -bid.confidence))\nresult = winner.agent.invoke(task)",
    "prompt": "Assign a task by asking specialists to bid on it.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/contract_net.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/contract-net.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/contract_net.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/contract-net.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/contract-net.ipynb",
    "runCommand": "agent-patterns run contract-net \"Assign a task by asking specialists to bid on it.\""
  },
  {
    "slug": "market-based",
    "name": "Market-based",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Agents priorisieren Arbeit über Budgets, Preise oder Nutzenfunktionen.",
    "frameworks": [
      "LangGraph custom coordination",
      "AWS Strands custom workflow"
    ],
    "steps": [
      "Budget und Nutzen je Aufgabe bestimmen",
      "Agents bieten Kapazität an",
      "Marktregel verteilt Aufgaben"
    ],
    "snippet": "market = Market(budget=100)\nallocations = market.clear(tasks, agent_offers)\nresults = [allocation.agent.invoke(allocation.task) for allocation in allocations]",
    "prompt": "Allocate limited model budget across three competing tasks.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/market_based.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/market-based.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/market_based.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/market-based.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/market-based.ipynb",
    "runCommand": "agent-patterns run market-based \"Allocate limited model budget across three competing tasks.\""
  },
  {
    "slug": "agents-as-tools",
    "name": "Agents-as-Tools",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Ein Hauptagent ruft spezialisierte Agents über stabile Tool-Schnittstellen auf.",
    "frameworks": [
      "AWS Strands",
      "OpenAI Agents SDK",
      "LangGraph"
    ],
    "steps": [
      "Spezialisten als Tools registrieren",
      "Hauptagent wählt Tool anhand Aufgabe",
      "Spezialist liefert begrenztes Ergebnis"
    ],
    "snippet": "tools = [research_agent.as_tool(), code_agent.as_tool()]\nmain_agent = create_agent(model, tools=tools)\nanswer = main_agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": prompt}]})",
    "prompt": "Use a research specialist and a coding specialist as callable tools.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/agents_as_tools.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/agents-as-tools.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/agents_as_tools.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/agents-as-tools.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/agents-as-tools.ipynb",
    "runCommand": "agent-patterns run agents-as-tools \"Use a research specialist and a coding specialist as callable tools.\""
  },
  {
    "slug": "graph-based-orchestration",
    "name": "Graph-based Orchestration",
    "group": "zusammenarbeit",
    "groupLabel": "Zusammenarbeit",
    "domain": "Zusammenarbeit",
    "idea": "Knoten und Kanten werden als Code modelliert — testbar, deterministisch, mit klar definierten Übergängen.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run graph-based-orchestration \"Plan a tiny agent architecture.\"",
    "prompt": "Plan a tiny agent architecture.",
    "sourcePath": "code/src/ai_agent_patterns/demos/zusammenarbeit/graph_based_orchestration.py",
    "notebookPath": "code/notebooks/patterns/zusammenarbeit/graph-based-orchestration.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/zusammenarbeit/graph_based_orchestration.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/graph-based-orchestration.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/zusammenarbeit/graph-based-orchestration.ipynb",
    "runCommand": "agent-patterns run graph-based-orchestration \"Plan a tiny agent architecture.\""
  },
  {
    "slug": "conversational-memory",
    "name": "Conversational Memory",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb",
    "idea": "Die bisherige Konversation wird als wachsendes Array im LLM-Call mitgeschickt.",
    "frameworks": [],
    "steps": [
      "Demo öffnen",
      "Run-Befehl ausführen",
      "Output und Pattern-Mechanik vergleichen"
    ],
    "snippet": "agent-patterns run conversational-memory \"My name is Michael and I like concise demos.\"",
    "prompt": "My name is Michael and I like concise demos.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/conversational_memory.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/conversational-memory.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/conversational_memory.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/conversational-memory.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/conversational-memory.ipynb",
    "runCommand": "agent-patterns run conversational-memory \"My name is Michael and I like concise demos.\""
  },
  {
    "slug": "episodic-memory",
    "name": "Episodic Memory",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Memory",
    "idea": "Abgeschlossene Aufgaben werden als Episoden wiederverwendet.",
    "frameworks": [
      "LangGraph stores",
      "CrewAI Memory"
    ],
    "steps": [
      "Ähnliche Episode suchen",
      "Lösungsweg adaptieren",
      "Neue Episode speichern"
    ],
    "snippet": "episode = store.search(prompt, kind=\"task_episode\")\nanswer = agent.invoke({\"input\": prompt, \"episode\": episode})",
    "prompt": "Reuse a previous successful debugging episode.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/episodic_memory.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/episodic-memory.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/episodic_memory.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/episodic-memory.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/episodic-memory.ipynb",
    "runCommand": "agent-patterns run episodic-memory \"Reuse a previous successful debugging episode.\""
  },
  {
    "slug": "semantic-memory",
    "name": "Semantic Memory",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Memory",
    "idea": "Dauerhaftes Wissen wird unabhängig von Gesprächen abgelegt.",
    "frameworks": [
      "LangChain",
      "OpenAI Vector Stores"
    ],
    "steps": [
      "Fakten extrahieren",
      "Wissen validieren",
      "Wissen abrufbar speichern"
    ],
    "snippet": "facts = extractor.invoke(prompt)\nknowledge_store.upsert(facts)\nanswer = agent.invoke({\"facts\": knowledge_store.search(prompt)})",
    "prompt": "Store a durable fact about a user's preferred response style.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/semantic_memory.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/semantic-memory.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/semantic_memory.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/semantic-memory.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/semantic-memory.ipynb",
    "runCommand": "agent-patterns run semantic-memory \"Store a durable fact about a user's preferred response style.\""
  },
  {
    "slug": "working-memory",
    "name": "Working Memory / Scratchpad",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Memory",
    "idea": "Kurzfristiger Arbeitszustand hält Zwischenschritte eines Laufs.",
    "frameworks": [
      "LangGraph State",
      "OpenAI Agents SDK"
    ],
    "steps": [
      "State initialisieren",
      "Tool-Ergebnisse in State schreiben",
      "Finale Antwort aus State erzeugen"
    ],
    "snippet": "state = {\"scratchpad\": [], \"input\": prompt}\nstate[\"scratchpad\"].append(tool.invoke(prompt))\nanswer = agent.invoke(state)",
    "prompt": "Track intermediate tool results while solving a task.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/working_memory.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/working-memory.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/working_memory.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/working-memory.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/working-memory.ipynb",
    "runCommand": "agent-patterns run working-memory \"Track intermediate tool results while solving a task.\""
  },
  {
    "slug": "vector-memory",
    "name": "Vector Memory",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Memory",
    "idea": "Embedding-Suche ruft semantisch ähnliche Inhalte ab.",
    "frameworks": [
      "LangChain VectorStores",
      "OpenAI Vector Stores"
    ],
    "steps": [
      "Dokumente embedden",
      "Top-k Treffer abrufen",
      "Antwort mit Retrieval-Kontext erzeugen"
    ],
    "snippet": "docs = vector_store.similarity_search(prompt, k=4)\nanswer = rag_chain.invoke({\"context\": docs, \"question\": prompt})",
    "prompt": "Retrieve relevant notes for an agent architecture question.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/vector_memory.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/vector-memory.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/vector_memory.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/vector-memory.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/vector-memory.ipynb",
    "runCommand": "agent-patterns run vector-memory \"Retrieve relevant notes for an agent architecture question.\""
  },
  {
    "slug": "graph-memory",
    "name": "Graph Memory",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Memory",
    "idea": "Entitäten und Beziehungen werden als Graph gespeichert.",
    "frameworks": [
      "LangGraph with graph stores",
      "Neo4j tool integration"
    ],
    "steps": [
      "Entitäten extrahieren",
      "Kanten aktualisieren",
      "Antwort über Graphpfade begründen"
    ],
    "snippet": "entities, edges = extractor.invoke(prompt)\ngraph.upsert(entities, edges)\nanswer = agent.invoke({\"paths\": graph.neighborhood(entities)})",
    "prompt": "Model relationships between agents, tools, and permissions.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/graph_memory.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/graph-memory.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/graph_memory.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/graph-memory.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/graph-memory.ipynb",
    "runCommand": "agent-patterns run graph-memory \"Model relationships between agents, tools, and permissions.\""
  },
  {
    "slug": "compressed-context-memory",
    "name": "Compressed Context Memory",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Memory",
    "idea": "Langer Verlauf wird verdichtet, damit relevante Information im Kontextfenster bleibt.",
    "frameworks": [
      "LangChain",
      "LangGraph"
    ],
    "steps": [
      "Alte Turns zusammenfassen",
      "Summary mit neuen Fakten aktualisieren",
      "Antwort mit verdichtetem Kontext erzeugen"
    ],
    "snippet": "summary = summarizer.invoke({\"old\": summary, \"new\": recent_messages})\nanswer = agent.invoke({\"summary\": summary, \"input\": prompt})",
    "prompt": "Compress a long conversation into a useful running summary.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/compressed_context_memory.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/compressed-context-memory.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/compressed_context_memory.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/compressed-context-memory.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/compressed-context-memory.ipynb",
    "runCommand": "agent-patterns run compressed-context-memory \"Compress a long conversation into a useful running summary.\""
  },
  {
    "slug": "function-calling",
    "name": "Function Calling",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Tool Integration",
    "idea": "Tools werden über strukturierte, validierbare Argumente aufgerufen.",
    "frameworks": [
      "LangChain Tools",
      "OpenAI Agents SDK"
    ],
    "steps": [
      "Schema definieren",
      "Tool auswählen",
      "Argumente validieren und ausführen"
    ],
    "snippet": "@tool\ndef lookup_order(order_id: str) -> str: ...\nagent = create_agent(model, tools=[lookup_order])",
    "prompt": "Calculate subscription cost for 7 seats at 19.5 per seat for 6 months.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/function_calling.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/function-calling.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/function_calling.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/function-calling.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/function-calling.ipynb",
    "runCommand": "agent-patterns run function-calling \"Calculate subscription cost for 7 seats at 19.5 per seat for 6 months.\""
  },
  {
    "slug": "tool-registry",
    "name": "Tool Registry",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Tool Integration",
    "idea": "Tools werden mit Schema, Beschreibung und Berechtigungen katalogisiert.",
    "frameworks": [
      "LangChain",
      "LangGraph"
    ],
    "steps": [
      "Tools registrieren",
      "Metadaten pflegen",
      "Agent erhält passenden Ausschnitt"
    ],
    "snippet": "registry.add(tool, scopes=[\"read:docs\"], owner=\"docs-team\")\ntools = registry.for_task(prompt)",
    "prompt": "Register three tools with schemas and permissions.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/tool_registry.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/tool-registry.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/tool_registry.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/tool-registry.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/tool-registry.ipynb",
    "runCommand": "agent-patterns run tool-registry \"Register three tools with schemas and permissions.\""
  },
  {
    "slug": "mcp",
    "name": "MCP (Model Context Protocol)",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Tool Integration",
    "idea": "Tools und Ressourcen werden über MCP standardisiert eingebunden.",
    "frameworks": [
      "MCP Clients",
      "LangChain adapters"
    ],
    "steps": [
      "MCP Server verbinden",
      "Capabilities entdecken",
      "Tool-Aufrufe über Protokoll ausführen"
    ],
    "snippet": "client = MCPClient(\"filesystem\")\ntools = client.list_tools()\nanswer = agent.invoke({\"tools\": tools, \"input\": prompt})",
    "prompt": "Expose a filesystem search capability through an MCP-style tool boundary.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/mcp.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/mcp.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/mcp.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/mcp.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/mcp.ipynb",
    "runCommand": "agent-patterns run mcp \"Expose a filesystem search capability through an MCP-style tool boundary.\""
  },
  {
    "slug": "adapter-pattern",
    "name": "Adapter Pattern",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Tool Integration",
    "idea": "Uneinheitliche APIs werden in stabile Agent-Tools übersetzt.",
    "frameworks": [
      "LangChain Tools",
      "Custom adapters"
    ],
    "steps": [
      "Externe API kapseln",
      "Agentenfreundliches Schema definieren",
      "Fehler und Auth im Adapter behandeln"
    ],
    "snippet": "class TicketAdapter:\n    def create_ticket(self, title: str) -> str: ...\ntool = StructuredTool.from_function(TicketAdapter().create_ticket)",
    "prompt": "Wrap an external ticket API as an agent-friendly tool.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/adapter_pattern.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/adapter-pattern.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/adapter_pattern.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/adapter-pattern.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/adapter-pattern.ipynb",
    "runCommand": "agent-patterns run adapter-pattern \"Wrap an external ticket API as an agent-friendly tool.\""
  },
  {
    "slug": "capability-routing",
    "name": "Capability Routing",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Tool Integration",
    "idea": "Anfragen werden anhand benötigter Fähigkeiten an passende Tools geleitet.",
    "frameworks": [
      "LangGraph",
      "OpenAI Agents SDK"
    ],
    "steps": [
      "Capability aus Prompt ableiten",
      "Passendes Tool-Set wählen",
      "Antwort mit gewählter Capability erzeugen"
    ],
    "snippet": "capability = router.invoke(prompt)\ntools = registry.by_capability(capability)\nanswer = agent.with_tools(tools).invoke(prompt)",
    "prompt": "Choose the right tool set for a billing support request.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/capability_routing.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/capability-routing.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/capability_routing.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/capability-routing.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/capability-routing.ipynb",
    "runCommand": "agent-patterns run capability-routing \"Choose the right tool set for a billing support request.\""
  },
  {
    "slug": "permission-scoped-tools",
    "name": "Permission-scoped Tools",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Tool Integration",
    "idea": "Tools werden mit minimalen Berechtigungen pro Agent oder Lauf bereitgestellt.",
    "frameworks": [
      "OpenAI Agents SDK",
      "LangGraph"
    ],
    "steps": [
      "Scope bestimmen",
      "Tool-Liste begrenzen",
      "Auditierbaren Aufruf ausführen"
    ],
    "snippet": "tools = registry.for_scope(user_scope=\"read_only\")\nagent = create_agent(model, tools=tools)",
    "prompt": "Limit a support agent to read-only account lookup tools.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/permission_scoped_tools.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/permission-scoped-tools.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/permission_scoped_tools.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/permission-scoped-tools.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/permission-scoped-tools.ipynb",
    "runCommand": "agent-patterns run permission-scoped-tools \"Limit a support agent to read-only account lookup tools.\""
  },
  {
    "slug": "actor-model",
    "name": "Actor Model",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Runtime",
    "idea": "Agents kapseln Zustand und kommunizieren über Nachrichten.",
    "frameworks": [
      "Ray actors",
      "Microsoft Agent Framework"
    ],
    "steps": [
      "Actor pro Agent starten",
      "Nachricht senden",
      "Antwort asynchron sammeln"
    ],
    "snippet": "researcher.send({\"task\": prompt})\nreply = await researcher.receive()",
    "prompt": "Send messages between two stateful agent actors.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/actor_model.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/actor-model.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/actor_model.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/actor-model.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/actor-model.ipynb",
    "runCommand": "agent-patterns run actor-model \"Send messages between two stateful agent actors.\""
  },
  {
    "slug": "event-driven-choreography",
    "name": "Event-driven Choreography",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Runtime",
    "idea": "Komponenten reagieren auf Ereignisse statt auf zentrale Steuerung.",
    "frameworks": [
      "AWS EventBridge",
      "LangGraph with event runtime"
    ],
    "steps": [
      "Event publizieren",
      "Subscriber reagieren",
      "Folgeevents erzeugen"
    ],
    "snippet": "bus.publish(\"task.created\", {\"prompt\": prompt})\n# agents subscribe to task.created and emit task.completed",
    "prompt": "React to a new support ticket event with independent handlers.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/event_driven_choreography.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/event-driven-choreography.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/event_driven_choreography.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/event-driven-choreography.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/event-driven-choreography.ipynb",
    "runCommand": "agent-patterns run event-driven-choreography \"React to a new support ticket event with independent handlers.\""
  },
  {
    "slug": "saga-compensation",
    "name": "Saga / Compensation",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Runtime",
    "idea": "Mehrschrittige Aktionen werden durch fachliche Rücknahme-Schritte abgesichert.",
    "frameworks": [
      "Workflow Engines",
      "LangGraph durable runtime"
    ],
    "steps": [
      "Aktion ausführen",
      "Fehler erkennen",
      "Kompensation auslösen"
    ],
    "snippet": "try:\n    reserve(); charge(); notify()\nexcept StepFailed:\n    refund(); release_reservation()",
    "prompt": "Book a multi-step workflow and compensate when a later step fails.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/saga_compensation.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/saga-compensation.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/saga_compensation.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/saga-compensation.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/saga-compensation.ipynb",
    "runCommand": "agent-patterns run saga-compensation \"Book a multi-step workflow and compensate when a later step fails.\""
  },
  {
    "slug": "workflow-dag-durable-execution",
    "name": "Workflow DAG / Durable Execution",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Runtime",
    "idea": "Workflows laufen als persistenter Graph mit Retry und Wiederaufnahme.",
    "frameworks": [
      "LangGraph",
      "Temporal",
      "AWS Strands Workflow"
    ],
    "steps": [
      "DAG definieren",
      "State persistieren",
      "Fehlerhafte Nodes retryen"
    ],
    "snippet": "workflow.add_edge(\"extract\", \"transform\")\nworkflow.add_edge(\"transform\", \"load\")\napp = workflow.compile(checkpointer=checkpointer)",
    "prompt": "Run a durable workflow with retryable graph nodes.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/workflow_dag_durable_execution.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/workflow-dag-durable-execution.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/workflow_dag_durable_execution.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/workflow-dag-durable-execution.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/workflow-dag-durable-execution.ipynb",
    "runCommand": "agent-patterns run workflow-dag-durable-execution \"Run a durable workflow with retryable graph nodes.\""
  },
  {
    "slug": "checkpointing-resumability",
    "name": "Checkpointing / Resumability",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Runtime",
    "idea": "Ausführungszustand wird gespeichert und später fortgesetzt.",
    "frameworks": [
      "LangGraph checkpointers",
      "Deep Agents"
    ],
    "steps": [
      "Checkpoint schreiben",
      "Run unterbrechen",
      "Mit gleicher Thread-ID fortsetzen"
    ],
    "snippet": "config = {\"configurable\": {\"thread_id\": \"demo\"}}\napp.invoke(input_state, config=config)\napp.invoke(next_state, config=config)",
    "prompt": "Pause and resume a long-running research task.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/checkpointing_resumability.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/checkpointing-resumability.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/checkpointing_resumability.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/checkpointing-resumability.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/checkpointing-resumability.ipynb",
    "runCommand": "agent-patterns run checkpointing-resumability \"Pause and resume a long-running research task.\""
  },
  {
    "slug": "pub-sub-agent-mesh",
    "name": "Pub/Sub Agent Mesh",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Runtime",
    "idea": "Agents kommunizieren lose gekoppelt über Topics oder Busse.",
    "frameworks": [
      "Kafka",
      "Redis Streams",
      "AWS SNS/SQS"
    ],
    "steps": [
      "Topic definieren",
      "Agents abonnieren",
      "Nachrichten fan-out/fan-in verarbeiten"
    ],
    "snippet": "bus.subscribe(\"research.requests\", researcher)\nbus.publish(\"research.requests\", {\"prompt\": prompt})",
    "prompt": "Publish an event to multiple agent subscribers.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/pub_sub_agent_mesh.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/pub-sub-agent-mesh.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/pub_sub_agent_mesh.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/pub-sub-agent-mesh.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/pub-sub-agent-mesh.ipynb",
    "runCommand": "agent-patterns run pub-sub-agent-mesh \"Publish an event to multiple agent subscribers.\""
  },
  {
    "slug": "human-in-the-loop-approval-gate",
    "name": "Human-in-the-Loop Approval Gate",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Governance",
    "idea": "Kritische Aktionen werden vor Ausführung menschlich freigegeben.",
    "frameworks": [
      "LangGraph interrupts",
      "Google ADK"
    ],
    "steps": [
      "Riskante Aktion erkennen",
      "Freigabe anfordern",
      "Nach Approval fortsetzen"
    ],
    "snippet": "if action.risk == \"high\":\n    interrupt({\"approval_required\": action})\nexecute(action)",
    "prompt": "Ask for approval before sending a customer-facing email.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/human_in_the_loop_approval_gate.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/human-in-the-loop-approval-gate.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/human_in_the_loop_approval_gate.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/human-in-the-loop-approval-gate.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/human-in-the-loop-approval-gate.ipynb",
    "runCommand": "agent-patterns run human-in-the-loop-approval-gate \"Ask for approval before sending a customer-facing email.\""
  },
  {
    "slug": "output-validation-schema-enforcement",
    "name": "Output Validation / Schema Enforcement",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Governance",
    "idea": "Modellantworten werden gegen Schema oder Regeln geprüft.",
    "frameworks": [
      "Pydantic",
      "OpenAI Structured Outputs",
      "LangChain"
    ],
    "steps": [
      "Schema definieren",
      "Antwort parsen",
      "Bei Fehler retry oder ablehnen"
    ],
    "snippet": "result = model.with_structured_output(AnswerSchema).invoke(prompt)\nAnswerSchema.model_validate(result)",
    "prompt": "Validate a structured support ticket summary.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/output_validation_schema_enforcement.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/output-validation-schema-enforcement.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/output_validation_schema_enforcement.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/output-validation-schema-enforcement.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/output-validation-schema-enforcement.ipynb",
    "runCommand": "agent-patterns run output-validation-schema-enforcement \"Validate a structured support ticket summary.\""
  },
  {
    "slug": "sandbox-execution",
    "name": "Sandbox Execution",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Governance",
    "idea": "Code oder Aktionen laufen isoliert mit begrenzten Rechten.",
    "frameworks": [
      "OpenAI sandboxed tools",
      "Docker",
      "E2B"
    ],
    "steps": [
      "Code prüfen",
      "Sandbox mit Limits starten",
      "Output ohne Seiteneffekte auswerten"
    ],
    "snippet": "result = sandbox.run(code, timeout=5, network=False)\nanswer = explain(result)",
    "prompt": "Run generated code in a restricted sandbox.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/sandbox_execution.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/sandbox-execution.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/sandbox_execution.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/sandbox-execution.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/sandbox-execution.ipynb",
    "runCommand": "agent-patterns run sandbox-execution \"Run generated code in a restricted sandbox.\""
  },
  {
    "slug": "least-privilege-agent",
    "name": "Least Privilege Agent",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Governance",
    "idea": "Jeder Agent erhält nur die Tools und Daten, die er benötigt.",
    "frameworks": [
      "OpenAI Agents SDK",
      "LangGraph"
    ],
    "steps": [
      "Rolle definieren",
      "Tool-Scope begrenzen",
      "Handoff nur mit minimalem Kontext"
    ],
    "snippet": "billing_agent = create_agent(model, tools=billing_readonly_tools)\nanswer = billing_agent.invoke(prompt)",
    "prompt": "Design an agent with only the minimum required permissions.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/least_privilege_agent.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/least-privilege-agent.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/least_privilege_agent.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/least-privilege-agent.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/least-privilege-agent.ipynb",
    "runCommand": "agent-patterns run least-privilege-agent \"Design an agent with only the minimum required permissions.\""
  },
  {
    "slug": "audit-trail",
    "name": "Audit Trail",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Governance",
    "idea": "Entscheidungen und Tool-Aufrufe werden nachvollziehbar protokolliert.",
    "frameworks": [
      "LangSmith",
      "OpenTelemetry"
    ],
    "steps": [
      "Run-ID erzeugen",
      "Events loggen",
      "Trace für Review speichern"
    ],
    "snippet": "audit.log(\"tool_call\", tool=name, args=safe_args, run_id=run_id)\nresult = tool.invoke(args)",
    "prompt": "Record tool calls and approvals for later review.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/audit_trail.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/audit-trail.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/audit_trail.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/audit-trail.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/audit-trail.ipynb",
    "runCommand": "agent-patterns run audit-trail \"Record tool calls and approvals for later review.\""
  },
  {
    "slug": "multimodal-guardrails",
    "name": "Multimodal Guardrails",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Governance",
    "idea": "Text, Bild, Audio oder Video werden modalitätsspezifisch geprüft.",
    "frameworks": [
      "OpenAI moderation",
      "Azure AI Content Safety",
      "AWS Bedrock Guardrails"
    ],
    "steps": [
      "Input-Modalität erkennen",
      "Passende Policy prüfen",
      "Antwort blockieren oder erlauben"
    ],
    "snippet": "policy_result = guardrail.check(media=input_asset)\nif not policy_result.allowed:\n    return policy_result.reason",
    "prompt": "Check a mixed text and image request before responding.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/multimodal_guardrails.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/multimodal-guardrails.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/multimodal_guardrails.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/multimodal-guardrails.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/multimodal-guardrails.ipynb",
    "runCommand": "agent-patterns run multimodal-guardrails \"Check a mixed text and image request before responding.\""
  },
  {
    "slug": "distributed-tracing",
    "name": "Distributed Tracing",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Observability",
    "idea": "Agentenläufe und Tool-Aufrufe werden als zusammenhängende Traces sichtbar.",
    "frameworks": [
      "LangSmith",
      "OpenTelemetry"
    ],
    "steps": [
      "Span pro Node erzeugen",
      "Tool-Latenz erfassen",
      "Trace-ID in Logs weiterreichen"
    ],
    "snippet": "with tracer.span(\"agent.run\"):\n    with tracer.span(\"tool.search\"):\n        result = search.invoke(prompt)",
    "prompt": "Trace a request across agent, tool, and evaluator nodes.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/distributed_tracing.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/distributed-tracing.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/distributed_tracing.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/distributed-tracing.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/distributed-tracing.ipynb",
    "runCommand": "agent-patterns run distributed-tracing \"Trace a request across agent, tool, and evaluator nodes.\""
  },
  {
    "slug": "token-cost-tracking",
    "name": "Token / Cost Tracking",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Observability",
    "idea": "Token und Kosten werden pro Run, Agent oder Workflow gemessen.",
    "frameworks": [
      "LangSmith",
      "Provider Usage APIs"
    ],
    "steps": [
      "Usage aus Response lesen",
      "Kosten berechnen",
      "Budgetentscheidung treffen"
    ],
    "snippet": "usage = response.usage_metadata\ncosts.add(run_id, tokens=usage[\"total_tokens\"])",
    "prompt": "Estimate and report token cost for a multi-step workflow.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/token_cost_tracking.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/token-cost-tracking.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/token_cost_tracking.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/token-cost-tracking.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/token-cost-tracking.ipynb",
    "runCommand": "agent-patterns run token-cost-tracking \"Estimate and report token cost for a multi-step workflow.\""
  },
  {
    "slug": "llm-as-judge",
    "name": "LLM-as-Judge",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Observability",
    "idea": "Ein Modell bewertet Ausgaben anhand einer Rubrik.",
    "frameworks": [
      "LangSmith",
      "OpenAI Evals"
    ],
    "steps": [
      "Rubrik definieren",
      "Antworten bewerten",
      "Score für Regressionen speichern"
    ],
    "snippet": "score = judge.invoke({\"rubric\": rubric, \"answer\": answer})\nmetrics.record(\"quality\", score)",
    "prompt": "Score three candidate answers with a rubric.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/llm_as_judge.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/llm-as-judge.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/llm_as_judge.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/llm-as-judge.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/llm-as-judge.ipynb",
    "runCommand": "agent-patterns run llm-as-judge \"Score three candidate answers with a rubric.\""
  },
  {
    "slug": "integration-tests-for-agents",
    "name": "Integration Tests für Agents",
    "group": "systembetrieb",
    "groupLabel": "Systembetrieb",
    "domain": "Systembetrieb / Observability",
    "idea": "Agenten werden über realistische Szenarien mit Tools und State getestet.",
    "frameworks": [
      "pytest",
      "LangSmith datasets"
    ],
    "steps": [
      "Szenario laden",
      "Agent mit Mocks ausführen",
      "Trace und Output prüfen"
    ],
    "snippet": "def test_refund_agent():\n    result = agent.invoke(case.input)\n    assert result.action == \"request_approval\"",
    "prompt": "Run an end-to-end test for an agent using mocked tools.",
    "sourcePath": "code/src/ai_agent_patterns/demos/systembetrieb/integration_tests_for_agents.py",
    "notebookPath": "code/notebooks/patterns/systembetrieb/integration-tests-for-agents.ipynb",
    "githubUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/src/ai_agent_patterns/demos/systembetrieb/integration_tests_for_agents.py",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/integration-tests-for-agents.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/patterns/systembetrieb/integration-tests-for-agents.ipynb",
    "runCommand": "agent-patterns run integration-tests-for-agents \"Run an end-to-end test for an agent using mocked tools.\""
  }
];

export const implementationArchitectureNotebooks: ImplementationArchitectureNotebook[] = [
  {
    "slug": "coding-agent",
    "title": "Coding Agent",
    "tagline": "Plant, schreibt und verifiziert Codeänderungen mit Test- und Review-Gates.",
    "scenario": "Ein Agent liest ein Issue oder einen User-Request, plant die Änderung im Repo, führt Edits in einer Sandbox aus, lässt Tests laufen und eskaliert riskante Aktionen zur menschlichen Freigabe.",
    "notebookPath": "code/notebooks/reference-architectures/coding-agent.ipynb",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/coding-agent.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/coding-agent.ipynb",
    "pageUrl": "/reference-architectures#coding-agent"
  },
  {
    "slug": "research-assistant",
    "title": "Research Assistant (RAG)",
    "tagline": "Recherchiert, bewertet Quellen und synthetisiert mit Zitaten und Unsicherheiten.",
    "scenario": "Ein Assistant beantwortet Wissensfragen über eine eigene Korpus + Live-Quellen, gewichtet Quellen nach Verlässlichkeit, synthetisiert eine Antwort mit Zitaten und gibt offene Unsicherheiten zurück.",
    "notebookPath": "code/notebooks/reference-architectures/research-assistant.ipynb",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/research-assistant.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/research-assistant.ipynb",
    "pageUrl": "/reference-architectures#research-assistant"
  },
  {
    "slug": "support-triage",
    "title": "Customer Support Triage",
    "tagline": "Routet Tickets, beantwortet Standardfälle und eskaliert sauber an Menschen.",
    "scenario": "Eingehende Kundenanfragen werden klassifiziert, mit Account-Daten angereichert, durch eine FAQ-RAG-Schicht beantwortet oder mit klarer Begründung an Spezialist:innen weitergereicht.",
    "notebookPath": "code/notebooks/reference-architectures/support-triage.ipynb",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/support-triage.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/support-triage.ipynb",
    "pageUrl": "/reference-architectures#support-triage"
  },
  {
    "slug": "document-pipeline",
    "title": "Document Processing Pipeline",
    "tagline": "Verarbeitet große Dokument-Batches parallel mit Map-Reduce und Validierung.",
    "scenario": "Eingehende Dokumente (PDFs, Verträge, Forms) werden extrahiert, in parallele Verarbeitungseinheiten zerlegt, strukturiert ausgewertet, validiert und zu einem konsolidierten Output aggregiert.",
    "notebookPath": "code/notebooks/reference-architectures/document-pipeline.ipynb",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/document-pipeline.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/document-pipeline.ipynb",
    "pageUrl": "/reference-architectures#document-pipeline"
  },
  {
    "slug": "browser-use-agent",
    "title": "Browser-Use / Computer-Use Agent",
    "tagline": "Bedient Web-UIs autonom – mit harten Guardrails und Approval-Gates.",
    "scenario": "Ein Agent steuert einen echten Browser (oder Desktop), löst UI-zentrierte Aufgaben (Form-Fill, Buchung, Datenpflege) in fremden Systemen ohne API. Hochautonom, hochrisikobehaftet.",
    "notebookPath": "code/notebooks/reference-architectures/browser-use-agent.ipynb",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/browser-use-agent.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/browser-use-agent.ipynb",
    "pageUrl": "/reference-architectures#browser-use-agent"
  },
  {
    "slug": "supervisor-multi-agent",
    "title": "Supervisor Multi-Agent System",
    "tagline": "Orchestrator delegiert an spezialisierte Worker-Agents.",
    "scenario": "Ein Supervisor-Agent zerlegt komplexe Aufgaben und delegiert an Spezialisten (Recherche, Code, Datenanalyse, Schreiben). Die Spezialisten arbeiten unabhängig und liefern strukturierte Ergebnisse zurück.",
    "notebookPath": "code/notebooks/reference-architectures/supervisor-multi-agent.ipynb",
    "notebookUrl": "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/supervisor-multi-agent.ipynb",
    "colabUrl": "https://colab.research.google.com/github/mimeonline/multi-agent-architecture/blob/main/code/notebooks/reference-architectures/supervisor-multi-agent.ipynb",
    "pageUrl": "/reference-architectures#supervisor-multi-agent"
  }
];

export const implementationDemoCount = implementationDemos.length;

export const implementationNotebookCount = implementationDemos.length + implementationArchitectureNotebooks.length;
