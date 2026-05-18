import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  Eye,
  FileSearch,
  GitBranch,
  Hand,
  HelpCircle,
  Landmark,
  Lock,
  Quote,
  Scale,
  ShieldAlert,
  Target,
  TimerReset,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import type { AtlasItem } from "../types/atlas";

type AtlasItemsTemplateProps = {
  kicker: string;
  title: string;
  intro: string;
  items: AtlasItem[];
  overviewTitle?: string;
  overviewIntro?: string;
};

type ItemVisual = {
  icon: LucideIcon;
  accent: "denken" | "ablauf" | "zusammen" | "system";
};

const ITEM_VISUALS: Record<string, ItemVisual> = {
  "Service Boundaries": { icon: GitBranch, accent: "zusammen" },
  "State Management": { icon: Database, accent: "ablauf" },
  Orchestration: { icon: Workflow, accent: "denken" },
  Observability: { icon: Eye, accent: "system" },
  "Cost Control": { icon: TimerReset, accent: "ablauf" },
  "Prompt Injection": { icon: ShieldAlert, accent: "system" },
  "PII Handling": { icon: Lock, accent: "ablauf" },
  "EU AI Act": { icon: Landmark, accent: "zusammen" },
  "Audit Trails": { icon: FileSearch, accent: "denken" },
  "Human Oversight": { icon: Hand, accent: "system" },
};

const ACCENTS: ItemVisual["accent"][] = ["denken", "ablauf", "zusammen", "system"];

function slugFor(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function labelForType(type: AtlasItem["type"]) {
  if (type === "Architecture") return "Architektur";
  if (type === "Governance") return "Governance";
  return type;
}

export function AtlasItemsTemplate({
  kicker,
  title,
  intro,
  items,
  overviewTitle,
  overviewIntro,
}: AtlasItemsTemplateProps) {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>{kicker}</SectionKicker>
        <h1 id="page-title">{title}</h1>
        <p>{intro}</p>
      </section>

      <section className="section atlas-section" aria-labelledby="items-index-title">
        <div className="section-heading">
          <SectionKicker>Übersicht</SectionKicker>
          <h2 id="items-index-title">
            {overviewTitle ?? `${items.length} Themen, ${items.length} wichtige Entscheidungen.`}
          </h2>
          <p>{overviewIntro ?? "Springe direkt zu dem Thema, das du einordnen möchtest."}</p>
        </div>
        <nav className="foundations-index" aria-label={`${kicker} Übersicht`}>
          <ol>
            {items.map((item, index) => {
              const visual = ITEM_VISUALS[item.title] ?? {
                icon: Activity,
                accent: ACCENTS[index % ACCENTS.length],
              };
              const Icon = visual.icon;
              return (
                <li key={item.title} data-accent={visual.accent}>
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

      <section className="section atlas-section">
        <div className="foundation-grid">
          {items.map((item, index) => {
            const visual = ITEM_VISUALS[item.title] ?? {
              icon: Activity,
              accent: ACCENTS[index % ACCENTS.length],
            };
            const Icon = visual.icon;
            return (
              <article
                className="foundation-card"
                data-accent={visual.accent}
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
                      <CheckCircle2 size={14} aria-hidden="true" />
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
                <span className="sr-only">{labelForType(item.type)}</span>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
