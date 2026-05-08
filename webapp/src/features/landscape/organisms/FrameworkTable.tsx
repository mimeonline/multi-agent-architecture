import { frameworkRows } from "../lib/patterns";

export function FrameworkTable() {
  return (
    <section className="frameworks" aria-labelledby="frameworks-title">
      <div className="frameworks-heading">
        <div>
          <p className="section-kicker">Framework-Mapping</p>
          <h2 id="frameworks-title">Frameworks nach natürlicher Stärke.</h2>
        </div>
        <p>
          Welche Frameworks bringen welche Patterns nativ mit. Eine schnelle Orientierung
          zur Auswahl der passenden Werkbank.
        </p>
      </div>
      <div className="framework-grid" role="list" aria-label="Framework-Mapping">
        {frameworkRows.map(([framework, nativePatterns, strength]) => (
          <article className="framework-card" role="listitem" key={framework}>
            <span className="fw-name">{framework}</span>
            <span className="fw-patterns">{nativePatterns}</span>
            <span className="fw-strength">{strength}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
