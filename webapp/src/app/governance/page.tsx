import { governanceItems } from "@/features/atlas/lib/atlas-content";
import { AtlasItemsTemplate } from "@/features/atlas/templates/AtlasItemsTemplate";

export default function GovernancePage() {
  return (
    <AtlasItemsTemplate
      kicker="Governance"
      title="Risiken, Kontrollen und Nachweise sauber trennen."
      intro="Governance ist der Control Layer für AI Security, Datenschutz, Regulation, Auditability und Human Oversight."
      items={governanceItems}
    />
  );
}
