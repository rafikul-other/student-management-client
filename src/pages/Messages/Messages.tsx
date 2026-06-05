import React from "react";
import { useAuth } from "../../context/AuthContext";
import ManagerView from "./ManagerView";
import AdminView from "./AdminView";
import SuperAdminView from "./SuperAdminView";

const Messages: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === "DepartmentManager") {
    return <ManagerView />;
  }

  if (user?.role === "Admin") {
    return <AdminView />;
  }

  if (user?.role === "SuperAdmin") {
    return <SuperAdminView />;
  }

  return null;
};

export default Messages;