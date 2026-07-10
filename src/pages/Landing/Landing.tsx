import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";
import LoginModal from "./LoginModal";

const getHomeRoute = (role: UserRole) => {
  if (role === "Student") return "/admin/calendar";
  if (role === "DepartmentManager") return "/admin/students";
  return "/admin/dashboard";
};

const features: Array<[string, string, string]> = [
  [
    "M3 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    "Student Management",
    "Add, view, edit, and delete student records. Supports single-entry and bulk CSV import for fast onboarding.",
  ],
  [
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    "Attendance Tracking",
    "Mark and view attendance on any date. Students can self-mark for today only. Real-time sync across all roles.",
  ],
  [
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    "Calendar View",
    "Monthly calendar grid with color-coded status. Admin/Manager view shows all students with search and CSV download.",
  ],
  [
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    "Reports & Dashboard",
    "Aggregated attendance reports filtered by month and year. Stats cards show total, present, absent days and rate.",
  ],
  [
    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    "Messaging System",
    "Department Managers contact their assigned Admin. Admins update message status with resolution notes.",
  ],
  [
    "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
    "Bulk CSV Import",
    "Upload a CSV file to register multiple students at once. Failed rows are reported with clear reasons.",
  ],
];

const roles: Array<[string, string, string, string]> = [
  ["SuperAdmin", "Full System", "Manage admins, all students, all attendance, all messages, audit logs, and system settings."],
  ["Admin", "Management", "Manage students, mark attendance, view reports, and respond to manager messages."],
  ["DepartmentManager", "Department", "Manage own department's students, mark attendance, and send messages to assigned Admin."],
  ["Student", "Self", "View own attendance calendar, self-mark today's attendance, and update own profile."],
];

const stats: Array<[string, string]> = [
  ["4", "Roles"],
  ["11+", "Features"],
  ["100", "Daily Entries"],
  ["24/7", "Access"],
];

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const Landing: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate(getHomeRoute(user?.role as UserRole), { replace: true });
  };

  const handleHomeScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link
            to="/"
            onClick={handleHomeScroll}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] shadow-sm">
              <span className="text-base font-bold text-white">GD</span>
            </span>
            <span className="text-base font-semibold tracking-tight text-[#1F2937]">
              GD College
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#top"
              onClick={handleHomeScroll}
              className="hidden rounded-md px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937] sm:inline-block"
            >
              Home
            </a>
            <Link
              to="/docs"
              className="rounded-md px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]"
            >
              Docs
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleDashboardClick}
                className="ml-2 cursor-pointer rounded-md bg-[#4F46E5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4338CA]"
              >
                Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="ml-2 cursor-pointer rounded-md bg-[#4F46E5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4338CA]"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative px-6 pt-24 pb-28 lg:px-10 lg:pt-32 lg:pb-36">
        <div className="mx-auto max-w-5xl text-center">
          
          <h1 className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-[#1F2937] sm:text-6xl lg:text-7xl">
            Student Management,
            <br />
            <span className="text-[#4F46E5]">made simple.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
            A complete platform for managing students, tracking attendance, and
            facilitating communication between department managers and administrators —
            all with role-based access control and real-time insights.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="group cursor-pointer inline-flex items-center gap-2 rounded-md bg-[#4F46E5] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4338CA]"
            >
              Get Started
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-7 py-3.5 text-sm font-semibold text-[#1F2937] transition-all hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
            >
              View Docs
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-5"
              >
                <p className="text-3xl font-bold text-[#1F2937] sm:text-4xl">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#E5E7EB] bg-white px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
              Features
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#1F2937] sm:text-5xl">
              Everything you need.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
              From attendance to reports, all the tools to manage students are built in.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([path, title, desc]) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-7 transition-all duration-300 hover:border-[#4F46E5]/30 hover:shadow-lg hover:shadow-[#4F46E5]/5"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                  <Icon path={path} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-[#1F2937]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
              Roles & Access
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#1F2937] sm:text-5xl">
              Four roles. One system.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#6B7280]">
              Granular permissions ensure everyone sees exactly what they need to.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map(([role, level, canDo]) => (
              <div
                key={role}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-7 transition-all duration-300 hover:border-[#10B981]/40 hover:shadow-lg hover:shadow-[#10B981]/5"
              >
                {/* <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#047857]">
                  <span className="inline-block h-1 w-1 rounded-full bg-[#10B981]" />
                  {level}
                </div> */}
                <h3 className="mt-5 text-xl font-semibold text-[#1F2937]">
                  {role}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                  {canDo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E5E7EB] bg-white px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] sm:text-4xl lg:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6B7280]">
              Sign in with your role and start managing your college today. Need
              help? Check out the full documentation.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-[#4F46E5] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4338CA]"
              >
                Sign In Now
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-7 py-3.5 text-sm font-semibold text-[#1F2937] transition-all hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4F46E5] text-xs font-bold text-white">
              GD
            </span>
            <span className="text-sm font-semibold text-[#1F2937]">
              GD College
            </span>
            <span className="text-xs text-[#9CA3AF]">
              · Student Management System v2.0
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/docs"
              className="text-[#6B7280] transition-colors hover:text-[#1F2937]"
            >
              Documentation
            </Link>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=rafikul.career@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] transition-colors hover:text-[#1F2937]"
            >
              Support
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-[#9CA3AF]">
          © {new Date().getFullYear()} GD College. All rights reserved.
        </p>
      </footer>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Landing;
