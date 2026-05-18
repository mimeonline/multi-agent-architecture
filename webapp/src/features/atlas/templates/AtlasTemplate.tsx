import { ArrowRight, BookOpen, ExternalLink, Quote, Sparkles } from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import {
  atlasDomains,
  atlasFaq,
  atlasPersonas,
  atlasQuote,
  atlasSteps,
  capabilityNotes,
  heroStats,
} from "../lib/atlas-content";

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
          <dl className="hero-stats" aria-label="Atlas in Zahlen">
            {heroStats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <dt>
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </dt>
                <dd>{stat.hint}</dd>
              </div>
            ))}
          </dl>
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

      <section className="section lp-how" aria-labelledby="how-title">
        <div className="section-heading">
          <SectionKicker>So funktioniert der Atlas</SectionKicker>
          <h2 id="how-title">Von Bausteinen zu betriebsfähigen AI-Systemen.</h2>
          <p>
            Vier Etappen, die du in der Reihenfolge nutzen kannst, die zu deinem System passt — als
            Lernweg, als Review-Checkliste oder als Vokabular im Architektur-Workshop.
          </p>
        </div>
        <ol className="lp-steps">
          {atlasSteps.map((step) => {
            const Icon = step.icon;
            return (
              <li className="lp-step" key={step.step}>
                <span className="lp-step-number">{step.step}</span>
                <span className="lp-step-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <a className="lp-step-link" href={step.href}>
                  Mehr erfahren
                  <ArrowRight aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="section lp-personas" aria-labelledby="personas-title">
        <div className="section-heading">
          <SectionKicker>Für wen</SectionKicker>
          <h2 id="personas-title">Geschrieben für die Rollen, die AI-Systeme tragen.</h2>
          <p>
            Der Atlas richtet sich an alle, die AI-Systeme nicht nur ausprobieren, sondern bewusst
            entwerfen, betreiben und verantworten.
          </p>
        </div>
        <div className="lp-persona-grid">
          {atlasPersonas.map((persona) => {
            const Icon = persona.icon;
            return (
              <article className={`lp-persona accent-${persona.accent}`} key={persona.title}>
                <span className="lp-persona-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{persona.title}</h3>
                <p>{persona.description}</p>
              </article>
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

      <section className="section lp-quote" aria-labelledby="quote-title">
        <figure>
          <Quote className="lp-quote-mark" aria-hidden="true" />
          <blockquote>
            <p id="quote-title">{atlasQuote.text}</p>
          </blockquote>
          <figcaption>
            <strong>{atlasQuote.attribution}</strong>
            <span>{atlasQuote.context}</span>
          </figcaption>
        </figure>
      </section>

      <section className="section lp-faq" aria-labelledby="faq-title">
        <div className="section-heading">
          <SectionKicker>FAQ</SectionKicker>
          <h2 id="faq-title">Häufige Fragen zum Atlas.</h2>
          <p>
            Kurze Antworten auf die Fragen, die uns am häufigsten begegnen — von Scope und
            Zielgruppe bis zur Rolle der Code-Demos.
          </p>
        </div>
        <div className="lp-faq-list">
          {atlasFaq.map((item, index) => (
            <details className="lp-faq-item" key={item.question} open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <span className="lp-faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section lp-cta" aria-labelledby="cta-title">
        <div className="lp-cta-inner">
          <SectionKicker>Loslegen</SectionKicker>
          <h2 id="cta-title">
            Bereit für robuste AI-Systeme?
            <em> Starte mit Foundations.</em>
          </h2>
          <p>
            Jede Reise durch den Atlas beginnt bei den Bausteinen. Von dort aus führst du den Weg
            über Patterns, Architecture und Governance bis zu deinen Reference Architectures.
          </p>
          <div className="lp-cta-actions">
            <a className="btn btn-primary" href="/foundations">
              <Sparkles aria-hidden="true" />
              Start with Foundations
            </a>
            <a className="btn btn-secondary" href="/reference-architectures">
              Reference Architectures
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
      </section>
    </main>
  );
}
