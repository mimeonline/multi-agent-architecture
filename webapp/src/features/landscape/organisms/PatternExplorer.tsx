"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { domains, allPatterns } from "../lib/patterns";
import type { Domain, Pattern } from "../types/pattern";
import { PatternDetail } from "../molecules/PatternDetail";
import { PatternListItem } from "../molecules/PatternListItem";
import { CompareTray } from "../molecules/CompareTray";
import { CompareView } from "./CompareView";
import { GlossarySheet } from "../atoms/Glossary";

type Filter = Domain | "Alle";
const MAX_COMPARE = 3;

function matchesQuery(pattern: Pattern, query: string) {
  const haystack = [
    pattern.name,
    pattern.domain,
    pattern.subdomain,
    pattern.idea,
    pattern.tradeoff,
    pattern.scenario,
    ...pattern.aliases,
    ...pattern.useWhen,
    ...pattern.avoidWhen,
    ...pattern.frameworks,
    ...pattern.traits,
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
  const [compareNames, setCompareNames] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    return allPatterns.filter((pattern) => {
      const domainMatch = filter === "Alle" || pattern.domain === filter;
      return domainMatch && (!query.trim() || matchesQuery(pattern, query.trim()));
    });
  }, [filter, query]);

  const current = filtered.includes(selected) ? selected : filtered[0] ?? allPatterns[0];

  function toggleCompare(p: Pattern) {
    setCompareNames((prev) => {
      if (prev.includes(p.name)) return prev.filter((n) => n !== p.name);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, p.name];
    });
  }

  function removeCompare(name: string) {
    setCompareNames((prev) => prev.filter((n) => n !== name));
  }

  function jumpTo(name: string) {
    const found = allPatterns.find((p) => p.name === name);
    if (found) {
      setFilter("Alle");
      setQuery("");
      setSelected(found);
      const root = document.getElementById("lookup");
      root?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const compared = compareNames
    .map((n) => allPatterns.find((p) => p.name === n))
    .filter((p): p is Pattern => Boolean(p));

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
                compared={compareNames.includes(pattern.name)}
                onSelect={setSelected}
                onToggleCompare={toggleCompare}
              />
            ))
          ) : (
            <p className="empty">Kein Pattern gefunden. Suchbegriff etwas breiter wählen.</p>
          )}
        </div>
        <PatternDetail pattern={current} onJump={jumpTo} />
      </div>

      <GlossarySheet />

      <CompareTray
        patterns={compared}
        onOpen={() => setCompareOpen(true)}
        onClear={() => setCompareNames([])}
        onRemove={removeCompare}
        max={MAX_COMPARE}
      />

      <CompareView
        patterns={compared}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onRemove={removeCompare}
      />
    </section>
  );
}
