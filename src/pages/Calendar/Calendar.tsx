import React from "react";
import { useAuth } from "../../context/AuthContext";
import StudentCalendarView from "./StudentCalendarView";
import AdminCalendarView from "./AdminCalendarView";

const Calendar: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === "Student") {
    return <StudentCalendarView />;
  }

  return <AdminCalendarView />;
};

export default Calendar;
