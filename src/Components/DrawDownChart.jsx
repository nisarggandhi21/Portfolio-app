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
    <div className="card h-80">
      <h4 className="font-semibold mb-4">Drawdown</h4>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Drawdown"
            stroke="#dc2626"
            fill="#fecaca"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
