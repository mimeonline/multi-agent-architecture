# Webapp Source

Quellcode der interaktiven Lernwebapp auf Basis von Next.js App Router.

## Struktur

- `app/`: Routen, Layout und globale Styles
- `components/`: featureübergreifende Atomic-Design-Komponenten
- `features/atlas/`: Atlas-Startseite, kuratierte Inhalte und Routentemplates
- `features/landscape/`: Pattern-Daten, Types und UI für die Landscape

## Hinweise

App-Routen bleiben bewusst schlank und rendern Templates aus `features/atlas` oder `features/landscape`. Fachliche Daten und Interaktion liegen in den Features.
