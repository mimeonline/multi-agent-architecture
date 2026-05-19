"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, RotateCcw, Share2, X } from "lucide-react";
import { decisionGuides } from "../lib/patterns";
import type { DecisionGuide as DecisionGuideDef } from "../types/pattern";
import { PatternQuickViewLink } from "./PatternQuickView";

type Answer = "yes" | "no";

function encodeAnswers(answers: Array<Answer | null>): string {
  return answers
    .map((a) => (a === "yes" ? "y" : a === "no" ? "n" : "-"))
    .join("");
}

function decodeAnswers(value: string | null, length: number): Array<Answer | null> {
  const base: Array<Answer | null> = Array(length).fill(null);
  if (!value) return base;
  for (let i = 0; i < Math.min(value.length, length); i++) {
    const ch = value[i];
    if (ch === "y") base[i] = "yes";
    else if (ch === "n") base[i] = "no";
  }
  return base;
}

export function DecisionGuide() {
  const [guideId, setGuideId] = useState<string>(decisionGuides[0].id);
  const guide: DecisionGuideDef =
    decisionGuides.find((g) => g.id === guideId) ?? decisionGuides[0];

  const [answers, setAnswers] = useState<Array<Answer | null>>(
    Array(guide.steps.length).fill(null),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  // Hydrate from URL once
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("guide");
    const target = decisionGuides.find((x) => x.id === g) ?? decisionGuides[0];
    setGuideId(target.id);
    const decoded = decodeAnswers(params.get("a"), target.steps.length);
    setAnswers(decoded);
    const firstUnanswered = decoded.findIndex((v) => v === null);
    setActiveIndex(firstUnanswered === -1 ? target.steps.length : firstUnanswered);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync to URL
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    params.set("guide", guide.id);
    const encoded = encodeAnswers(answers);
    if (encoded.replace(/-/g, "").length > 0) params.set("a", encoded);
    else params.delete("a");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? "?" + query : ""}${window.location.hash}`,
    );
  }, [answers, guide.id, hydrated]);

  const switchGuide = useCallback((id: string) => {
    const target = decisionGuides.find((g) => g.id === id);
    if (!target) return;
    setGuideId(id);
    setAnswers(Array(target.steps.length).fill(null));
    setActiveIndex(0);
    setShareNotice(null);
  }, []);

  const answer = useCallback(
    (value: Answer) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[activeIndex] = value;
        return next;
      });
      setActiveIndex((i) => Math.min(i + 1, guide.steps.length));
    },
    [activeIndex, guide.steps.length],
  );

  const reset = useCallback(() => {
    setAnswers(Array(guide.steps.length).fill(null));
    setActiveIndex(0);
    setShareNotice(null);
  }, [guide.steps.length]);

  const stepBack = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

  const isComplete = activeIndex >= guide.steps.length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const currentStep = isComplete ? null : guide.steps[activeIndex];

  // Aggregate recommendations the user has "collected" from answered steps.
  // Heuristic: if a step has a recommendation, count it as relevant when the
  // user answered "yes" (the typical "consider these patterns" cue).
  const collected = useMemo(() => {
    const map = new Map<string, { pattern: string; note: string; stepId: string; question: string }>();
    answers.forEach((ans, idx) => {
      if (ans !== "yes") return;
      const step = guide.steps[idx];
      step.recommendations.forEach((rec) => {
        if (!map.has(rec.pattern)) {
          map.set(rec.pattern, {
            pattern: rec.pattern,
            note: rec.note,
            stepId: step.id,
            question: step.question,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [answers, guide.steps]);

  const share = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareNotice("Link kopiert");
    } catch {
      setShareNotice(url);
    }
    setTimeout(() => setShareNotice(null), 2400);
  }, []);

  return (
    <section id="decision" className="section decision" aria-labelledby="decision-title">
      <div className="section-heading">
        <p className="section-kicker">Decision Guides</p>
        <h2 id="decision-title">{guide.title}</h2>
        <p>{guide.intro}</p>
      </div>

      {decisionGuides.length > 1 && (
        <div className="guide-switcher" role="tablist" aria-label="Decision Guide auswählen">
          {decisionGuides.map((g) => {
            const active = g.id === guide.id;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`guide-switch${active ? " is-active" : ""}`}
                onClick={() => switchGuide(g.id)}
              >
                <span className="guide-switch-kicker">{g.kicker}</span>
                <span className="guide-switch-title">{g.title}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="guide-framing">
        <div className="when-box when-fit">
          <p className="guide-framing-label"><Check size={14} aria-hidden /> Passend wenn</p>
          <p>{guide.whenToUse}</p>
        </div>
        {guide.whenNotToUse && (
          <div className="when-box when-misfit">
            <p className="guide-framing-label"><X size={14} aria-hidden /> Nicht für</p>
            <p>{guide.whenNotToUse}</p>
          </div>
        )}
      </div>

      <ol className="guide-stepper" aria-label="Fortschritt">
        {guide.steps.map((step, idx) => {
          const ans = answers[idx];
          const isCurrent = idx === activeIndex && !isComplete;
          const state = ans ?? (isCurrent ? "current" : "pending");
          return (
            <li key={step.id}>
              <button
                type="button"
                className={`stepper-dot is-${state}`}
                onClick={() => setActiveIndex(idx)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Schritt ${idx + 1}: ${step.question}${
                  ans ? ` – beantwortet mit ${ans === "yes" ? "Ja" : "Nein"}` : ""
                }`}
              >
                <span className="stepper-num">{String(idx + 1).padStart(2, "0")}</span>
                <span className="stepper-mark" aria-hidden>
                  {ans === "yes" ? "Ja" : ans === "no" ? "Nein" : isCurrent ? "•" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {currentStep ? (
        <div className="decision-detail" aria-live="polite">
          <p className="decision-count">
            Frage {activeIndex + 1} von {guide.steps.length}
          </p>
          <h3>{currentStep.question}</h3>

          <div className="answer-grid">
            <button
              type="button"
              className="answer-card yes is-interactive"
              onClick={() => answer("yes")}
            >
              <p className="answer-label">Ja</p>
              <p>{currentStep.yes}</p>
            </button>
            <button
              type="button"
              className="answer-card no is-interactive"
              onClick={() => answer("no")}
            >
              <p className="answer-label">Nein</p>
              <p>{currentStep.no}</p>
            </button>
          </div>

          <p className="recommendation-label">Typische Kandidaten bei „Ja“</p>
          <ul className="recommendations-rich">
            {currentStep.recommendations.map((rec) => (
              <li key={rec.pattern}>
                <PatternQuickViewLink className="rec-pattern" name={rec.pattern}>
                  {rec.pattern}
                </PatternQuickViewLink>
                <span className="rec-note">{rec.note}</span>
              </li>
            ))}
          </ul>

          <div className="decision-nav">
            <button
              type="button"
              className="decision-nav-btn"
              onClick={stepBack}
              disabled={activeIndex === 0}
            >
              <ArrowLeft size={14} aria-hidden /> Zurück
            </button>
            <button
              type="button"
              className="decision-nav-btn ghost"
              onClick={() => setActiveIndex((i) => Math.min(i + 1, guide.steps.length))}
            >
              Überspringen <ArrowRight size={14} aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <div className="decision-summary" aria-live="polite">
          <p className="decision-count">Ergebnis</p>
          <h3>Dein Pattern-Setup auf Basis von {answeredCount} Antworten.</h3>

          {collected.length === 0 ? (
            <p className="summary-empty">
              Keine „Ja“-Antworten, das deutet auf ein bewusst einfaches Setup. Direkter
              Modell-Call oder ein schlanker Prototyp ist hier oft das richtige.
            </p>
          ) : (
            <>
              <p className="recommendation-label">Engere Auswahl</p>
              <ul className="summary-list">
                {collected.map((rec) => (
                  <li key={rec.pattern}>
                    <div className="summary-pattern">
                      <PatternQuickViewLink name={rec.pattern}>{rec.pattern}</PatternQuickViewLink>
                      <span className="summary-trigger" title={rec.question}>
                        aus Frage {guide.steps.findIndex((s) => s.id === rec.stepId) + 1}
                      </span>
                    </div>
                    <p className="summary-note">{rec.note}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="summary-cta">
            <Link className="cta-link primary" href="/reference-architectures">
              Reference Architectures ansehen <ArrowRight size={14} aria-hidden />
            </Link>
            <Link className="cta-link" href="/implementation-lab">
              In Implementation Lab umsetzen
            </Link>
            <Link className="cta-link" href="/governance">
              Governance-Check für Production
            </Link>
          </div>

          <div className="decision-nav">
            <button type="button" className="decision-nav-btn" onClick={reset}>
              <RotateCcw size={14} aria-hidden /> Von vorn
            </button>
            <button type="button" className="decision-nav-btn" onClick={stepBack}>
              <ArrowLeft size={14} aria-hidden /> Letzte Frage
            </button>
            <button type="button" className="decision-nav-btn" onClick={share}>
              <Share2 size={14} aria-hidden /> {shareNotice ?? "Pfad teilen"}
            </button>
          </div>
        </div>
      )}

      {!isComplete && answeredCount > 0 && (
        <div className="decision-toolbar">
          <span className="toolbar-hint">
            <Info size={14} aria-hidden /> {answeredCount} von {guide.steps.length} beantwortet
          </span>
          <button type="button" className="decision-nav-btn ghost" onClick={reset}>
            <RotateCcw size={14} aria-hidden /> Reset
          </button>
          <button type="button" className="decision-nav-btn ghost" onClick={share}>
            <Share2 size={14} aria-hidden /> {shareNotice ?? "Pfad teilen"}
          </button>
        </div>
      )}
    </section>
  );
}
