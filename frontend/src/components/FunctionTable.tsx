import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FunctionResult } from "../types";

interface Props {
  functions: FunctionResult[];
}

function ComplexityBadge({ value }: { value: number }) {
  const color = value <= 3 ? "#3FB950" : value <= 6 ? "#D29922" : "#F85149";
  const label = value <= 3 ? "Low" : value <= 6 ? "Medium" : "High";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: `${color}18`, color }}
    >
      {value} · {label}
    </span>
  );
}

function MaintainabilityBar({ value }: { value: number }) {
  const color = value >= 70 ? "#3FB950" : value >= 40 ? "#D29922" : "#F85149";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "#30363D" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs tabular-nums" style={{ color: "#8B949E" }}>{value}</span>
    </div>
  );
}

export default function FunctionTable({ functions }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "long" | "duplicate" | "complex">("all");
  const [search, setSearch] = useState("");

  const filtered = functions.filter((f) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "long" && f.is_long) ||
      (filter === "duplicate" && f.is_duplicate) ||
      (filter === "complex" && f.complexity > 5);
    const matchesSearch =
      search === "" ||
      f.function.toLowerCase().includes(search.toLowerCase()) ||
      f.file.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (key: string) => setExpanded((prev) => (prev === key ? null : key));

  const FILTERS = [
    { id: "all", label: "All" },
    { id: "long", label: "Long" },
    { id: "duplicate", label: "Duplicates" },
    { id: "complex", label: "High Complexity" },
  ] as const;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search functions..."
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "#161B22",
            border: "1px solid #30363D",
            color: "#C9D1D9",
          }}
        />
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === f.id ? "#58A6FF22" : "#161B22",
                border: `1px solid ${filter === f.id ? "#58A6FF66" : "#30363D"}`,
                color: filter === f.id ? "#58A6FF" : "#8B949E",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#30363D" }}>
        <div
          className="grid text-xs font-medium uppercase tracking-wider px-4 py-3"
          style={{
            gridTemplateColumns: "2fr 1fr 1fr 1fr 60px 60px",
            background: "#161B22",
            color: "#8B949E",
            borderBottom: "1px solid #30363D",
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
          <div className="px-4 py-8 text-center text-sm" style={{ color: "#8B949E", background: "#0D1117" }}>
            No functions match the current filter.
          </div>
        ) : (
          filtered.map((fn, i) => {
            const key = `${fn.file}-${fn.function}`;
            const isOpen = expanded === key;
            return (
              <div key={key} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #30363D" : undefined }}>
                <button
                  onClick={() => toggleExpand(key)}
                  className="w-full grid px-4 py-3 text-left transition-colors hover:bg-white/5"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 60px 60px", background: "#0D1117" }}
                >
                  <div>
                    <p className="text-sm font-mono font-medium" style={{ color: "#58A6FF" }}>
                      {fn.function}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#8B949E" }}>{fn.file}</p>
                  </div>
                  <div className="flex items-center">
                    <ComplexityBadge value={fn.complexity} />
                  </div>
                  <div className="flex items-center">
                    <MaintainabilityBar value={fn.maintainability} />
                  </div>
                  <div className="flex items-center text-sm" style={{ color: "#C9D1D9" }}>
                    {fn.line_count || "—"}
                  </div>
                  <div className="flex items-center">
                    {fn.is_long ? (
                      <span className="w-2 h-2 rounded-full" style={{ background: "#D29922" }} />
                    ) : (
                      <span className="text-xs" style={{ color: "#30363D" }}>—</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {fn.is_duplicate ? (
                      <span className="w-2 h-2 rounded-full" style={{ background: "#F85149" }} />
                    ) : (
                      <span className="text-xs" style={{ color: "#30363D" }}>—</span>
                    )}
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
                        className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border-t"
                        style={{ background: "#161B22", borderColor: "#30363D" }}
                      >
                        <Detail label="File" value={fn.file} mono />
                        <Detail label="Function" value={fn.function} mono />
                        <Detail label="Cyclomatic Complexity" value={fn.complexity} />
                        <Detail label="Maintainability Score" value={fn.maintainability} />
                        <Detail label="Line Count" value={fn.line_count || "N/A"} />
                        <Detail label="Duplicate" value={fn.is_duplicate ? "Yes" : "No"} />
                        <div className="col-span-2 sm:col-span-3">
                          <p className="text-xs mb-1" style={{ color: "#8B949E" }}>Recommendation</p>
                          <p className="text-xs" style={{ color: "#C9D1D9" }}>
                            {fn.complexity > 6
                              ? "⚠ High complexity — consider breaking this function into smaller units."
                              : fn.is_long
                              ? "⚠ Function exceeds 50 lines — refactor for readability."
                              : fn.is_duplicate
                              ? "⚠ Duplicate detected — extract to a shared utility function."
                              : "✓ This function looks healthy."}
                          </p>
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
      <p className="text-xs mt-2 text-right" style={{ color: "#8B949E" }}>
        Showing {filtered.length} of {functions.length} functions · Click a row to expand
      </p>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: "#8B949E" }}>{label}</p>
      <p
        className={`text-sm ${mono ? "font-mono" : "font-medium"}`}
        style={{ color: "#E6EDF3" }}
      >
        {String(value)}
      </p>
    </div>
  );
}
