import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STAGES = [
  { label: "Scanning files",              icon: "🔍" },
  { label: "Parsing AST",                 icon: "🌳" },
  { label: "Calculating Complexity",      icon: "📊" },
  { label: "Calculating Maintainability", icon: "⚙️"  },
  { label: "Finding Duplicate Code",      icon: "🔁" },
  { label: "Generating Report",           icon: "📄" },
];

interface Props {
  onDone?: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= STAGES.length) {
          clearInterval(interval);
          setTimeout(() => onDone?.(), 500);
          return prev;
        }
        setCompleted((c) => [...c, prev]);
        return next;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [onDone]);

  const progress = Math.round(((step) / (STAGES.length - 1)) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </motion.div>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Analyzing your project
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Running code quality checks…
          </p>
        </div>

        {/* Stages list */}
        <div
          className="rounded-xl border p-4 mb-6 space-y-1"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {STAGES.map((stage, i) => {
            const done = completed.includes(i);
            const active = i === step;
            return (
              <div
                key={stage.label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
                style={{
                  background: active ? "var(--primary-muted)" : "transparent",
                }}
              >
                {/* Status icon */}
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {done ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"/>
                    </motion.svg>
                  ) : active ? (
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "var(--primary)" }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  ) : (
                    <div className="w-3 h-3 rounded-full" style={{ background: "var(--border)" }} />
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-sm transition-all"
                  style={{
                    color: done ? "var(--text-muted)" : active ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {stage.label}
                </span>

                {/* Active spinner */}
                {active && (
                  <motion.div
                    className="ml-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--primary)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
