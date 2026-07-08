import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MetricCard from "../components/MetricCard";
import ScoreGauge from "../components/ScoreGauge";
import ComplexityChart from "../components/ComplexityChart";
import MaintainabilityChart from "../components/MaintainabilityChart";
import FunctionTable from "../components/FunctionTable";
import type { AnalysisResult } from "../types";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [tab, setTab] = useState<"overview" | "functions" | "duplicates">("overview");

  useEffect(() => {
    const raw = sessionStorage.getItem("analysisResult");
    if (!raw) {
      navigate("/analyze");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      navigate("/analyze");
    }
  }, [navigate]);

  if (!data) return null;

  const { summary, functions, duplicates } = data;

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "functions", label: `Functions (${functions.length})` },
    { id: "duplicates", label: `Duplicates (${duplicates.length})` },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
            style={{ color: "#E6EDF3" }}
          >
            Analysis Results
          </motion.h1>
          <p className="text-sm mt-1" style={{ color: "#8B949E" }}>
            {summary.total_files} file{summary.total_files !== 1 ? "s" : ""} ·{" "}
            {summary.total_functions} function{summary.total_functions !== 1 ? "s" : ""} analyzed
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/analyze")}
            className="px-4 py-2 rounded-lg text-sm border transition-all hover:bg-white/5"
            style={{ borderColor: "#30363D", color: "#8B949E" }}
          >
            ← New Analysis
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-8 p-1 rounded-lg w-fit"
        style={{ background: "#161B22", border: "1px solid #30363D" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? "#58A6FF22" : "transparent",
              border: tab === t.id ? "1px solid #58A6FF44" : "1px solid transparent",
              color: tab === t.id ? "#58A6FF" : "#8B949E",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Score + Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ScoreGauge score={summary.overall_score} />

            <MetricCard
              index={1}
              title="Avg Complexity"
              value={summary.avg_complexity}
              subtitle={
                summary.avg_complexity <= 3
                  ? "Low — healthy"
                  : summary.avg_complexity <= 6
                  ? "Medium — watch it"
                  : "High — refactor soon"
              }
              color={summary.avg_complexity <= 3 ? "#3FB950" : summary.avg_complexity <= 6 ? "#D29922" : "#F85149"}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
            />

            <MetricCard
              index={2}
              title="Avg Maintainability"
              value={summary.avg_maintainability}
              subtitle={
                summary.avg_maintainability >= 70
                  ? "Excellent"
                  : summary.avg_maintainability >= 40
                  ? "Moderate"
                  : "Needs attention"
              }
              color={summary.avg_maintainability >= 70 ? "#3FB950" : summary.avg_maintainability >= 40 ? "#D29922" : "#F85149"}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />

            <div className="grid grid-rows-2 gap-4">
              <MetricCard
                index={3}
                title="Long Functions"
                value={summary.long_functions_count}
                color="#D29922"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 10h16M4 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                }
              />
              <MetricCard
                index={4}
                title="Duplicates"
                value={summary.duplicates_count}
                color="#F85149"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                }
              />
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border p-5"
              style={{ background: "#161B22", borderColor: "#30363D" }}
            >
              <h3 className="text-sm font-semibold mb-1" style={{ color: "#E6EDF3" }}>
                Complexity by Function
              </h3>
              <p className="text-xs mb-4" style={{ color: "#8B949E" }}>
                Top 15 · Green ≤3, Yellow ≤6, Red {">"} 6
              </p>
              <ComplexityChart functions={functions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border p-5"
              style={{ background: "#161B22", borderColor: "#30363D" }}
            >
              <h3 className="text-sm font-semibold mb-1" style={{ color: "#E6EDF3" }}>
                Maintainability Distribution
              </h3>
              <p className="text-xs mb-4" style={{ color: "#8B949E" }}>
                Functions grouped by maintainability tier
              </p>
              <MaintainabilityChart functions={functions} />
            </motion.div>
          </div>

          {/* Export buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border p-5"
            style={{ background: "#161B22", borderColor: "#30363D" }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#E6EDF3" }}>
              Export Report
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "code-quality-report.json";
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all hover:bg-white/5"
                style={{ borderColor: "#30363D", color: "#C9D1D9" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download JSON
              </button>
              <button
                onClick={() => {
                  const s = summary;
                  const rows = data.functions
                    .map(
                      (f) =>
                        `<tr><td>${f.file}</td><td>${f.function}</td><td>${f.complexity}</td><td>${f.maintainability}</td><td>${f.line_count || "—"}</td><td>${f.is_duplicate ? "Yes" : "No"}</td></tr>`
                    )
                    .join("");
                  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Code Quality Report</title><style>body{font-family:sans-serif;background:#0D1117;color:#c9d1d9;padding:2rem}h1{color:#58A6FF}table{border-collapse:collapse;width:100%}th,td{border:1px solid #30363D;padding:.5rem;text-align:left}th{background:#161B22}</style></head><body><h1>Code Quality Report</h1><h2>Summary</h2><ul><li>Overall Score: ${s.overall_score}/100</li><li>Files: ${s.total_files}</li><li>Functions: ${s.total_functions}</li><li>Avg Complexity: ${s.avg_complexity}</li><li>Avg Maintainability: ${s.avg_maintainability}</li><li>Long Functions: ${s.long_functions_count}</li><li>Duplicates: ${s.duplicates_count}</li></ul><h2>Functions</h2><table><tr><th>File</th><th>Function</th><th>Complexity</th><th>Maintainability</th><th>Lines</th><th>Duplicate</th></tr>${rows}</table></body></html>`;
                  const blob = new Blob([html], { type: "text/html" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "code-quality-report.html";
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all hover:bg-white/5"
                style={{ borderColor: "#30363D", color: "#C9D1D9" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download HTML
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Functions tab */}
      {tab === "functions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <FunctionTable functions={functions} />
        </motion.div>
      )}

      {/* Duplicates tab */}
      {tab === "duplicates" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {duplicates.length === 0 ? (
            <div
              className="rounded-xl border p-12 text-center"
              style={{ background: "#161B22", borderColor: "#30363D" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#3FB95018", color: "#3FB950" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <p className="font-semibold mb-1" style={{ color: "#E6EDF3" }}>No duplicates detected</p>
              <p className="text-sm" style={{ color: "#8B949E" }}>All functions have unique implementations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {duplicates.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border p-5"
                  style={{ background: "#161B22", borderColor: "#F8514944" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#F8514918", color: "#F85149" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-2" style={{ color: "#E6EDF3" }}>
                        Duplicate detected
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div
                          className="rounded-lg p-3"
                          style={{ background: "#0D1117", border: "1px solid #30363D" }}
                        >
                          <p className="mb-1" style={{ color: "#8B949E" }}>Original</p>
                          <p className="font-mono" style={{ color: "#58A6FF" }}>{d.original_function}</p>
                          <p className="mt-0.5" style={{ color: "#8B949E" }}>{d.original_file}</p>
                        </div>
                        <div
                          className="rounded-lg p-3"
                          style={{ background: "#0D1117", border: "1px solid #F8514944" }}
                        >
                          <p className="mb-1" style={{ color: "#8B949E" }}>Duplicate</p>
                          <p className="font-mono" style={{ color: "#F85149" }}>{d.duplicate_function}</p>
                          <p className="mt-0.5" style={{ color: "#8B949E" }}>{d.duplicate_file}</p>
                        </div>
                      </div>
                      <p className="text-xs mt-2" style={{ color: "#8B949E" }}>
                        💡 Extract to a shared utility function to eliminate duplication.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
