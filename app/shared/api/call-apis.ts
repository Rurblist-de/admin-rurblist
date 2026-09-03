import { request } from "./base-api";
import type { ApiResponse } from "./base-response";

export const api = {
  get: <T>(path: string): Promise<ApiResponse<T>> => request<T>("GET", path),

  post: <T>(path: string, payload?: unknown): Promise<ApiResponse<T>> =>
    request<T>("POST", path, { payload }),

  patch: <T>(path: string, payload?: unknown): Promise<ApiResponse<T>> =>
    request<T>("PATCH", path, { payload }),

  put: <T>(path: string, payload?: unknown): Promise<ApiResponse<T>> =>
    request<T>("PUT", path, { payload }),

  delete: <T>(path: string): Promise<ApiResponse<T>> =>
    request<T>("DELETE", path),

  authGet: <T>(path: string): Promise<ApiResponse<T>> =>
    request<T>("GET", path, { protected: true }),

  authPost: <T>(path: string, payload?: unknown): Promise<ApiResponse<T>> =>
    request<T>("POST", path, { payload, protected: true }),

  authPatch: <T>(path: string, payload?: unknown): Promise<ApiResponse<T>> =>
    request<T>("PATCH", path, { payload, protected: true }),

  authPut: <T>(path: string, payload?: unknown): Promise<ApiResponse<T>> =>
    request<T>("PUT", path, { payload, protected: true }),

  authDelete: <T>(path: string): Promise<ApiResponse<T>> =>
    request<T>("DELETE", path, { protected: true }),
};
