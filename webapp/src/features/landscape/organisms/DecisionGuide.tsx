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
        <p>Beantworte die Leitfragen von oben nach unten. Die Empfehlungen bleiben pragmatisch.</p>
      </div>
      <div className="decision-grid">
        <ol className="decision-steps">
          {decisionSteps.map((item, index) => (
            <li key={item.question}>
              <button
                type="button"
                className={activeIndex === index ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
              >
                {item.question}
              </button>
            </li>
          ))}
        </ol>
        <div className="decision-detail">
          <p className="decision-count">Frage {activeIndex + 1} von {decisionSteps.length}</p>
          <h3>{step.question}</h3>
          <div className="answer-grid">
            <div><strong>Ja</strong><p>{step.yes}</p></div>
            <div><strong>Nein</strong><p>{step.no}</p></div>
          </div>
          <p className="recommendation-label">Typische Kandidaten</p>
          <div className="recommendations">
            {step.recommendation.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

