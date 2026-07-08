import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { FunctionResult } from "../types";

interface Props {
  functions: FunctionResult[];
}

function barColor(complexity: number) {
  if (complexity <= 3) return "#3FB950";
  if (complexity <= 6) return "#D29922";
  return "#F85149";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-sm border"
        style={{ background: "#161B22", borderColor: "#30363D", color: "#C9D1D9" }}
      >
        <p className="font-mono text-xs mb-1" style={{ color: "#8B949E" }}>{label}</p>
        <p>Complexity: <span style={{ color: barColor(payload[0].value) }}>{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default function ComplexityChart({ functions }: Props) {
  const data = [...functions]
    .sort((a, b) => b.complexity - a.complexity)
    .slice(0, 15)
    .map((f) => ({ name: f.function, complexity: f.complexity }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 40, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#8B949E", fontSize: 11, fontFamily: "JetBrains Mono" }}
          angle={-35}
          textAnchor="end"
          interval={0}
          stroke="#30363D"
        />
        <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} stroke="#30363D" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#58A6FF11" }} />
        <Bar dataKey="complexity" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={barColor(entry.complexity)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
