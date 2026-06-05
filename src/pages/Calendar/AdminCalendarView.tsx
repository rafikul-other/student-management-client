import React, { useState, useEffect, useMemo } from "react";
import { studentApi } from "../../api/studentApi";
import { attendanceApi } from "../../api/attendanceApi";
import { useAuth } from "../../context/AuthContext";
import { Student, AttendanceRecord } from "../../types";
import { showToast } from "../../hooks/useToast";
import CalendarGrid from "./CalendarGrid";
import AttendanceFormModal from "./AttendanceFormModal";
import { downloadCSV } from "./csvDownload";

const AdminCalendarView: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [markModalOpen, setMarkModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getAll();
      let data: Student[] = res.data.data?.students || [];

      if (user?.role === "DepartmentManager" && user.department) {
        data = data.filter(
          (s) => s.subject === user.department || s.assignedManager === user._id
        );
      }

      setStudents(data);
    } catch {
      showToast.error("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user?._id, user?.role, user?.department]);

  const fetchStudentAttendance = async (studentId: string) => {
    setAttendanceLoading(true);
    try {
      const res = await attendanceApi.getStudentAttendance(studentId);
      setStudentAttendance(res.data.data || []);
    } catch {
      setStudentAttendance([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleStudentClick = async (student: Student) => {
    setSelectedStudent(student);
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth());
    await fetchStudentAttendance(student._id);
    setModalOpen(true);
  };

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q)
    );
  }, [students, search]);

  const getStudentStats = (student: Student) => {
    const total = student.attendance?.length || 0;
    const present = student.attendance?.filter((a) => a.present === "Present").length || 0;
    const rate = total > 0 ? ((present / total) * 100).toFixed(0) : "0";
    return { total, present, rate };
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleMarkSuccess = async () => {
    if (selectedStudent) {
      await fetchStudentAttendance(selectedStudent._id);
      await fetchStudents();
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedStudent) return;
    const filename = `${selectedStudent.name.replace(/\s+/g, "_")}_attendance.csv`;
    downloadCSV(studentAttendance, filename);
  };

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Attendance Calendar</h1>
        <p className="text-gray-500 mt-1">View and manage student attendance records</p>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Students</h3>
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-stroke bg-transparent py-2.5 px-4 text-sm text-black dark:text-white outline-none focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="py-3 text-left text-sm font-semibold text-black dark:text-white">Name</th>
                <th className="py-3 text-left text-sm font-semibold text-black dark:text-white">Subject</th>
                <th className="py-3 text-center text-sm font-semibold text-black dark:text-white">Total Days</th>
                <th className="py-3 text-center text-sm font-semibold text-black dark:text-white">Present</th>
                <th className="py-3 text-center text-sm font-semibold text-black dark:text-white">Rate</th>
                <th className="py-3 text-center text-sm font-semibold text-black dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">No students found</td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const stats = getStudentStats(student);
                  return (
                    <tr
                      key={student._id}
                      className="border-b border-stroke dark:border-strokedark hover:bg-gray-1 dark:hover:bg-meta-4 transition cursor-pointer"
                      onClick={() => handleStudentClick(student)}
                    >
                      <td className="py-3 text-sm font-medium text-black dark:text-white">{student.name}</td>
                      <td className="py-3 text-sm text-gray-500">{student.subject}</td>
                      <td className="py-3 text-center text-sm text-gray-500">{stats.total}</td>
                      <td className="py-3 text-center text-sm text-green-600 font-medium">{stats.present}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          parseFloat(stats.rate) >= 75
                            ? "bg-green-100 text-green-700"
                            : parseFloat(stats.rate) >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {stats.rate}%
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStudentClick(student);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-boxdark rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-boxdark border-b border-stroke dark:border-strokedark px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white">{selectedStudent.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedStudent.subject}</p>
              </div>
              <button
                onClick={() => { setModalOpen(false); setSelectedStudent(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setMarkModalOpen(true)}
                  className="flex-1 cursor-pointer rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-white hover:bg-primary/90 transition"
                >
                  Mark Attendance
                </button>
                <button
                  onClick={handleDownloadCSV}
                  disabled={studentAttendance.length === 0}
                  className="flex-1 cursor-pointer rounded-lg border border-stroke py-2.5 px-4 text-sm font-medium text-black dark:text-white hover:bg-gray-1 dark:hover:bg-meta-4 transition disabled:opacity-50"
                >
                  Download CSV
                </button>
              </div>

              <div className="rounded-xl border border-stroke bg-gray-1 dark:bg-meta-4 p-4">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handlePrevMonth} className="p-1.5 rounded-lg border border-stroke hover:bg-white dark:hover:bg-boxdark transition">
                    <svg className="w-4 h-4 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-semibold text-black dark:text-white">{monthName}</span>
                  <button onClick={handleNextMonth} className="p-1.5 rounded-lg border border-stroke hover:bg-white dark:hover:bg-boxdark transition">
                    <svg className="w-4 h-4 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {attendanceLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <CalendarGrid
                    year={selectedYear}
                    month={selectedMonth}
                    attendance={studentAttendance}
                    readOnly
                  />
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-black dark:text-white mb-3">Attendance Records</h3>
                <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-lg border border-stroke">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white dark:bg-boxdark">
                      <tr className="border-b border-stroke dark:border-strokedark">
                        <th className="py-2.5 px-4 text-left text-xs font-semibold text-black dark:text-white">Date</th>
                        <th className="py-2.5 px-4 text-center text-xs font-semibold text-black dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentAttendance.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-sm text-gray-500">No records</td>
                        </tr>
                      ) : (
                        studentAttendance
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((record, i) => (
                            <tr key={i} className="border-b border-stroke dark:border-strokedark">
                              <td className="py-2.5 px-4 text-sm text-gray-500">{record.date}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
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
            </div>
          </div>
        </div>
      )}

      {selectedStudent && (
        <AttendanceFormModal
          open={markModalOpen}
          onClose={() => setMarkModalOpen(false)}
          onSuccess={handleMarkSuccess}
          isStudentView={false}
          student={selectedStudent}
          initialDate={new Date().toISOString().split("T")[0]}
        />
      )}
    </div>
  );
};

export default AdminCalendarView;
