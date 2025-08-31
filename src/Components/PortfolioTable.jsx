// src/components/TrailingReturnsTable.jsx

export default function TrailingReturnsTable({ equity }) {
  if (!equity || equity.length === 0) return null;

  const last = equity[equity.length - 1];
  const first = equity[0];

  // helper to calc % return over window (days)
  function calcReturn(days) {
    const end = equity[equity.length - 1];
    const startIdx = equity.length - days;
    if (startIdx < 0) return null;
    const start = equity[startIdx];
    return ((end.Cumulative / start.Cumulative - 1) * 100).toFixed(2);
  }

  // metrics
  const metrics = {
    YTD: calcReturn(252), // approx 1y
    "1D": calcReturn(1),
    "1W": calcReturn(5),
    "1M": calcReturn(21),
    "3M": calcReturn(63),
    "6M": calcReturn(126),
    "1Y": calcReturn(252),
    "3Y": calcReturn(756),
    SI: ((last.Cumulative / first.Cumulative - 1) * 100).toFixed(2),
  };

  // max drawdown
  let peak = -Infinity;
  let maxDD = 0;
  equity.forEach((pt) => {
    peak = Math.max(peak, pt.Cumulative);
    const dd = (pt.Cumulative - peak) / peak;
    maxDD = Math.min(maxDD, dd);
  });

  return (
    <div className="overflow-x-auto mb-6">
      <h3 className="text-lg font-semibold mb-2">Trailing Returns</h3>
      <table className="min-w-full border text-sm text-center">
        <thead>
          <tr className="bg-gray-100">
            {Object.keys(metrics).map((k) => (
              <th key={k} className="px-3 py-2 border">
                {k}
              </th>
            ))}
            <th className="px-3 py-2 border">MAXDD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.values(metrics).map((v, i) => (
              <td
                key={i}
                className={`px-3 py-2 border ${
                  v >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {v}%
              </td>
            ))}
            <td className="px-3 py-2 border text-red-600">
              {(maxDD * 100).toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
