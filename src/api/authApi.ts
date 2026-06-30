import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface LoginExtras {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
}

export const authApi = {
  superAdminLogin: (data: { id: string; password: string; role: string } & LoginExtras) =>
    apiClient.post(ENDPOINTS.auth.superAdminLogin, data),
  adminLogin: (data: { id: string; password: string; role: string } & LoginExtras) =>
    apiClient.post(ENDPOINTS.auth.adminLogin, data),
  departmentManagerLogin: (data: { email: string; password: string; role: string } & LoginExtras) =>
    apiClient.post(ENDPOINTS.auth.departmentManagerLogin, data),
  studentLogin: (data: { name: string; subject: string; role: string } & LoginExtras) =>
    apiClient.post(ENDPOINTS.auth.studentLogin, data),
  studentRegister: (data: { name: string; subject: string }) =>
    apiClient.post(ENDPOINTS.auth.studentRegister, data),
};
