import React, { useState } from "react";
import { attendanceApi } from "../../api/attendanceApi";
import { showToast } from "../../hooks/useToast";

const AttendanceMark: React.FC = () => {
  const [form, setForm] = useState({ name: "", subject: "", date: new Date().toISOString().split("T")[0], present: "Present" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.subject || !form.date) return showToast.error("All fields are required");
    setLoading(true);
    try {
      await attendanceApi.mark(form);
      showToast.success("Attendance marked successfully");
      setForm({ ...form, name: "", subject: "" });
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">Mark Attendance</h1>
        <p className="text-gray-500 mt-1">Record student attendance for today</p>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Student Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter student name" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
          </div>
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Subject / Course *</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Computer Science" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
          </div>
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Date *</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" required />
          </div>
          <div>
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Status *</label>
            <div className="flex gap-4">
              {["Present", "Absent"].map((status) => (
                <label key={status} className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-3 cursor-pointer transition ${form.present === status ? "border-primary bg-primary/10 text-primary" : "border-stroke hover:bg-gray-2"}`}>
                  <input type="radio" name="present" value={status} checked={form.present === status} onChange={() => setForm({ ...form, present: status })} className="hidden" />
                  <span className="text-sm font-medium">{status}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full cursor-pointer rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
            {loading ? "Marking..." : "Mark Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttendanceMark;
