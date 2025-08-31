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
  const formatYAxis = (tickItem) => Math.round(tickItem);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          syncId="portfolioSync" // Add a sync ID
          margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" hide /> {/* Hide the X-axis on the top chart */}
          <YAxis
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatYAxis}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Cumulative"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
