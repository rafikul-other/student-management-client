import React, { useEffect, useState, useCallback } from "react";
import apiClient from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { showToast } from "../../hooks/useToast";
import { UserLog, UserRole } from "../../types";

const roleColor: Record<UserRole, string> = {
  SuperAdmin: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  Admin: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  DepartmentManager: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Student: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const formatDateTime = (iso: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const toLocalInputValue = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatLocation = (loc?: UserLog["location"]) => {
  if (!loc) return "-";
  const parts = [loc.city, loc.region, loc.country].filter(Boolean);
  if (parts.length === 0) {
    if (loc.lat != null && loc.lon != null) return `${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)}`;
    return "-";
  }
  const unique = Array.from(new Set(parts));
  if (unique.length === 1) return unique[0];
  return unique.join(", ");
};

const formatIp = (ip?: string) => {
  if (!ip) return "-";
  if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("::ffff:")) return "localhost";
  return ip;
};

const parseBrowser = (ua?: string) => {
  if (!ua) return "-";
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua) || /Opera/.test(ua)) return "Opera";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  if (/curl\//.test(ua)) return "curl";
  if (/Postman/.test(ua)) return "Postman";
  return "Other";
};

interface EditForm {
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  location: {
    city: string;
    region: string;
    country: string;
    lat: string;
    lon: string;
  };
}

const emptyEditForm = (log: UserLog): EditForm => ({
  ipAddress: log.ipAddress || "",
  userAgent: log.userAgent || "",
  createdAt: toLocalInputValue(log.createdAt),
  location: {
    city: log.location?.city || "",
    region: log.location?.region || "",
    country: log.location?.country || "",
    lat: log.location?.lat != null ? String(log.location.lat) : "",
    lon: log.location?.lon != null ? String(log.location.lon) : "",
  },
});

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

const formatDateForCsv = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toISOString();
};

