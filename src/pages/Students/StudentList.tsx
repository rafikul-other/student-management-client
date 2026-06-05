import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import { Student } from "../../types";
import { showToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";

const StudentList: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", subject: "", email: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    studentApi.getAll().then((res) => setStudents(res.data.data.students || [])).catch(() => showToast.error("Failed to load students")).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q);
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Students</h1>
          <p className="text-gray-500 mt-1">Manage all registered students</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent py-2 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <Link to="/admin/students/bulk-import" className="px-5 py-2 rounded-lg border border-stroke text-sm font-medium hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">Bulk Import</Link>
          <Link to="/admin/students/new" className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">+ Add Student</Link>
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
                <th className="py-4 px-6 text-left text-sm font-semibold">Name</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Subject</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Present</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Absent</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Rate</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => {
                const total = (student.totalPresent || 0) + (student.totalAbsent || 0);
                const rate = total > 0 ? ((student.totalPresent || 0) / total * 100).toFixed(1) : "0";
                return (
                  <tr key={student._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30">
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
                        <td className="py-4 px-6 text-center">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleEdit(student._id)} className="text-green-500 hover:text-green-700 text-sm font-medium">Save</button>
                            <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancel</button>
                          </div>
                        </td>
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
                        <td className="py-4 px-6 text-center">
                          {user?.role !== "DepartmentManager" && (
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => startEdit(student)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Edit</button>
                            <button onClick={() => handleDelete(student._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                          </div>
                        )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
