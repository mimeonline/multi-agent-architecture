"use client";

import { useMemo } from "react";
import type { Pattern } from "../types/pattern";
import { PatternDiagram } from "../atoms/PatternDiagram";
import { PatternIcon } from "../atoms/PatternIcon";
import { ComplexityBadge } from "../atoms/ComplexityBadge";
import { TraitChip } from "../atoms/TraitChip";
import { computeDiff } from "../lib/compareDiff";

type Props = {
  patterns: Pattern[];
  open: boolean;
  onClose: () => void;
  onRemove: (name: string) => void;
};

export function CompareView({ patterns, open, onClose, onRemove }: Props) {
  const diff = useMemo(() => computeDiff(patterns), [patterns]);

  if (!open) return null;
  return (
    <div className="compare-modal" role="dialog" aria-label="Pattern-Vergleich" aria-modal="true">
      <div className="compare-backdrop" onClick={onClose} />
      <div className="compare-shell">
        <header className="compare-header">
          <div>
            <p className="section-kicker">Vergleich</p>
            <h3>{patterns.length} Pattern direkt nebeneinander</h3>
            <p className="compare-legend">
              <span className="legend-dot shared" aria-hidden="true" /> gemeinsam ·{" "}
              <span className="legend-dot exclusive" aria-hidden="true" /> nur in einem
            </p>
          </div>
          <button type="button" className="compare-close" onClick={onClose} aria-label="Schließen">
            ×
          </button>
        </header>
        <div className="compare-grid" data-count={patterns.length}>
          {patterns.map((p) => (
            <article className="compare-card" data-domain={p.domain} key={p.name}>
              <header>
                <span className="detail-icon" aria-hidden="true">
                  <PatternIcon name={p.icon} size={18} />
                </span>
                <div>
                  <span className="detail-tag">{p.domain}</span>
                  <h4>{p.name}</h4>
                </div>
                <button type="button" className="compare-remove" onClick={() => onRemove(p.name)} aria-label={`Entfernen: ${p.name}`}>
                  ×
                </button>
              </header>
              <PatternDiagram diagram={p.diagram} domain={p.domain} />
              <p className="detail-idea">{p.idea}</p>
              <div className="compare-row">
                <ComplexityBadge complexity={p.complexity} />
                {diff.complexityDiffers && (
                  <span className="compare-mark exclusive" title="Unterscheidet sich von anderen">
                    abweichend
                  </span>
                )}
              </div>
              <div className="trait-row">
                {p.traits.map((t) => (
                  <TraitChip key={t} trait={t} />
                ))}
              </div>
              <div className="compare-axes">
                <div className="compare-axis tradeoff">
                  <span className="compare-axis-label">Trade-off</span>
                  <p>{p.tradeoff}</p>
                </div>
                <div>
                  <span className="compare-axis-label">Einsetzen, wenn</span>
                  <ul className="compare-diff-list">
                    {p.useWhen.slice(0, 4).map((u) => (
                      <li key={u} data-state={diff.useWhen.get(u) ?? "exclusive"}>
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="compare-axis-label">Vermeiden, wenn</span>
                  <ul className="compare-diff-list">
                    {p.avoidWhen.slice(0, 4).map((u) => (
                      <li key={u} data-state={diff.avoidWhen.get(u) ?? "exclusive"}>
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="compare-axis-label">Frameworks</span>
                  <ul className="compare-diff-list inline">
                    {p.frameworks.slice(0, 6).map((f) => (
                      <li key={f} data-state={diff.frameworks.get(f) ?? "exclusive"}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
