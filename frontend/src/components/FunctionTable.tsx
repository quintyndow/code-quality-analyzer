import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FunctionResult } from "../types";

interface Props {
  functions: FunctionResult[];
}

type Filter = "all" | "long" | "duplicate" | "complex";

function ComplexityBadge({ value }: { value: number }) {
  const color = value <= 3 ? "var(--success)" : value <= 6 ? "var(--warning)" : "var(--danger)";
  const label = value <= 3 ? "Low" : value <= 6 ? "Medium" : "High";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
    >
      {value} · {label}
    </span>
  );
}

function MaintainabilityBar({ value }: { value: number }) {
  const color = value >= 70 ? "var(--success)" : value >= 40 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>{value}</span>
    </div>
  );
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "complex",   label: "High Complexity" },
  { id: "long",      label: "Long" },
  { id: "duplicate", label: "Duplicates" },
];

export default function FunctionTable({ functions }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = functions.filter((f) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "long" && f.is_long) ||
      (filter === "duplicate" && f.is_duplicate) ||
      (filter === "complex" && f.complexity > 5);
    const q = search.toLowerCase();
    const matchesSearch = !q || f.function.toLowerCase().includes(q) || f.file.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const toggle = (key: string) => setExpanded((p) => (p === key ? null : key));

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search functions or files…"
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-body)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === f.id ? "var(--primary-muted)" : "var(--surface)",
                border: `1px solid ${filter === f.id ? "var(--primary-dim)" : "var(--border)"}`,
                color: filter === f.id ? "var(--primary)" : "var(--text-muted)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
        {/* Header */}
        <div
          className="hidden sm:grid px-4 py-3 text-xs font-semibold uppercase tracking-widest"
          style={{
            gridTemplateColumns: "2fr 1fr 1fr 80px 60px 60px",
            background: "var(--surface)",
            color: "var(--text-muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>Function</div>
          <div>Complexity</div>
          <div>Maintainability</div>
          <div>Lines</div>
          <div>Long</div>
          <div>Dupe</div>
        </div>

        {filtered.length === 0 ? (
          <div
            className="px-4 py-10 text-center text-sm"
            style={{ color: "var(--text-muted)", background: "var(--bg)" }}
          >
            No functions match the current filter.
          </div>
        ) : (
          filtered.map((fn, i) => {
            const key = `${fn.file}::${fn.function}`;
            const isOpen = expanded === key;
            return (
              <div
                key={key}
                style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid var(--border)` : undefined,
                }}
              >
                <button
                  onClick={() => toggle(key)}
                  className="w-full text-left transition-colors hover:bg-white/5 focus-visible:outline-none"
                  style={{ background: "var(--bg)" }}
                >
                  <div className="px-4 py-3 flex flex-col sm:grid gap-2 sm:gap-0" style={{ gridTemplateColumns: "2fr 1fr 1fr 80px 60px 60px" }}>
                    <div>
                      <p className="text-sm font-mono font-medium" style={{ color: "var(--primary)" }}>
                        {fn.function}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{fn.file}</p>
                    </div>
                    <div className="flex items-center">
                      <ComplexityBadge value={fn.complexity} />
                    </div>
                    <div className="flex items-center">
                      <MaintainabilityBar value={fn.maintainability} />
                    </div>
                    <div className="flex items-center text-sm" style={{ color: "var(--text-body)" }}>
                      {fn.line_count || <span style={{ color: "var(--border)" }}>—</span>}
                    </div>
                    <div className="flex items-center">
                      {fn.is_long
                        ? <span className="w-2 h-2 rounded-full" style={{ background: "var(--warning)" }} />
                        : <span className="text-xs" style={{ color: "var(--border)" }}>—</span>}
                    </div>
                    <div className="flex items-center">
                      {fn.is_duplicate
                        ? <span className="w-2 h-2 rounded-full" style={{ background: "var(--danger)" }} />
                        : <span className="text-xs" style={{ color: "var(--border)" }}>—</span>}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 py-5 border-t"
                        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-4">
                          <Detail label="File"               value={fn.file}              mono />
                          <Detail label="Function"           value={fn.function}          mono />
                          <Detail label="Complexity"         value={fn.complexity} />
                          <Detail label="Maintainability"    value={fn.maintainability} />
                          <Detail label="Line Count"         value={fn.line_count || "N/A"} />
                          <Detail label="Duplicate"          value={fn.is_duplicate ? "Yes" : "No"} />
                        </div>
                        {/* AI placeholder */}
                        <div
                          className="rounded-lg p-3 text-xs"
                          style={{ background: "var(--primary-muted)", border: "1px solid var(--primary-dim)", color: "var(--primary)" }}
                        >
                          <p className="font-semibold mb-1">Recommendation</p>
                          <p style={{ color: "var(--text-body)" }}>
                            {fn.complexity > 6
                              ? "⚠ High complexity — consider breaking this function into smaller, single-purpose units."
                              : fn.is_long
                              ? "⚠ Function exceeds 50 lines — extract logical sections into helper functions."
                              : fn.is_duplicate
                              ? "⚠ Duplicate logic detected — extract to a shared utility to eliminate redundancy."
                              : "✓ This function looks healthy. No immediate action required."}
                          </p>
                          <p className="mt-2 opacity-60">AI-powered suggestions · Coming soon</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs mt-2 text-right" style={{ color: "var(--text-muted)" }}>
        {filtered.length} of {functions.length} functions · Click a row to expand
      </p>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`} style={{ color: "var(--text-primary)" }}>
        {String(value)}
      </p>
    </div>
  );
}
