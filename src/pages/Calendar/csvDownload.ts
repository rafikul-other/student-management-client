import { AttendanceRecord } from "../../types";

export const downloadCSV = (records: AttendanceRecord[], filename: string) => {
  if (!records || records.length === 0) return;

  const headers = ["Date", "Status"];
  const rows = records.map((r) => [r.date, r.present]);

  const csvContent =
    headers.join(",") +
    "\n" +
    rows.map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
