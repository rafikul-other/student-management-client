import React from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  icon: string;
  color: "blue" | "green" | "red" | "purple" | "yellow";
}

const colors = {
  blue: "bg-blue-500/10 text-blue-600",
  green: "bg-green-500/10 text-green-600",
  red: "bg-red-500/10 text-red-600",
  purple: "bg-purple-500/10 text-purple-600",
  yellow: "bg-yellow-500/10 text-yellow-600",
};

const CardDataStats: React.FC<CardDataStatsProps> = ({ title, total, icon, color }) => {
  return (
    <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-black dark:text-white">{total}</h3>
        </div>
        <div className={`flex items-center justify-center w-14 h-14 rounded-full text-2xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;