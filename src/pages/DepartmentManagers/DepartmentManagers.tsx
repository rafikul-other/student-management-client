import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { showToast } from "../../hooks/useToast";

const DepartmentManagers: React.FC = () => {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiClient.get(ENDPOINTS.departmentManagers.list)
      .then((res) => setManagers(res.data.data.managers || []))
      .catch(() => showToast.error("Failed to load managers"))
      .finally(() => setLoading(false));
  }, []);

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
      ) : managers.length === 0 ? (
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
              {managers.map((manager) => (
                <tr key={manager._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30">
                  <td className="py-4 px-6 font-medium text-black dark:text-white">{manager.name}</td>
                  <td className="py-4 px-6 text-gray-500">{manager.email}</td>
                  <td className="py-4 px-6 text-gray-500">{manager.department}</td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDelete(manager._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                  </td>
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