"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Info } from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { FrameworkTable } from "@/features/landscape/organisms/FrameworkTable";
import { toolingCompatibility } from "../lib/atlas-content";
import type { ToolingCategory, ToolingCompatibilityLevel } from "../types/atlas";
import { allPatterns } from "@/features/landscape/lib/patterns";

const KNOWN_PATTERNS = new Set(allPatterns.map((p) => p.name));
function patternHref(name: string): string | null {
  return KNOWN_PATTERNS.has(name) ? `/patterns?p=${encodeURIComponent(name)}` : null;
}

type LevelFilter = "Alle" | ToolingCompatibilityLevel;
type CategoryFilter = "Alle" | ToolingCategory;

const LEVELS: LevelFilter[] = ["Alle", "Native", "Composable", "Supporting", "Custom"];

const LEVEL_LEGEND: Record<ToolingCompatibilityLevel, string> = {
  Native: "Pattern wird direkt vom Tool als Primitive angeboten.",
  Composable: "Pattern lässt sich aus den Bausteinen sauber zusammensetzen.",
  Supporting: "Spielt eine Rolle in der Komposition, ist aber nicht selbst Orchestrator.",
  Custom: "Möglich, erfordert aber relevanten eigenen Code.",
};

const CATEGORY_ORDER: ToolingCategory[] = [
  "Orchestration",
  "Agent Runtime",
  "Memory & Retrieval",
  "Workflow Runtime",
  "Observability",
  "Typed Interfaces",
];

export function ToolingCompatibilityTemplate() {
  const [level, setLevel] = useState<LevelFilter>("Alle");
  const [category, setCategory] = useState<CategoryFilter>("Alle");

  const filtered = useMemo(() => {
    return toolingCompatibility.filter((entry) => {
      if (level !== "Alle" && entry.level !== level) return false;
      if (category !== "Alle" && entry.category !== category) return false;
      return true;
    });
  }, [level, category]);

  const grouped = useMemo(() => {
    const map = new Map<ToolingCategory, typeof toolingCompatibility>();
    filtered.forEach((entry) => {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    });
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      entries: map.get(c)!,
    }));
  }, [filtered]);

  const categories: CategoryFilter[] = ["Alle", ...CATEGORY_ORDER];

  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Tooling Compatibility</SectionKicker>
        <h1 id="page-title">Werkzeuge nach Architekturfit, nicht nach Hype.</h1>
        <p>
          Welche Werkzeuge tragen welche Atlas-Patterns – und wo lohnt sich der Trade-off?
          Jedes Tool mit Kategorie, Sprache, Lizenz, verlinkten Patterns und Quellen.
        </p>
      </section>

      <section className="section tooling-section" aria-labelledby="tooling-legend-title">
        <div className="section-heading">
          <SectionKicker>Bewertung</SectionKicker>
          <h2 id="tooling-legend-title">Vier Kompatibilitätsstufen.</h2>
          <p>
            Die Stufen beschreiben das Verhältnis Tool ↔ Pattern. Sie bewerten kein Tool als
            Ganzes, sondern dessen Eignung als Implementierungsschicht für einen Pattern.
          </p>
        </div>
        <div className="legend-grid">
          {(Object.keys(LEVEL_LEGEND) as ToolingCompatibilityLevel[]).map((lvl) => (
            <div key={lvl} className={`legend-card legend-${lvl.toLowerCase()}`}>
              <p className="legend-level">{lvl}</p>
              <p className="legend-desc">{LEVEL_LEGEND[lvl]}</p>
            </div>
          ))}
        </div>

        <div className="reference-filters" role="group" aria-label="Tooling Filter">
          <div className="filter-group">
            <span className="filter-label">Level</span>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                className={`filter-pill${level === l ? " is-active" : ""}`}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Kategorie</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-pill${category === c ? " is-active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {grouped.length === 0 ? (
          <p className="reference-empty">Keine Tools mit diesen Filtern. Filter zurücksetzen.</p>
        ) : (
          grouped.map((group) => (
            <div key={group.category} className="tooling-group">
              <h3 className="tooling-group-title">{group.category}</h3>
              <div className="tooling-grid">
                {group.entries.map((entry) => (
                  <article
                    className="tooling-card"
                    data-level={entry.level}
                    key={entry.tool}
                  >
                    <div className="tooling-card-header">
                      <h4>{entry.tool}</h4>
                      <span className={`tooling-level tooling-level-${entry.level.toLowerCase()}`}>
                        {entry.level}
                      </span>
                    </div>
                    <div className="tooling-meta">
                      <span><strong>Sprache:</strong> {entry.language}</span>
                      <span><strong>Lizenz:</strong> {entry.license}</span>
                    </div>
                    <dl className="tooling-dl">
                      <div>
                        <dt>Best for</dt>
                        <dd>{entry.bestFor}</dd>
                      </div>
                      <div>
                        <dt>Watch out</dt>
                        <dd>{entry.watchOut}</dd>
                      </div>
                    </dl>
                    <div className="tooling-patterns" aria-label={`Verwandte Patterns für ${entry.tool}`}>
                      <p className="tooling-section-label">Patterns</p>
                      <div className="pattern-chip-row">
                        {entry.related.map((p) => {
                          const href = patternHref(p);
                          return href ? (
                            <Link key={p} href={href} className="pattern-chip">
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
                    <div className="tooling-links">
                      <p className="tooling-section-label">Quellen</p>
                      <div className="tooling-link-row">
                        {entry.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tooling-link"
                          >
                            {link.label} <ExternalLink size={12} aria-hidden />
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}

        <p className="tooling-disclaimer">
          <Info size={14} aria-hidden /> Snapshot mit Stand der jeweiligen Quelle. Lizenzen und
          Pattern-Abdeckung können sich kurzfristig ändern – im Zweifel an der verlinkten
          Doku verifizieren.
        </p>
      </section>

      <section aria-label="Bestehendes Framework-Mapping">
        <FrameworkTable />
      </section>
    </main>
  );
}
