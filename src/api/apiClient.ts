import axios from "axios";
import BaseUrl from "../BaseUrl/BaseUrl";

const authStorageKeys = ["user", "token", "type", "name", "studentId", "about"];

const clearAuthStorage = () => {
  authStorageKeys.forEach((key) => localStorage.removeItem(key));
};

const apiClient = axios.create({
  baseURL: BaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
