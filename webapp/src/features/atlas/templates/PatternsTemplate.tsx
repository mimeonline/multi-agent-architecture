import Image from "next/image";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { FrameworkTable } from "@/features/landscape/organisms/FrameworkTable";
import { PatternExplorer } from "@/features/landscape/organisms/PatternExplorer";
import { capabilityNotes } from "../lib/atlas-content";

export function PatternsTemplate() {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Patterns</SectionKicker>
        <h1 id="page-title">Agent Patterns als wiederverwendbare Lösungsformen.</h1>
        <p>
          Die bestehende AI Agent Pattern Landscape bleibt der Kern des Atlas. Sie ordnet Reasoning,
          Workflow, Zusammenarbeit und Systembetrieb als Architekturbausteine.
        </p>
      </section>

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
          <div className="infographic-frame">
            <Image
              src="/ai-agen-pattern-landscape.png"
              alt="Infografik AI Agent Pattern Landscape mit Ebenen für Agent Intelligence, Orchestration und Production Architecture"
              width={2800}
              height={1600}
              priority
            />
          </div>
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
        <pre className="code-panel"><code>{`cd code
pip install -r requirements.txt
pip install -e .
agent-patterns list
agent-patterns run react "Find 12 * 7 and summarize the tool result."`}</code></pre>
      </section>

      <section id="tooling" aria-label="Tooling Compatibility">
        <FrameworkTable />
        <p className="demo-link tooling-deep-link">
          Vertiefung: <a href="/tooling-compatibility">Tooling Compatibility öffnen</a>
        </p>
      </section>
    </main>
  );
}
