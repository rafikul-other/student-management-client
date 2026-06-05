import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import DefaultLayout from "../layout/DefaultLayout";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const fallbackRoute =
    user?.role === "Student" ? "/admin/calendar" :
    user?.role === "DepartmentManager" ? "/admin/students" :
    "/admin/dashboard";

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  );
};

export default ProtectedRoute;
