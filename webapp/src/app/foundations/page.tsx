import { foundationItems } from "@/features/atlas/lib/atlas-content";
import { AtlasItemsTemplate } from "@/features/atlas/templates/AtlasItemsTemplate";

export default function FoundationsPage() {
  return (
    <AtlasItemsTemplate
      kicker="Foundations"
      title="Architecture Primitives statt Grundlagenkurs."
      intro="Foundations erklären, welche Systementscheidungen durch LLMs, Context, Tool Calling, Memory und Evaluation entstehen."
      items={foundationItems}
    />
  );
}
