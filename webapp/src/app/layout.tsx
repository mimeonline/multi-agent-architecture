import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agent Pattern Landscape",
  description: "Interaktive Lernwebapp zur AI Agent Pattern Landscape.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <header className="site-header">
          <a className="brand" href="#top" aria-label="AI Agent Pattern Landscape Start">
            <span className="brand-mark">A</span>
            <span>Agent Pattern Landscape</span>
          </a>
          <nav className="top-nav" aria-label="Hauptnavigation">
            <a href="#landscape">Infografik</a>
            <a href="#lookup">Lookup</a>
            <a href="#decision">Decision</a>
            <a href="#demos">Code</a>
            <a href="https://github.com/mimeonline/multi-agent-architecture" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div className="footer-row">
            <span>AI Agent Pattern Landscape · Lernreferenz</span>
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
