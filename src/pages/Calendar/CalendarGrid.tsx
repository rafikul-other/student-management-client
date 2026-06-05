import React from "react";
import { AttendanceRecord } from "../../types";

interface CalendarGridProps {
  year: number;
  month: number;
  attendance?: AttendanceRecord[];
  onDayClick?: (date: string, record?: AttendanceRecord) => void;
  readOnly?: boolean;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  attendance = [],
  onDayClick,
  readOnly = false,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const attendanceMap: Record<string, AttendanceRecord> = {};
  attendance.forEach((a) => {
    attendanceMap[a.date] = a;
  });

  const cells: React.ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="w-10 h-10" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const record = attendanceMap[dateStr];
    const isToday = dateStr === today;
    const isPast = dateStr < today;
    const isFuture = dateStr > today;

    let dotColor = "";
    if (record) {
      dotColor = record.present === "Present" ? "bg-green-500" : "bg-red-500";
    }

    const handleClick = () => {
      if (readOnly) return;
      if (isFuture) return;
      onDayClick?.(dateStr, record);
    };

    cells.push(
      <div
        key={day}
        onClick={handleClick}
        className={`relative w-10 h-10 flex flex-col items-center justify-center rounded-lg cursor-pointer transition select-none
          ${isToday ? "ring-2 ring-primary" : ""}
          ${isFuture && !readOnly ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-meta-4"}
          ${readOnly ? "cursor-default" : ""}
        `}
      >
        <span className={`text-sm font-medium ${isToday ? "text-primary font-bold" : "text-black dark:text-white"}`}>
          {day}
        </span>
        {dotColor && (
          <span className={`absolute bottom-1 w-2 h-2 rounded-full ${dotColor}`} />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="w-10 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    </div>
  );
};

export default CalendarGrid;
