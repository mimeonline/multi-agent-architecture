import { SectionKicker } from "@/components/atoms/SectionKicker";
import { DecisionGuide } from "@/features/landscape/organisms/DecisionGuide";

export function DecisionGuidesTemplate() {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>Decision Guides</SectionKicker>
        <h1 id="page-title">Architekturentscheidungen statt Pattern-Raten.</h1>
        <p>
          Decision Guides übersetzen den Atlas in konkrete Auswahlfragen. Sie zeigen Optionen,
          Trade-offs und typische Kandidaten für robuste AI-Systeme.
        </p>
      </section>
      <DecisionGuide />
    </main>
  );
}
