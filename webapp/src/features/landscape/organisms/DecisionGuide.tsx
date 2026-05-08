"use client";

import { useState } from "react";
import { decisionSteps } from "../lib/patterns";

export function DecisionGuide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const step = decisionSteps[activeIndex];

  return (
    <section id="decision" className="section decision" aria-labelledby="decision-title">
      <div className="section-heading">
        <p className="section-kicker">Decision-Heuristik</p>
        <h2 id="decision-title">Vom Problem zum Pattern-Kandidaten.</h2>
        <p>
          Beantworte die Leitfragen in Reihenfolge. Die Empfehlungen bleiben pragmatisch — keine
          Festlegung, sondern eine Sammlung wahrscheinlicher Kandidaten.
        </p>
      </div>

      <div className="flowchart" role="list" aria-label="Entscheidungsfluss">
        {decisionSteps.map((item, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          return (
            <div className="flow-node-wrap" key={item.question}>
              <button
                type="button"
                className={`flow-node${isActive ? " is-active" : ""}${isPast ? " is-past" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
              >
                <span className="flow-step">
                  Schritt {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flow-question">{item.question}</span>
                <span className="flow-summary">
                  <span className="flow-yes">Ja → {item.yes.split(".")[0]}</span>
                  <span className="flow-no">Nein → {item.no.split(".")[0]}</span>
                </span>
              </button>
              {index < decisionSteps.length - 1 && (
                <div className="flow-connector" aria-hidden="true">
                  <span />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="decision-detail" aria-live="polite">
        <p className="decision-count">
          Frage {activeIndex + 1} von {decisionSteps.length}
        </p>
        <h3>{step.question}</h3>
        <div className="answer-grid">
          <div className="answer-card yes">
            <p className="answer-label">Ja</p>
            <p>{step.yes}</p>
          </div>
          <div className="answer-card no">
            <p className="answer-label">Nein</p>
            <p>{step.no}</p>
          </div>
        </div>
        <p className="recommendation-label">Typische Kandidaten</p>
        <div className="recommendations">
          {step.recommendation.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
