type DomainBadgeProps = {
  children: React.ReactNode;
};

export function DomainBadge({ children }: DomainBadgeProps) {
  return <span className="domain-badge">{children}</span>;
}

