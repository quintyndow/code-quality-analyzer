import type { Language } from "../types";

interface Props {
  languages: Language[];
  selected: string;
  onSelect: (id: string) => void;
}

const ICONS: Record<string, string> = {
  python: "🐍",
  javascript: "JS",
  typescript: "TS",
  java: "☕",
  cpp: "C++",
  go: "Go",
  rust: "🦀",
};

export default function LanguageSelector({ languages, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => lang.available && onSelect(lang.id)}
          disabled={!lang.available}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: selected === lang.id ? "#58A6FF22" : "#161B22",
            border: `1px solid ${selected === lang.id ? "#58A6FF66" : "#30363D"}`,
            color: !lang.available ? "#30363D" : selected === lang.id ? "#58A6FF" : "#8B949E",
            cursor: lang.available ? "pointer" : "not-allowed",
          }}
        >
          <span className="text-xs font-mono">{ICONS[lang.id] ?? lang.id}</span>
          <span>{lang.name}</span>
          {!lang.available && (
            <span
              className="text-xs px-1 rounded"
              style={{ background: "#30363D", color: "#8B949E" }}
            >
              Soon
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
