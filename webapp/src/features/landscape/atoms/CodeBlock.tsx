import type { CodeSnippet } from "../types/pattern";

type Props = {
  code: CodeSnippet;
};

export function CodeBlock({ code }: Props) {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-dots" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="code-framework">{code.framework}</span>
        <span className="code-lang">{code.language ?? "pseudo"}</span>
      </div>
      <pre><code>{code.snippet}</code></pre>
    </div>
  );
}
