"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Code2,
  ExternalLink,
  KeyRound,
  Layers,
  Play,
  Terminal,
} from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import {
  implementationArchitectureNotebooks,
  implementationDemoCount,
  implementationDemoGroups,
  implementationDemos,
  implementationNotebookCount,
} from "../lib/implementation-lab-catalog";
import type { ImplementationDemoGroupId } from "../lib/implementation-lab-catalog";
import {
  PatternQuickViewLink,
  PatternQuickViewProvider,
} from "@/features/landscape/organisms/PatternQuickView";

const REPO_CODE_URL = "https://github.com/mimeonline/multi-agent-architecture/tree/main/code";
const REPO_README_URL = "https://github.com/mimeonline/multi-agent-architecture/blob/main/code/README.md";

type DomainFilter = "Alle" | ImplementationDemoGroupId;

export function ImplementationLabTemplate() {
  const [domain, setDomain] = useState<DomainFilter>("Alle");

  const filtered = useMemo(() => {
    if (domain === "Alle") return implementationDemos;
    return implementationDemos.filter((demo) => demo.group === domain);
  }, [domain]);

  return (
    <PatternQuickViewProvider>
      <main id="top">
        <section className="page-hero" aria-labelledby="page-title">
          <SectionKicker>Implementation Lab</SectionKicker>
          <h1 id="page-title">Code, Notebooks und Demos für alle Patterns.</h1>
          <p>
            Die praktische Werkbank des Atlas. Jede Pattern-Demo erreichbar als Quellcode,
            Jupyter-Notebook und CLI-Befehl. Python ist die ausführbare Wahrheit, Notebooks der
            Lernpfad, der Atlas verbindet beides.
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
            Die Webapp hilft beim Finden, die Notebooks erklären Schritt für Schritt, das
            Python-Package führt dieselben Demos über die CLI aus. Keine doppelte Implementierung.
          </p>
        </div>
        <div className="lab-principles">
          <article className="lab-principle lab-principle-code">
            <div className="lab-principle-icon"><Code2 aria-hidden /></div>
            <h3>Python bleibt führend</h3>
            <p>CLI, Tests, Shared Provider-Logik und Dry-Run-Verhalten bleiben im Package.</p>
          </article>
          <article className="lab-principle lab-principle-notebook">
            <div className="lab-principle-icon"><BookOpen aria-hidden /></div>
            <h3>Notebooks erklären</h3>
            <p>Jedes Notebook installiert das Package und ruft genau eine Demo mit Beispielprompt auf.</p>
          </article>
          <article className="lab-principle lab-principle-atlas">
            <div className="lab-principle-icon"><Layers aria-hidden /></div>
            <h3>Atlas verbindet</h3>
            <p>Der Katalog verlinkt Pattern, Code, Notebook, Colab und lokalen Run-Befehl an einem Ort.</p>
          </article>
        </div>
      </section>

      <section className="section lab-start" aria-labelledby="lab-start-title">
        <div className="section-heading">
          <SectionKicker>Start</SectionKicker>
          <h2 id="lab-start-title">Lokal ausführen oder im Notebook öffnen.</h2>
          <p>
            Ohne API-Key liefern die Demos erklärenden Output. Mit eigenem Provider-Key laufen
            sie gegen echte Modelle. Colab installiert das Package direkt aus GitHub.
          </p>
        </div>
        <div className="lab-token-note" aria-labelledby="lab-token-title">
          <KeyRound aria-hidden="true" />
          <div>
            <h3 id="lab-token-title">Model-Token selbst setzen</h3>
            <p>
              GitHub und Colab stellen keinen Model-Token für die Notebooks bereit. Wer echte
              Modellantworten sehen möchte, setzt im Notebook einen eigenen Provider-Key. Für Nutzer
              mit GitHub Account ist GitHub Models der naheliegende Einstieg, weil der Endpoint
              OpenAI-kompatibel ist.
            </p>
            <pre className="code-panel compact"><code>{`import getpass, os

os.environ["AGENT_PROVIDER"] = "github"
os.environ["GITHUB_TOKEN"] = getpass.getpass("GitHub Token mit Models-Zugriff: ")
os.environ["GITHUB_MODEL"] = "openai/gpt-4.1-mini"`}</code></pre>
            <p>
              Der Token braucht Zugriff auf GitHub Models, in der Regel <code>models:read</code>.
              Ohne Token bleiben die Demos im erklärenden Offline-Modus.
            </p>
          </div>
        </div>
        <div className="lab-start-grid">
          <pre className="lab-start-code"><code>{`cd code
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .

agent-patterns list --plain
agent-patterns run react "Find 12 * 7 and summarize."
agent-patterns run all`}</code></pre>
          <div className="lab-start-cta">
            <p className="lab-start-cta-label">Direkt loslegen</p>
            <a className="cta-link primary" href={REPO_CODE_URL} target="_blank" rel="noreferrer">
              <Terminal size={14} aria-hidden /> Code auf GitHub
            </a>
            <a className="cta-link" href={REPO_README_URL} target="_blank" rel="noreferrer">
              <BookOpen size={14} aria-hidden /> README ansehen
            </a>
            <a className="cta-link" href="#pattern-catalog">
              <Layers size={14} aria-hidden /> Pattern-Katalog ↓
            </a>
          </div>
        </div>
      </section>

      <section
        id="pattern-catalog"
        className="section lab-catalog-section"
        aria-labelledby="lab-catalog-title"
      >
        <div className="section-heading">
          <SectionKicker>Pattern Codebooks</SectionKicker>
          <h2 id="lab-catalog-title">Alle Pattern-Demos als Code, Notebook und Run-Befehl.</h2>
          <p>
            Jede Karte führt zum Python-Quellcode, zum Notebook und direkt zu Colab. Der lokale
            Befehl nutzt denselben Demo-Slug wie die CLI.
          </p>
        </div>

        <div className="reference-filters" role="group" aria-label="Domain-Filter">
          <div className="filter-group">
            <span className="filter-label">Domäne</span>
            <button
              type="button"
              className={`filter-pill${domain === "Alle" ? " is-active" : ""}`}
              onClick={() => setDomain("Alle")}
            >
              Alle ({implementationDemos.length})
            </button>
            {implementationDemoGroups.map((g) => {
              const count = implementationDemos.filter((d) => d.group === g.id).length;
              return (
                <button
                  key={g.id}
                  type="button"
                  className={`filter-pill domain-pill domain-${g.id}${
                    domain === g.id ? " is-active" : ""
                  }`}
                  onClick={() => setDomain(g.id)}
                >
                  {g.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {implementationDemoGroups
          .filter((g) => domain === "Alle" || g.id === domain)
          .map((group) => {
            const demos = filtered.filter((d) => d.group === group.id);
            if (demos.length === 0) return null;
            return (
              <section
                className={`lab-demo-group lab-group-${group.id}`}
                aria-labelledby={`lab-group-${group.id}`}
                key={group.id}
              >
                <div className="lab-demo-group-heading">
                  <div>
                    <span className={`domain-tag domain-${group.id}`}>{group.label}</span>
                    <h3 id={`lab-group-${group.id}`}>{demos.length} Demos</h3>
                  </div>
                  <p>{group.description}</p>
                </div>
                <div className="lab-demo-grid">
                  {demos.map((demo) => {
                    return (
                      <article className={`lab-demo-card domain-${demo.group}`} key={demo.slug}>
                        <header className="lab-demo-card-head">
                          <span className={`domain-tag domain-${demo.group}`}>{demo.groupLabel}</span>
                          <h4>{demo.name}</h4>
                          <p>{demo.idea}</p>
                        </header>

                        {demo.prompt && (
                          <div className="lab-demo-prompt">
                            <span className="lab-demo-prompt-label">Beispiel-Prompt</span>
                            <code>{demo.prompt}</code>
                          </div>
                        )}

                        <pre className="lab-command"><code>{demo.runCommand}</code></pre>

                        <div className="lab-demo-links" aria-label={`${demo.name} Links`}>
                          <a
                            className="lab-link lab-link-primary"
                            href={demo.colabUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Play size={13} aria-hidden /> Colab
                          </a>
                          <a
                            className="lab-link lab-link-secondary"
                            href={demo.notebookUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <BookOpen size={13} aria-hidden /> Notebook
                          </a>
                          <a
                            className="lab-link"
                            href={demo.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Code2 size={13} aria-hidden /> Code
                          </a>
                          <PatternQuickViewLink className="lab-link" name={demo.name}>
                              <Layers size={13} aria-hidden /> Pattern
                          </PatternQuickViewLink>
                        </div>

                        {demo.frameworks.length > 0 && (
                          <div className="lab-demo-tags" aria-label={`${demo.name} Frameworks`}>
                            {demo.frameworks.slice(0, 4).map((fw) => (
                              <span key={fw}>{fw}</span>
                            ))}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
      </section>

      <section className="section lab-architecture-section" aria-labelledby="lab-architecture-title">
        <div className="section-heading">
          <SectionKicker>Architecture Codebooks</SectionKicker>
          <h2 id="lab-architecture-title">Reference Architectures als Notebook-Arbeitsblätter.</h2>
          <p>
            Strukturieren Szenario, Komponenten, Entscheidungen und Risiken als Arbeitsmaterial,
            keine zweite Implementierung.
          </p>
        </div>
        <div className="lab-architecture-grid">
          {implementationArchitectureNotebooks.map((arch) => (
            <article className="lab-architecture-card" key={arch.slug}>
              <span className="domain-tag domain-architecture">Reference Architecture</span>
              <h3>{arch.title}</h3>
              <p>{arch.tagline}</p>
              <div className="lab-demo-links" aria-label={`${arch.title} Links`}>
                <a className="lab-link lab-link-primary" href={arch.colabUrl} target="_blank" rel="noreferrer">
                  <Play size={13} aria-hidden /> Colab
                </a>
                <a className="lab-link lab-link-secondary" href={arch.notebookUrl} target="_blank" rel="noreferrer">
                  <BookOpen size={13} aria-hidden /> Notebook
                </a>
                <Link className="lab-link" href={arch.pageUrl}>
                  <Layers size={13} aria-hidden /> Atlas
                </Link>
                <a
                  className="lab-link"
                  href={arch.notebookUrl.replace("/blob/", "/raw/")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={13} aria-hidden /> Raw
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      </main>
    </PatternQuickViewProvider>
  );
}
