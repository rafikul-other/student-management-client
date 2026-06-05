import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { showToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";

const DepartmentManagers: React.FC = () => {
  const { user } = useAuth();
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", department: "", password: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient.get(ENDPOINTS.departmentManagers.list)
      .then((res) => setManagers(res.data.data.managers || []))
      .catch(() => showToast.error("Failed to load managers"))
      .finally(() => setLoading(false));
  }, []);

  const visibleManagers = managers.filter((m) => {
    if (user?.role === "DepartmentManager" && m._id !== user._id) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.department.toLowerCase().includes(q);
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.department) return showToast.error("All fields are required");
    setSubmitting(true);
    try {
      const res = await apiClient.post(ENDPOINTS.departmentManagers.create, form);
      setManagers((prev) => [...prev, res.data.data]);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", department: "" });
      showToast.success("Manager created successfully");
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Failed to create manager");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this manager?")) return;
    try {
      await apiClient.delete(ENDPOINTS.departmentManagers.delete(id));
      setManagers((prev) => prev.filter((m) => m._id !== id));
      showToast.success("Manager deleted");
    } catch {
      showToast.error("Failed to delete manager");
    }
  };

  const startEdit = (manager: any) => {
    setEditingId(manager._id);
    setEditForm({ name: manager.name, email: manager.email, department: manager.department, password: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", email: "", department: "", password: "" });
  };

  const handleEdit = async (id: string) => {
    const payload: any = {
      name: editForm.name,
      email: editForm.email,
      department: editForm.department,
    };
    if (editForm.password) {
      payload.password = editForm.password;
    }
    try {
      const res = await apiClient.put(ENDPOINTS.departmentManagers.update(id), payload);
      setManagers((prev) => prev.map((m) => (m._id === id ? res.data.data : m)));
      setEditingId(null);
      setEditForm({ name: "", email: "", department: "", password: "" });
      showToast.success("Manager updated successfully");
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Failed to update manager");
    }
  };

  const canEditPassword = user?.role === "SuperAdmin" || user?.role === "Admin";
  const canEditOrDelete = user?.role === "SuperAdmin" || user?.role === "Admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">Department Managers</h1>
          <p className="text-gray-500 mt-1">Manage department heads and their access</p>
        </div>
        {canEditOrDelete && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <span className="text-base leading-none">+</span>
            {showForm ? "Cancel" : <span className="hidden sm:inline">Add Manager</span>}
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search by name, email, or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white w-full max-w-sm"
      />

      {showForm && (
        <div className="rounded-xl border border-stroke bg-white p-5 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">Create New Manager</h3>
              <p className="text-sm text-gray-500">Add a new department head to the system</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="manager@college.edu"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ name: "", email: "", password: "", department: "" });
                }}
                className="flex-1 cursor-pointer rounded-lg border border-stroke py-3 font-semibold text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 cursor-pointer rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Manager"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      ) : visibleManagers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No department managers found</div>
      ) : (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark">
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">Name</th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">Email</th>
                <th className="py-4 px-3 sm:px-6 text-left text-sm font-semibold text-black dark:text-white">Department</th>
                {canEditOrDelete && (
                  <th className="py-4 px-3 sm:px-6 text-center text-sm font-semibold text-black dark:text-white">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleManagers.map((manager) => (
                <tr
                  key={manager._id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30 transition-colors"
                >
                  <td className="py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {manager.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-black dark:text-white whitespace-nowrap">{manager.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 sm:px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">{manager.email}</td>
                  <td className="py-4 px-3 sm:px-6">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                      {manager.department}
                    </span>
                  </td>
                  {canEditOrDelete && (
                    <td className="py-4 px-3 sm:px-6">
                      <div className="flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap">
                        <button
                          onClick={() => startEdit(manager)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                        >
                          <span>✏️</span> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(manager._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 text-sm font-medium hover:bg-red-500/20 transition-colors"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelEdit();
          }}
        >
          <div className="w-full max-w-md mx-4 rounded-2xl border border-stroke bg-white p-5 sm:p-6 shadow-xl dark:border-strokedark dark:bg-boxdark">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl">✏️</span>
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">Edit Manager</h3>
              </div>
              <button
                onClick={cancelEdit}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-black dark:hover:bg-meta-4 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEdit(editingId); }} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>

              {canEditPassword && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    New Password <span className="text-xs font-normal text-gray-400">(leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Enter new password to update"
                    className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
              )}

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
                  className="flex-1 cursor-pointer rounded-lg bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagers;
