"use client";

import { createContext, useContext } from "react";

type HighlightContextValue = {
  patterns: Record<string, string>;
  shellSnippet?: string;
};

const HighlightContext = createContext<HighlightContextValue>({ patterns: {} });

export function HighlightProvider({
  value,
  children,
}: {
  value: HighlightContextValue;
  children: React.ReactNode;
}) {
  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>;
}

export function usePatternHighlight(name: string): string | undefined {
  return useContext(HighlightContext).patterns[name];
}

export function useShellHighlight(): string | undefined {
  return useContext(HighlightContext).shellSnippet;
}
