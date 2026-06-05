import React, { useEffect, useState } from "react";
import { messageApi, Message } from "../../api/messageApi";
import { studentApi } from "../../api/studentApi";
import { showToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import { Student } from "../../types";

const ManagerView: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ studentName: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");

  const fetchMessages = () => {
    messageApi.getAll()
      .then((res) => setMessages(res.data.data || []))
      .catch(() => showToast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  };

  const fetchStudents = () => {
    studentApi.getAll()
      .then((res) => {
        const all: Student[] = res.data.data?.students || [];
        const deptStudents = all.filter((s) => s.subject === user?.department);
        setStudents(deptStudents);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
    fetchStudents();
  }, []);

  const openForm = () => {
    setForm({ studentName: "", subject: user?.department || "", message: "" });
    setStudentSearch("");
    setShowForm(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) return showToast.error("Subject and message are required");
    setSending(true);
    try {
      await messageApi.create(form);
      setForm({ studentName: "", subject: "", message: "" });
      setShowForm(false);
      fetchMessages();
      showToast.success("Message sent to admin");
    } catch (err: any) {
      showToast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      done: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || "bg-gray-100"}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Contact Admin</h1>
          <p className="text-gray-500 mt-1">Send messages to your assigned administrator</p>
        </div>
        <button
          onClick={openForm}
          className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
        >
          + New Message
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Send Message to Admin</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">Student Name</label>
              <input
                type="text"
                placeholder="Search student by name..."
                value={studentSearch}
                onChange={(e) => { setStudentSearch(e.target.value); setForm({ ...form, studentName: "" }); }}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-2"
              />
              <select
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              >
                <option value="">-- Select a student (optional) --</option>
                {filteredStudents.map((s) => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>
              {studentSearch && filteredStudents.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No students found for "{studentSearch}"</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                placeholder="Enter subject"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white resize-none"
                placeholder="Enter your message"
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-stroke py-3 font-semibold text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30">Cancel</button>
              <button type="submit" disabled={sending} className="flex-1 rounded-lg bg-primary py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-50">{sending ? "Sending..." : "Send Message"}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No messages yet</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="rounded-xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-black dark:text-white">{msg.subject}</h4>
                    {statusBadge(msg.status)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}</p>
                  {msg.studentName && (
                    <p className="text-sm text-gray-500 mt-0.5">Student: <span className="font-medium text-black dark:text-white">{msg.studentName}</span></p>
                  )}
                  <p className="mt-3 text-gray-700 dark:text-gray-300">{msg.message}</p>
                  {msg.resolution && (
                    <div className="mt-3 rounded-lg bg-gray-50 dark:bg-meta-4/30 p-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Resolution:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{msg.resolution}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerView;