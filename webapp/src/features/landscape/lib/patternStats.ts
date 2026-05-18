import { allPatterns } from "./patterns";

export function getPatternStats() {
  const frameworks = new Set<string>();
  for (const p of allPatterns) {
    for (const f of p.frameworks) frameworks.add(f);
  }
  const domains = new Set(allPatterns.map((p) => p.domain));
  return {
    patternCount: allPatterns.length,
    domainCount: domains.size,
    frameworkCount: frameworks.size,
  };
}

export function getAllFrameworks(): string[] {
  const set = new Set<string>();
  for (const p of allPatterns) for (const f of p.frameworks) set.add(f);
  return [...set].sort((a, b) => a.localeCompare(b, "de"));
}
