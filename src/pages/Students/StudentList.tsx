import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import { Student } from "../../types";
import { showToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";

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

const StudentList: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", subject: "", email: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    studentApi.getAll().then((res) => setStudents(res.data.data.students || [])).catch(() => showToast.error("Failed to load students")).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedStudents = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const computeRate = (s: Student) => {
    const total = (s.totalPresent || 0) + (s.totalAbsent || 0);
    return total > 0 ? ((s.totalPresent || 0) / total * 100).toFixed(1) : "0";
  };

  const handleDownloadCsv = () => {
    if (paginatedStudents.length === 0) {
      showToast.error("No entries to export");
      return;
    }
    const startIndex = (safePage - 1) * pageSize;
    const csvColumns = [
      "#",
      "Name",
      "Subject",
      "Present",
      "Absent",
      "Rate",
    ];
    const rows = paginatedStudents.map((s, i) => ({
      "#": startIndex + i + 1,
      Name: s.name || "",
      Subject: s.subject || "",
      Present: s.totalPresent || 0,
      Absent: s.totalAbsent || 0,
      Rate: `${computeRate(s)}%`,
    }));
    const csv = buildCsv(rows, csvColumns);
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(csv, `students-${today}.csv`);
    showToast.success(
      `Exported ${paginatedStudents.length} ${paginatedStudents.length === 1 ? "student" : "students"}`
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await studentApi.delete(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      showToast.success("Student deleted");
    } catch {
      showToast.error("Failed to delete student");
    }
  };

  const startEdit = (student: Student) => {
    setEditingId(student._id);
    setEditForm({ name: student.name, subject: student.subject, email: student.email || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", subject: "", email: "" });
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await studentApi.update(id, { name: editForm.name, subject: editForm.subject, email: editForm.email });
      setStudents((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
      setEditingId(null);
      setEditForm({ name: "", subject: "", email: "" });
      showToast.success("Student updated");
    } catch {
      showToast.error("Failed to update student");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Students</h1>
          <p className="text-gray-500 mt-1">
            {students.length === 0
              ? "Manage all registered students"
              : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
                  safePage * pageSize,
                  filtered.length
                )} of ${filtered.length} total ${filtered.length === 1 ? "student" : "students"}`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
          <Link to="/admin/students/bulk-import" className="px-5 py-2 rounded-lg border border-stroke text-sm font-medium hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 whitespace-nowrap">Bulk Import</Link>
          <Link to="/admin/students/new" className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 whitespace-nowrap">+ Add Student</Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No students found.</div>
      ) : (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark">
                <th className="py-4 px-6 text-left text-sm font-semibold w-12">#</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Name</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Subject</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Present</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Absent</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Rate</th>
                {user?.role !== "DepartmentManager" && (
                  <th className="py-4 px-6 text-center text-sm font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, i) => {
                const total = (student.totalPresent || 0) + (student.totalAbsent || 0);
                const rate = total > 0 ? ((student.totalPresent || 0) / total * 100).toFixed(1) : "0";
                return (
                  <tr key={student._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30">
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {(safePage - 1) * pageSize + i + 1}
                    </td>
                    {editingId === student._id ? (
                      <>
                        <td className="py-4 px-6">
                          <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2 px-2 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm" />
                        </td>
                        <td className="py-4 px-6">
                          <input type="text" value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2 px-2 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm" />
                        </td>
                        <td className="py-4 px-6 text-center text-gray-500">{student.totalPresent || 0}</td>
                        <td className="py-4 px-6 text-center text-gray-500">{student.totalAbsent || 0}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${parseFloat(rate) >= 75 ? "bg-green-100 text-green-700" : parseFloat(rate) >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{rate}%</span>
                        </td>
                        {user?.role !== "DepartmentManager" && (
                          <td className="py-4 px-6 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => handleEdit(student._id)} className="text-green-500 hover:text-green-700 text-sm font-medium">Save</button>
                              <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancel</button>
                            </div>
                          </td>
                        )}
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 font-medium text-black dark:text-white">{student.name}</td>
                        <td className="py-4 px-6 text-gray-500">{student.subject}</td>
                        <td className="py-4 px-6 text-center text-green-600 font-medium">{student.totalPresent || 0}</td>
                        <td className="py-4 px-6 text-center text-red-600 font-medium">{student.totalAbsent || 0}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${parseFloat(rate) >= 75 ? "bg-green-100 text-green-700" : parseFloat(rate) >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{rate}%</span>
                        </td>
                        {user?.role !== "DepartmentManager" && (
                          <td className="py-4 px-6 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => startEdit(student)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Edit</button>
                              <button onClick={() => handleDelete(student._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                            </div>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                );
              })}
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
    </div>
  );
};

export default StudentList;
