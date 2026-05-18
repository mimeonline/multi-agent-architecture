"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  text: string;
  label?: string;
};

export function CopyButton({ text, label = "Kopieren" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handle() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore — clipboard may be unavailable (e.g. insecure context)
    }
  }

  return (
    <button
      type="button"
      className={`copy-button${copied ? " is-copied" : ""}`}
      onClick={handle}
      aria-label={copied ? "Kopiert" : label}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      <span>{copied ? "Kopiert" : label}</span>
    </button>
  );
}
