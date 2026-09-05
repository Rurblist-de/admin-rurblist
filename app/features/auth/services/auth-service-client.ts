import type { ApiResponse } from "~/shared/api/base-response";
import type { AuthMe } from "~/services/api/types";
import type { AdminLoginData, LoginPayload } from "../models";
import {
  getAdminMeRequest,
  loginAdminRequest,
  logoutAdminRequest,
} from "./auth-service";

export async function loginAdmin(
  data: LoginPayload,
): Promise<ApiResponse<AdminLoginData>> {
  const res = await loginAdminRequest(data);

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  if (!res.data?.authenticated) {
    throw new Error("Authentication failed");
  }

  return res;
}

export async function getAdminMe(): Promise<ApiResponse<AuthMe>> {
  const res = await getAdminMeRequest();

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}

export async function logoutAdmin(): Promise<ApiResponse<null>> {
  const res = await logoutAdminRequest();

  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }

  return res;
}
