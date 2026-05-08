import type { Pattern, RelatedKind } from "../types/pattern";
import { PatternDiagram } from "../atoms/PatternDiagram";
import { PatternIcon } from "../atoms/PatternIcon";
import { ComplexityBadge } from "../atoms/ComplexityBadge";
import { TraitChip } from "../atoms/TraitChip";
import { CodeBlock } from "../atoms/CodeBlock";

type PatternDetailProps = {
  pattern: Pattern;
  onJump?: (name: string) => void;
};

const KIND_LABEL: Record<RelatedKind, string> = {
  similar: "Ähnlich",
  combines: "Kombiniert mit",
  contrasts: "Abgrenzung",
};

export function PatternDetail({ pattern, onJump }: PatternDetailProps) {
  return (
    <aside className="pattern-detail" data-domain={pattern.domain} aria-live="polite">
      <header className="detail-header">
        <span className="detail-icon" aria-hidden="true">
          <PatternIcon name={pattern.icon} size={22} />
        </span>
        <div className="detail-meta">
          <span className="detail-tag">
            {pattern.subdomain ? `${pattern.domain} · ${pattern.subdomain}` : pattern.domain}
          </span>
          <h3>{pattern.name}</h3>
        </div>
        <ComplexityBadge complexity={pattern.complexity} />
      </header>

      <p className="detail-idea">{pattern.idea}</p>

      {pattern.traits.length > 0 && (
        <div className="trait-row">
          {pattern.traits.map((t) => (
            <TraitChip key={t} trait={t} />
          ))}
        </div>
      )}

      <PatternDiagram diagram={pattern.diagram} domain={pattern.domain} />

      <section className="detail-section">
        <p className="detail-label">Stell dir vor</p>
        <p className="detail-scenario">{pattern.scenario}</p>
      </section>

      <div className="detail-grid">
        <div className="detail-block use">
          <h4>Einsetzen, wenn</h4>
          <ul>
            {pattern.useWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="detail-block avoid">
          <h4>Nicht einsetzen, wenn</h4>
          <ul>
            {pattern.avoidWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="detail-tradeoff">{pattern.tradeoff}</p>

      <section className="detail-section">
        <p className="detail-label">Code-Skizze</p>
        <CodeBlock code={pattern.code} />
      </section>

      {pattern.example && pattern.example.length > 0 && (
        <section className="detail-section">
          <p className="detail-label">Worked Example</p>
          <ol className="worked-example">
            {pattern.example.map((step, i) => (
              <li key={i}>
                <span className="step-name">{step.step}</span>
                <span className="step-detail">{step.detail}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {pattern.related.length > 0 && (
        <section className="detail-section">
          <p className="detail-label">Verwandt &amp; abgrenzbar</p>
          <ul className="related-list">
            {pattern.related.map((rel) => (
              <li key={rel.name} data-kind={rel.kind}>
                <span className="rel-kind">{KIND_LABEL[rel.kind]}</span>
                {onJump ? (
                  <button type="button" className="rel-link" onClick={() => onJump(rel.name)}>
                    {rel.name}
                  </button>
                ) : (
                  <span className="rel-link">{rel.name}</span>
                )}
                <span className="rel-note">{rel.note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="detail-section">
        <p className="detail-label">Aliase</p>
        <div className="chip-row">
          {pattern.aliases.map((item) => (
            <span key={item} className="chip alias">{item}</span>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <p className="detail-label">Frameworks</p>
        <div className="chip-row">
          {pattern.frameworks.map((item) => (
            <span key={item} className="chip">{item}</span>
          ))}
        </div>
      </section>
    </aside>
  );
}
