import excelUrl from "@/assets/historical_nav.xlsx?url";
import DrawDownChart from "@/Components/DrawDownChart";
import EquityChart from "@/Components/EquityChart";
import PortfolioTable from "@/Components/PortfolioTable";
import { parseExcelUrl } from "@/utils/excelParser";
import { useEffect, useState } from "react";

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
  const [fullEquityData, setFullEquityData] = useState([]);
  const [filteredEquityData, setFilteredEquityData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  useEffect(() => {
    if (fullEquityData.length === 0 || !startDate || !endDate) return;

    const filtered = fullEquityData.filter(
      (item) => item.Date >= startDate && item.Date <= endDate
    );

    setFilteredEquityData(filtered);
  }, [startDate, endDate, fullEquityData]);

  function processRows(rows) {
    if (!rows?.length) return;

    const headers = Object.keys(rows[0]);
    const dateKey =
      headers.find((h) =>
        ["NAV Date", "Date", "date", "NAV_Date"].includes(h)
      ) || headers.find((h) => /date/i.test(h));
    const navKey =
      headers.find((h) =>
        ["NAV (Rs)", "NAV", "Nav", "NAV Value"].includes(h)
      ) || headers.find((h) => /nav/i.test(h));
    if (!dateKey || !navKey) return;
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
    let cumulative = 100;
    let maxSoFar = -Infinity;
    const processedData = parsed.map((p, i) => {
      if (i > 0) {
        const prevNav = parsed[i - 1].NAV;
        const ret = prevNav === 0 ? 0 : p.NAV / prevNav - 1;
        cumulative *= 1 + ret;
      }
      maxSoFar = Math.max(maxSoFar, cumulative);
      const drawdown = ((cumulative - maxSoFar) / maxSoFar) * 100;
      return {
        Date: p.Date,
        Cumulative: +cumulative.toFixed(2),
        Drawdown: +drawdown.toFixed(2),
      };
    });

    setFullEquityData(processedData);
    if (processedData.length > 0) {
      setStartDate(processedData[0].Date);
      setEndDate(processedData[processedData.length - 1].Date);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>

      {filteredEquityData.length > 0 ? (
        <PortfolioTable equity={filteredEquityData} />
      ) : (
        <div className="text-sm text-gray-500">
          Loading data or no data in selected range...
        </div>
      )}

      <div className="card mt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Equity curve</h4>
          <div className="flex items-center gap-2 text-sm">
            <span>From date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 bg-gray-50"
            />
            <span>To date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 bg-gray-50"
            />
          </div>
        </div>

        <EquityChart data={filteredEquityData} />
        <DrawDownChart data={filteredEquityData} />
      </div>
    </div>
  );
}
