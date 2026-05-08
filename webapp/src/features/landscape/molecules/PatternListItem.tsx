import type { Pattern } from "../types/pattern";
import { PatternIcon } from "../atoms/PatternIcon";
import { ComplexityBadge } from "../atoms/ComplexityBadge";

type PatternListItemProps = {
  pattern: Pattern;
  selected: boolean;
  compared: boolean;
  onSelect: (pattern: Pattern) => void;
  onToggleCompare: (pattern: Pattern) => void;
};

export function PatternListItem({
  pattern,
  selected,
  compared,
  onSelect,
  onToggleCompare,
}: PatternListItemProps) {
  return (
    <div
      className={`pattern-row${selected ? " is-selected" : ""}${compared ? " is-compared" : ""}`}
      data-domain={pattern.domain}
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
          <strong>{pattern.name}</strong>
          <small>
            {pattern.subdomain ? `${pattern.domain} · ${pattern.subdomain}` : pattern.domain}
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
