import { getPatternStats } from "@/features/landscape/lib/patternStats";

export function QuickStats() {
  const { patternCount, domainCount, frameworkCount } = getPatternStats();
  return (
    <dl className="quick-stats" aria-label="Atlas-Kennzahlen">
      <div className="quick-stat">
        <dt>Patterns</dt>
        <dd>{patternCount}</dd>
      </div>
      <div className="quick-stat">
        <dt>Domänen</dt>
        <dd>{domainCount}</dd>
      </div>
      <div className="quick-stat">
        <dt>Frameworks</dt>
        <dd>{frameworkCount}</dd>
      </div>
    </dl>
  );
}
