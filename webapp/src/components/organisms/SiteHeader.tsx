"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";

const NAV_ITEMS = [
  { href: "/foundations", label: "Foundations" },
  { href: "/patterns", label: "Patterns" },
  { href: "/architecture", label: "Architecture" },
  { href: "/governance", label: "Governance" },
  { href: "/decision-guides", label: "Decisions" },
  { href: "/reference-architectures", label: "References" },
  { href: "/implementation-lab", label: "Lab" },
  { href: "/tooling-compatibility", label: "Tooling" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <a className="skip-link" href="#top">
        Zum Inhalt
      </a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="AI Systems Atlas Start">
          <span className="brand-mark" aria-hidden="true">
            <img src="/atlas-logo.svg" alt="" width="32" height="32" />
          </span>
          <span>AI Systems Atlas</span>
        </Link>
        <nav className="top-nav" aria-label="Hauptnavigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className={pathname.startsWith(item.href) ? "is-active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-right">
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
