import type { Pattern } from "../types/pattern";
import { PatternIcon } from "../atoms/PatternIcon";
import { ComplexityBadge } from "../atoms/ComplexityBadge";
import { Highlight } from "../atoms/Highlight";

type Props = {
  pattern: Pattern;
  selected: boolean;
  compared: boolean;
  onSelect: (pattern: Pattern) => void;
  onToggleCompare: (pattern: Pattern) => void;
  query?: string;
};

export function PatternCard({
  pattern,
  selected,
  compared,
  onSelect,
  onToggleCompare,
  query = "",
}: Props) {
  const subline = pattern.subdomain
    ? `${pattern.domain} · ${pattern.subdomain}`
    : pattern.domain;

  return (
    <article
      className={`pattern-card${selected ? " is-selected" : ""}${compared ? " is-compared" : ""}`}
      data-domain={pattern.domain}
      data-name={pattern.name}
    >
      <button
        type="button"
        className="pattern-card-main"
        onClick={() => onSelect(pattern)}
        aria-pressed={selected}
      >
        <header className="pattern-card-header">
          <span className="pattern-icon" aria-hidden="true">
            <PatternIcon name={pattern.icon} size={18} />
          </span>
          <span className="pattern-card-meta">
            <span className="pattern-card-tag">
              <Highlight text={subline} query={query} />
            </span>
            <h3>
              <Highlight text={pattern.name} query={query} />
            </h3>
          </span>
          <ComplexityBadge complexity={pattern.complexity} compact />
        </header>
        <p className="pattern-card-idea">
          <Highlight text={pattern.idea} query={query} />
        </p>
        {pattern.traits.length > 0 && (
          <ul className="pattern-card-traits" aria-label="Eigenschaften">
            {pattern.traits.slice(0, 4).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </button>
      <button
        className={`compare-toggle card${compared ? " is-on" : ""}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompare(pattern);
        }}
        aria-label={
          compared ? `Aus Vergleich entfernen: ${pattern.name}` : `Zum Vergleich: ${pattern.name}`
        }
        title={compared ? "Aus Vergleich entfernen" : "Zum Vergleich"}
      >
        {compared ? "✓" : "+"}
      </button>
    </article>
  );
}
