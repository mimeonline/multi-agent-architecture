import { ExternalLink, Terminal } from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { implementationLabGroups } from "../lib/atlas-content";

export function ImplementationLabTemplate() {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Implementation Lab</SectionKicker>
        <h1 id="page-title">Ausführbare Proofs unter der Architektur.</h1>
        <p>
          Das Lab ist die praktische Werkbank des Atlas. Es beweist ausgewählte Patterns und
          Runtime-Mechaniken mit kleinen Python-Demos, ohne die Produktstruktur nach Code zu ordnen.
        </p>
      </section>

      <section className="section lab-section" aria-labelledby="lab-model-title">
        <div className="atlas-section-heading">
          <div>
            <SectionKicker>Rolle</SectionKicker>
            <h2 id="lab-model-title">Code als Evidenz, nicht als Taxonomie.</h2>
          </div>
          <p>
            Jede Demo soll eine Architekturidee greifbar machen: Reasoning, Workflow,
            Zusammenarbeit, Runtime, Governance oder Observability. Nicht jedes Atlas Item braucht
            eine Demo.
          </p>
        </div>
        <div className="lab-grid">
          {implementationLabGroups.map((group) => (
            <article className="lab-card" key={group.title}>
              <span className="lab-path">{group.path}</span>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <div>
                <strong>Architekturwert</strong>
                <span>{group.architectureValue}</span>
              </div>
              <ul aria-label={`${group.title} Beispiel-Demos`}>
                {group.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section demos" aria-labelledby="lab-start-title">
        <div className="section-heading">
          <SectionKicker>Start</SectionKicker>
          <h2 id="lab-start-title">CLI mit Offline-Fallback.</h2>
          <p>
            Die Demos sind defensiv gebaut. Ohne API Keys liefern sie hilfreichen erklärenden
            Output, statt hart zu scheitern.
          </p>
        </div>
        <pre className="code-panel"><code>{`cd code
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .

agent-patterns list --grouped
agent-patterns run react "Find 12 * 7 and summarize the tool result."
agent-patterns run all`}</code></pre>
        <div className="lab-actions">
          <a
            className="btn btn-primary lab-action"
            href="https://github.com/mimeonline/multi-agent-architecture/tree/main/code"
            target="_blank"
            rel="noreferrer"
          >
            <Terminal aria-hidden="true" />
            Code auf GitHub
          </a>
          <a
            className="btn btn-secondary lab-action dark"
            href="https://github.com/mimeonline/multi-agent-architecture/blob/main/code/README.md"
            target="_blank"
            rel="noreferrer"
          >
            README
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
