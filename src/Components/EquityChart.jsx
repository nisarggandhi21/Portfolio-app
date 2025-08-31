import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function EquityChart({ data = [] }) {
  return (
    <div className="card h-80">
      <h4 className="font-semibold mb-4">Equity curve</h4>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Cumulative"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
