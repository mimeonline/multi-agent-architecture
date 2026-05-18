import type { Pattern } from "../types/pattern";

export type CompareDiff = {
  /** Map from useWhen item → "shared" if in all patterns, else "exclusive" */
  useWhen: Map<string, "shared" | "exclusive">;
  avoidWhen: Map<string, "shared" | "exclusive">;
  /** Map from framework → "shared" if in all patterns, else "exclusive" */
  frameworks: Map<string, "shared" | "exclusive">;
  /** true if not all complexities are equal */
  complexityDiffers: boolean;
};

function classify(itemLists: string[][]): Map<string, "shared" | "exclusive"> {
  const out = new Map<string, "shared" | "exclusive">();
  if (itemLists.length === 0) return out;
  const sets = itemLists.map((list) => new Set(list));
  const all = new Set<string>();
  for (const list of itemLists) for (const item of list) all.add(item);
  for (const item of all) {
    const shared = sets.every((s) => s.has(item));
    out.set(item, shared ? "shared" : "exclusive");
  }
  return out;
}

export function computeDiff(patterns: Pattern[]): CompareDiff {
  const useWhen = classify(patterns.map((p) => p.useWhen));
  const avoidWhen = classify(patterns.map((p) => p.avoidWhen));
  const frameworks = classify(patterns.map((p) => p.frameworks));
  const complexities = new Set(patterns.map((p) => p.complexity));
  return {
    useWhen,
    avoidWhen,
    frameworks,
    complexityDiffers: complexities.size > 1,
  };
}
