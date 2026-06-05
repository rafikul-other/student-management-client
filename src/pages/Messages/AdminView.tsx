import React, { useEffect, useState } from "react";
import { messageApi, Message } from "../../api/messageApi";
import { showToast } from "../../hooks/useToast";

const AdminView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [statusForm, setStatusForm] = useState({ status: "", resolution: "" });
  const [saving, setSaving] = useState(false);

  const fetchMessages = () => {
    messageApi.getAll()
      .then((res) => setMessages(res.data.data || []))
      .catch(() => showToast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openDetail = (msg: Message) => {
    setSelected(msg);
    setStatusForm({ status: msg.status, resolution: msg.resolution || "" });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await messageApi.updateStatus(selected._id, statusForm);
      fetchMessages();
      setSelected(null);
      showToast.success("Status updated");
    } catch {
      showToast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      done: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || "bg-gray-100"}`}>{status}</span>;
  };

  const pending = messages.filter((m) => m.status === "pending" || m.status === "processing");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Manager Requests</h1>
        <p className="text-gray-500 mt-1">Manage messages from department managers</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No messages from managers yet</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-black dark:text-white">All Requests ({messages.length})</h3>
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => openDetail(msg)}
                className={`rounded-xl border p-4 cursor-pointer transition-colors dark:border-strokedark dark:bg-boxdark ${selected?._id === msg._id ? "border-primary bg-primary/5" : "border-stroke bg-white hover:border-primary/50"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-black dark:text-white">{msg.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">From: {msg.fromName} ({msg.fromDepartment})</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                  {statusBadge(msg.status)}
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">{selected.subject}</h3>
              <p className="text-xs text-gray-500 mb-4">From: {selected.fromName} — {selected.fromDepartment} • {new Date(selected.createdAt).toLocaleString()}</p>
              <div className="rounded-lg bg-gray-50 dark:bg-meta-4/30 p-4 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Status</label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="done">Done</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">Resolution Notes</label>
                  <textarea
                    value={statusForm.resolution}
                    onChange={(e) => setStatusForm({ ...statusForm, resolution: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white resize-none"
                    placeholder="Add resolution notes..."
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSelected(null)} className="flex-1 rounded-lg border border-stroke py-2.5 font-semibold text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30">Cancel</button>
                  <button onClick={handleUpdate} disabled={saving} className="flex-1 rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminView;