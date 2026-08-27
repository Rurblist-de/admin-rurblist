import axios from "axios";
import { getTokenFromDocument } from "~/lib/auth/session";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
  withCredentials: true,
  timeout: 30_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getTokenFromDocument();
  if (token && token !== "dev-admin") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
