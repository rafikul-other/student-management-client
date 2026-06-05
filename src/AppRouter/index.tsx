import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
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
import Admins from "../pages/Admins/Admins";
import Messages from "../pages/Messages/Messages";

const AppRouter = () => {
  const { user } = useAuth();
  const homeRoute = (user?.role === "Student" || user?.role === "DepartmentManager") ? "/admin/calendar" : "/admin/dashboard";

  return (
    <Routes>
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><StudentList /></ProtectedRoute>} />
      <Route path="/students/new" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><StudentEntry /></ProtectedRoute>} />
      <Route path="/students/bulk-import" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><StudentBulkImport /></ProtectedRoute>} />
      <Route path="/attendance/mark" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><AttendanceMark /></ProtectedRoute>} />
      <Route path="/attendance/report" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><AttendanceReport /></ProtectedRoute>} />
      <Route path="/department-managers" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><DepartmentManagers /></ProtectedRoute>} />
      <Route path="/admins" element={<ProtectedRoute allowedRoles={["SuperAdmin"]}><Admins /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><Messages /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "Student"]}><Calendar /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
};

export default AppRouter;