const UserLogPage: React.FC = () => {
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [editingLog, setEditingLog] = useState<UserLog | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm({} as UserLog));
  const [savingEdit, setSavingEdit] = useState(false);
  const [pageSize, setPageSize] = useState(25);

  const fetchLogs = useCallback(
    async (p: number, size: number) => {
      setLoading(true);
      try {
        const res = await apiClient.get(ENDPOINTS.userLogs.list, {
          params: { page: p, limit: size },
        });
        const data = res.data?.data || {};
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
        setPage(data.pagination?.page || p);
      } catch (err: any) {
        showToast.error(err?.response?.data?.message || "Failed to load user logs");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLogs(1, pageSize);
  }, [fetchLogs, pageSize]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const filtered = logs.filter((log) => {
    if (roleFilter !== "All" && log.userType !== roleFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.userName?.toLowerCase().includes(q) ||
      log.email?.toLowerCase().includes(q) ||
      log.ipAddress?.toLowerCase().includes(q) ||
      log.userType?.toLowerCase().includes(q) ||
      log.location?.city?.toLowerCase().includes(q) ||
      log.location?.region?.toLowerCase().includes(q) ||
      log.location?.country?.toLowerCase().includes(q)
    );
  });

  const startEdit = (log: UserLog) => {
    setEditingLog(log);
    setEditForm(emptyEditForm(log));
  };

  const cancelEdit = () => {
    setEditingLog(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    setSavingEdit(true);
    try {
      const lat = editForm.location.lat.trim() === "" ? null : Number(editForm.location.lat);
      const lon = editForm.location.lon.trim() === "" ? null : Number(editForm.location.lon);
      const payload = {
        ipAddress: editForm.ipAddress,
        userAgent: editForm.userAgent,
        createdAt: editForm.createdAt ? new Date(editForm.createdAt).toISOString() : undefined,
        location: {
          city: editForm.location.city,
          region: editForm.location.region,
          country: editForm.location.country,
          lat: Number.isFinite(lat) ? lat : null,
          lon: Number.isFinite(lon) ? lon : null,
        },
      };
      const res = await apiClient.put(ENDPOINTS.userLogs.update(editingLog._id), payload);
      const updated = res.data?.data;
      if (updated) {
        setLogs((prev) => prev.map((l) => (l._id === editingLog._id ? { ...l, ...updated } : l)));
        if (selectedLog?._id === editingLog._id) {
          setSelectedLog({ ...selectedLog, ...updated });
        }
        showToast.success("User log updated");
      }
      setEditingLog(null);
    } catch (err: any) {
      showToast.error(err?.response?.data?.message || "Failed to update user log");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (log: UserLog) => {
    if (!confirm(`Delete this user log entry for ${log.userName}? This cannot be undone.`)) return;
    try {
      await apiClient.delete(ENDPOINTS.userLogs.delete(log._id));
      setLogs((prev) => prev.filter((l) => l._id !== log._id));
      setTotal((t) => Math.max(0, t - 1));
      if (selectedLog?._id === log._id) setSelectedLog(null);
      showToast.success("User log deleted");
    } catch (err: any) {
      showToast.error(err?.response?.data?.message || "Failed to delete user log");
    }
  };

  const handleDownloadCsv = () => {
    if (filtered.length === 0) {
      showToast.error("No entries to export");
      return;
    }
    const startIndex = (page - 1) * pageSize;
    const csvColumns = [
      "#",
      "Name",
      "Role",
      "Email",
      "IP Address",
      "City",
      "Region",
      "Country",
      "Latitude",
      "Longitude",
      "Browser",
      "Login Time",
    ];
    const rows = filtered.map((log, i) => ({
      "#": startIndex + i + 1,
      Name: log.userName || "",
      Role: log.userType || "",
      Email: log.email || "",
      "IP Address": log.ipAddress || "",
      City: log.location?.city || "",
      Region: log.location?.region || "",
      Country: log.location?.country || "",
      Latitude: log.location?.lat ?? "",
      Longitude: log.location?.lon ?? "",
      Browser: log.userAgent || "",
      "Login Time": formatDateForCsv(log.createdAt),
    }));
    const csv = buildCsv(rows, csvColumns);
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(csv, `user-log-${today}.csv`);
    showToast.success(`Exported ${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`);
  };

  const [lookingUp, setLookingUp] = useState(false);
  const handleLookupLocation = async () => {
    const lat = Number(editForm.location.lat);
    const lon = Number(editForm.location.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      showToast.error("Enter valid latitude and longitude first");
      return;
    }
    setLookingUp(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=en`,
        { headers: { "User-Agent": "GDCollege/1.0" } }
      );
      if (!res.ok) throw new Error("Lookup failed");
      const data = await res.json();
      const addr = data?.address;
      if (!addr) throw new Error("No address found");
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state_district || "";
      const region = addr.state || addr.region || addr.province || "";
      const country = addr.country || "";
      setEditForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          city: city || prev.location.city,
          region: region || prev.location.region,
          country: country || prev.location.country,
        },
      }));
      showToast.success("Location filled from coordinates");
    } catch {
      showToast.error("Could not resolve location from coordinates");
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">User Log</h1>
          <p className="text-gray-500 mt-1">
            {total === 0
              ? "Login activity across all roles"
              : `Showing ${(page - 1) * pageSize + 1}–${Math.min(
                  page * pageSize,
                  total
                )} of ${total} total ${total === 1 ? "entry" : "entries"}`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "All" | UserRole)}
            className="rounded-lg border border-stroke bg-transparent py-2 px-3 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="All">All Roles</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="DepartmentManager">DepartmentManager</option>
            <option value="Student">Student</option>
          </select>
          <input
            type="text"
            placeholder="Search by name, email, IP, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
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
            onClick={() => fetchLogs(page, pageSize)}
            className="rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors"
          >
            Refresh
          </button>
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
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {logs.length === 0
            ? "No login activity recorded yet."
            : "No entries match the current search/filter."}
        </div>
      ) : (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark">
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white w-12">
                  #
                </th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">
                  User
                </th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">
                  Role
                </th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">
                  Email
                </th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">
                  IP Address
                </th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">
                  Location
                </th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">
                  Browser
                </th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">
                  Login Time
                </th>
                <th className="py-4 px-3 sm:px-6 text-center text-sm font-semibold text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr
                  key={log._id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30 transition-colors"
                >
                  <td className="py-4 px-3 sm:px-6 text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {(page - 1) * pageSize + i + 1}
                  </td>
                  <td className="py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {log.userName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-black dark:text-white whitespace-nowrap">
                        {log.userName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-3 sm:px-6">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                        roleColor[log.userType] || "bg-gray-500/15 text-gray-600"
                      }`}
                    >
                      {log.userType}
                    </span>
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {log.email || "-"}
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono text-xs">
                    {formatIp(log.ipAddress)}
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-gray-500 dark:text-gray-400">
                    {log.location?.lat != null && log.location?.lon != null ? (
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        title={`View ${log.userName}'s location on map`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        View Map
                      </button>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">
                        {formatLocation(log.location)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {parseBrowser(log.userAgent)}
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap text-sm">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="py-4 px-3 sm:px-6">
                    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <button
                        onClick={() => startEdit(log)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-sm font-medium hover:bg-blue-500/20 transition-colors cursor-pointer"
                      >
                        <span>✏️</span> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(log)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 text-sm font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => fetchLogs(page - 1, pageSize)}
              className="rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchLogs(page + 1, pageSize)}
              className="rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedLog?.location?.lat != null && selectedLog?.location?.lon != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLog(null);
          }}
        >
          <div className="w-full max-w-3xl rounded-2xl border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stroke dark:border-strokedark">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {selectedLog.userName}'s Location
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedLog.userType} • IP: {formatIp(selectedLog.ipAddress)} • {formatDateTime(selectedLog.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-black dark:hover:bg-meta-4 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                title="User Location Map"
                src={`https://maps.google.com/maps?q=${selectedLog.location.lat},${selectedLog.location.lon}&z=15&output=embed`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-stroke dark:border-strokedark">
              <p className="text-xs text-gray-500 font-mono">
                {selectedLog.location.lat.toFixed(6)}, {selectedLog.location.lon.toFixed(6)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="cursor-pointer rounded-lg border border-stroke py-2 px-4 text-sm font-medium text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors"
                >
                  Close
                </button>
                <a
                  href={`https://www.google.com/maps?q=${selectedLog.location.lat},${selectedLog.location.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelEdit();
          }}
        >
          <div className="w-full max-w-lg mx-4 rounded-2xl border border-stroke bg-white p-5 sm:p-6 shadow-xl dark:border-strokedark dark:bg-boxdark max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl">✏️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">Edit User Log</h3>
                  <p className="text-xs text-gray-500">
                    {editingLog.userName} ({editingLog.userType})
                  </p>
                </div>
              </div>
              <button
                onClick={cancelEdit}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-black dark:hover:bg-meta-4 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  IP Address
                </label>
                <input
                  type="text"
                  value={editForm.ipAddress}
                  onChange={(e) => setEditForm({ ...editForm, ipAddress: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  User Agent (Browser)
                </label>
                <textarea
                  value={editForm.userAgent}
                  onChange={(e) => setEditForm({ ...editForm, userAgent: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Login Time
                </label>
                <input
                  type="datetime-local"
                  value={editForm.createdAt}
                  onChange={(e) => setEditForm({ ...editForm, createdAt: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm"
                />
              </div>

              <div className="pt-2">
                <p className="mb-2 text-sm font-medium text-black dark:text-white">Location</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">City</label>
                    <input
                      type="text"
                      value={editForm.location.city}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: { ...editForm.location, city: e.target.value } })
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">Region</label>
                    <input
                      type="text"
                      value={editForm.location.region}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: { ...editForm.location, region: e.target.value } })
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">Country</label>
                    <input
                      type="text"
                      value={editForm.location.country}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: { ...editForm.location, country: e.target.value } })
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editForm.location.lat}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: { ...editForm.location, lat: e.target.value } })
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-gray-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editForm.location.lon}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: { ...editForm.location, lon: e.target.value } })
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLookupLocation}
                  disabled={lookingUp}
                  className="mt-3 inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-primary bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {lookingUp ? "Looking up..." : "Look up City/Region/Country from coordinates"}
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 cursor-pointer rounded-lg border border-stroke py-2.5 font-semibold text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 cursor-pointer rounded-lg bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLogPage;
