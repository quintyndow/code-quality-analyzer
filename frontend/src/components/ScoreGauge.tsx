import { motion } from "framer-motion";

interface Props {
  score: number;
}

function scoreColor(score: number) {
  if (score >= 80) return "#3FB950";
  if (score >= 60) return "#D29922";
  return "#F85149";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Fair";
  return "Needs Work";
}

export default function ScoreGauge({ score }: Props) {
  const color = scoreColor(score);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-xl p-6 border"
      style={{ background: "#161B22", borderColor: "#30363D" }}
    >
      <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "#8B949E" }}>
        Overall Score
      </p>
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#30363D"
            strokeWidth="10"
          />
          <motion.circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color: "#E6EDF3" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {score}
          </motion.span>
          <span className="text-xs" style={{ color: "#8B949E" }}>/100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium" style={{ color }}>
        {scoreLabel(score)}
      </p>
    </motion.div>
  );
}
