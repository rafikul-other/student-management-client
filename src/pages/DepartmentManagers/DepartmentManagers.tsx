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

  useEffect(() => {
    apiClient.get(ENDPOINTS.departmentManagers.list)
      .then((res) => setManagers(res.data.data.managers || []))
      .catch(() => showToast.error("Failed to load managers"))
      .finally(() => setLoading(false));
  }, []);

  const visibleManagers = user?.role === "DepartmentManager"
    ? managers.filter((m) => m._id === user._id)
    : managers;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Department Managers</h1>
          <p className="text-gray-500 mt-1">Manage department heads and their access</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
          {showForm ? "Cancel" : "+ Add Manager"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="font-semibold mb-4">Create New Manager</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
            <input type="text" placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
            <button type="submit" disabled={submitting} className="md:col-span-2 cursor-pointer rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
              {submitting ? "Creating..." : "Create Manager"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
      ) : visibleManagers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No department managers found</div>
      ) : (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark">
                <th className="py-4 px-6 text-left text-sm font-semibold">Name</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Email</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Department</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleManagers.map((manager) => (
                <tr key={manager._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30">
                  {editingId === manager._id ? (
                    <>
                      <td className="py-4 px-6">
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2 px-2 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm" />
                      </td>
                      <td className="py-4 px-6">
                        <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2 px-2 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm" />
                      </td>
                      <td className="py-4 px-6">
                        <input type="text" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2 px-2 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col gap-1">
                          {canEditPassword && (
                            <input type="password" placeholder="New password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-2 px-2 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white text-sm" />
                          )}
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleEdit(manager._id)} className="text-green-500 hover:text-green-700 text-sm font-medium">Save</button>
                            <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancel</button>
                          </div>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-6 font-medium text-black dark:text-white">{manager.name}</td>
                      <td className="py-4 px-6 text-gray-500">{manager.email}</td>
                      <td className="py-4 px-6 text-gray-500">{manager.department}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => startEdit(manager)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Edit</button>
                          {canEditOrDelete && (
                            <button onClick={() => handleDelete(manager._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagers;
