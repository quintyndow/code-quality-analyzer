import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { FunctionResult } from "../types";

interface Props {
  functions: FunctionResult[];
}

const TIERS = [
  { label: "Excellent ≥70", min: 70, max: Infinity },
  { label: "Fair 40–69",    min: 40, max: 70 },
  { label: "Poor < 40",     min: -Infinity, max: 40 },
];

const COLORS = ["var(--success)", "var(--warning)", "var(--danger)"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-lg text-sm border"
      style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-md)", color: "var(--text-body)" }}
    >
      <span style={{ color: payload[0].payload.fill }}>{payload[0].name}</span>
      {": "}
      <strong style={{ color: "var(--text-primary)" }}>{payload[0].value}</strong>
    </div>
  );
};

export default function MaintainabilityChart({ functions }: Props) {
  const data = TIERS.map((tier, i) => ({
    name: tier.label,
    value: functions.filter((f) => f.maintainability >= tier.min && f.maintainability < tier.max).length,
    fill: COLORS[i],
  })).filter((d) => d.value > 0);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-muted)" }}>
        No data
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
          innerRadius={62}
          outerRadius={98}
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
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
