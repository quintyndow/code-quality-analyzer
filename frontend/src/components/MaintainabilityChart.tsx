import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { FunctionResult } from "../types";

interface Props {
  functions: FunctionResult[];
}

const LABELS = ["Excellent (≥70)", "Fair (40–69)", "Poor (<40)"];
const COLORS = ["#3FB950", "#D29922", "#F85149"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-sm border"
        style={{ background: "#161B22", borderColor: "#30363D", color: "#C9D1D9" }}
      >
        <p>{payload[0].name}: <span style={{ color: payload[0].payload.fill }}>{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default function MaintainabilityChart({ functions }: Props) {
  const excellent = functions.filter((f) => f.maintainability >= 70).length;
  const fair = functions.filter((f) => f.maintainability >= 40 && f.maintainability < 70).length;
  const poor = functions.filter((f) => f.maintainability < 40).length;

  const data = [
    { name: LABELS[0], value: excellent, fill: COLORS[0] },
    { name: LABELS[1], value: fair, fill: COLORS[1] },
    { name: LABELS[2], value: poor, fill: COLORS[2] },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm" style={{ color: "#8B949E" }}>
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "#8B949E", fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
