// src/pages/Portfolio.jsx
import excelUrl from "@/assets/historical_nav.xlsx?url";
import DrawDownChart from "@/components/DrawDownChart";
import EquityChart from "@/components/EquityChart";
import PortfolioTable from "@/components/PortfolioTable";
import { parseExcelUrl } from "@/utils/excelParser";
import { useEffect, useState } from "react";

// Helper: parse Excel dates
function parseExcelDate(value) {
  if (!value) return null;
  if (value instanceof Date) return !isNaN(value) ? value : null;
  if (typeof value === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + value * 86400000);
  }
  const d = new Date(value);
  return isNaN(d) ? null : d;
}

export default function Portfolio() {
  const [pivot, setPivot] = useState(null);
  const [equity, setEquity] = useState([]);
  const [drawdown, setDrawdown] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const rows = await parseExcelUrl(excelUrl);
        processRows(rows);
      } catch (err) {
        console.error("Failed to load excel:", err);
      }
    }
    load();
  }, []);

  function processRows(rows) {
    if (!rows?.length) return;

    const headers = Object.keys(rows[0]);

    // Detect Date and NAV columns
    const dateKey =
      headers.find((h) =>
        ["NAV Date", "Date", "date", "NAV_Date"].includes(h)
      ) || headers.find((h) => /date/i.test(h));

    const navKey =
      headers.find((h) =>
        ["NAV (Rs)", "NAV", "Nav", "NAV Value"].includes(h)
      ) || headers.find((h) => /nav/i.test(h));

    if (!dateKey || !navKey) {
      console.error("No Date/NAV columns found", headers);
      return;
    }

    // Parse & clean
    const parsed = rows
      .map((r) => {
        const d = parseExcelDate(r[dateKey]);
        const nav =
          r[navKey] == null ? null : +String(r[navKey]).replace(/,/g, "");
        return {
          DateObj: d,
          Date: d ? d.toISOString().slice(0, 10) : null,
          NAV: nav,
        };
      })
      .filter((r) => r.DateObj && Number.isFinite(r.NAV))
      .sort((a, b) => a.DateObj - b.DateObj);

    if (!parsed.length) return;

    // Equity curve (base 100)
    let cumulative = 100;
    const eq = parsed.map((p, i) => {
      if (i === 0) return { Date: p.Date, Cumulative: 100 };
      const ret = parsed[i - 1].NAV === 0 ? 0 : p.NAV / parsed[i - 1].NAV - 1;
      cumulative *= 1 + ret;
      return { Date: p.Date, Cumulative: +cumulative.toFixed(2) };
    });

    // Drawdown
    let maxSoFar = -Infinity;
    const dd = eq.map((pt) => {
      maxSoFar = Math.max(maxSoFar, pt.Cumulative);
      const drop = ((pt.Cumulative - maxSoFar) / maxSoFar) * 100;
      return { Date: pt.Date, Drawdown: +drop.toFixed(2) };
    });

    // Monthly returns pivot
    const monthlyMap = new Map();
    parsed.forEach((pt) => monthlyMap.set(pt.Date.slice(0, 7), pt));
    const monthlyRows = Array.from(monthlyMap.entries())
      .map(([ym, v]) => {
        const dt = new Date(ym + "-01");
        return {
          Year: dt.getFullYear(),
          Month: dt.toLocaleString("en-US", { month: "short" }),
          NAV: v.NAV,
          Date: ym + "-01",
        };
      })
      .sort((a, b) => new Date(a.Date) - new Date(b.Date));

    for (let i = 1; i < monthlyRows.length; i++) {
      monthlyRows[i].MonthlyReturn =
        (monthlyRows[i].NAV / monthlyRows[i - 1].NAV - 1) * 100;
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const pivotObj = {};
    months.forEach((m) => (pivotObj[m] = {}));
    monthlyRows.forEach((r) => {
      pivotObj[r.Month][r.Year] =
        r.MonthlyReturn == null ? null : +r.MonthlyReturn.toFixed(2);
    });

    setEquity(eq);
    setDrawdown(dd);
    setPivot(pivotObj);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>

      {pivot ? (
        <PortfolioTable pivot={pivot} />
      ) : (
        <div className="text-sm text-gray-500">Waiting for data...</div>
      )}

      {/* Only show final 2 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <EquityChart data={equity} />
        <DrawDownChart data={drawdown} />
      </div>
    </div>
  );
}
