"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { domains, allPatterns } from "../lib/patterns";
import { getAllFrameworks } from "../lib/patternStats";
import type { Complexity, Domain, Pattern } from "../types/pattern";
import { PatternCard } from "../molecules/PatternCard";
import { PatternDrawer } from "./PatternDrawer";
import { CompareTray } from "../molecules/CompareTray";
import { CompareView } from "./CompareView";
import { GlossarySheet } from "../atoms/Glossary";

type DomainFilter = Domain | "Alle";
const MAX_COMPARE = 3;
const COMPLEXITIES: Complexity[] = ["Einsteiger", "Fortgeschritten", "Production"];
const SUGGESTIONS = ["ReAct", "Routing", "LangGraph", "Handoff", "Critic", "Memory"];

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

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function PatternExplorer() {
  const [domain, setDomain] = useState<DomainFilter>("Alle");
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [complexities, setComplexities] = useState<Complexity[]>([]);
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [compareNames, setCompareNames] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [frameworkOpen, setFrameworkOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const allFrameworks = useMemo(() => getAllFrameworks(), []);

  // Hydrate from URL once
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("domain") as DomainFilter | null;
    if (d && (domains as string[]).includes(d)) setDomain(d);
    const fw = parseList(params.get("fw"));
    if (fw.length) setFrameworks(fw);
    const cx = parseList(params.get("cx")).filter((v): v is Complexity =>
      (COMPLEXITIES as string[]).includes(v),
    );
    if (cx.length) setComplexities(cx);
    const q = params.get("q");
    if (q) setQuery(q);
    const sel = params.get("p");
    if (sel && allPatterns.some((p) => p.name === sel)) {
      setSelectedName(sel);
      setDrawerOpen(true);
    }
    const cmp = parseList(params.get("compare")).filter((n) =>
      allPatterns.some((p) => p.name === n),
    );
    if (cmp.length) setCompareNames(cmp.slice(0, MAX_COMPARE));
    setHydrated(true);
  }, []);

  // Sync state to URL
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    if (domain !== "Alle") params.set("domain", domain);
    else params.delete("domain");
    if (frameworks.length) params.set("fw", frameworks.join(","));
    else params.delete("fw");
    if (complexities.length) params.set("cx", complexities.join(","));
    else params.delete("cx");
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (selectedName && drawerOpen) params.set("p", selectedName);
    else params.delete("p");
    if (compareNames.length) params.set("compare", compareNames.join(","));
    else params.delete("compare");
    const next = params.toString();
    const url = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [domain, frameworks, complexities, query, selectedName, drawerOpen, compareNames, hydrated]);

  const filtered = useMemo(() => {
    return allPatterns.filter((pattern) => {
      if (domain !== "Alle" && pattern.domain !== domain) return false;
      if (
        frameworks.length &&
        !frameworks.some((f) => pattern.frameworks.includes(f))
      )
        return false;
      if (complexities.length && !complexities.includes(pattern.complexity)) return false;
      if (query.trim() && !matchesQuery(pattern, query.trim())) return false;
      return true;
    });
  }, [domain, frameworks, complexities, query]);

  const explicit = selectedName ? allPatterns.find((p) => p.name === selectedName) : undefined;
  const current: Pattern = explicit ?? filtered[0] ?? allPatterns[0];

  const setSelected = useCallback((pattern: Pattern) => {
    setSelectedName(pattern.name);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const toggleCompare = useCallback((p: Pattern) => {
    setCompareNames((prev) => {
      if (prev.includes(p.name)) return prev.filter((n) => n !== p.name);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, p.name];
    });
  }, []);

  const removeCompare = useCallback((name: string) => {
    setCompareNames((prev) => prev.filter((n) => n !== name));
  }, []);

  function jumpTo(name: string) {
    const found = allPatterns.find((p) => p.name === name);
    if (!found) return;
    setDomain("Alle");
    setFrameworks([]);
    setComplexities([]);
    setQuery("");
    setSelectedName(found.name);
    setDrawerOpen(true);
    document.getElementById("lookup")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearAllFilters() {
    setDomain("Alle");
    setFrameworks([]);
    setComplexities([]);
    setQuery("");
  }

  function toggleFramework(name: string) {
    setFrameworks((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name],
    );
  }

  function toggleComplexity(c: Complexity) {
    setComplexities((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  // Keyboard shortcuts: j/k, c, /
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === "Escape" && target === searchRef.current) {
        (target as HTMLInputElement).blur();
        return;
      }
      if (isTyping) return;

      if (e.key === "j" || e.key === "k" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!filtered.length) return;
        const idx = filtered.findIndex((p) => p.name === current.name);
        const next =
          e.key === "j" || e.key === "ArrowDown"
            ? Math.min(filtered.length - 1, idx + 1)
            : Math.max(0, idx - 1);
        const target = filtered[next];
        if (target) {
          setSelectedName(target.name);
          const row = listRef.current?.querySelector<HTMLElement>(
            `[data-name="${CSS.escape(target.name)}"]`,
          );
          row?.scrollIntoView({ block: "nearest" });
        }
        e.preventDefault();
      } else if (e.key === "Enter" && !drawerOpen) {
        setDrawerOpen(true);
        e.preventDefault();
      } else if (e.key === "c") {
        toggleCompare(current);
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, current, toggleCompare, drawerOpen]);

  const compared = compareNames
    .map((n) => allPatterns.find((p) => p.name === n))
    .filter((p): p is Pattern => Boolean(p));

  const activeFilterCount =
    (domain !== "Alle" ? 1 : 0) +
    frameworks.length +
    complexities.length +
    (query.trim() ? 1 : 0);

  return (
    <section id="lookup" className="workspace" aria-labelledby="lookup-title">
      <div className="workspace-header">
        <div>
          <p className="section-kicker">Pattern-Lookup</p>
          <h2 id="lookup-title">Finde passende Bausteine nach Problem, Domäne oder Framework.</h2>
          <p className="lookup-hint" aria-hidden="true">
            <kbd>/</kbd> suchen · <kbd>j</kbd>/<kbd>k</kbd> navigieren · <kbd>Enter</kbd> öffnen · <kbd>c</kbd> vergleichen
          </p>
        </div>
        <label className="search-shell" aria-label="Suche">
          <Search aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            placeholder="z. B. Tool, LangGraph, Kosten, Handoff"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery("")}
              aria-label="Suche leeren"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </label>
      </div>

      <div className="filter-row" role="list" aria-label="Domänenfilter">
        {domains.map((d) => (
          <button
            className={`filter${domain === d ? " is-active" : ""}`}
            data-domain={d}
            key={d}
            type="button"
            onClick={() => setDomain(d)}
          >
            {d}
            <span style={{ opacity: 0.6, fontWeight: 600 }}>
              {d === "Alle"
                ? allPatterns.length
                : allPatterns.filter((p) => p.domain === d).length}
            </span>
          </button>
        ))}
      </div>

      <div className="filter-row secondary" aria-label="Weitere Filter">
        {COMPLEXITIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`filter-chip${complexities.includes(c) ? " is-active" : ""}`}
            onClick={() => toggleComplexity(c)}
            aria-pressed={complexities.includes(c)}
          >
            {c}
          </button>
        ))}
        <div className="framework-filter">
          <button
            type="button"
            className={`filter-chip framework-toggle${frameworks.length ? " is-active" : ""}`}
            onClick={() => setFrameworkOpen((v) => !v)}
            aria-expanded={frameworkOpen}
          >
            Frameworks
            {frameworks.length > 0 && <span className="count">{frameworks.length}</span>}
          </button>
          {frameworkOpen && (
            <div className="framework-popover" role="dialog" aria-label="Frameworks wählen">
              {allFrameworks.map((f) => (
                <label key={f} className={frameworks.includes(f) ? "is-on" : ""}>
                  <input
                    type="checkbox"
                    checked={frameworks.includes(f)}
                    onChange={() => toggleFramework(f)}
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button type="button" className="filter-reset" onClick={clearAllFilters}>
            Filter zurücksetzen ({activeFilterCount})
          </button>
        )}
        <span className="filter-result-count" aria-live="polite">
          {filtered.length} von {allPatterns.length}
        </span>
      </div>

      {filtered.length ? (
        <div className="pattern-grid" aria-label="Pattern-Liste" ref={listRef}>
          {filtered.map((pattern) => (
            <PatternCard
              key={pattern.name}
              pattern={pattern}
              selected={drawerOpen && pattern.name === current.name}
              compared={compareNames.includes(pattern.name)}
              onSelect={setSelected}
              onToggleCompare={toggleCompare}
              query={query}
            />
          ))}
        </div>
      ) : (
        <div className="empty pattern-grid-empty" role="status">
          <p>
            <strong>Kein Pattern passt zu deinen Filtern.</strong>
          </p>
          <p>Versuche es mit:</p>
          <div className="empty-suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setQuery(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" className="filter-reset" onClick={clearAllFilters}>
            Alle Filter zurücksetzen
          </button>
        </div>
      )}

      <PatternDrawer
        pattern={drawerOpen ? current : null}
        open={drawerOpen}
        onClose={closeDrawer}
        onJump={jumpTo}
        query={query}
      />

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
