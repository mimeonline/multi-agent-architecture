import { PatternsTemplate } from "@/features/atlas/templates/PatternsTemplate";
import { getHighlightedSnippets } from "@/features/landscape/lib/highlightPatterns";

export default async function PatternsPage() {
  const patterns = await getHighlightedSnippets();
  return <PatternsTemplate highlightedPatterns={patterns} />;
}
