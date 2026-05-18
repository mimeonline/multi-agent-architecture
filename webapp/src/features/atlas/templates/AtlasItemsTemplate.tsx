import { SectionKicker } from "@/components/atoms/SectionKicker";
import { AtlasItemList } from "../molecules/AtlasItemList";
import type { AtlasItem } from "../types/atlas";

type AtlasItemsTemplateProps = {
  kicker: string;
  title: string;
  intro: string;
  items: AtlasItem[];
};

export function AtlasItemsTemplate({ kicker, title, intro, items }: AtlasItemsTemplateProps) {
  return (
    <main id="top">
      <section className="page-hero" aria-labelledby="page-title">
        <SectionKicker>{kicker}</SectionKicker>
        <h1 id="page-title">{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="section atlas-section">
        <AtlasItemList items={items} />
      </section>
    </main>
  );
}
