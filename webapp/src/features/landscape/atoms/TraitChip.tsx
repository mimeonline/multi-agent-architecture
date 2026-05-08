type Props = {
  trait: string;
};

const TRAIT_META: Record<string, { tone: string; icon?: string }> = {
  "Token-hungry": { tone: "warn" },
  "Latenz-sensitiv": { tone: "warn" },
  "Stateful": { tone: "info" },
  "Stateless": { tone: "info" },
  "Tool-lastig": { tone: "info" },
  "Robustheit": { tone: "good" },
  "Adaptiv": { tone: "good" },
  "Kontrollierbar": { tone: "good" },
  "Multi-Agent": { tone: "info" },
  "Production": { tone: "warn" },
  "Async": { tone: "info" },
  "Sicherheit": { tone: "good" },
  "Erklärbar": { tone: "good" },
  "Cost-bewusst": { tone: "good" },
};

export function TraitChip({ trait }: Props) {
  const meta = TRAIT_META[trait] ?? { tone: "neutral" };
  return (
    <span className="trait-chip" data-tone={meta.tone}>
      {trait}
    </span>
  );
}
