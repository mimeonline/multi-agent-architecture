import type { Pattern } from "../types/pattern";
import { PatternIcon } from "../atoms/PatternIcon";
import { ComplexityBadge } from "../atoms/ComplexityBadge";
import { Highlight } from "../atoms/Highlight";

type PatternListItemProps = {
  pattern: Pattern;
  selected: boolean;
  compared: boolean;
  onSelect: (pattern: Pattern) => void;
  onToggleCompare: (pattern: Pattern) => void;
  query?: string;
};

export function PatternListItem({
  pattern,
  selected,
  compared,
  onSelect,
  onToggleCompare,
  query = "",
}: PatternListItemProps) {
  const subline = pattern.subdomain
    ? `${pattern.domain} · ${pattern.subdomain}`
    : pattern.domain;
  return (
    <div
      className={`pattern-row${selected ? " is-selected" : ""}${compared ? " is-compared" : ""}`}
      data-domain={pattern.domain}
      data-name={pattern.name}
    >
      <button
        className="pattern-row-main"
        type="button"
        onClick={() => onSelect(pattern)}
        aria-pressed={selected}
      >
        <span className="pattern-icon" aria-hidden="true">
          <PatternIcon name={pattern.icon} size={16} />
        </span>
        <span className="name">
          <strong>
            <Highlight text={pattern.name} query={query} />
          </strong>
          <small>
            <Highlight text={subline} query={query} />
          </small>
        </span>
        <ComplexityBadge complexity={pattern.complexity} compact />
      </button>
      <button
        className={`compare-toggle${compared ? " is-on" : ""}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompare(pattern);
        }}
        aria-label={compared ? `Aus Vergleich entfernen: ${pattern.name}` : `Zum Vergleich: ${pattern.name}`}
        title={compared ? "Aus Vergleich entfernen" : "Zum Vergleich"}
      >
        {compared ? "✓" : "+"}
      </button>
    </div>
  );
}
