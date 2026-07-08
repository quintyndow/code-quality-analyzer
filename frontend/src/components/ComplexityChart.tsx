import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { FunctionResult } from "../types";

interface Props {
  functions: FunctionResult[];
}

function barColor(v: number) {
  if (v <= 3) return "var(--success)";
  if (v <= 6) return "var(--warning)";
  return "var(--danger)";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value as number;
  return (
    <div
      className="px-3 py-2.5 rounded-lg text-sm border"
      style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-md)", color: "var(--text-body)" }}
    >
      <p className="font-mono text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p>
        Complexity:{" "}
        <span style={{ color: barColor(v), fontWeight: 600 }}>{v}</span>
      </p>
    </div>
  );
};

export default function ComplexityChart({ functions }: Props) {
  const data = [...functions]
    .sort((a, b) => b.complexity - a.complexity)
    .slice(0, 15)
    .map((f) => ({ name: f.function, complexity: f.complexity }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 44, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
          angle={-38}
          textAnchor="end"
          interval={0}
          stroke="var(--border)"
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          stroke="var(--border)"
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--primary-muted)" }} />
        <Bar dataKey="complexity" radius={[4, 4, 0, 0]} maxBarSize={32}>
          {data.map((entry, i) => (
            <Cell key={i} fill={barColor(entry.complexity)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
