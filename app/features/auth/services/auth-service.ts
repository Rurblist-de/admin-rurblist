import type { ApiResponse } from "~/shared/api/base-response";
import { api } from "~/shared/api/call-apis";
import { setAuthSession, clearAuthCookie } from "~/lib/auth/session";
import type { AuthMe } from "~/services/api/types";
import type { AdminLoginData, LoginPayload } from "../models";

export async function loginAdminRequest(
  data: LoginPayload,
): Promise<ApiResponse<AdminLoginData>> {
  const res = await api.post<AdminLoginData>("/auth/admin-login", data);

  if ((res.statusCode ?? 0) < 400 && res.data?.authenticated) {
    setAuthSession();
  }

  return res;
}

export async function getAdminMeRequest(): Promise<ApiResponse<AuthMe>> {
  return api.authGet<AuthMe>("/auth/me");
}

export async function logoutAdminRequest(): Promise<ApiResponse<null>> {
  const res = await api.authPost<null>("/auth/logout");
  clearAuthCookie();
  return res;
}
