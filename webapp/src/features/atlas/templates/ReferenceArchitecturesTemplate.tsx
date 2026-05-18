"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Layers,
  ShieldAlert,
  Workflow,
  X,
} from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { referenceArchitectures } from "../lib/atlas-content";
import type { ReferenceArchitecture } from "../types/atlas";
import { allPatterns } from "@/features/landscape/lib/patterns";

const KNOWN_PATTERNS = new Set(allPatterns.map((p) => p.name));

function patternHref(name: string): string | null {
  return KNOWN_PATTERNS.has(name)
    ? `/patterns?p=${encodeURIComponent(name)}`
    : null;
}

type ComplexityFilter = "Alle" | ReferenceArchitecture["complexity"];
type AutonomyFilter = "Alle" | ReferenceArchitecture["autonomy"];

const COMPLEXITIES: ComplexityFilter[] = ["Alle", "Einsteiger", "Fortgeschritten", "Production"];
const AUTONOMIES: AutonomyFilter[] = ["Alle", "Workflow", "Single Agent", "Multi-Agent"];

export function ReferenceArchitecturesTemplate() {
  const [complexity, setComplexity] = useState<ComplexityFilter>("Alle");
  const [autonomy, setAutonomy] = useState<AutonomyFilter>("Alle");

  const filtered = useMemo(() => {
    return referenceArchitectures.filter((arch) => {
      if (complexity !== "Alle" && arch.complexity !== complexity) return false;
      if (autonomy !== "Alle" && arch.autonomy !== autonomy) return false;
      return true;
    });
  }, [complexity, autonomy]);

  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Reference Architectures</SectionKicker>
        <h1 id="page-title">Konkrete Systemkompositionen als Applied Views.</h1>
        <p>
          Sechs Referenzarchitekturen mit Pattern-Komposition, Diagramm, Trade-off-begründeten
          Entscheidungen, Governance-Mitigationen und Failure-Modes. Jede ist ein Startpunkt, kein
          Tutorial.
        </p>
      </section>

      <section className="section reference-overview" aria-labelledby="overview-title">
        <div className="section-heading">
          <SectionKicker>Übersicht</SectionKicker>
          <h2 id="overview-title">{filtered.length} Architekturen im Atlas</h2>
          <p>
            Filter nach Autonomie-Grad und Reife. Klick auf eine Karte springt zum Detail –
            jede Architektur ist über Anchor-Links teilbar.
          </p>
        </div>

        <div className="reference-filters" role="group" aria-label="Filter">
          <div className="filter-group">
            <span className="filter-label">Reife</span>
            {COMPLEXITIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-pill${complexity === c ? " is-active" : ""}`}
                onClick={() => setComplexity(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Autonomie</span>
            {AUTONOMIES.map((a) => (
              <button
                key={a}
                type="button"
                className={`filter-pill${autonomy === a ? " is-active" : ""}`}
                onClick={() => setAutonomy(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="reference-overview-grid">
          {filtered.map((arch) => (
            <a key={arch.slug} href={`#${arch.slug}`} className="overview-card">
              <div className="overview-meta">
                <span className="meta-badge meta-complexity">{arch.complexity}</span>
                <span className="meta-badge meta-autonomy">{arch.autonomy}</span>
                <span className="meta-badge meta-domain">{arch.domain}</span>
              </div>
              <h3>{arch.title}</h3>
              <p className="overview-tagline">{arch.tagline}</p>
              <span className="overview-jump">
                Detail ansehen <ChevronRight size={14} aria-hidden />
              </span>
            </a>
          ))}
          {filtered.length === 0 && (
            <p className="reference-empty">Keine Architekturen mit diesen Filtern. Filter zurücksetzen.</p>
          )}
        </div>
      </section>

      {filtered.map((arch) => (
        <ArchitectureDetail key={arch.slug} arch={arch} />
      ))}

      <section className="section reference-cta" aria-labelledby="cta-title">
        <div className="section-heading">
          <SectionKicker>Nächster Schritt</SectionKicker>
          <h2 id="cta-title">Vom Reference Pattern zum eigenen System.</h2>
          <p>
            Reference Architectures sind Komposition – kein Copy-Paste. Verifizier deine Auswahl
            mit dem Decision Guide und prüfe Governance früh.
          </p>
        </div>
        <div className="cta-row">
          <Link className="cta-link primary" href="/decision-guides">
            Mit Decision Guide validieren <ArrowRight size={14} aria-hidden />
          </Link>
          <Link className="cta-link" href="/patterns">
            Patterns im Detail
          </Link>
          <Link className="cta-link" href="/governance">
            Governance-Check
          </Link>
          <Link className="cta-link" href="/implementation-lab">
            Implementation Lab
          </Link>
        </div>
      </section>
    </main>
  );
}

