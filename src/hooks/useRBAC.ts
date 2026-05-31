import { UserRole } from "../types";
import { useAuth } from "../context/AuthContext";

export const useRBAC = () => {
  const { user, hasRole } = useAuth();

  const can = (permission: string): boolean => {
    const permissions: Record<UserRole, string[]> = {
      SuperAdmin: ["manage_students", "mark_attendance", "view_reports", "manage_admins", "manage_department_managers", "system_settings"],
      Admin: ["manage_students", "mark_attendance", "view_reports"],
      DepartmentManager: ["mark_attendance", "view_reports"],
      Student: ["view_reports"],
    };
    return user ? (permissions[user.role] || []).includes(permission) : false;
  };

  return { can, hasRole, isAdmin: hasRole("Admin", "SuperAdmin"), isSuperAdmin: hasRole("SuperAdmin"), isDepartmentManager: hasRole("DepartmentManager"), isStudent: hasRole("Student") };
};