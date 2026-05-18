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
          <SectionKicker>AI-Systemarchitektur</SectionKicker>
          <h1 id="hero-title">
            AI Systems <em>Atlas</em>
          </h1>
          <p className="hero-lead">
            Eine verständliche Landkarte für robuste AI-Systeme. Der Atlas zeigt, welche
            Grundlagen, Lösungsmuster, Architekturentscheidungen und Kontrollmechanismen
            zusammengehören.
          </p>
          <div className="hero-actions" aria-label="Schnellzugriff">
            <a className="btn btn-primary" href="/foundations">
              <BookOpen aria-hidden="true" />
              Mit Grundlagen starten
            </a>
            <a className="btn btn-secondary" href="/patterns">
              Lösungsmuster ansehen
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
            <div className="node denken">Grundlagen</div>
            <div className="node ablauf">Muster</div>
            <div className="node zusammen">Architektur</div>
            <div className="node system">Governance</div>
          </div>
        </div>
      </section>

      <section id="atlas-map" className="section atlas-overview" aria-labelledby="atlas-map-title">
        <div className="section-heading">
          <SectionKicker>Überblick</SectionKicker>
          <h2 id="atlas-map-title">Was du im Atlas findest.</h2>
          <p>
            Die Startseite führt in die wichtigsten Bereiche. Jeder Bereich erklärt eine andere
            Frage: Was muss ich verstehen, welche Lösungsmuster gibt es, wie entwerfe ich das
            System und wie kontrolliere ich Risiken?
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
            Du kannst den Atlas als Lernweg, als Checkliste für ein bestehendes System oder als
            gemeinsame Sprache im Architekturgespräch nutzen.
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
          <h2 id="personas-title">Für alle, die AI-Systeme entwerfen oder verantworten.</h2>
          <p>
            Der Atlas richtet sich an Menschen, die über Prototypen hinausdenken und verstehen
            wollen, welche Entscheidungen ein AI-System robust, nachvollziehbar und betreibbar
            machen.
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
          <h2 id="principle-title">Erst die Architektur, dann die Implementierung.</h2>
        </div>
        <p>
          Der Atlas erklärt AI-Systeme über Entscheidungen, nicht über einzelne Tools. Code-Demos
          und Frameworks sind wichtig, aber sie dienen als Beispiele und Werkzeuge.
        </p>
      </section>

      <section className="section demos lp-capabilities" aria-labelledby="capability-title">
        <div className="section-heading">
          <SectionKicker>Praxisbezug</SectionKicker>
          <h2 id="capability-title">Beispiele und Werkzeuge bleiben eingeordnet.</h2>
          <p>
            Die Pattern-Übersicht, die Python-Demos und die Werkzeugvergleiche zeigen, wie die
            Konzepte praktisch aussehen. Sie ersetzen aber nicht die Architekturentscheidung.
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
            Kurze Antworten auf die häufigsten Fragen: Wofür ist der Atlas gedacht, wie steigt
            man ein und welche Rolle spielen Code-Demos?
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
            <em> Starte mit den Grundlagen.</em>
          </h2>
          <p>
            Beginne bei den Bausteinen. Von dort aus kommst du zu Lösungsmustern,
            Architekturentscheidungen, Governance und konkreten Referenzarchitekturen.
          </p>
          <div className="lp-cta-actions">
            <a className="btn btn-primary" href="/foundations">
              <Sparkles aria-hidden="true" />
              Mit Grundlagen starten
            </a>
            <a className="btn btn-secondary" href="/reference-architectures">
              Referenzarchitekturen
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
