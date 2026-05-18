import { architectureItems } from "@/features/atlas/lib/atlas-content";
import { AtlasItemsTemplate } from "@/features/atlas/templates/AtlasItemsTemplate";

export default function ArchitecturePage() {
  return (
    <AtlasItemsTemplate
      kicker="Architektur"
      title="Systementscheidungen für robuste AI-Anwendungen."
      intro="Diese Seite erklärt die Architekturthemen, die aus einzelnen AI-Funktionen ein betreibbares System machen: klare Grenzen, Zustand, Ablaufsteuerung, Beobachtbarkeit und Kostenkontrolle."
      overviewTitle="Fünf Architekturthemen, fünf zentrale Entscheidungen."
      overviewIntro="Springe direkt zu dem Thema, das für dein System gerade am wichtigsten ist."
      items={architectureItems}
    />
  );
}
