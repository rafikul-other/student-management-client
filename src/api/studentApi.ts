import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const studentApi = {
  getAll: () => apiClient.get(ENDPOINTS.students.list),
  getById: (id: string) => apiClient.get(ENDPOINTS.students.get(id)),
  create: (data: { name: string; subject: string; email?: string }) =>
    apiClient.post(ENDPOINTS.students.create, data),
  bulkRegister: (students: { name: string; subject: string; email?: string }[]) =>
    apiClient.post(ENDPOINTS.students.bulk, { students }),
  update: (id: string, data: Record<string, unknown>) =>
    apiClient.put(ENDPOINTS.students.update(id), data),
  delete: (id: string) => apiClient.delete(ENDPOINTS.students.delete(id)),
  updateAboutMe: (id: string, aboutMe: string) =>
    apiClient.put(ENDPOINTS.students.updateAboutMe(id), { aboutMe }),
};