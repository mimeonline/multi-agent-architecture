import type { Pattern } from "../types/pattern";

type PatternDetailProps = {
  pattern: Pattern;
};

export function PatternDetail({ pattern }: PatternDetailProps) {
  return (
    <aside className="pattern-detail" aria-live="polite">
      <p className="detail-domain">
        {pattern.subdomain ? `${pattern.domain} · ${pattern.subdomain}` : pattern.domain}
      </p>
      <h3>{pattern.name}</h3>
      <p className="detail-idea">{pattern.idea}</p>
      <dl>
        <dt>Aliase</dt>
        <dd>{pattern.aliases.join(", ")}</dd>
        <dt>Einsetzen, wenn</dt>
        <dd>{pattern.useWhen.map((item) => <span key={item}>{item}</span>)}</dd>
        <dt>Nicht einsetzen, wenn</dt>
        <dd>{pattern.avoidWhen.map((item) => <span key={item}>{item}</span>)}</dd>
        <dt>Trade-off</dt>
        <dd>{pattern.tradeoff}</dd>
        <dt>Frameworks</dt>
        <dd>{pattern.frameworks.map((item) => <span key={item}>{item}</span>)}</dd>
      </dl>
    </aside>
  );
}

