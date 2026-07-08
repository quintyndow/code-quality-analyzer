import type { AnalysisResult, Language } from "./types";

const BASE = "/api";

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${BASE}/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}

export async function fetchLanguages(): Promise<{ languages: Language[] }> {
  const res = await fetch(`${BASE}/languages`);
  if (!res.ok) throw new Error("Failed to fetch languages");
  return res.json();
}

export async function analyzeZip(
  file: File,
  language: string
): Promise<AnalysisResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("language", language);

  const res = await fetch(`${BASE}/analyze`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail ?? "Analysis failed");
  }
  return res.json();
}

export async function analyzeGitHub(
  url: string,
  language: string
): Promise<AnalysisResult> {
  const form = new FormData();
  form.append("github_url", url);
  form.append("language", language);

  const res = await fetch(`${BASE}/analyze`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail ?? "Analysis failed");
  }
  return res.json();
}
