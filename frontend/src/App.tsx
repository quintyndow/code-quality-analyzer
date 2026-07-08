import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AnalyzePage from "./pages/AnalyzePage";
import ResultsPage from "./pages/ResultsPage";
import ComingSoonPage from "./pages/ComingSoonPage";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/docs" element={<ComingSoonPage title="Documentation" desc="Comprehensive guides, metric explanations, and API reference — coming soon." />} />
            <Route path="/about" element={<ComingSoonPage title="About" desc="Learn about the project, its architecture, and the team behind it — coming soon." />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
