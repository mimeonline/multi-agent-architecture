import {
  AlertTriangle,
  CheckSquare,
  Database,
  FileCode2,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageSquare,
  Quote,
  Scale,
  Sparkles,
  Target,
  Wrench,
  type LucideIcon,
} from "lucide-react";
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

type FoundationVisual = {
  icon: LucideIcon;
  /** which domain color token to derive the accent from */
  accent: "denken" | "ablauf" | "zusammen" | "system";
};

const VISUALS: Record<string, FoundationVisual> = {
  LLMs: { icon: Sparkles, accent: "denken" },
  "Context Windows": { icon: Layers, accent: "ablauf" },
  "Tool Calling": { icon: Wrench, accent: "zusammen" },
  "Structured Outputs": { icon: FileCode2, accent: "system" },
  Memory: { icon: Database, accent: "ablauf" },
  Evaluation: { icon: CheckSquare, accent: "denken" },
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
          <p>Springe direkt zu dem Thema, das du verstehen oder einordnen möchtest.</p>
        </div>
        <nav className="foundations-index" aria-label="Grundlagenübersicht">
          <ol>
            {foundationItems.map((item, index) => {
              const visual = VISUALS[item.title];
              const Icon = visual?.icon ?? MessageSquare;
              return (
                <li key={item.title} data-accent={visual?.accent}>
                  <a href={`#${slugFor(item.title)}`}>
                    <span className="foundations-index-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="foundations-index-icon" aria-hidden="true">
                      <Icon size={16} />
                    </span>
                    <span className="foundations-index-body">
                      <strong>{item.title}</strong>
                      <span>{item.tag}</span>
                    </span>
                  </a>
                </li>
              );
            })}
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
        <div className="foundation-grid">
          {foundationItems.map((item, index) => {
            const visual = VISUALS[item.title];
            const Icon = visual?.icon ?? MessageSquare;
            return (
              <article
                className="foundation-card"
                data-accent={visual?.accent ?? "ablauf"}
                id={slugFor(item.title)}
                key={item.title}
              >
                <header className="foundation-card-head">
                  <div className="foundation-card-marker" aria-hidden="true">
                    <span className="foundation-card-icon">
                      <Icon size={22} />
                    </span>
                    <span className="foundation-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="foundation-card-titles">
                    <span className="foundation-card-tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p className="foundation-card-summary">{item.summary}</p>
                  </div>
                </header>

                {item.explanation && (
                  <section className="foundation-card-block explanation">
                    <header>
                      <HelpCircle size={14} aria-hidden="true" />
                      <span>Was ist das?</span>
                    </header>
                    <p>{item.explanation}</p>
                  </section>
                )}

                {item.projectQuestion && (
                  <aside className="foundation-card-quote" aria-label="Projektfrage">
                    <Quote size={20} aria-hidden="true" />
                    <div>
                      <span className="foundation-card-quote-label">Projektfrage</span>
                      <p>{item.projectQuestion}</p>
                    </div>
                  </aside>
                )}

                {item.example && (
                  <section className="foundation-card-block example">
                    <header>
                      <Lightbulb size={14} aria-hidden="true" />
                      <span>Beispiel</span>
                    </header>
                    <p>{item.example}</p>
                  </section>
                )}

                <div className="foundation-card-twocol">
                  <section className="foundation-card-block value">
                    <header>
                      <Target size={14} aria-hidden="true" />
                      <span>Architekturwert</span>
                    </header>
                    <p>{item.whyItMatters}</p>
                  </section>
                  <section className="foundation-card-block tradeoff">
                    <header>
                      <Scale size={14} aria-hidden="true" />
                      <span>Abwägung</span>
                    </header>
                    <p>{item.tradeoffs}</p>
                  </section>
                </div>

                <section className="foundation-card-fails">
                  <header>
                    <AlertTriangle size={14} aria-hidden="true" />
                    <span>Typische Fehler</span>
                  </header>
                  <ul>
                    {item.failureModes.map((mode) => (
                      <li key={mode}>{mode}</li>
                    ))}
                  </ul>
                </section>

                <footer className="foundation-card-related" aria-label="Verwandte Themen">
                  <span className="foundation-card-related-label">Verwandt</span>
                  <div>
                    {item.related.map((entry) => (
                      <span key={entry} className="foundation-card-chip">
                        {entry}
                      </span>
                    ))}
                  </div>
                </footer>
              </article>
            );
          })}
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
