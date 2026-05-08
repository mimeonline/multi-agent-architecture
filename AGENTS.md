# AGENTS.md

## Projektziel

Dieses Repository dokumentiert und demonstriert die AI Agent Pattern Landscape. Änderungen sollen Theorie, Präsentation, Code und Webapp konsistent weiterentwickeln.

## Sprache und Stil

- Hauptsprache: Deutsch
- Technische Begriffe, Pattern-Namen und Framework-Namen bleiben englisch
- Ton: präzise, didaktisch, veröffentlichbar
- Keine unnötigen Superlative
- Keine Em-Dashes oder Gedankenstriche im generierten deutschen Fließtext

## Struktur

- `docs/ai-agent-pattern-landscape.md`: kanonische Langfassung
- `docs/ai-agen-pattern-landscape.png`: Infografik, muss in Webapp und Slides verlinkt bleiben
- `presentation/`: Reveal.js Präsentation
- `code/`: Python-Demos für LangChain, LangGraph, LangSmith und Deep Agents
- `webapp/`: Next.js App Router Lernoberfläche

## Entwicklungsregeln

- Bestehende Inhalte nicht stillschweigend entfernen
- Neue Pattern-Einträge im vorhandenen Lookup-Schema ergänzen
- Systembetrieb-Einträge immer mit `Subdomäne` versehen
- Framework-Zuordnungen konservativ formulieren, wenn native Unterstützung unklar ist
- API Keys niemals committen
- Beispiele sollen ohne API Key hilfreich scheitern oder im Dry-Run-Modus erklärenden Output liefern

## Webapp und Atomic Design

- Die Webapp nutzt Next.js App Router mit TypeScript.
- Styling basiert auf Tailwind CSS 4, CSS-Variablen und shadcn/ui-kompatiblen Primitives.
- Seiten liegen in `webapp/src/app` und bleiben orchestration-only: Route lesen, Template rendern, keine Fachlogik.
- Feature-Code liegt unter `webapp/src/features/<feature>/`.
- Atomic Design ist verbindlich:
  - `atoms`: kleinste wiederverwendbare UI-Bausteine ohne Fachlogik
  - `molecules`: zusammengesetzte UI-Elemente mit klarer Eingabe und Ausgabe
  - `organisms`: interaktive oder datenreiche Bereiche wie Pattern Explorer oder Decision Guide
  - `templates`: Seitenkompositionen, die Organisms und Layoutfluss zusammenführen
- Globale, featureübergreifende Komponenten liegen in `webapp/src/components`.
- shadcn/ui-kompatible Primitives liegen in `webapp/src/components/ui` und nutzen `webapp/src/lib/utils.ts`.
- Feature-spezifische Komponenten bleiben im jeweiligen Feature-Ordner.
- Reuse-Reihenfolge: erst bestehende globale Komponenten, dann feature-lokale Komponenten, erst danach neue Bausteine anlegen.
- Presentational Components bleiben frei von Business-Logik.
- Datenmodelle, Pattern-Listen und Decision-Heuristik gehören in `features/landscape/lib` oder `features/landscape/types`, nicht direkt in Pages.
- Client Components müssen explizit mit `"use client"` markiert werden und auf interaktive Organisms begrenzt bleiben.
- App-Oberfläche bevorzugt ruhige, scanbare Arbeitsflächen statt Marketing-Hero-Überladung.
- Externe Links und lokale Artefaktlinks müssen semantisch benannt und tastaturbedienbar bleiben.

## Qualität

- Markdown muss genau ein H1 haben, wenn es sich um die Hauptreferenz handelt
- Webapp muss Infografik, Slides, Code, Theorie und Decision-Heuristik sichtbar verbinden
- Präsentation soll offline verständlich sein und die Infografik einbetten
- Code-Demos sollen kleine, fokussierte Pattern-Beispiele sein, keine monolithische Agentenplattform
- Nach Webapp-Änderungen mindestens `npm run build` im Verzeichnis `webapp` ausführen, sofern Abhängigkeiten installiert sind
