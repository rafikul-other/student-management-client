import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const attendanceApi = {
  mark: (data: { name: string; subject: string; date: string; present: string }) =>
    apiClient.post(ENDPOINTS.attendance.mark, data),
  update: (studentId: string, data: { date: string; present: string }) =>
    apiClient.put(ENDPOINTS.attendance.update(studentId), data),
  getStudentAttendance: (studentId: string) =>
    apiClient.get(ENDPOINTS.attendance.studentAttendance(studentId)),
  getReport: (subject?: string) =>
    apiClient.get(ENDPOINTS.attendance.report, { params: { subject } }),
};