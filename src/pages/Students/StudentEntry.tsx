import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import { showToast } from "../../hooks/useToast";

const StudentEntry: React.FC = () => {
  const [form, setForm] = useState({ name: "", subject: "", email: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.subject) return showToast.error("Name and subject are required");
    setLoading(true);
    try {
      await studentApi.create(form);
      showToast.success("Student created successfully");
      navigate("/admin/students");
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-xl border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Add New Student</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Full Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter student name" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
          </div>
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Subject / Course *</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Computer Science" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
          </div>
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 cursor-pointer rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Creating..." : "Create Student"}
            </button>
            <button type="button" onClick={() => navigate("/admin/students")} className="flex-1 cursor-pointer rounded-lg border border-stroke py-3 font-semibold hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEntry;