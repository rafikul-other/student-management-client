import React from "react";
import { Link } from "react-router-dom";

const Docs: React.FC = () => {
  const features: Array<[string, string, string]> = [
    ["👥", "Student Management", "Add, view, edit, and delete student records. Supports single-entry and bulk CSV import."],
    ["📅", "Attendance Tracking", "Mark and view attendance on any date. Calendar view with color-coded status (Present/Absent). Students can self-mark for today only."],
    ["📊", "Dashboard & Reports", "Aggregated attendance reports filtered by month/year. Stats cards showing total, present, absent days and attendance rate."],
    ["💬", "Messaging System", "Department Managers can contact their assigned Admin. Admins can update message status (Pending → Processing → Done/Rejected) with resolution notes."],
    ["🗓️", "Calendar View", "Monthly calendar grid for students. Color-coded dots show daily attendance. Admin/Manager view shows all students with search and CSV download."],
    ["🌙", "Dark / Light Mode", "Toggle between dark and light themes. Preference is saved per session."],
    ["🔐", "Role-Based Access", "Four distinct roles with different permissions and navigation menus."],
    ["📥", "Bulk Import", "Upload a CSV file to register multiple students at once."],
    ["📍", "Location Tracking", "Every login captures browser geolocation and IP. SuperAdmin can view user location on Google Maps with one click. IP-based fallback with city/region/country."],
    ["📋", "User Audit Log", "SuperAdmin can view every login across all roles — who, when, from where, with what browser. Edit and hard-delete support for corrections."],
    ["📤", "CSV Export", "All tables support CSV download. Choose page size (25–500 entries), search/filter, then export visible data in one click."],
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans antialiased">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#6B7280] transition-all hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
          >
            <span>←</span> Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#10B981]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            v2.0 — Now with location tracking
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight text-[#1F2937]">
            GD College
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-medium text-[#6B7280]">
            Student Management System
          </p>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Documentation · Everything you need to know
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F2937]">
              <span className="text-[#4F46E5]">4</span> Roles
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F2937]">
              <span className="text-[#10B981]">11</span> Features
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F2937]">
              <span className="text-[#4F46E5]">9</span> Tech Layers
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F2937]">
              <span className="text-[#10B981]">100</span> entries / day
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Overview */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <span className="text-lg">📌</span>
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Overview</h2>
            </div>
            <p className="text-[#6B7280] leading-relaxed">
              GD College Student Management System is a comprehensive web-based platform designed to manage students,
              track attendance, facilitate communication between department managers and administrators, and provide
              real-time insights through a dashboard — all with role-based access control.
            </p>
          </section>

          {/* Key Features */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#10B981]">
                <span className="text-lg">✨</span>
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Key Features</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map(([icon, title, desc]) => (
                <li
                  key={title}
                  className="group rounded-xl border border-[#E5E7EB] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4F46E5]/30 hover:shadow-md hover:shadow-[#4F46E5]/5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-base">
                      {icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937]">{title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{desc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Roles & Permissions */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <span className="text-lg">🔑</span>
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Roles & Permissions</h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9FAFB]">
                    <th className="py-3 px-4 text-left font-semibold text-[#1F2937]">Role</th>
                    <th className="py-3 px-4 text-left font-semibold text-[#1F2937]">Access Level</th>
                    <th className="py-3 px-4 text-left font-semibold text-[#1F2937]">Can Do</th>
                  </tr>
                </thead>
                <tbody className="text-[#6B7280]">
                  {(
                    [
                      ["SuperAdmin", "Full System", "Manage admins, all students, all attendance, all messages, view/edit/delete user login audit logs, settings"],
                      ["Admin", "Management", "Manage students, mark attendance for any student, view reports, respond to manager messages"],
                      ["DepartmentManager", "Department", "Manage own department's students (create/list only), mark attendance, send messages to assigned Admin"],
                      ["Student", "Self", "View own attendance calendar, self-mark today's attendance, update own profile"],
                    ] as Array<[string, string, string]>
                  ).map(([role, level, canDo]) => (
                    <tr key={role} className="border-t border-[#E5E7EB] transition-colors hover:bg-[#F9FAFB]">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2 font-semibold text-[#1F2937]">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
                          {role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-semibold text-[#4F46E5]">
                          {level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs leading-relaxed">{canDo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <span className="text-lg">🧑‍💻</span>
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Technology Stack</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ["Frontend", "React 18 + Vite + TypeScript + Tailwind CSS"],
                  ["Backend", "Express.js + Node.js"],
                  ["Database", "MongoDB (Mongoose ODM)"],
                  ["Authentication", "JWT (JSON Web Tokens) with role-based guards"],
                  ["State Management", "React Context API (AuthContext, ColorModeContext)"],
                  ["Routing", "React Router v6"],
                  ["API Layer", "Axios-based apiClient with typed endpoints"],
                  ["Geolocation", "Browser Geolocation API → Nominatim reverse geocode → ip-api.com IP fallback"],
                  ["CSV Export", "Client-side RFC 4180 CSV generation via Blob API"],
                ] as Array<[string, string]>
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 transition-all hover:border-[#4F46E5]/30 hover:shadow-sm"
                >
                  <span className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#4F46E5]" />
                  <div className="text-sm">
                    <span className="font-semibold text-[#1F2937]">{label}:</span>{" "}
                    <span className="text-[#6B7280]">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Getting Started */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <span className="text-lg">🚀</span>
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Getting Started</h2>
            </div>
            <div className="space-y-3 text-sm text-[#6B7280]">
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#4F46E5]">1</span>
                <span>
                  Contact your <strong className="text-[#1F2937]">System Administrator</strong> to receive your login credentials. Each user is assigned a role that determines their access level within the system.
                </span>
              </p>
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#4F46E5]">2</span>
                <span>
                  Once logged in, use the sidebar navigation to access features available for your role. Most pages include a <strong className="text-[#1F2937]">search bar</strong> to quickly find records.
                </span>
              </p>
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#4F46E5]">3</span>
                <span>
                  Student self-attendance can be marked on the <strong className="text-[#1F2937]">Calendar</strong> page — click on today's date to mark your attendance.
                </span>
              </p>
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#4F46E5]">4</span>
                <span>
                  Most list pages include a <strong className="text-[#1F2937]">page-size selector</strong> and a <strong className="text-[#1F2937]">Download CSV</strong> button so you can export visible data for offline analysis. Apply a search or filter first, then click Download CSV.
                </span>
              </p>
            </div>
          </section>

          {/* Daily Entry Limit + Support side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706]">
                  <span className="text-lg">⚠️</span>
                </div>
                <h2 className="text-lg font-bold text-[#1F2937]">Daily Entry Limit</h2>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                A combined daily creation limit of{" "}
                <span className="inline-flex items-center rounded-full bg-[#4F46E5] px-2.5 py-0.5 text-xs font-bold text-white">
                  100 entries
                </span>{" "}
                applies across all record types (students, managers, admins, and messages). If you reach this limit, please try again the next day.
              </p>
            </section>

            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                  <span className="text-lg">📞</span>
                </div>
                <h2 className="text-lg font-bold text-[#1F2937]">Support</h2>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                For technical issues or feature requests, contact your system administrator or submit a message through the
                platform's built-in messaging system. Or connect with{" "}
                <a
                  className="inline-flex items-center gap-1 font-semibold text-[#4F46E5] underline-offset-4 hover:underline"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=rafikul.career@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  rafikul.career@gmail.com ↗
                </a>
              </p>
            </section>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#1F2937] transition-all hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
          >
            <span>←</span> Back to Home
          </Link>
          <p className="mt-4 text-xs text-[#9CA3AF]">
            Made with care · GD College · v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Docs;
