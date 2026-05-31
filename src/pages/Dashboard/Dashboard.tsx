import React, { useEffect, useState } from "react";
import { studentApi } from "../../api/studentApi";
import { attendanceApi } from "../../api/attendanceApi";
import CardDataStats from "../../components/ui/CardDataStats";
import { AttendanceReport, Student } from "../../types";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, reportRes] = await Promise.all([
          studentApi.getAll(),
          attendanceApi.getReport(),
        ]);
        setStudents(studentsRes.data.data.students || []);
        setReport(reportRes.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;
  }

  const chartData = {
    labels: Object.keys(report?.bySubject || {}),
    datasets: [
      {
        label: "Present",
        data: Object.values(report?.bySubject || {}).map((s: any) => s.present),
        borderColor: "#3C50E0",
        backgroundColor: "rgba(60, 80, 224, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Absent",
        data: Object.values(report?.bySubject || {}).map((s: any) => s.absent),
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" as const } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardDataStats title="Total Students" total={report?.totalStudents?.toString() || "0"} icon="👥" color="blue" />
        <CardDataStats title="Total Present" total={report?.totalPresent?.toString() || "0"} icon="✅" color="green" />
        <CardDataStats title="Total Absent" total={report?.totalAbsent?.toString() || "0"} icon="❌" color="red" />
        <CardDataStats title="Attendance Rate" total={report?.overallAttendanceRate || "0%"} icon="📊" color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold mb-4">Attendance by Subject</h3>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {(report?.recentRecords || []).slice(0, 8).map((record, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-stroke dark:border-strokedark last:border-0">
                <div>
                  <p className="font-medium text-black dark:text-white">{record.student}</p>
                  <p className="text-sm text-gray-500">{record.subject}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.present === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {record.present}
                </span>
              </div>
            ))}
            {(!report?.recentRecords || report.recentRecords.length === 0) && (
              <p className="text-gray-500 text-center py-8">No recent records</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-4">All Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="py-3 text-left text-sm font-semibold">Name</th>
                <th className="py-3 text-left text-sm font-semibold">Subject</th>
                <th className="py-3 text-center text-sm font-semibold">Present</th>
                <th className="py-3 text-center text-sm font-semibold">Absent</th>
                <th className="py-3 text-center text-sm font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 10).map((student) => {
                const total = (student.totalPresent || 0) + (student.totalAbsent || 0);
                const rate = total > 0 ? ((student.totalPresent || 0) / total * 100).toFixed(1) : "0";
                return (
                  <tr key={student._id} className="border-b border-stroke dark:border-strokedark last:border-0">
                    <td className="py-3 text-black dark:text-white">{student.name}</td>
                    <td className="py-3 text-gray-500">{student.subject}</td>
                    <td className="py-3 text-center text-green-600 font-medium">{student.totalPresent || 0}</td>
                    <td className="py-3 text-center text-red-600 font-medium">{student.totalAbsent || 0}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${parseFloat(rate) >= 75 ? "bg-green-100 text-green-700" : parseFloat(rate) >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;