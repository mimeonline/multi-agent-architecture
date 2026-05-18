"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Pattern } from "../types/pattern";
import { PatternDetail } from "../molecules/PatternDetail";

type Props = {
  pattern: Pattern | null;
  open: boolean;
  onClose: () => void;
  onJump?: (name: string) => void;
  query?: string;
};

export function PatternDrawer({ pattern, open, onClose, onJump, query }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`pattern-drawer-backdrop${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`pattern-drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={pattern ? `Pattern ${pattern.name}` : "Pattern-Details"}
        aria-hidden={!open}
      >
        <div className="pattern-drawer-bar">
          <button
            type="button"
            ref={closeRef}
            className="pattern-drawer-close"
            onClick={onClose}
            aria-label="Schließen"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="pattern-drawer-body">
          {pattern && <PatternDetail pattern={pattern} onJump={onJump} query={query} />}
        </div>
      </aside>
    </>
  );
}
