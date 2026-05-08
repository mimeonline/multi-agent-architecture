"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { domains, allPatterns } from "../lib/patterns";
import type { Domain, Pattern } from "../types/pattern";
import { PatternDetail } from "../molecules/PatternDetail";
import { PatternListItem } from "../molecules/PatternListItem";

type Filter = Domain | "Alle";

function matchesQuery(pattern: Pattern, query: string) {
  const haystack = [
    pattern.name,
    pattern.domain,
    pattern.subdomain,
    pattern.idea,
    pattern.tradeoff,
    ...pattern.aliases,
    ...pattern.useWhen,
    ...pattern.avoidWhen,
    ...pattern.frameworks,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export function PatternExplorer() {
  const [filter, setFilter] = useState<Filter>("Alle");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pattern>(allPatterns[0]);

  const filtered = useMemo(() => {
    return allPatterns.filter((pattern) => {
      const domainMatch = filter === "Alle" || pattern.domain === filter;
      return domainMatch && (!query.trim() || matchesQuery(pattern, query.trim()));
    });
  }, [filter, query]);

  const current = filtered.includes(selected) ? selected : filtered[0] ?? allPatterns[0];

  return (
    <section id="lookup" className="workspace" aria-labelledby="lookup-title">
      <div className="workspace-header">
        <div>
          <p className="section-kicker">Pattern-Lookup</p>
          <h2 id="lookup-title">Finde passende Bausteine nach Problem, Domäne oder Framework.</h2>
        </div>
        <label className="search-shell" aria-label="Suche">
          <Search aria-hidden="true" />
          <input
            type="search"
            placeholder="z. B. Tool, LangGraph, Kosten, Handoff"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="filter-row" role="list" aria-label="Domänenfilter">
        {domains.map((domain) => (
          <button
            className={`filter${filter === domain ? " is-active" : ""}`}
            data-domain={domain}
            key={domain}
            type="button"
            onClick={() => setFilter(domain)}
          >
            {domain}
            <span style={{ opacity: 0.6, fontWeight: 600 }}>
              {domain === "Alle"
                ? allPatterns.length
                : allPatterns.filter((p) => p.domain === domain).length}
            </span>
          </button>
        ))}
      </div>

      <div className="lookup-layout">
        <div className="pattern-list" aria-label="Pattern-Liste">
          {filtered.length ? (
            filtered.map((pattern) => (
              <PatternListItem
                key={pattern.name}
                pattern={pattern}
                selected={pattern.name === current.name}
                onSelect={setSelected}
              />
            ))
          ) : (
            <p className="empty">Kein Pattern gefunden. Suchbegriff etwas breiter wählen.</p>
          )}
        </div>
        <PatternDetail pattern={current} />
      </div>
    </section>
  );
}
