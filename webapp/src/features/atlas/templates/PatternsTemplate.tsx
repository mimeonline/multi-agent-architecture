"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { PatternExplorer } from "@/features/landscape/organisms/PatternExplorer";
import { QuickStats } from "../atoms/QuickStats";
import { SubNav } from "../atoms/SubNav";
import { HighlightProvider } from "@/features/landscape/lib/highlightContext";

const SUB_NAV = [
  { id: "landscape", label: "Landscape" },
  { id: "lookup", label: "Explorer" },
  { id: "demos", label: "Implementation Lab" },
  { id: "tooling", label: "Tooling-Hinweis" },
];

type Props = {
  highlightedPatterns: Record<string, string>;
};

export function PatternsTemplate({
  highlightedPatterns,
}: Props) {
  const [zoom, setZoom] = useState(false);

  return (
    <HighlightProvider value={{ patterns: highlightedPatterns, shellSnippet: "" }}>
    <main id="top">
      <section className="page-hero with-stats" aria-labelledby="page-title">
        <SectionKicker>Patterns</SectionKicker>
        <h1 id="page-title">Agent Patterns als wiederverwendbare Lösungsformen.</h1>
        <p>
          Die bestehende AI Agent Pattern Landscape bleibt der Kern des Atlas. Sie ordnet Reasoning,
          Workflow, Zusammenarbeit und Systembetrieb als Architekturbausteine.
        </p>
        <QuickStats />
      </section>

      <SubNav items={SUB_NAV} />

      <section id="landscape" className="section media-section" aria-labelledby="landscape-title">
        <div className="section-heading">
          <SectionKicker>Pattern Landscape</SectionKicker>
          <h2 id="landscape-title">Die bestehende Landkarte bleibt sichtbar.</h2>
          <p>
            Die Infografik verdichtet die Pattern-Domänen und verbindet Theorie, Explorer und
            Implementation Lab.
          </p>
        </div>
        <figure className="infographic">
          <button
            type="button"
            className="infographic-frame is-zoomable"
            onClick={() => setZoom(true)}
            aria-label="Infografik vergrößern"
          >
            <Image
              src="/ai-agen-pattern-landscape.png"
              alt="Infografik AI Agent Pattern Landscape mit Ebenen für Agent Intelligence, Orchestration und Production Architecture"
              width={2800}
              height={1600}
              priority
            />
            <span className="zoom-hint" aria-hidden="true">Klicken zum Vergrößern</span>
          </button>
          <figcaption>
            Quelle:{" "}
            <a
              href="https://github.com/mimeonline/multi-agent-architecture/blob/main/docs/ai-agent-pattern-landscape.md"
              target="_blank"
              rel="noreferrer"
            >
              AI Agent Pattern Landscape
            </a>
          </figcaption>
        </figure>
      </section>

      {zoom && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Pattern Landscape vergrößert"
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setZoom(false)}
            aria-label="Schließen"
          >
            ×
          </button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <Image
              src="/ai-agen-pattern-landscape.png"
              alt="Infografik AI Agent Pattern Landscape — vergrößert"
              width={2800}
              height={1600}
            />
          </div>
        </div>
      )}

      <PatternExplorer />

      <section id="demos" className="section demos" aria-labelledby="demos-title">
        <div className="section-heading">
          <SectionKicker>Implementation Lab</SectionKicker>
          <h2 id="demos-title">Patterns praktisch ausprobieren.</h2>
          <p>
            Im Implementation Lab findest du kleine Python-Demos zu ausgewählten Patterns. Sie
            zeigen, wie die Ideen im Code aussehen und funktionieren auch ohne API Key mit
            erklärendem Output.
          </p>
        </div>
        <p className="demo-link">
          Praktisch testen: <a href="/implementation-lab">Implementation Lab öffnen</a>
        </p>
      </section>

      <section id="tooling" className="section demos" aria-labelledby="tooling-title">
        <div className="section-heading">
          <SectionKicker>Tooling</SectionKicker>
          <h2 id="tooling-title">Passende Frameworks einordnen.</h2>
          <p>
            Tooling Compatibility zeigt, welche Frameworks bestimmte Patterns besonders gut
            unterstützen und wo sie eher ergänzend eingesetzt werden sollten.
          </p>
        </div>
        <p className="demo-link tooling-deep-link">
          Frameworks vergleichen: <a href="/tooling-compatibility">Tooling Compatibility öffnen</a>
        </p>
      </section>
    </main>
    </HighlightProvider>
  );
}
