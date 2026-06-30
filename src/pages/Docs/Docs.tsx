import React from "react";
import { Link } from "react-router-dom";

const Docs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-boxdark dark:to-meta-4/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8"
          >
            <span>←</span> Back to Login
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">GD College</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Student Management System</p>
            <p className="text-gray-400 mt-2 text-sm">Version 2.0 — Documentation</p>
          </div>
        </div>

        <div className="space-y-8">

          <section className="rounded-2xl border border-stroke bg-white p-6 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">📌 Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              GD College Student Management System is a comprehensive web-based platform designed to manage students,
              track attendance, facilitate communication between department managers and administrators, and provide
              real-time insights through a dashboard — all with role-based access control.
            </p>
          </section>

          <section className="rounded-2xl border border-stroke bg-white p-6 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">✨ Key Features</h2>
            <ul className="space-y-3">
              {[
                ["👥 Student Management", "Add, view, edit, and delete student records. Supports single-entry and bulk CSV import."],
                ["📅 Attendance Tracking", "Mark and view attendance on any date. Calendar view with color-coded status (Present/Absent). Students can self-mark for today only."],
                ["📊 Dashboard & Reports", "Aggregated attendance reports filtered by month/year. Stats cards showing total, present, absent days and attendance rate."],
                ["💬 Messaging System", "Department Managers can contact their assigned Admin. Admins can update message status (Pending → Processing → Done/Rejected) with resolution notes."],
                ["🗓️ Calendar View", "Monthly calendar grid for students. Color-coded dots show daily attendance. Admin/Manager view shows all students with search and CSV download."],
                ["🌙 Dark / Light Mode", "Toggle between dark and light themes. Preference is saved per session."],
                ["🔐 Role-Based Access", "Four distinct roles with different permissions and navigation menus."],
                ["📥 Bulk Import", "Upload a CSV file to register multiple students at once."],
                ["📍 Location Tracking", "Every login captures browser geolocation and IP. SuperAdmin can view user location on Google Maps with one click. IP-based fallback with city/region/country."],
                ["📋 User Audit Log", "SuperAdmin can view every login across all roles — who, when, from where, with what browser. Edit and hard-delete support for corrections."],
                ["📤 CSV Export", "All tables support CSV download. Choose page size (25–500 entries), search/filter, then export visible data in one click."],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3 text-sm">
                  <span className="text-primary font-semibold shrink-0">{title}:</span>
                  <span className="text-gray-600 dark:text-gray-400">{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-stroke bg-white p-6 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">🔑 Roles & Permissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stroke dark:border-strokedark">
                    <th className="py-3 pr-4 text-left font-semibold text-black dark:text-white">Role</th>
                    <th className="py-3 px-4 text-left font-semibold text-black dark:text-white">Access Level</th>
                    <th className="py-3 pl-4 text-left font-semibold text-black dark:text-white">Can Do</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-400">
                  {[
                    ["SuperAdmin", "Full System", "Manage admins, all students, all attendance, all messages, view/edit/delete user login audit logs, settings"],
                    ["Admin", "Management", "Manage students, mark attendance for any student, view reports, respond to manager messages"],
                    ["DepartmentManager", "Department", "Manage own department's students (create/list only), mark attendance, send messages to assigned Admin"],
                    ["Student", "Self", "View own attendance calendar, self-mark today's attendance, update own profile"],
                  ].map(([role, level, canDo]) => (
                    <tr key={role} className="border-b border-stroke/50 dark:border-strokedark/50 last:border-0">
                      <td className="py-3 pr-4 font-medium text-black dark:text-white">{role}</td>
                      <td className="py-3 px-4 text-primary font-medium">{level}</td>
                      <td className="py-3 pl-4">{canDo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-stroke bg-white p-6 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">🧑‍💻 Technology Stack</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Frontend", "React 18 + Vite + TypeScript + Tailwind CSS"],
                ["Backend", "Express.js + Node.js"],
                ["Database", "MongoDB (Mongoose ODM)"],
                ["Authentication", "JWT (JSON Web Tokens) with role-based guards"],
                ["State Management", "React Context API (AuthContext, ColorModeContext)"],
                ["Routing", "React Router v6"],
                ["API Layer", "Axios-based apiClient with typed endpoints"],
                ["Geolocation", "Browser Geolocation API → Nominatim reverse geocode → ip-api.com IP fallback"],
                ["CSV Export", "Client-side RFC 4180 CSV generation via Blob API"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="font-semibold text-black dark:text-white shrink-0">{label}:</span>
                  <span className="text-gray-600 dark:text-gray-400">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-stroke bg-white p-6 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">🚀 Getting Started</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Contact your <strong className="text-black dark:text-white">System Administrator</strong> to receive your login credentials.
                Each user is assigned a role that determines their access level within the system.
              </p>
              <p>
                Once logged in, use the sidebar navigation to access features available for your role.
                Most pages include a <strong className="text-black dark:text-white">search bar</strong> to quickly find records.
              </p>
              <p>
                Student self-attendance can be marked on the <strong className="text-black dark:text-white">Calendar</strong> page — click on today's date to mark your attendance.
              </p>
              <p>
                Most list pages include a <strong className="text-black dark:text-white">page-size selector</strong> and a <strong className="text-black dark:text-white">Download CSV</strong> button so you can export visible data for offline analysis. Apply a search or filter first, then click Download CSV.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-stroke bg-white p-6 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">⚠️ Daily Entry Limit</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The system enforces a combined daily creation limit of <strong className="text-black dark:text-white">100 entries per day</strong> across
              all record types (students, managers, admins, and messages). If you reach this limit, please try again the next day.
            </p>
          </section>

          <section className="rounded-2xl border border-stroke bg-white p-6 sm:p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">📞 Support</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For technical issues or feature requests, please contact your system administrator or submit a message through the
              platform's built-in messaging system. Or connect with rafikul.career@gmail.com
            </p>
          </section>

        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-stroke py-3 px-6 text-sm font-semibold text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4/30 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Docs;