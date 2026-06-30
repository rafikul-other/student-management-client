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
  markedBy?: "self" | "admin" | "manager";
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

export interface Admin {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface AttendanceReport {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  overallAttendanceRate: string;
  bySubject: Record<string, { total: number; present: number; absent: number; students: number }>;
  recentRecords: Array<{ student: string; subject: string; date: string; present: string; markedBy?: string }>;
}

export interface BulkImportResult {
  successCount: number;
  failedCount: number;
  successRecords: Array<{ _id: string; name: string; subject: string }>;
  failedRecords: Array<{ name: string; subject: string; reason: string }>;
}

export interface UserLogLocation {
  city?: string;
  region?: string;
  country?: string;
  lat?: number | null;
  lon?: number | null;
}

export interface UserLog {
  _id: string;
  userId: string;
  userType: UserRole;
  userName: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: UserLogLocation;
  createdAt: string;
  updatedAt: string;
}