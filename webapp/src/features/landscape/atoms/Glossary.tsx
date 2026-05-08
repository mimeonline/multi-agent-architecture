"use client";

import { useState } from "react";
import { findGlossaryTerm, glossary } from "../lib/glossary";

type Props = {
  term: string;
  children?: React.ReactNode;
};

export function Glossary({ term, children }: Props) {
  const entry = findGlossaryTerm(term);
  if (!entry) return <>{children ?? term}</>;
  return (
    <span className="glossary-term" tabIndex={0}>
      <span className="glossary-text">{children ?? term}</span>
      <span className="glossary-tooltip" role="tooltip">
        <strong>{entry.term}</strong>
        {entry.full && <em>{entry.full}</em>}
        <span>{entry.definition}</span>
      </span>
    </span>
  );
}

export function GlossarySheet() {
  const [open, setOpen] = useState(false);
  const entries = Object.values(glossary).sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className={`glossary-sheet${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="glossary-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Glossar · {entries.length} Begriffe
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <dl className="glossary-list">
          {entries.map((entry) => (
            <div key={entry.term} className="glossary-list-item">
              <dt>
                {entry.term}
                {entry.full && <em>{entry.full}</em>}
              </dt>
              <dd>{entry.definition}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
