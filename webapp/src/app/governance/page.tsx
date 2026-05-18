import { governanceItems } from "@/features/atlas/lib/atlas-content";
import { AtlasItemsTemplate } from "@/features/atlas/templates/AtlasItemsTemplate";

export default function GovernancePage() {
  return (
    <AtlasItemsTemplate
      kicker="Governance"
      title="Risiken, Kontrollen und Nachweise sauber trennen."
      intro="Diese Seite erklärt, wie AI-Systeme kontrollierbar bleiben: Sicherheit, Datenschutz, regulatorische Einordnung, Nachvollziehbarkeit und menschliche Kontrolle."
      overviewTitle="Fünf Governance-Themen, fünf Kontrollpunkte."
      overviewIntro="Springe direkt zu dem Risiko oder Kontrollpunkt, den du einordnen möchtest."
      items={governanceItems}
    />
  );
}
