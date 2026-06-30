import React, { useEffect, useState } from "react";
import { messageApi, Message } from "../../api/messageApi";
import { showToast } from "../../hooks/useToast";

const escapeCsv = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const buildCsv = (rows: Array<Record<string, unknown>>, columns: string[]): string => {
  const header = columns.map(escapeCsv).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeCsv(row[col])).join(","))
    .join("\n");
  return `${header}\n${body}`;
};

const triggerDownload = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const SuperAdminView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [statusForm, setStatusForm] = useState({ status: "", resolution: "" });
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fetchMessages = () => {
    messageApi.getAll()
      .then((res) => setMessages(res.data.data || []))
      .catch(() => showToast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.subject.toLowerCase().includes(q) ||
      m.fromName.toLowerCase().includes(q) ||
      m.fromDepartment.toLowerCase().includes(q) ||
      m.toName.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedMessages = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleDownloadCsv = () => {
    if (paginatedMessages.length === 0) {
      showToast.error("No entries to export");
      return;
    }
    const startIndex = (safePage - 1) * pageSize;
    const csvColumns = [
      "#",
      "Date",
      "Subject",
      "From Manager",
      "Department",
      "To Admin",
      "Student",
      "Status",
      "Resolution",
    ];
    const rows = paginatedMessages.map((m, i) => ({
      "#": startIndex + i + 1,
      Date: m.createdAt ? new Date(m.createdAt).toISOString() : "",
      Subject: m.subject || "",
      "From Manager": m.fromName || "",
      Department: m.fromDepartment || "",
      "To Admin": m.toName || "",
      Student: m.studentName || "",
      Status: m.status || "",
      Resolution: m.resolution || "",
    }));
    const csv = buildCsv(rows, csvColumns);
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(csv, `support-log-${today}.csv`);
    showToast.success(
      `Exported ${paginatedMessages.length} ${paginatedMessages.length === 1 ? "message" : "messages"}`
    );
  };

  const openDetail = (msg: Message) => {
    setSelected(msg);
    setStatusForm({ status: msg.status, resolution: msg.resolution || "" });
  };

  const closeDetail = () => {
    setSelected(null);
    setStatusForm({ status: "", resolution: "" });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await messageApi.updateStatus(selected._id, statusForm);
      fetchMessages();
      closeDetail();
      showToast.success("Status updated");
    } catch {
      showToast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      done: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || "bg-gray-100 dark:bg-gray-800 dark:text-gray-400"}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">Support Log</h1>
          <p className="text-gray-500 mt-1">
            {messages.length === 0
              ? "All messages between managers and admins"
              : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
                  safePage * pageSize,
                  filtered.length
                )} of ${filtered.length} total ${filtered.length === 1 ? "message" : "messages"}`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64 rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            title="Entries per page"
            className="rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={200}>200 / page</option>
            <option value={500}>500 / page</option>
          </select>
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No messages found</div>
      ) : (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark">
                <th className="py-4 px-4 sm:px-6 text-left text-sm font-semibold text-black dark:text-white w-12">#</th>
                <th className="py-4 px-4 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">Date</th>
                <th className="py-4 px-4 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">Subject</th>
                <th className="py-4 px-4 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">Manager</th>
                <th className="py-4 px-4 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">Department</th>
                <th className="py-4 px-4 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">To Admin</th>
                <th className="py-4 px-4 sm:px-6 text-center text-sm font-semibold text-black dark:text-white">Status</th>
                <th className="py-4 px-4 sm:px-6 text-center text-sm font-semibold text-black dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMessages.map((msg, i) => (
                <tr key={msg._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30 transition-colors">
                  <td className="py-4 px-4 sm:px-6 text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {(safePage - 1) * pageSize + i + 1}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-sm text-gray-500 whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 sm:px-6 font-medium text-black dark:text-white">{msg.subject}</td>
                  <td className="py-4 px-4 sm:px-6 text-gray-500 whitespace-nowrap">{msg.fromName}</td>
                  <td className="py-4 px-4 sm:px-6 text-gray-500 whitespace-nowrap">{msg.fromDepartment}</td>
                  <td className="py-4 px-4 sm:px-6 text-gray-500 whitespace-nowrap">{msg.toName}</td>
                  <td className="py-4 px-4 sm:px-6 text-center">{statusBadge(msg.status)}</td>
                  <td className="py-4 px-4 sm:px-6 text-center">
                    <button
                      onClick={() => openDetail(msg)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors whitespace-nowrap"
                    >
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className="rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className="rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeDetail(); }}
        >
          <div className="w-full max-w-md rounded-2xl border border-stroke bg-white p-5 sm:p-6 shadow-xl dark:border-strokedark dark:bg-boxdark">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl">✏️</span>
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">Message Detail</h3>
              </div>
              <button
                onClick={closeDetail}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-black dark:hover:bg-meta-4 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <p className="text-sm font-medium text-black dark:text-white">{selected.fromName} — {selected.fromDepartment}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To Admin</p>
                <p className="text-sm font-medium text-black dark:text-white">{selected.toName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="text-sm font-medium text-black dark:text-white">{selected.subject}</p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-meta-4/30 p-4">
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selected.message}</p>
              </div>
              {selected.studentName && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Student</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selected.studentName}</p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="done">Done</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Resolution Notes</label>
                <textarea
                  value={statusForm.resolution}
                  onChange={(e) => setStatusForm({ ...statusForm, resolution: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white resize-none"
                  placeholder="Add resolution notes..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDetail}
                  className="flex-1 cursor-pointer rounded-lg border border-stroke py-2.5 font-semibold text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex-1 cursor-pointer rounded-lg bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminView;
