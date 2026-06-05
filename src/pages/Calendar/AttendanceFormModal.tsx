import React, { useState, useEffect } from "react";
import { attendanceApi } from "../../api/attendanceApi";
import { showToast } from "../../hooks/useToast";

interface AttendanceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isStudentView: boolean;
  studentName?: string;
  studentSubject?: string;
  student?: { _id: string; name: string; subject: string };
  initialDate?: string;
}

const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  isStudentView,
  studentName,
  studentSubject,
  student,
  initialDate,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [present, setPresent] = useState<string>("Present");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDate(initialDate || today);
      setPresent("Present");
    }
  }, [open, initialDate, today]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isStudentView) {
        await attendanceApi.selfMark({ present });
        showToast.success("Attendance marked successfully!");
      } else {
        if (!student) return;
        await attendanceApi.markById(student._id, { date, present });
        showToast.success("Attendance marked successfully!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-boxdark rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {isStudentView ? "Mark Today's Attendance" : `Mark Attendance — ${student?.name || ""}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {isStudentView ? (
            <div className="rounded-lg border border-stroke bg-gray-1 dark:bg-meta-4 p-4 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Student Name</p>
                <p className="text-sm font-medium text-black dark:text-white">{studentName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Subject / Department</p>
                <p className="text-sm font-medium text-black dark:text-white">{studentSubject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-black dark:text-white">{today}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-stroke bg-gray-1 dark:bg-meta-4 p-4 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Student</p>
                <p className="text-sm font-medium text-black dark:text-white">{student?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="text-sm font-medium text-black dark:text-white">{student?.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <input
                  type="date"
                  value={date}
                  max={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 text-black dark:text-white outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-black dark:text-white mb-2">Attendance Status</p>
            <div className="flex gap-4">
              {["Present", "Absent"].map((status) => (
                <label
                  key={status}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-3 cursor-pointer transition ${
                    present === status
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-stroke hover:bg-gray-1 dark:hover:bg-meta-4"
                  }`}
                >
                  <input
                    type="radio"
                    name="present"
                    value={status}
                    checked={present === status}
                    onChange={() => setPresent(status)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg border border-stroke py-3 font-medium text-black dark:text-white hover:bg-gray-1 dark:hover:bg-meta-4 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFormModal;
