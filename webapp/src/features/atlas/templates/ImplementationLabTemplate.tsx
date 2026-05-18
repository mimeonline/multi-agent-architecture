import { BookOpen, Code2, ExternalLink, Layers, Play, Terminal } from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import {
  implementationArchitectureNotebooks,
  implementationDemoCount,
  implementationDemoGroups,
  implementationDemos,
  implementationNotebookCount,
} from "../lib/implementation-lab-catalog";

const REPO_CODE_URL = "https://github.com/mimeonline/multi-agent-architecture/tree/main/code";
const REPO_README_URL = "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/README.md";

export function ImplementationLabTemplate() {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Implementation Lab</SectionKicker>
        <h1 id="page-title">Code, Notebooks und Demos für alle Patterns.</h1>
        <p>
          Das Lab ist die praktische Werkbank des Atlas. Jede vorhandene Pattern-Demo ist hier als
          Run-Befehl, Quellcode-Link und Jupyter-Notebook erreichbar. Die Python-Demos bleiben die
          ausführbare Wahrheit, die Notebooks sind der Lernpfad darüber.
        </p>
        <dl className="lab-summary" aria-label="Implementation Lab Umfang">
          <div>
            <dt>{implementationDemoCount}</dt>
            <dd>Pattern-Demos</dd>
          </div>
          <div>
            <dt>{implementationArchitectureNotebooks.length}</dt>
            <dd>Architektur-Notebooks</dd>
          </div>
          <div>
            <dt>{implementationNotebookCount}</dt>
            <dd>Notebooks gesamt</dd>
          </div>
        </dl>
      </section>

      <section className="section lab-section" aria-labelledby="lab-model-title">
        <div className="atlas-section-heading">
          <div>
            <SectionKicker>Rolle</SectionKicker>
            <h2 id="lab-model-title">Drei Schichten, eine Demo-Wahrheit.</h2>
          </div>
          <p>
            Die Webapp hilft beim Finden, die Notebooks erklären Schritt für Schritt, und das
            Python-Package führt dieselben Demos über die CLI aus. So entsteht keine zweite
            Implementierung im Notebook.
          </p>
        </div>
        <div className="lab-principles">
          <article>
            <Code2 aria-hidden="true" />
            <h3>Python bleibt führend</h3>
            <p>CLI, Tests, Shared Provider-Logik und Dry-Run-Verhalten bleiben im Package.</p>
          </article>
          <article>
            <BookOpen aria-hidden="true" />
            <h3>Notebooks erklären</h3>
            <p>Jedes Notebook installiert das Package und ruft genau eine Demo mit Beispielprompt auf.</p>
          </article>
          <article>
            <Layers aria-hidden="true" />
            <h3>Atlas verbindet</h3>
            <p>Der Katalog verlinkt Pattern, Code, Notebook, Colab und lokalen Run-Befehl an einem Ort.</p>
          </article>
        </div>
      </section>

      <section className="section demos" aria-labelledby="lab-start-title">
        <div className="section-heading">
          <SectionKicker>Start</SectionKicker>
          <h2 id="lab-start-title">Lokal ausführen oder im Notebook öffnen.</h2>
          <p>
            Ohne API Keys liefern die Demos erklärenden Output. Mit eigenem Provider-Key laufen sie
            gegen echte Modelle. Colab-Notebooks installieren das Package direkt aus GitHub.
          </p>
        </div>
        <pre className="code-panel"><code>{`cd code
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .

agent-patterns list --plain
agent-patterns run react "Find 12 * 7 and summarize the tool result."
agent-patterns run all`}</code></pre>
        <div className="lab-actions">
          <a className="btn btn-primary lab-action" href={REPO_CODE_URL} target="_blank" rel="noreferrer">
            <Terminal aria-hidden="true" />
            Code auf GitHub
          </a>
          <a className="btn btn-secondary lab-action dark" href={REPO_README_URL} target="_blank" rel="noreferrer">
            README
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="section lab-catalog-section" aria-labelledby="lab-catalog-title">
        <div className="section-heading">
          <SectionKicker>Pattern Codebooks</SectionKicker>
          <h2 id="lab-catalog-title">Alle Pattern-Demos als Code, Notebook und Run-Befehl.</h2>
          <p>
            Jede Karte führt zum Python-Quellcode, zum Notebook im Repo und direkt zu Colab. Der
            lokale Befehl nutzt denselben Demo-Slug wie die CLI.
          </p>
        </div>

        {implementationDemoGroups.map((group) => {
          const demos = implementationDemos.filter((demo) => demo.group === group.id);
          return (
            <section className="lab-demo-group" aria-labelledby={`lab-group-${group.id}`} key={group.id}>
              <div className="lab-demo-group-heading">
                <div>
                  <SectionKicker>{group.label}</SectionKicker>
                  <h3 id={`lab-group-${group.id}`}>{demos.length} Demos</h3>
                </div>
                <p>{group.description}</p>
              </div>
              <div className="lab-demo-grid">
                {demos.map((demo) => (
                  <article className="lab-demo-card" key={demo.slug}>
                    <div className="lab-demo-card-head">
                      <span className="lab-path">{demo.domain}</span>
                      <h4>{demo.name}</h4>
                      <p>{demo.idea}</p>
                    </div>
                    <div className="lab-demo-steps">
                      <strong>Lernschritte</strong>
                      <ol>
                        {demo.steps.slice(0, 3).map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    <pre className="lab-command"><code>{demo.runCommand}</code></pre>
                    <div className="lab-demo-links" aria-label={`${demo.name} Links`}>
                      <a href={demo.colabUrl} target="_blank" rel="noreferrer">
                        <Play aria-hidden="true" />
                        Colab
                      </a>
                      <a href={demo.notebookUrl} target="_blank" rel="noreferrer">
                        <BookOpen aria-hidden="true" />
                        Notebook
                      </a>
                      <a href={demo.githubUrl} target="_blank" rel="noreferrer">
                        <Code2 aria-hidden="true" />
                        Code
                      </a>
                    </div>
                    {demo.frameworks.length ? (
                      <div className="lab-demo-tags" aria-label={`${demo.name} Frameworks`}>
                        {demo.frameworks.slice(0, 3).map((framework) => (
                          <span key={framework}>{framework}</span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section className="section lab-catalog-section" aria-labelledby="lab-architecture-title">
        <div className="section-heading">
          <SectionKicker>Architecture Codebooks</SectionKicker>
          <h2 id="lab-architecture-title">Reference Architectures als Notebook-Arbeitsblätter.</h2>
          <p>
            Diese Notebooks sind keine zweite Implementierung. Sie strukturieren Szenario,
            Komponenten, Entscheidungen und Risiken als Arbeitsmaterial für eigene Entwürfe.
          </p>
        </div>
        <div className="lab-architecture-grid">
          {implementationArchitectureNotebooks.map((architecture) => (
            <article className="lab-architecture-card" key={architecture.slug}>
              <span className="lab-path">Reference Architecture</span>
              <h3>{architecture.title}</h3>
              <p>{architecture.tagline}</p>
              <div className="lab-demo-links" aria-label={`${architecture.title} Links`}>
                <a href={architecture.pageUrl}>
                  <Layers aria-hidden="true" />
                  Atlas
                </a>
                <a href={architecture.colabUrl} target="_blank" rel="noreferrer">
                  <Play aria-hidden="true" />
                  Colab
                </a>
                <a href={architecture.notebookUrl} target="_blank" rel="noreferrer">
                  <BookOpen aria-hidden="true" />
                  Notebook
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
