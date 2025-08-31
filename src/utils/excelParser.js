import * as XLSX from "xlsx";

function normalizeRowsWithHeaderDetection(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const isDateLike = (cell) => {
    if (cell == null) return false;
    const s = String(cell).trim();
    if (!s) return false;
    const d = new Date(s);
    if (!isNaN(d)) return true;
    if (/\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/.test(s)) return true;
    return false;
  };

  const containsPattern = (row, regex) =>
    row.some((c) => c != null && regex.test(String(c)));

  let headerIdx = rows.findIndex(
    (row) =>
      containsPattern(row, /date/i) &&
      containsPattern(row, /nav|close|value|price/i)
  );

  if (headerIdx === -1) {
    const dataRowIdx = rows.findIndex((row) => row.some((c) => isDateLike(c)));
    if (dataRowIdx > 0) headerIdx = dataRowIdx - 1;
  }

  if (headerIdx === -1) {
    headerIdx = rows.findIndex(
      (row) =>
        row.filter((c) => c != null && String(c).trim() !== "").length >= 2
    );
  }

  if (headerIdx === -1 || headerIdx >= rows.length - 1) return [];

  const headerRow = rows[headerIdx].map((h, i) => {
    const txt = h == null ? "" : String(h).trim();
    return txt || `Column_${i}`;
  });

  const dataRows = rows.slice(headerIdx + 1);
  const result = dataRows
    .map((r) => {
      const obj = {};
      for (let i = 0; i < headerRow.length; i++) {
        obj[headerRow[i]] =
          i < r.length ? (r[i] === undefined ? null : r[i]) : null;
      }
      return obj;
    })
    .filter((rowObj) =>
      Object.values(rowObj).some(
        (v) => v !== null && (typeof v !== "string" || v.trim() !== "")
      )
    );

  return result;
}

function parseWorkbookDataArray(dataArray) {
  const workbook = XLSX.read(dataArray, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rawRows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
  });
  const normalized = normalizeRowsWithHeaderDetection(rawRows);
  if (normalized.length > 0) return normalized;

  const fallback = XLSX.utils.sheet_to_json(worksheet, { defval: null });
  return fallback;
}

export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const arrayBuffer = evt.target.result;
        const data = new Uint8Array(arrayBuffer);
        const json = parseWorkbookDataArray(data);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export async function parseExcelUrl(excelUrl) {
  const res = await fetch(excelUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${excelUrl} - ${res.status}`);
  const buffer = await res.arrayBuffer();
  const data = new Uint8Array(buffer);
  return parseWorkbookDataArray(data);
}
