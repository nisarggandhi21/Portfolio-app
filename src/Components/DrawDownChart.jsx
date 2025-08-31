// src/Components/DrawDownChart.jsx

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DrawDownChart({ data = [] }) {
  return (
    <div className="h-40 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" tick={{ fontSize: 12 }} />
          <YAxis domain={[-60, 0]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <defs>
            <linearGradient id="drawdownFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#fecaca" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="Drawdown"
            stroke="#ef4444"
            fill="url(#drawdownFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
