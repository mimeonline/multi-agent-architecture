# Webapp

Interaktive Lernwebapp zur AI Agent Pattern Landscape auf Basis von Next.js App Router, Tailwind CSS 4 und shadcn/ui-kompatiblen Primitives.

## Start

```bash
npm install
npm run dev
```

Next.js startet standardmäßig auf `http://localhost:3000`. Das Dev-Script nutzt Watchpack-Polling, damit lokale Watcher-Limits auf macOS nicht sofort in `EMFILE` laufen.

## Inhalte

- `src/app/`: Next.js App Router Layout und Page
- `src/features/landscape/`: Pattern-Daten, Types, Organisms und Template
- `src/components/`: featureübergreifende Atomic-Design-Komponenten und shadcn/ui-Primitives
- `src/lib/`: gemeinsame Utilities, aktuell `cn()` für shadcn/ui
- `public/`: statische Assets und Symlinks auf `docs`, `presentation` und `code`
- `index.html`, `src/app.js`, `src/styles.css`: Legacy-Version der statischen Webapp, bleibt vorerst als Referenz liegen

## Zweck

Die Webapp ist der navigierbare Einstieg in das Projekt. Sie verlinkt Theorie, Infografik, Slides und Code-Demos und macht die Pattern Landscape als Lernoberfläche nutzbar.

## Architektur

Die UI folgt Atomic Design:

- `atoms`: kleine wiederverwendbare Bausteine
- `molecules`: zusammengesetzte UI-Elemente
- `organisms`: interaktive Bereiche wie Pattern Explorer und Decision Guide
- `templates`: Seitenkompositionen

shadcn/ui-Primitives liegen in `src/components/ui` und bleiben fachlich neutral.
