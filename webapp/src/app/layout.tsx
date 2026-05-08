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
            <span className="brand-mark">AI</span>
            <span>Agent Pattern Landscape</span>
          </a>
          <nav className="top-nav" aria-label="Hauptnavigation">
            <a href="#landscape">Infografik</a>
            <a href="#lookup">Lookup</a>
            <a href="#decision">Decision</a>
            <a href="#demos">Code</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

