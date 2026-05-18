"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { FrameworkTable } from "@/features/landscape/organisms/FrameworkTable";
import { PatternExplorer } from "@/features/landscape/organisms/PatternExplorer";
import { capabilityNotes } from "../lib/atlas-content";
import { QuickStats } from "../atoms/QuickStats";
import { SubNav } from "../atoms/SubNav";
import { CopyButton } from "../atoms/CopyButton";
import { HighlightProvider } from "@/features/landscape/lib/highlightContext";

const SUB_NAV = [
  { id: "landscape", label: "Landscape" },
  { id: "lookup", label: "Explorer" },
  { id: "demos", label: "Implementation Lab" },
  { id: "tooling", label: "Tooling" },
];

type Props = {
  highlightedPatterns: Record<string, string>;
  highlightedShell: string;
  runSnippet: string;
};

export function PatternsTemplate({
  highlightedPatterns,
  highlightedShell,
  runSnippet,
}: Props) {
  const [zoom, setZoom] = useState(false);

  return (
    <HighlightProvider value={{ patterns: highlightedPatterns, shellSnippet: highlightedShell }}>
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
          <h2 id="demos-title">Ausführbare Proofs unter der Architektur.</h2>
          <p>
            Die Python-Demos bleiben kleine Pattern-Skizzen mit Offline-Fallback. Sie beweisen
            ausgewählte Mechaniken, ohne den Atlas zum Code-Demo-Projekt zu machen.
          </p>
        </div>
        <div className="capability-row">
          {capabilityNotes.map((note) => {
            const Icon = note.icon;
            return (
              <a className="capability-note" href={note.href} key={note.title}>
                <Icon aria-hidden="true" />
                <strong>{note.title}</strong>
                <span>{note.text}</span>
              </a>
            );
          })}
        </div>
        <p className="demo-link">
          Vertiefung: <a href="/implementation-lab">Implementation Lab öffnen</a>
        </p>
        <div className="code-panel-wrap">
          <div className="code-panel-toolbar">
            <CopyButton text={runSnippet} label="Befehle kopieren" />
          </div>
          <div
            className="code-panel shiki-panel"
            dangerouslySetInnerHTML={{ __html: highlightedShell }}
          />
        </div>
      </section>

      <section id="tooling" aria-label="Tooling Compatibility">
        <FrameworkTable />
        <p className="demo-link tooling-deep-link">
          Vertiefung: <a href="/tooling-compatibility">Tooling Compatibility öffnen</a>
        </p>
      </section>
    </main>
    </HighlightProvider>
  );
}
