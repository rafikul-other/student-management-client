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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Animated gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(at 20% 10%, rgba(99,102,241,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(236,72,153,0.15) 0px, transparent 50%), radial-gradient(at 60% 80%, rgba(56,189,248,0.18) 0px, transparent 50%), radial-gradient(at 0% 70%, rgba(168,85,247,0.12) 0px, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 -z-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-pink-400/20 blur-3xl dark:bg-pink-600/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-600/20"
      />
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 backdrop-blur-md shadow-sm transition-all hover:-translate-x-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            <span>←</span> Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 backdrop-blur-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            v2.0 — Now with location tracking
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              GD College
            </span>
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300">
            Student Management System
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Documentation · Everything you need to know
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-md shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200">
              <span className="text-indigo-500">4</span> Roles
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-md shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200">
              <span className="text-fuchsia-500">11</span> Features
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-md shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200">
              <span className="text-sky-500">9</span> Tech Layers
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-md shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200">
              <span className="text-emerald-500">100</span> entries / day
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Overview */}
          <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 sm:p-8 shadow-xl shadow-slate-900/[0.04] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
                <span className="text-lg">📌</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Overview</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              GD College Student Management System is a comprehensive web-based platform designed to manage students,
              track attendance, facilitate communication between department managers and administrators, and provide
              real-time insights through a dashboard — all with role-based access control.
            </p>
          </section>

          {/* Key Features */}
          <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 sm:p-8 shadow-xl shadow-slate-900/[0.04] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-lg shadow-amber-500/30">
                <span className="text-lg">✨</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Key Features</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map(([icon, title, desc]) => (
                <li
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/50"
                >
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 blur-2xl transition-all group-hover:from-indigo-500/20 group-hover:to-fuchsia-500/20" />
                  <div className="relative flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-base dark:from-slate-800 dark:to-slate-700">
                      {icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Roles & Permissions */}
          <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 sm:p-8 shadow-xl shadow-slate-900/[0.04] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-500/30">
                <span className="text-lg">🔑</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Roles & Permissions</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200/70 dark:border-slate-800/80">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-sky-500/10 dark:from-indigo-500/20 dark:via-fuchsia-500/20 dark:to-sky-500/20">
                    <th className="py-3 px-4 text-left font-semibold text-slate-700 dark:text-slate-200">Role</th>
                    <th className="py-3 px-4 text-left font-semibold text-slate-700 dark:text-slate-200">Access Level</th>
                    <th className="py-3 px-4 text-left font-semibold text-slate-700 dark:text-slate-200">Can Do</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  {(
                    [
                      ["SuperAdmin", "Full System", "from-indigo-500 to-fuchsia-500", "Manage admins, all students, all attendance, all messages, view/edit/delete user login audit logs, settings"],
                      ["Admin", "Management", "from-sky-500 to-cyan-500", "Manage students, mark attendance for any student, view reports, respond to manager messages"],
                      ["DepartmentManager", "Department", "from-amber-500 to-orange-500", "Manage own department's students (create/list only), mark attendance, send messages to assigned Admin"],
                      ["Student", "Self", "from-emerald-500 to-teal-500", "View own attendance calendar, self-mark today's attendance, update own profile"],
                    ] as Array<[string, string, string, string]>
                  ).map(([role, level, gradient, canDo]) => (
                    <tr key={role} className="border-t border-slate-200/70 dark:border-slate-800/80 transition-colors hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-white`}>
                          <span className={`inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r ${gradient}`} />
                          {role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${gradient} px-2.5 py-0.5 text-xs font-semibold text-white`}>
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
          <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 sm:p-8 shadow-xl shadow-slate-900/[0.04] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/30">
                <span className="text-lg">🧑‍💻</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Technology Stack</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ["Frontend", "React 18 + Vite + TypeScript + Tailwind CSS", "from-cyan-500 to-blue-500"],
                  ["Backend", "Express.js + Node.js", "from-emerald-500 to-green-500"],
                  ["Database", "MongoDB (Mongoose ODM)", "from-lime-500 to-emerald-500"],
                  ["Authentication", "JWT (JSON Web Tokens) with role-based guards", "from-amber-500 to-yellow-500"],
                  ["State Management", "React Context API (AuthContext, ColorModeContext)", "from-purple-500 to-violet-500"],
                  ["Routing", "React Router v6", "from-rose-500 to-pink-500"],
                  ["API Layer", "Axios-based apiClient with typed endpoints", "from-orange-500 to-red-500"],
                  ["Geolocation", "Browser Geolocation API → Nominatim reverse geocode → ip-api.com IP fallback", "from-fuchsia-500 to-pink-500"],
                  ["CSV Export", "Client-side RFC 4180 CSV generation via Blob API", "from-indigo-500 to-blue-500"],
                ] as Array<[string, string, string]>
              ).map(([label, value, gradient]) => (
                <div
                  key={label}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/60 p-3 transition-all hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/10 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/50"
                >
                  <span className={`mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${gradient}`} />
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">{label}:</span>{" "}
                    <span className="text-slate-600 dark:text-slate-400">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Getting Started */}
          <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 sm:p-8 shadow-xl shadow-slate-900/[0.04] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                <span className="text-lg">🚀</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Getting Started</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-300">1</span>
                <span>
                  Contact your <strong className="text-slate-900 dark:text-white">System Administrator</strong> to receive your login credentials. Each user is assigned a role that determines their access level within the system.
                </span>
              </p>
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-300">2</span>
                <span>
                  Once logged in, use the sidebar navigation to access features available for your role. Most pages include a <strong className="text-slate-900 dark:text-white">search bar</strong> to quickly find records.
                </span>
              </p>
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-300">3</span>
                <span>
                  Student self-attendance can be marked on the <strong className="text-slate-900 dark:text-white">Calendar</strong> page — click on today's date to mark your attendance.
                </span>
              </p>
              <p className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-600 dark:text-indigo-300">4</span>
                <span>
                  Most list pages include a <strong className="text-slate-900 dark:text-white">page-size selector</strong> and a <strong className="text-slate-900 dark:text-white">Download CSV</strong> button so you can export visible data for offline analysis. Apply a search or filter first, then click Download CSV.
                </span>
              </p>
            </div>
          </section>

          {/* Daily Entry Limit + Support side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-6 shadow-xl shadow-amber-500/[0.06] backdrop-blur-xl dark:border-amber-500/20 dark:from-amber-500/10 dark:to-orange-500/10">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                  <span className="text-lg">⚠️</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daily Entry Limit</h2>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A combined daily creation limit of{" "}
                <span className="inline-flex items-center rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
                  100 entries
                </span>{" "}
                applies across all record types (students, managers, admins, and messages). If you reach this limit, please try again the next day.
              </p>
            </section>

            <section className="rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-50/80 to-indigo-50/60 p-6 shadow-xl shadow-sky-500/[0.06] backdrop-blur-xl dark:border-sky-500/20 dark:from-sky-500/10 dark:to-indigo-500/10">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/30">
                  <span className="text-lg">📞</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Support</h2>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                For technical issues or feature requests, contact your system administrator or submit a message through the
                platform's built-in messaging system. Or connect with{" "}
                <a
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
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
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span> Back to Home
          </Link>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            Made with care · GD College · v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Docs;
