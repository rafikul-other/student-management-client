import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import { showToast } from "../../hooks/useToast";
import { BulkImportResult } from "../../types";

const StudentBulkImport: React.FC = () => {
  const [preview, setPreview] = useState<{ name: string; subject: string; email?: string }[]>([]);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const rows: { name: string; subject: string; email?: string }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        rows.push({ name: parts[0], subject: parts[1], email: parts[2] || "" });
      }
    }
    return rows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        showToast.error("No valid rows found. Ensure CSV has: name,subject[,email]");
        return;
      }
      setPreview(parsed);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setLoading(true);
    try {
      const res = await studentApi.bulkRegister(preview);
      setResult(res.data.data);
      setPreview([]);
      showToast.success(`Imported ${res.data.data.successCount} students`);
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Bulk Import Students</h1>
        <p className="text-gray-500 mt-1">Upload a CSV file with columns: name, subject [, email]</p>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-2 border-dashed border-stroke rounded-lg p-8 text-center">
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90">
            Choose CSV File
          </button>
          <p className="mt-3 text-sm text-gray-500">or drag and drop a .csv file here</p>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6 border-b border-stroke dark:border-strokedark flex items-center justify-between">
            <h3 className="font-semibold text-black dark:text-white">Preview ({preview.length} students)</h3>
            <button onClick={() => setPreview([])} className="text-sm text-gray-500 hover:text-red-500">Clear</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark">
                  <th className="py-3 px-6 text-left text-sm font-semibold">#</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Name</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Subject</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((s, i) => (
                  <tr key={i} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-3 px-6 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-6 font-medium text-black dark:text-white">{s.name}</td>
                    <td className="py-3 px-6 text-gray-500">{s.subject}</td>
                    <td className="py-3 px-6 text-gray-500">{s.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 flex gap-4">
            <button onClick={handleImport} disabled={loading} className="flex-1 cursor-pointer rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Importing..." : `Import ${preview.length} Students`}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="font-semibold text-black dark:text-white mb-4">Import Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-2xl font-bold text-green-600">{result.successCount}</p>
              <p className="text-sm text-green-700">Imported</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-2xl font-bold text-red-600">{result.failedCount}</p>
              <p className="text-sm text-red-700">Failed</p>
            </div>
          </div>
          {result.failedRecords.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-500 mb-2">Failed Records:</p>
              {result.failedRecords.map((f, i) => (
                <div key={i} className="text-sm text-gray-500 py-1">{f.name} / {f.subject} — {f.reason}</div>
              ))}
            </div>
          )}
          <button onClick={() => { setResult(null); navigate("/admin/students"); }} className="mt-4 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentBulkImport;