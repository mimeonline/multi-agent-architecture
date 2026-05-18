import type { Metadata } from "next";
import { SiteHeader } from "@/components/organisms/SiteHeader";
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
    <html lang="de" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <SiteHeader />
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
