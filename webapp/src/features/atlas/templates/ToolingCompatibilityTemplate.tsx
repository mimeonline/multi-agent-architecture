import { SectionKicker } from "@/components/atoms/SectionKicker";
import { FrameworkTable } from "@/features/landscape/organisms/FrameworkTable";
import { toolingCompatibility } from "../lib/atlas-content";

export function ToolingCompatibilityTemplate() {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Tooling Compatibility</SectionKicker>
        <h1 id="page-title">Werkzeuge nach Architekturfit, nicht nach Hype.</h1>
        <p>
          Tooling Compatibility zeigt, welche Werkzeuge bestimmte Atlas-Entscheidungen unterstützen.
          Die Tools bleiben eine unterstützende Dimension und werden nicht zur Produktnavigation.
        </p>
      </section>

      <section className="section tooling-section" aria-labelledby="tooling-principles-title">
        <div className="atlas-section-heading">
          <div>
            <SectionKicker>Bewertung</SectionKicker>
            <h2 id="tooling-principles-title">Vier Kompatibilitätsstufen reichen für V1.</h2>
          </div>
          <p>
            Die Matrix bleibt bewusst grob. Sie soll Architekturentscheidungen vorbereiten, nicht
            Frameworks vollständig benchmarken.
          </p>
        </div>
        <div className="tooling-grid">
          {toolingCompatibility.map((entry) => (
            <article className="tooling-card" data-level={entry.level} key={entry.tool}>
              <div className="tooling-card-header">
                <h3>{entry.tool}</h3>
                <span>{entry.level}</span>
              </div>
              <dl>
                <div>
                  <dt>Best for</dt>
                  <dd>{entry.bestFor}</dd>
                </div>
                <div>
                  <dt>Watch out</dt>
                  <dd>{entry.watchOut}</dd>
                </div>
              </dl>
              <div className="atlas-related" aria-label={`${entry.tool} Beziehungen`}>
                {entry.related.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Bestehendes Framework-Mapping">
        <FrameworkTable />
      </section>
    </main>
  );
}
