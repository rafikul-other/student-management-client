import React, { useState } from "react";
import { useColorMode } from "../../hooks/useColorMode";
import { showToast } from "../../hooks/useToast";

const Settings: React.FC = () => {
  const [colorMode, setColorMode] = useColorMode();
  const [alertThreshold, setAlertThreshold] = useState(() => localStorage.getItem("alertThreshold") || "75");

  const handleSave = () => {
    localStorage.setItem("alertThreshold", alertThreshold);
    showToast.success("Settings saved");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Customize your experience</p>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="font-semibold text-black dark:text-white mb-6">Appearance</h3>
        <div className="flex items-center justify-between py-4 border-b border-stroke dark:border-strokedark">
          <div>
            <p className="font-medium text-black dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
          </div>
          <button onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")} className={`relative m-0 block h-7.5 w-14 rounded-full ${colorMode === "dark" ? "bg-primary" : "bg-stroke"}`}>
            <span className={`absolute top-1 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${colorMode === "dark" && "!right-[3px] !translate-x-full"}`}>
              {colorMode === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="font-semibold text-black dark:text-white mb-6">Notifications</h3>
        <div className="py-4 border-b border-stroke dark:border-strokedark">
          <p className="font-medium text-black dark:text-white">Attendance Alert Threshold</p>
          <p className="text-sm text-gray-500 mb-3">Notify when student attendance drops below this percentage</p>
          <div className="flex items-center gap-4">
            <input type="number" min="0" max="100" value={alertThreshold} onChange={(e) => setAlertThreshold(e.target.value)} className="w-24 rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
            <span className="text-gray-500">%</span>
          </div>
        </div>
        <div className="pt-4">
          <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
            Save Settings
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="font-semibold text-black dark:text-white mb-4">System Info</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Version: <span className="text-black dark:text-white">2.0.0</span></p>
          <p>API: <span className="text-black dark:text-white">https://server-student.onrender.com/api/v1</span></p>
          <p>Build: <span className="text-black dark:text-white">Production</span></p>
        </div>
      </div>
    </div>
  );
};

export default Settings;