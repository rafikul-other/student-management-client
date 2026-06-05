import apiClient from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export interface Message {
  _id: string;
  fromManager: string;
  fromName: string;
  fromDepartment: string;
  toAdmin: string;
  toName: string;
  subject: string;
  message: string;
  status: "pending" | "processing" | "done" | "rejected";
  resolution: string;
  createdAt: string;
}

export const messageApi = {
  getAll: () => apiClient.get<{ data: Message[] }>(ENDPOINTS.messages.list),
  create: (data: { subject: string; message: string }) =>
    apiClient.post(ENDPOINTS.messages.create, data),
  updateStatus: (id: string, data: { status: string; resolution?: string }) =>
    apiClient.put(ENDPOINTS.messages.updateStatus(id), data),
};