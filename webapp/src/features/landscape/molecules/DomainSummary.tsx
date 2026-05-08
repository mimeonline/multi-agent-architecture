import type { ReactNode } from "react";
import type { Domain } from "../types/pattern";

type DomainSummaryProps = {
  index: string;
  domain: Domain;
  title: string;
  description: string;
  icon: ReactNode;
};

const DOMAIN_VARS: Record<Domain, { color: string; soft: string }> = {
  Denken: { color: "var(--denken)", soft: "var(--denken-soft)" },
  Ablauf: { color: "var(--ablauf)", soft: "var(--ablauf-soft)" },
  Zusammenarbeit: { color: "var(--zusammen)", soft: "var(--zusammen-soft)" },
  Systembetrieb: { color: "var(--system)", soft: "var(--system-soft)" },
};

export function DomainSummary({ index, domain, title, description, icon }: DomainSummaryProps) {
  const { color, soft } = DOMAIN_VARS[domain];
  return (
    <article
      className="domain-card"
      style={{ ["--card-color" as string]: color, ["--card-soft" as string]: soft }}
    >
      <span className="domain-num">{index}</span>
      <span className="domain-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
