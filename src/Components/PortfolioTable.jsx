import React from "react";
export default function PortfolioTable({ equity }) {
  if (!equity || equity.length === 0) return null;

  const last = equity[equity.length - 1];
  const first = equity[0];

  const calcReturn = (days) => {
    const startIdx = Math.max(0, equity.length - days);
    const start = equity[startIdx];
    if (!start || !last) return "N/A";
    return ((last.Cumulative / start.Cumulative - 1) * 100).toFixed(1);
  };

  let peak = -Infinity;
  let maxDD = 0;
  equity.forEach((pt) => {
    peak = Math.max(peak, pt.Cumulative);
    const dd = (pt.Cumulative - peak) / peak;
    maxDD = Math.min(maxDD, dd);
  });

  const metrics = {
    YTD: calcReturn(252),
    "1D": calcReturn(1),
    "1W": calcReturn(5),
    "1M": calcReturn(21),
    "3M": calcReturn(63),
    "6M": calcReturn(126),
    "1Y": calcReturn(252),
    SI: ((last.Cumulative / first.Cumulative - 1) * 100).toFixed(1),
    DD: last.Drawdown.toFixed(1),
    MAXDD: (maxDD * 100).toFixed(1),
  };

  const headers = ["NAME", ...Object.keys(metrics)];

  const formatCell = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return <td className="px-3 py-2 border">{value}</td>;

    const colorClass = num >= 0 ? "text-green-600" : "text-red-600";
    return (
      <td className={`px-3 py-2 border font-medium ${colorClass}`}>{value}%</td>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-2">Trailing Returns</h3>
      <table className="min-w-full border text-sm text-center">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((k) => (
              <th
                key={k}
                className="px-3 py-2 border font-medium text-gray-600"
              >
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-3 py-2 border text-left font-semibold">
              QUANT ACTIVE
            </td>
            {Object.values(metrics).map((value, i) => (
              <React.Fragment key={i}>{formatCell(value)}</React.Fragment>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
