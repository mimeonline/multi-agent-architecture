import { SectionKicker } from "@/components/atoms/SectionKicker";
import { foundationItems } from "../lib/atlas-content";

const SLUGS: Record<string, string> = {
  LLMs: "llms",
  "Context Windows": "context-windows",
  "Tool Calling": "tool-calling",
  "Structured Outputs": "structured-outputs",
  Memory: "memory",
  Evaluation: "evaluation",
};

function slugFor(title: string) {
  return SLUGS[title] ?? title.toLowerCase().replace(/\s+/g, "-");
}

export function FoundationsTemplate() {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="foundations-title">
        <SectionKicker>Grundlagen</SectionKicker>
        <h1 id="foundations-title">Grundlagen für robuste AI-Systeme.</h1>
        <p>
          Diese Seite erklärt sechs Grundbausteine, die fast jedes AI-System prägen:
          LLMs, Context Windows, Tool Calling, Structured Outputs, Memory und
          Evaluation. Du siehst, welche Aufgabe jeder Baustein übernimmt, welche
          Entscheidungen damit verbunden sind und wo typische Risiken entstehen.
        </p>
      </section>

      <section
        className="section atlas-section"
        aria-labelledby="foundations-index-title"
      >
        <div className="section-heading">
          <SectionKicker>Übersicht</SectionKicker>
          <h2 id="foundations-index-title">Sechs Bausteine, sechs wichtige Entscheidungen.</h2>
          <p>
            Springe direkt zu dem Thema, das du verstehen oder einordnen möchtest.
          </p>
        </div>
        <nav className="foundations-index" aria-label="Grundlagenübersicht">
          <ol>
            {foundationItems.map((item, index) => (
              <li key={item.title}>
                <a href={`#${slugFor(item.title)}`}>
                  <span className="foundations-index-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="foundations-index-body">
                    <strong>{item.title}</strong>
                    <span>{item.tag}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section
        className="section atlas-section"
        aria-labelledby="foundations-detail-title"
      >
        <div className="section-heading">
          <SectionKicker>Einordnung</SectionKicker>
          <h2 id="foundations-detail-title">
            Was es bedeutet, welche Abwägungen nötig sind und woran es scheitern kann.
          </h2>
          <p>
            Für jeden Baustein zeigt die Seite, warum er für die Architektur wichtig
            ist, welche Abwägungen du treffen musst und welche Fehler in der Praxis
            häufig auftreten.
          </p>
        </div>
        <div className="atlas-item-list">
          {foundationItems.map((item) => (
            <article
              className="atlas-item"
              id={slugFor(item.title)}
              key={item.title}
            >
              <div className="atlas-item-meta">
                <span>Grundlage</span>
                <strong>{item.tag}</strong>
              </div>
              <div className="atlas-item-body">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <dl>
                  {item.explanation ? (
                    <div>
                      <dt>Was ist das?</dt>
                      <dd>{item.explanation}</dd>
                    </div>
                  ) : null}
                  {item.projectQuestion ? (
                    <div>
                      <dt>Projektfrage</dt>
                      <dd>{item.projectQuestion}</dd>
                    </div>
                  ) : null}
                  {item.example ? (
                    <div>
                      <dt>Beispiel</dt>
                      <dd>{item.example}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Architekturwert</dt>
                    <dd>{item.whyItMatters}</dd>
                  </div>
                  <div>
                    <dt>Abwägung</dt>
                    <dd>{item.tradeoffs}</dd>
                  </div>
                </dl>
              </div>
              <div className="atlas-item-side">
                <p>Typische Fehler</p>
                <ul>
                  {item.failureModes.map((mode) => (
                    <li key={mode}>{mode}</li>
                  ))}
                </ul>
                <div
                  className="atlas-related"
                  aria-label={`${item.title} Beziehungen`}
                >
                  {item.related.map((entry) => (
                    <span key={entry}>{entry}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section foundations-footer"
        aria-labelledby="foundations-next-title"
      >
        <div className="section-heading">
          <SectionKicker>Anschluss</SectionKicker>
          <h2 id="foundations-next-title">Von Grundlagen zu Architekturentscheidungen.</h2>
          <p>
            Diese Bausteine helfen dabei, <a href="/patterns">Lösungsmuster</a>,
            <a href="/architecture"> Architektur</a> und
            <a href="/governance"> Governance</a> besser einzuordnen.
          </p>
        </div>
      </section>
    </main>
  );
}
