import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UploadZone from "../components/UploadZone";
import LanguageSelector from "../components/LanguageSelector";
import LoadingScreen from "../components/LoadingScreen";
import { fetchLanguages, analyzeZip, analyzeGitHub } from "../api";
import type { Language, AnalysisResult } from "../types";

type Mode = "zip" | "github";

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("zip");
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [language, setLanguage] = useState("python");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLanguages()
      .then((d) => setLanguages(d.languages))
      .catch(() => {});
  }, []);

  const canSubmit =
    !analyzing &&
    ((mode === "zip" && !!file) ||
      (mode === "github" && githubUrl.trim().length > 8));

  const handleSubmit = () => {
    if (!canSubmit) return;
    setError(null);
    setAnalyzing(true);
  };

  const onLoadingDone = async () => {
    try {
      let result: AnalysisResult;
      if (mode === "zip" && file) {
        result = await analyzeZip(file, language);
      } else {
        result = await analyzeGitHub(githubUrl.trim(), language);
      }
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      navigate("/results");
    } catch (err: unknown) {
      setAnalyzing(false);
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    }
  };

  if (analyzing) return <LoadingScreen onDone={onLoadingDone} />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Analyze a Project
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Upload a ZIP archive of your project or link a public GitHub repository.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-md)" }}
        >
          {/* Mode tabs */}
          <div
            className="flex rounded-lg p-1 mb-6"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            {(["zip", "github"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  background: mode === m ? "var(--surface)" : "transparent",
                  border: mode === m ? "1px solid var(--border)" : "1px solid transparent",
                  color: mode === m ? "var(--text-primary)" : "var(--text-muted)",
                  boxShadow: mode === m ? "var(--shadow-sm)" : "none",
                }}
              >
                {m === "zip" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    Upload ZIP
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                    </svg>
                    GitHub URL
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {mode === "zip" ? (
                <motion.div
                  key="zip"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.18 }}
                >
                  <UploadZone onFile={setFile} disabled={analyzing} />
                </motion.div>
              ) : (
                <motion.div
                  key="github"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <label
                    className="block text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Repository URL
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                      </svg>
                    </span>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/owner/repository"
                      className="w-full pl-9 pr-4 py-3 rounded-lg text-sm font-mono outline-none transition-all"
                      style={{
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text-body)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    Must be a public repository on GitHub, GitLab, or Bitbucket.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language */}
          {languages.length > 0 && (
            <div className="mb-6">
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Language
              </label>
              <LanguageSelector
                languages={languages}
                selected={language}
                onSelect={setLanguage}
              />
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 mb-5 p-3.5 rounded-lg border text-sm"
                style={{
                  background: "var(--danger-muted)",
                  borderColor: "color-mix(in srgb, var(--danger) 30%, transparent)",
                  color: "var(--danger)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
            style={{
              background: canSubmit ? "var(--primary)" : "var(--border)",
              color: canSubmit ? "#0D1117" : "var(--text-muted)",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {canSubmit && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
            Run Analysis
          </button>
        </div>

        {/* Hint */}
        <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
          Analysis runs entirely on the server · Your code is never stored
        </p>
      </motion.div>
    </div>
  );
}
