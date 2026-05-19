import { SectionKicker } from "@/components/atoms/SectionKicker";
import { DecisionGuide } from "@/features/landscape/organisms/DecisionGuide";
import { PatternQuickViewProvider } from "@/features/landscape/organisms/PatternQuickView";

export function DecisionGuidesTemplate() {
  return (
    <PatternQuickViewProvider>
      <main id="top">
        <section className="page-hero" aria-labelledby="page-title">
          <SectionKicker>Decision Guides</SectionKicker>
          <h1 id="page-title">Architekturentscheidungen statt Pattern-Raten.</h1>
          <p>
            Interaktive Leitfragen, die Atlas-Patterns in eine engere Auswahl übersetzen.
            Antworte mit Ja oder Nein – am Ende stehen verlinkte Kandidaten und der nächste Schritt.
          </p>
        </section>
        <DecisionGuide />
      </main>
    </PatternQuickViewProvider>
  );
}
