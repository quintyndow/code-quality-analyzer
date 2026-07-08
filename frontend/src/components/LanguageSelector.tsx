import type { Language } from "../types";

interface Props {
  languages: Language[];
  selected: string;
  onSelect: (id: string) => void;
}

const LANG_META: Record<string, { icon: string; label: string }> = {
  python:     { icon: "🐍", label: "Python" },
  javascript: { icon: "JS", label: "JavaScript" },
  typescript: { icon: "TS", label: "TypeScript" },
  java:       { icon: "☕", label: "Java" },
  cpp:        { icon: "C++", label: "C++" },
  go:         { icon: "Go", label: "Go" },
  rust:       { icon: "🦀", label: "Rust" },
};

export default function LanguageSelector({ languages, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => {
        const meta = LANG_META[lang.id] ?? { icon: lang.id, label: lang.name };
        const isSelected = selected === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => lang.available && onSelect(lang.id)}
            disabled={!lang.available}
            title={!lang.available ? `${lang.name} support coming soon` : undefined}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: isSelected ? "var(--primary-muted)" : "var(--surface)",
              border: `1px solid ${isSelected ? "var(--primary-dim)" : "var(--border)"}`,
              color: !lang.available ? "var(--text-muted)" : isSelected ? "var(--primary)" : "var(--text-body)",
              cursor: lang.available ? "pointer" : "not-allowed",
              opacity: !lang.available ? 0.6 : 1,
            }}
          >
            <span className="text-xs font-mono">{meta.icon}</span>
            <span>{meta.label}</span>
            {!lang.available && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: "var(--border)",
                  color: "var(--text-muted)",
                  fontSize: "10px",
                }}
              >
                Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
