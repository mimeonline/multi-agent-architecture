import { SectionKicker } from "@/components/atoms/SectionKicker";
import { referenceArchitectures } from "../lib/atlas-content";

export function ReferenceArchitecturesTemplate() {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Reference Architectures</SectionKicker>
        <h1 id="page-title">Konkrete Systemkompositionen als Applied Views.</h1>
        <p>
          Reference Architectures zeigen, wie Foundations, Patterns, Architecture und Governance
          in realistischen AI-Systemen zusammenspielen.
        </p>
      </section>

      <section className="section reference-section" aria-labelledby="reference-title">
        <div className="section-heading">
          <SectionKicker>V1-Auswahl</SectionKicker>
          <h2 id="reference-title">Zwei Referenzarchitekturen für den ersten Atlas-Schnitt.</h2>
          <p>
            Der Fokus liegt auf Systemgrenzen, Entscheidungen und Risiken, nicht auf vollständigen
            Implementierungs-Tutorials.
          </p>
        </div>
        <div className="reference-grid">
          {referenceArchitectures.map((architecture) => (
            <article className="reference-card" key={architecture.title}>
              <h3>{architecture.title}</h3>
              <p>{architecture.scenario}</p>
              <div className="reference-columns">
                <div>
                  <strong>Components</strong>
                  <ul>
                    {architecture.components.map((component) => (
                      <li key={component}>{component}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Key Decisions</strong>
                  <ul>
                    {architecture.keyDecisions.map((decision) => (
                      <li key={decision}>{decision}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Governance</strong>
                  <ul>
                    {architecture.governanceConcerns.map((concern) => (
                      <li key={concern}>{concern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
