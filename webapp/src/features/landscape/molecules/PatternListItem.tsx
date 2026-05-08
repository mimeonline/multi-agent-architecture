import type { Pattern } from "../types/pattern";

type PatternListItemProps = {
  pattern: Pattern;
  selected: boolean;
  onSelect: (pattern: Pattern) => void;
};

export function PatternListItem({ pattern, selected, onSelect }: PatternListItemProps) {
  return (
    <button
      className={`pattern-row${selected ? " is-selected" : ""}`}
      data-domain={pattern.domain}
      type="button"
      onClick={() => onSelect(pattern)}
    >
      <span className="name">
        <strong>{pattern.name}</strong>
        <small>{pattern.subdomain ? `${pattern.domain} · ${pattern.subdomain}` : pattern.domain}</small>
      </span>
      <em>{pattern.frameworks.slice(0, 2).join(", ")}</em>
    </button>
  );
}
