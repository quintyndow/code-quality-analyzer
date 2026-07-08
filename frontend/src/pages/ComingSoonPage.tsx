import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  title: string;
  desc: string;
}

export default function ComingSoonPage({ title, desc }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
          {desc}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all hover:opacity-80"
          style={{ borderColor: "var(--border)", color: "var(--text-body)", background: "var(--surface)" }}
        >
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
