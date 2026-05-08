import type { Pattern } from "../types/pattern";

type Props = {
  patterns: Pattern[];
  onOpen: () => void;
  onClear: () => void;
  onRemove: (name: string) => void;
  max: number;
};

export function CompareTray({ patterns, onOpen, onClear, onRemove, max }: Props) {
  if (patterns.length === 0) return null;
  return (
    <div className="compare-tray" role="region" aria-label="Vergleichsliste">
      <span className="tray-label">
        Vergleich · {patterns.length}/{max}
      </span>
      <ul className="tray-list">
        {patterns.map((p) => (
          <li key={p.name} data-domain={p.domain}>
            <span>{p.name}</span>
            <button type="button" onClick={() => onRemove(p.name)} aria-label={`Entfernen: ${p.name}`}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="tray-actions">
        <button type="button" className="tray-clear" onClick={onClear}>
          Leeren
        </button>
        <button
          type="button"
          className="tray-open"
          onClick={onOpen}
          disabled={patterns.length < 2}
        >
          Vergleichen
        </button>
      </div>
    </div>
  );
}
