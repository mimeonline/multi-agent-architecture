# Webapp Source

Quellcode der interaktiven Lernwebapp auf Basis von Next.js App Router.

## Struktur

- `app/`: Routen, Layout und globale Styles
- `components/`: featureübergreifende Atomic-Design-Komponenten
- `features/landscape/`: Pattern-Daten, Types und UI für die Landscape

## Hinweise

`app/page.tsx` bleibt bewusst schlank und rendert nur das Landscape-Template. Fachliche Daten und Interaktion liegen im Feature.
