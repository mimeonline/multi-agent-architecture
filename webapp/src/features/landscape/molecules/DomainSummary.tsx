import { DomainBadge } from "@/components/atoms/DomainBadge";

type DomainSummaryProps = {
  index: string;
  title: string;
  description: string;
};

export function DomainSummary({ index, title, description }: DomainSummaryProps) {
  return (
    <article>
      <DomainBadge>{index}</DomainBadge>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

