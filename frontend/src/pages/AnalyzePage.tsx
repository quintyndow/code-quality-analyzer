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
      .then((data) => setLanguages(data.languages))
      .catch(() => {});
  }, []);

  const canSubmit =
    !analyzing &&
    ((mode === "zip" && !!file) || (mode === "github" && githubUrl.trim().length > 0));

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setAnalyzing(true);
  };

  // Called when loading animation completes
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
    } catch (err: any) {
      setAnalyzing(false);
      setError(err.message ?? "Analysis failed. Please try again.");
    }
  };

  if (analyzing) {
    return <LoadingScreen onDone={onLoadingDone} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#E6EDF3" }}>
          Analyze a Project
        </h1>
        <p className="text-sm mb-8" style={{ color: "#8B949E" }}>
          Upload a ZIP archive or link a public GitHub repository.
        </p>

        {/* Mode toggle */}
        <div
          className="flex rounded-lg p-1 mb-8"
          style={{ background: "#161B22", border: "1px solid #30363D" }}
        >
          {(["zip", "github"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                background: mode === m ? "#58A6FF22" : "transparent",
                border: mode === m ? "1px solid #58A6FF44" : "1px solid transparent",
                color: mode === m ? "#58A6FF" : "#8B949E",
              }}
            >
              {m === "zip" ? "📁 Upload ZIP" : "🔗 GitHub URL"}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {mode === "zip" ? (
              <motion.div
                key="zip"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <UploadZone onFile={setFile} disabled={analyzing} />
              </motion.div>
            ) : (
              <motion.div
                key="github"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium mb-2" style={{ color: "#C9D1D9" }}>
                  Repository URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                  style={{
                    background: "#161B22",
                    border: "1px solid #30363D",
                    color: "#C9D1D9",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#58A6FF")}
                  onBlur={(e) => (e.target.style.borderColor = "#30363D")}
                />
                <p className="text-xs mt-2" style={{ color: "#8B949E" }}>
                  Must be a public repository. The repo will be cloned on the server.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language selector */}
        {languages.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3" style={{ color: "#C9D1D9" }}>
              Programming Language
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 px-4 py-3 rounded-lg text-sm border"
              style={{
                background: "#F8514918",
                borderColor: "#F8514944",
                color: "#F85149",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: canSubmit ? "#58A6FF" : "#30363D",
            color: canSubmit ? "#0D1117" : "#8B949E",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          Run Analysis
        </button>
      </motion.div>
    </div>
  );
}
