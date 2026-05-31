import React, { useEffect, useState } from "react";
import { attendanceApi } from "../../api/attendanceApi";
import { AttendanceReport } from "../../types";
import { useAuth } from "../../context/AuthContext";

const AttendanceReportPage: React.FC = () => {
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    attendanceApi.getReport().then((res) => setReport(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Attendance Reports</h1>
        <p className="text-gray-500 mt-1">
          {user?.role === "Student" ? "Your personal attendance history" : "Overview of all attendance records"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="mt-1 text-3xl font-bold">{report?.totalStudents || 0}</p>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Present Days</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{report?.totalPresent || 0}</p>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Absent Days</p>
          <p className="mt-1 text-3xl font-bold text-red-600">{report?.totalAbsent || 0}</p>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <p className="mt-1 text-3xl font-bold text-primary">{report?.overallAttendanceRate || "0%"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-4">Attendance by Subject</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="py-3 text-left text-sm font-semibold">Subject</th>
                <th className="py-3 text-center text-sm font-semibold">Students</th>
                <th className="py-3 text-center text-sm font-semibold">Present</th>
                <th className="py-3 text-center text-sm font-semibold">Absent</th>
                <th className="py-3 text-center text-sm font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report?.bySubject || {}).map(([subject, data]: [string, any]) => {
                const rate = data.total > 0 ? ((data.present / data.total) * 100).toFixed(1) : "0";
                return (
                  <tr key={subject} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-3 font-medium text-black dark:text-white">{subject}</td>
                    <td className="py-3 text-center text-gray-500">{data.students}</td>
                    <td className="py-3 text-center text-green-600 font-medium">{data.present}</td>
                    <td className="py-3 text-center text-red-600 font-medium">{data.absent}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${parseFloat(rate) >= 75 ? "bg-green-100 text-green-700" : parseFloat(rate) >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{rate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-4">Recent Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="py-3 text-left text-sm font-semibold">Date</th>
                <th className="py-3 text-left text-sm font-semibold">Student</th>
                <th className="py-3 text-left text-sm font-semibold">Subject</th>
                <th className="py-3 text-center text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {(report?.recentRecords || []).slice(0, 15).map((record, i) => (
                <tr key={i} className="border-b border-stroke dark:border-strokedark">
                  <td className="py-3 text-gray-500">{record.date}</td>
                  <td className="py-3 font-medium text-black dark:text-white">{record.student}</td>
                  <td className="py-3 text-gray-500">{record.subject}</td>
                  <td className="py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.present === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{record.present}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage;