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

const AppRouter = () => {
  const { user } = useAuth();
  const homeRoute = user?.role === "Student" ? "/admin/calendar" : "/admin/dashboard";

  return (
    <Routes>
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><StudentList /></ProtectedRoute>} />
      <Route path="/students/new" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><StudentEntry /></ProtectedRoute>} />
      <Route path="/students/bulk-import" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><StudentBulkImport /></ProtectedRoute>} />
      <Route path="/attendance/mark" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><AttendanceMark /></ProtectedRoute>} />
      <Route path="/attendance/report" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
      <Route path="/department-managers" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin", "DepartmentManager"]}><DepartmentManagers /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
};

export default AppRouter;
