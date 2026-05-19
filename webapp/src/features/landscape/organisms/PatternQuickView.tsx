"use client";

import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { allPatterns } from "../lib/patterns";
import type { Pattern } from "../types/pattern";
import { PatternDrawer } from "./PatternDrawer";

type PatternQuickViewContextValue = {
  openPattern: (name: string) => void;
};

const PatternQuickViewContext = createContext<PatternQuickViewContextValue | null>(null);

function findPattern(name: string): Pattern | undefined {
  return allPatterns.find((pattern) => pattern.name === name);
}

function patternHref(name: string): string {
  return `/patterns?p=${encodeURIComponent(name)}`;
}

export function PatternQuickViewProvider({ children }: { children: ReactNode }) {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const selectedPattern = selectedName ? findPattern(selectedName) : undefined;
  const openPattern = useCallback((name: string) => {
    if (findPattern(name)) setSelectedName(name);
  }, []);
  const closePattern = useCallback(() => setSelectedName(null), []);

  const value = useMemo(() => ({ openPattern }), [openPattern]);

  return (
    <PatternQuickViewContext.Provider value={value}>
      {children}
      <PatternDrawer
        pattern={selectedPattern ?? null}
        open={Boolean(selectedPattern)}
        onClose={closePattern}
        onJump={openPattern}
      />
    </PatternQuickViewContext.Provider>
  );
}

type PatternQuickViewLinkProps = {
  name: string;
  className?: string;
  children?: ReactNode;
};

export function PatternQuickViewLink({ name, className, children }: PatternQuickViewLinkProps) {
  const quickView = useContext(PatternQuickViewContext);
  const pattern = findPattern(name);

  if (!pattern) {
    return <span className={`${className ?? ""} is-unlinked`.trim()}>{children ?? name}</span>;
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!quickView) return;
    event.preventDefault();
    quickView.openPattern(name);
  }

  return (
    <a className={className} href={patternHref(name)} onClick={handleClick}>
      {children ?? name}
    </a>
  );
}
