import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  index?: number;
}

export default function MetricCard({ title, value, subtitle, icon, color = "#58A6FF", index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-xl p-5 border"
      style={{ background: "#161B22", borderColor: "#30363D" }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8B949E" }}>
          {title}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18`, color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: "#E6EDF3" }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs" style={{ color: "#8B949E" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
