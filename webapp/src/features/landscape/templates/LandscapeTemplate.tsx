import Image from "next/image";
import { ArrowRight, BookOpen, Brain, Network, Server, Users, Workflow } from "lucide-react";
import { SectionKicker } from "@/components/atoms/SectionKicker";
import { DecisionGuide } from "../organisms/DecisionGuide";
import { DomainSummary } from "../molecules/DomainSummary";
import { FrameworkTable } from "../organisms/FrameworkTable";
import { PatternExplorer } from "../organisms/PatternExplorer";

export function LandscapeTemplate() {
  return (
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <SectionKicker>Architektur-Referenz · Lernoberfläche</SectionKicker>
          <h1 id="hero-title">
            AI Agent Pattern <em>Landscape</em>
          </h1>
          <p className="hero-lead">
            Eine navigierbare Referenz für Agent Intelligence, Orchestration und Production
            Architecture. Pattern verstehen, einordnen und in Code übertragen.
          </p>
          <div className="hero-actions" aria-label="Schnellzugriff">
            <a className="btn btn-primary" href="#lookup">
              <BookOpen aria-hidden="true" />
              Pattern suchen
            </a>
            <a className="btn btn-secondary" href="#decision">
              Decision-Heuristik
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="constellation">
            <div className="core">
              <Network aria-hidden="true" style={{ width: 32, height: 32 }} />
            </div>
            <div className="node denken">Reasoning</div>
            <div className="node ablauf">Workflow</div>
            <div className="node zusammen">Multi-Agent</div>
            <div className="node system">Runtime</div>
          </div>
        </div>
      </section>

      <section className="section intro" aria-labelledby="model-title">
        <div>
          <SectionKicker>Modell</SectionKicker>
          <h2 id="model-title">Vier Domänen, zwei Querschnittssichten.</h2>
        </div>
        <p>
          Die Referenz trennt internes Reasoning, Ablaufsteuerung, Multi-Agent-Zusammenarbeit
          und Systembetrieb. Framework-Mapping und Decision-Heuristik verbinden diese Bausteine
          mit konkreten Architekturentscheidungen.
        </p>
      </section>

      <section className="domain-band" aria-label="Domänenübersicht">
        <DomainSummary
          index="01"
          domain="Denken"
          title="Denken"
          description="Cognitive und Reasoning Patterns für einzelne Agents."
          icon={<Brain aria-hidden="true" />}
        />
        <DomainSummary
          index="02"
          domain="Ablauf"
          title="Ablauf"
          description="Workflow und Control Flow zwischen LLM-Aufrufen."
          icon={<Workflow aria-hidden="true" />}
        />
        <DomainSummary
          index="03"
          domain="Zusammenarbeit"
          title="Zusammenarbeit"
          description="Koordination, Handoff und Kommunikation mehrerer Agents."
          icon={<Users aria-hidden="true" />}
        />
        <DomainSummary
          index="04"
          domain="Systembetrieb"
          title="Systembetrieb"
          description="Memory, Tool Integration, Runtime, Governance und Evaluation."
          icon={<Server aria-hidden="true" />}
        />
      </section>

      <section id="landscape" className="section media-section" aria-labelledby="landscape-title">
        <div className="section-heading">
          <SectionKicker>Infografik</SectionKicker>
          <h2 id="landscape-title">Die Landscape als visuelle Landkarte.</h2>
          <p>Die Infografik verdichtet die Pattern-Domänen und macht Beziehungen schneller scanbar.</p>
        </div>
        <figure className="infographic">
          <div className="infographic-frame">
            <Image
              src="/ai-agen-pattern-landscape.png"
              alt="Infografik AI Agent Pattern Landscape mit Ebenen für Agent Intelligence, Orchestration und Production Architecture"
              width={2800}
              height={1600}
              priority
            />
          </div>
          <figcaption>
            Quelle: <a href="/docs/ai-agent-pattern-landscape.md">docs/ai-agent-pattern-landscape.md</a>
            <span> · </span>
            Slides: <a href="/presentation/index.html">presentation/index.html</a>
            <span> · </span>
            Code: <a href="/code/README.md">code/README.md</a>
          </figcaption>
        </figure>
      </section>

      <PatternExplorer />
      <DecisionGuide />

      <section id="demos" className="section demos" aria-labelledby="demos-title">
        <div className="section-heading">
          <SectionKicker>Code-Demos</SectionKicker>
          <h2 id="demos-title">Kleine Pattern-Skizzen für die Implementierung.</h2>
          <p>
            Die Python-Demos zeigen LangChain, LangGraph, LangSmith und Deep Agents als praktische
            Werkbank unter der Theorie.
          </p>
        </div>
        <p className="demo-link">
          Einstieg in die Implementierung: <a href="/code/README.md">code/README.md</a>
        </p>
        <pre className="code-panel"><code>{`cd code
pip install -r requirements.txt
pip install -e .
agent-patterns list
agent-patterns run deepagents "Research how handoffs should be documented."`}</code></pre>
      </section>

      <FrameworkTable />
    </main>
  );
}
