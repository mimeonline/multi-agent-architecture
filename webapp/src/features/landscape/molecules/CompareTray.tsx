import type { Pattern } from "../types/pattern";

type Props = {
  patterns: Pattern[];
  onOpen: () => void;
  onClear: () => void;
  onRemove: (name: string) => void;
  max: number;
};

export function CompareTray({ patterns, onOpen, onClear, onRemove, max }: Props) {
  const isEmpty = patterns.length === 0;
  return (
    <div
      className={`compare-tray${isEmpty ? " is-empty" : ""}`}
      role="region"
      aria-label="Vergleichsliste"
    >
      <span className="tray-label">
        Vergleich · {patterns.length}/{max}
      </span>
      {isEmpty ? (
        <p className="tray-hint">
          Bis zu {max} Patterns mit <span className="kbd-inline">+</span> auf der Karte
          markieren oder <kbd>c</kbd> drücken.
        </p>
      ) : (
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
      )}
      <div className="tray-actions">
        {!isEmpty && (
          <button type="button" className="tray-clear" onClick={onClear}>
            Leeren
          </button>
        )}
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
