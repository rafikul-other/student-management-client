export const ENDPOINTS = {
  auth: {
    superAdminLogin: "/auth/superadmin/login",
    adminLogin: "/auth/admin/login",
    departmentManagerLogin: "/auth/department-manager/login",
    studentLogin: "/auth/student/login",
    studentRegister: "/auth/student/register",
  },
  students: {
    list: "/students",
    create: "/students",
    bulk: "/students/bulk",
    get: (id: string) => `/students/${id}`,
    update: (id: string) => `/students/${id}`,
    delete: (id: string) => `/students/${id}`,
    updateAboutMe: (id: string) => `/students/${id}/about-me`,
  },
  attendance: {
    mark: "/attendance/mark",
    update: (studentId: string) => `/attendance/${studentId}`,
    studentAttendance: (studentId: string) => `/attendance/student/${studentId}`,
    report: "/attendance/report",
  },
  departmentManagers: {
    list: "/department-managers",
    create: "/department-managers",
    get: (id: string) => `/department-managers/${id}`,
    update: (id: string) => `/department-managers/${id}`,
    delete: (id: string) => `/department-managers/${id}`,
  },
};