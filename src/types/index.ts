export type UserRole = "SuperAdmin" | "Admin" | "DepartmentManager" | "Student";

export interface User {
  _id?: string;
  name: string;
  email?: string;
  subject?: string;
  role: UserRole;
  department?: string;
  aboutMe?: string;
  token?: string;
}

export interface AttendanceRecord {
  date: string;
  present: "Present" | "Absent";
}

export interface Student {
  _id: string;
  name: string;
  subject: string;
  email?: string;
  aboutMe?: string;
  assignedManager?: string;
  attendance: AttendanceRecord[];
  totalPresent?: number;
  totalAbsent?: number;
  totalAttendance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentManager {
  _id: string;
  name: string;
  email: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export interface AttendanceReport {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  overallAttendanceRate: string;
  bySubject: Record<string, { total: number; present: number; absent: number; students: number }>;
  recentRecords: Array<{ student: string; subject: string; date: string; present: string }>;
}

export interface BulkImportResult {
  successCount: number;
  failedCount: number;
  successRecords: Array<{ _id: string; name: string; subject: string }>;
  failedRecords: Array<{ name: string; subject: string; reason: string }>;
}