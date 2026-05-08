import type { Complexity } from "../types/pattern";

const META: Record<Complexity, { label: string; level: number; tone: string }> = {
  Einsteiger: { label: "Einsteiger", level: 1, tone: "ablauf" },
  Fortgeschritten: { label: "Fortgeschritten", level: 2, tone: "zusammen" },
  Production: { label: "Production", level: 3, tone: "system" },
};

type Props = {
  complexity: Complexity;
  compact?: boolean;
};

export function ComplexityBadge({ complexity, compact }: Props) {
  const meta = META[complexity];
  return (
    <span className={`complexity-badge${compact ? " compact" : ""}`} data-tone={meta.tone}>
      <span className="complexity-dots" aria-hidden="true">
        <span className={meta.level >= 1 ? "is-on" : ""} />
        <span className={meta.level >= 2 ? "is-on" : ""} />
        <span className={meta.level >= 3 ? "is-on" : ""} />
      </span>
      {!compact && <span>{meta.label}</span>}
    </span>
  );
}
