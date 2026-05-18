import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Systems Atlas",
  description: "Architecture-first Knowledge Platform für robuste AI-Systeme.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="AI Systems Atlas Start">
            <span className="brand-mark" aria-hidden="true">
              <img src="/atlas-logo.svg" alt="" width="32" height="32" />
            </span>
            <span>AI Systems Atlas</span>
          </Link>
          <nav className="top-nav" aria-label="Hauptnavigation">
            <Link href="/foundations">Foundations</Link>
            <Link href="/patterns">Patterns</Link>
            <Link href="/architecture">Architecture</Link>
            <Link href="/governance">Governance</Link>
            <Link href="/decision-guides">Decisions</Link>
            <Link href="/reference-architectures">References</Link>
            <Link href="/implementation-lab">Lab</Link>
            <Link href="/tooling-compatibility">Tooling</Link>
            <a href="https://github.com/mimeonline/multi-agent-architecture" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div className="footer-row">
            <span>AI Systems Atlas · Architecture-first Knowledge Platform</span>
            <span>
              Quellen:{" "}
              <a
                href="https://github.com/mimeonline/multi-agent-architecture/blob/main/docs/ai-agent-pattern-landscape.md"
                target="_blank"
                rel="noreferrer"
              >
                docs
              </a>
              <span> · </span>
              <a
                href="https://github.com/mimeonline/multi-agent-architecture/tree/main/code"
                target="_blank"
                rel="noreferrer"
              >
                code
              </a>
              <span> · </span>
              <a href="https://github.com/mimeonline/multi-agent-architecture" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
