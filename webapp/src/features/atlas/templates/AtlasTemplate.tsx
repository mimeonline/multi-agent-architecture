import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { atlasDomains, capabilityNotes } from "../lib/atlas-content";

export function AtlasTemplate() {
  return (
    <main id="top">
      <section className="hero atlas-hero lp-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <SectionKicker>AI Systems Architecture</SectionKicker>
          <h1 id="hero-title">
            AI Systems <em>Atlas</em>
          </h1>
          <p className="hero-lead">
            Architecture-first knowledge platform für robuste AI-Systeme. Lerne, wie
            Foundations, Patterns, Systemdesign und Governance zusammen robuste AI-Systeme formen.
          </p>
          <div className="hero-actions" aria-label="Schnellzugriff">
            <a className="btn btn-primary" href="/foundations">
              <BookOpen aria-hidden="true" />
              Start with Foundations
            </a>
            <a className="btn btn-secondary" href="/patterns">
              Pattern Landscape
              <ArrowRight aria-hidden="true" />
            </a>
            <a
              className="btn btn-secondary"
              href="https://github.com/mimeonline/multi-agent-architecture"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="constellation atlas-constellation">
            <div className="core">Atlas</div>
            <div className="node denken">Foundations</div>
            <div className="node ablauf">Patterns</div>
            <div className="node zusammen">Architecture</div>
            <div className="node system">Governance</div>
          </div>
        </div>
      </section>

      <section id="atlas-map" className="section atlas-overview" aria-labelledby="atlas-map-title">
        <div className="section-heading">
          <SectionKicker>Produktmodell</SectionKicker>
          <h2 id="atlas-map-title">Eine Landkarte, kein Framework-Verzeichnis.</h2>
          <p>
            Die Startseite führt in die Wissensdomänen. Jede Domain hat eine eigene Seite, während
            Tooling und Implementation Lab unterstützende Capabilities bleiben.
          </p>
        </div>
        <div className="atlas-domain-grid">
          {atlasDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <a className="atlas-domain" href={domain.href} key={domain.title}>
                <span className="atlas-domain-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="atlas-domain-role">{domain.role}</span>
                <strong>{domain.title}</strong>
                <span>{domain.description}</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="section lp-principle" aria-labelledby="principle-title">
        <div>
          <SectionKicker>Prinzip</SectionKicker>
          <h2 id="principle-title">Architecture first. Implementation proves it. Frameworks support it.</h2>
        </div>
        <p>
          Der Atlas erklärt AI-Systeme über Architekturentscheidungen. Code-Demos und Frameworks
          sind wichtig, aber sie bleiben Belege und Werkzeuge, nicht die primäre Taxonomie.
        </p>
      </section>

      <section className="section demos lp-capabilities" aria-labelledby="capability-title">
        <div className="section-heading">
          <SectionKicker>Capabilities</SectionKicker>
          <h2 id="capability-title">Praktisch, ohne zum Tool-Katalog zu werden.</h2>
          <p>
            Die bestehende Pattern-App, das Implementation Lab und das Framework-Mapping bleiben
            erhalten, aber sie ordnen sich der Atlas-Perspektive unter.
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
      </section>
    </main>
  );
}
