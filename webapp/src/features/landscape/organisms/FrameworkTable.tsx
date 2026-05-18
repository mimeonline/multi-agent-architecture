import { ExternalLink } from "lucide-react";
import { frameworkRows } from "../lib/patterns";

export function FrameworkTable() {
  return (
    <section className="frameworks" aria-labelledby="frameworks-title">
      <div className="frameworks-heading">
        <div>
          <p className="section-kicker">Framework-Mapping</p>
          <h2 id="frameworks-title">Frameworks nach natürlicher Stärke.</h2>
        </div>
        <p>
          Welche Frameworks bringen welche Patterns nativ mit. Eine schnelle Orientierung
          zur Auswahl der passenden Werkbank – mit Sprung zur Originalquelle.
        </p>
      </div>
      <div className="framework-grid" role="list" aria-label="Framework-Mapping">
        {frameworkRows.map(({ framework, nativePatterns, strength, links }) => (
          <article className="framework-card" role="listitem" key={framework}>
            <span className="fw-name">{framework}</span>
            <span className="fw-patterns">{nativePatterns}</span>
            <span className="fw-strength">{strength}</span>
            {links.length > 0 && (
              <div className="fw-links">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-link"
                  >
                    {link.label} <ExternalLink size={11} aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