function ArchitectureDetail({ arch }: { arch: ReferenceArchitecture }) {
  const [open, setOpen] = useState(true);

  return (
    <section
      id={arch.slug}
      className="section reference-detail"
      aria-labelledby={`${arch.slug}-title`}
    >
      <header className="reference-detail-header">
        <div>
          <div className="overview-meta">
            <span className="meta-badge meta-complexity">{arch.complexity}</span>
            <span className="meta-badge meta-autonomy">{arch.autonomy}</span>
            <span className="meta-badge meta-domain">{arch.domain}</span>
          </div>
          <h2 id={`${arch.slug}-title`}>{arch.title}</h2>
          <p className="detail-tagline">{arch.tagline}</p>
        </div>
        <button
          type="button"
          className="detail-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${arch.slug}-body`}
        >
          {open ? "Einklappen" : "Ausklappen"}
          <ChevronDown
            size={14}
            aria-hidden
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}
          />
        </button>
      </header>

      {open && (
        <div id={`${arch.slug}-body`} className="reference-detail-body">
          <p className="detail-scenario">{arch.scenario}</p>

          <div className="detail-when">
            <div className="when-box when-fit">
              <p className="detail-label"><Check size={14} aria-hidden /> Passend wenn</p>
              <ul>
                {arch.whenToUse.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="when-box when-misfit">
              <p className="detail-label"><X size={14} aria-hidden /> Nicht passend wenn</p>
              <ul>
                {arch.whenNotToUse.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="detail-block">
            <h3><Workflow size={16} aria-hidden /> Pattern-Komposition</h3>
            <div className="pattern-chip-row">
              {arch.patternComposition.map((p) => {
                const href = patternHref(p);
                return href ? (
                  <Link key={p} className="pattern-chip" href={href}>
                    {p}
                  </Link>
                ) : (
                  <span key={p} className="pattern-chip is-unlinked">
                    {p}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="detail-block">
            <h3>Datenfluss</h3>
            <ol className="reference-diagram">
              {arch.diagram.map((step, idx) => (
                <li key={step.label}>
                  <span className="diagram-step-num">{String(idx + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="diagram-step-label">{step.label}</p>
                    {step.detail && <p className="diagram-step-detail">{step.detail}</p>}
                  </div>
                  {idx < arch.diagram.length - 1 && (
                    <span className="diagram-arrow" aria-hidden>→</span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="detail-block">
            <h3><Layers size={16} aria-hidden /> Komponenten</h3>
            <ul className="reference-components">
              {arch.components.map((c) => (
                <li key={c.name}>
                  <strong>{c.name}</strong>
                  <span>{c.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-block">
            <h3>Schlüsselentscheidungen</h3>
            <ul className="reference-decisions">
              {arch.keyDecisions.map((d) => (
                <li key={d.question}>
                  <p className="decision-question">{d.question}</p>
                  <p className="decision-choice">→ {d.choice}</p>
                  <p className="decision-rationale">{d.rationale}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-block">
            <h3><ShieldAlert size={16} aria-hidden /> Governance</h3>
            <ul className="reference-governance">
              {arch.governance.map((g) => (
                <li key={g.concern}>
                  <p className="gov-concern">{g.concern}</p>
                  <p className="gov-mitigation">{g.mitigation}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-block">
            <h3>Failure Modes</h3>
            <ul className="reference-failures">
              {arch.failureModes.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="detail-block">
            <h3>Varianten</h3>
            <ul className="reference-variants">
              {arch.variants.map((v) => (
                <li key={v.name}>
                  <strong>{v.name}</strong>
                  <span>{v.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
