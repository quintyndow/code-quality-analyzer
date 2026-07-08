export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "#30363D", background: "#0D1117" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
            style={{ background: "#58A6FF22", color: "#58A6FF" }}
          >
            CQ
          </div>
          <span className="text-sm" style={{ color: "#8B949E" }}>
            CodeQuality Analyzer
          </span>
        </div>
        <p className="text-xs" style={{ color: "#8B949E" }}>
          Analyze Python code quality — complexity, maintainability, duplication.
        </p>
      </div>
    </footer>
  );
}
