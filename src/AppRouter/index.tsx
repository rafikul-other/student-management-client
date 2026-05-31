import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Calendar from "../pages/Calendar/Calendar";
import Profile from "../pages/Profile/Profile";
import StudentEntry from "../pages/Students/StudentEntry";
import StudentList from "../pages/Students/StudentList";
import StudentBulkImport from "../pages/Students/StudentBulkImport";
import AttendanceReport from "../pages/Attendance/AttendanceReport";
import AttendanceMark from "../pages/Attendance/AttendanceMark";
import DepartmentManagers from "../pages/DepartmentManagers/DepartmentManagers";
import Settings from "../pages/Settings/Settings";

const AppRouter = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!(token && user);

  if (!isAuthenticated) {
    return <Routes><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
  }

  const hasRole = (...roles: string[]) => user ? roles.includes(user.role) : false;

  return (
    <Routes>
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><StudentList /></ProtectedRoute>} />
      <Route path="/admin/students/new" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><StudentEntry /></ProtectedRoute>} />
      <Route path="/admin/students/bulk-import" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><StudentBulkImport /></ProtectedRoute>} />
      <Route path="/admin/attendance/mark" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><AttendanceMark /></ProtectedRoute>} />
      <Route path="/admin/attendance/report" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
      <Route path="/admin/department-managers" element={<ProtectedRoute allowedRoles={["SuperAdmin"]}><DepartmentManagers /></ProtectedRoute>} />
      <Route path="/admin/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;