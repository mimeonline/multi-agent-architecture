# Webapp

Interaktive Lernwebapp für den AI Systems Atlas auf Basis von Next.js App Router, Tailwind CSS 4 und shadcn/ui-kompatiblen Primitives.

## Start

```bash
npm install
npm run dev
```

Next.js startet standardmäßig auf `http://localhost:3000`. Das Dev-Script nutzt Watchpack-Polling, damit lokale Watcher-Limits auf macOS nicht sofort in `EMFILE` laufen.

## Inhalte

- `src/app/`: Next.js App Router Layout und Routenseiten
- `src/features/atlas/`: Atlas-Startseite, kuratierte V1-Inhalte und Produktkomposition
- `src/features/landscape/`: bestehende Pattern-Daten, Explorer, Decision-Heuristik und Pattern-Detailansichten
- `src/components/`: featureübergreifende Atomic-Design-Komponenten und shadcn/ui-Primitives
- `src/lib/`: gemeinsame Utilities, aktuell `cn()` für shadcn/ui
- `public/`: statische Assets für den isolierten Vercel-Deploy

Die frühere statische Legacy-Webapp wurde entfernt. Einstiegspunkt ist ausschließlich der App Router unter `src/app`.

## Zweck

Die Webapp ist der navigierbare Einstieg in den AI Systems Atlas. Die Startseite rendert das Atlas Template, während Foundations, Patterns, Architecture, Governance, Decision Guides und Reference Architectures eigene Seiten im App Router haben. Der Capability Layer hat eigene Seiten für Implementation Lab und Tooling Compatibility, bleibt aber unterstützend und wird nicht zur Haupttaxonomie.

## Architektur

Die UI folgt Atomic Design:

- `atoms`: kleine wiederverwendbare Bausteine
- `molecules`: zusammengesetzte UI-Elemente
- `organisms`: interaktive Bereiche wie Pattern Explorer und Decision Guide
- `templates`: Seitenkompositionen

shadcn/ui-Primitives liegen in `src/components/ui` und bleiben fachlich neutral.
