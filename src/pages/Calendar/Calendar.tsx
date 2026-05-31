import React from "react";
import { useAuth } from "../../context/AuthContext";

const Calendar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Calendar</h1>
        <p className="text-gray-500 mt-1">View and manage your schedule</p>
      </div>
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">📅</p>
          <p>Calendar view for {user?.role}</p>
          <p className="text-sm mt-2">Attendance records are available in the Reports section</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;