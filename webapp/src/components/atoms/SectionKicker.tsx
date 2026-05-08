type SectionKickerProps = {
  children: React.ReactNode;
};

export function SectionKicker({ children }: SectionKickerProps) {
  return <p className="section-kicker">{children}</p>;
}

