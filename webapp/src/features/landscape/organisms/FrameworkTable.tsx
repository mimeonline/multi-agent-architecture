import { frameworkRows } from "../lib/patterns";

export function FrameworkTable() {
  return (
    <section className="frameworks" aria-labelledby="frameworks-title">
      <div>
        <p className="section-kicker">Framework-Mapping</p>
        <h2 id="frameworks-title">Frameworks nach natürlicher Stärke.</h2>
      </div>
      <div className="framework-table" role="table" aria-label="Framework-Mapping">
        <div role="row">
          <strong role="columnheader">Framework</strong>
          <strong role="columnheader">Native Patterns</strong>
          <strong role="columnheader">Stärke</strong>
        </div>
        {frameworkRows.map(([framework, nativePatterns, strength]) => (
          <div role="row" key={framework}>
            <span>{framework}</span>
            <span>{nativePatterns}</span>
            <span>{strength}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

