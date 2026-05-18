import { PatternsTemplate } from "@/features/atlas/templates/PatternsTemplate";
import {
  getHighlightedSnippets,
  highlightShell,
} from "@/features/landscape/lib/highlightPatterns";

const RUN_SNIPPET = `cd code
pip install -r requirements.txt
pip install -e .
agent-patterns list
agent-patterns run react "Find 12 * 7 and summarize the tool result."`;

export default async function PatternsPage() {
  const [patterns, shell] = await Promise.all([
    getHighlightedSnippets(),
    highlightShell(RUN_SNIPPET),
  ]);
  return (
    <PatternsTemplate
      highlightedPatterns={patterns}
      highlightedShell={shell}
      runSnippet={RUN_SNIPPET}
    />
  );
}
