import React, { useState, useEffect } from "react";
import { attendanceApi } from "../../api/attendanceApi";
import { useAuth } from "../../context/AuthContext";
import { AttendanceRecord } from "../../types";
import { showToast } from "../../hooks/useToast";
import CalendarGrid from "./CalendarGrid";
import AttendanceFormModal from "./AttendanceFormModal";

const StudentCalendarView: React.FC = () => {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];

  const fetchAttendance = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await attendanceApi.getStudentAttendance(user._id);
      setAttendance(res.data.data || []);
    } catch {
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user?._id]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth());
  };

  const handleDayClick = (date: string, record?: AttendanceRecord) => {
    if (date === today) {
      setSelectedDate(date);
      setModalOpen(true);
    }
  };

  const monthName = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

  const presentCount = attendance.filter((a) => a.present === "Present").length;
  const absentCount = attendance.filter((a) => a.present === "Absent").length;
  const total = attendance.length;
  const rate = total > 0 ? ((presentCount / total) * 100).toFixed(1) : "0";

  const sortedAttendance = [...attendance].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">My Attendance</h1>
          <p className="text-gray-500 mt-1">Track and manage your daily attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handlePrevMonth} className="p-2 rounded-lg border border-stroke hover:bg-gray-1 dark:hover:bg-meta-4 transition">
            <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-semibold text-black dark:text-white min-w-[160px] text-center">{monthName}</span>
          <button onClick={handleNextMonth} className="p-2 rounded-lg border border-stroke hover:bg-gray-1 dark:hover:bg-meta-4 transition">
            <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={handleToday} className="px-3 py-1.5 rounded-lg border border-stroke text-sm font-medium text-black dark:text-white hover:bg-gray-1 dark:hover:bg-meta-4 transition">
            Today
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <CalendarGrid
            year={year}
            month={month}
            attendance={attendance}
            onDayClick={handleDayClick}
          />
        )}

        {attendance.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4 text-sm">No attendance records yet.</p>
        )}

        {today && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Click on <span className="font-semibold text-primary">today</span> to mark attendance
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Present Days</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{presentCount}</p>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Absent Days</p>
          <p className="mt-1 text-3xl font-bold text-red-600">{absentCount}</p>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <p className="mt-1 text-3xl font-bold text-primary">{rate}%</p>
        </div>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="py-3 text-left text-sm font-semibold text-black dark:text-white">Date</th>
                <th className="py-3 text-center text-sm font-semibold text-black dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAttendance.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-6 text-center text-gray-500">No records found</td>
                </tr>
              ) : (
                sortedAttendance.map((record, i) => (
                  <tr key={i} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-3 text-sm text-gray-500">{record.date}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        record.present === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {record.present}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AttendanceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAttendance}
        isStudentView={true}
        studentName={user?.name}
        studentSubject={user?.subject}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default StudentCalendarView;
