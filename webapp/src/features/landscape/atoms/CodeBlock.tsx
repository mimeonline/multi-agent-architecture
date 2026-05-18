"use client";

import type { CodeSnippet } from "../types/pattern";
import { CopyButton } from "@/features/atlas/atoms/CopyButton";
import { usePatternHighlight } from "../lib/highlightContext";

type Props = {
  code: CodeSnippet;
  patternName?: string;
};

export function CodeBlock({ code, patternName }: Props) {
  const html = usePatternHighlight(patternName ?? "");
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-dots" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="code-framework">{code.framework}</span>
        <span className="code-lang">{code.language ?? "pseudo"}</span>
        <CopyButton text={code.snippet} label="Code kopieren" />
      </div>
      {html ? (
        <div
          className="code-block-body shiki-wrap"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre><code>{code.snippet}</code></pre>
      )}
    </div>
  );
}
