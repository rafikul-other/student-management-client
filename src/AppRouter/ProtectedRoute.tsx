import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import DefaultLayout from "../layout/DefaultLayout";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  showBreadcrumb?: boolean;
  pageTitle?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  showBreadcrumb = true,
  pageTitle,
}) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  );
};

export default ProtectedRoute;