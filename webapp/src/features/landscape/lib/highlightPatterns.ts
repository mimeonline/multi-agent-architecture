import "server-only";
import { createHighlighter, type Highlighter } from "shiki";
import { allPatterns } from "./patterns";

export type HighlightMap = Record<string, string>;

let cached: Promise<HighlightMap> | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const THEME_LIGHT = "github-light";
const THEME_DARK = "github-dark";
const LANGS = ["python", "typescript", "bash"] as const;

function resolveLang(language: string | undefined): "python" | "typescript" | "bash" {
  if (language === "python") return "python";
  if (language === "typescript") return "typescript";
  return "python";
}

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME_LIGHT, THEME_DARK],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

export async function getHighlightedSnippets(): Promise<HighlightMap> {
  if (cached) return cached;
  cached = (async () => {
    const hl = await getHighlighter();
    const out: HighlightMap = {};
    for (const pattern of allPatterns) {
      const lang = resolveLang(pattern.code.language);
      out[pattern.name] = hl.codeToHtml(pattern.code.snippet, {
        lang,
        themes: { light: THEME_LIGHT, dark: THEME_DARK },
        defaultColor: false,
      });
    }
    return out;
  })();
  return cached;
}

export async function highlightShell(snippet: string): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(snippet, {
    lang: "bash",
    themes: { light: THEME_LIGHT, dark: THEME_DARK },
    defaultColor: false,
  });
}
