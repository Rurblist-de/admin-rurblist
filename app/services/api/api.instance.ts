import axios from "axios";
import { clearAuthCookie, getTokenFromDocument } from "~/lib/auth/session";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:6003",
  withCredentials: true,
  timeout: 30_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getTokenFromDocument();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAuthCookie();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
