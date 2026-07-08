const DOCS = [
  { label: "Getting Started", href: "#" },
  { label: "API Reference", href: "#" },
  { label: "Metrics Guide", href: "#" },
  { label: "FAQ", href: "#" },
];

const PROJECT = [
  { label: "GitHub Repository", href: "https://github.com", external: true },
  { label: "Report an Issue", href: "https://github.com", external: true },
  { label: "MIT License", href: "#" },
  { label: "Changelog", href: "#" },
];

const ROADMAP = [
  "User Authentication",
  "Saved Report History",
  "GitHub OAuth Integration",
  "AI Code Suggestions",
  "Multi-language Support",
  "PDF Export",
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--primary-muted)", color: "var(--primary)", border: "1px solid var(--primary-dim)" }}
              >
                CQ
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                CodeQuality
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Analyze Python code quality instantly. Powered by Python's native AST engine.
            </p>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Documentation
            </h3>
            <ul className="space-y-2.5">
              {DOCS.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--text-body)" }}
                  >
                    {d.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Project
            </h3>
            <ul className="space-y-2.5">
              {PROJECT.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target={p.external ? "_blank" : undefined}
                    rel={p.external ? "noopener noreferrer" : undefined}
                    className="text-sm transition-colors hover:opacity-80 flex items-center gap-1"
                    style={{ color: "var(--text-body)" }}
                  >
                    {p.label}
                    {p.external && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Roadmap */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Coming Soon
            </h3>
            <ul className="space-y-2.5">
              {ROADMAP.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--border)" }} />
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} CodeQuality Analyzer. Released under the MIT License.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Built with Python AST · FastAPI · React · TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
