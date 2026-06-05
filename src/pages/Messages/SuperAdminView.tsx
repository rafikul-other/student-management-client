import React, { useEffect, useState } from "react";
import { messageApi, Message } from "../../api/messageApi";
import { showToast } from "../../hooks/useToast";

const SuperAdminView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    messageApi.getAll()
      .then((res) => setMessages(res.data.data || []))
      .catch(() => showToast.error("Failed to load messages"))
      .finally(() => setLoading(false));
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
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Support Log</h1>
        <p className="text-gray-500 mt-1">All messages between managers and admins</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by subject, manager, department, admin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No messages found</div>
      ) : (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark">
                <th className="py-4 px-6 text-left text-sm font-semibold">Date</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Subject</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Manager</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Department</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">To Admin</th>
                <th className="py-4 px-6 text-center text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((msg) => (
                <tr key={msg._id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-meta-4/30">
                  <td className="py-4 px-6 text-sm text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 font-medium text-black dark:text-white">{msg.subject}</td>
                  <td className="py-4 px-6 text-gray-500">{msg.fromName}</td>
                  <td className="py-4 px-6 text-gray-500">{msg.fromDepartment}</td>
                  <td className="py-4 px-6 text-gray-500">{msg.toName}</td>
                  <td className="py-4 px-6 text-center">{statusBadge(msg.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminView;