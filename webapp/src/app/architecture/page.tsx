import { architectureItems } from "@/features/atlas/lib/atlas-content";
import { AtlasItemsTemplate } from "@/features/atlas/templates/AtlasItemsTemplate";

export default function ArchitecturePage() {
  return (
    <AtlasItemsTemplate
      kicker="Architecture"
      title="Von Agent-Verhalten zu Systemdesign."
      intro="Architecture Topics beschreiben Boundaries, State, Orchestration, Observability und Cost als produktionsrelevante Designkräfte."
      items={architectureItems}
    />
  );
}
