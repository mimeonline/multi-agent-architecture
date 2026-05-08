import type { Pattern } from "../types/pattern";

type PatternDetailProps = {
  pattern: Pattern;
};

export function PatternDetail({ pattern }: PatternDetailProps) {
  return (
    <aside className="pattern-detail" data-domain={pattern.domain} aria-live="polite">
      <span className="detail-tag">
        {pattern.subdomain ? `${pattern.domain} · ${pattern.subdomain}` : pattern.domain}
      </span>
      <h3>{pattern.name}</h3>
      <p className="detail-idea">{pattern.idea}</p>

      <div className="detail-grid">
        <div className="detail-block use">
          <h4>✓ Einsetzen, wenn</h4>
          <ul>
            {pattern.useWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="detail-block avoid">
          <h4>✗ Nicht einsetzen, wenn</h4>
          <ul>
            {pattern.avoidWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="detail-tradeoff">{pattern.tradeoff}</p>

      <div className="detail-aliases">
        <p className="detail-label">Aliase</p>
        <div className="chip-row">
          {pattern.aliases.map((item) => (
            <span key={item} className="chip alias">{item}</span>
          ))}
        </div>
      </div>

      <div className="detail-frameworks">
        <p className="detail-label">Frameworks</p>
        <div className="chip-row">
          {pattern.frameworks.map((item) => (
            <span key={item} className="chip">{item}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
