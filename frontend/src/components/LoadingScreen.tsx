import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "Scanning Project...",
  "Parsing Files...",
  "Calculating Complexity...",
  "Calculating Maintainability...",
  "Detecting Duplicates...",
  "Generating Report...",
];

interface Props {
  onDone?: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          clearInterval(interval);
          setTimeout(() => onDone?.(), 400);
        }
        return Math.min(next, STEPS.length - 1);
      });
    }, 600);
    return () => clearInterval(interval);
  }, [onDone]);

  useEffect(() => {
    setProgress(Math.round((step / (STEPS.length - 1)) * 100));
  }, [step]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "#0D1117" }}
    >
      <div className="w-full max-w-sm px-6 text-center">
        {/* Spinner */}
        <motion.div
          className="w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center"
          style={{ background: "#161B22", border: "1px solid #30363D" }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Step label */}
        <div className="h-6 mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-medium"
              style={{ color: "#C9D1D9" }}
            >
              {STEPS[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "#30363D" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#58A6FF" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: i <= step ? "#58A6FF" : "#30363D" }}
              animate={{ scale: i === step ? 1.3 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
