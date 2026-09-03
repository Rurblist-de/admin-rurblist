import type { ApiResponse } from "~/shared/api/base-response";
import type { AdminUser } from "~/services/api/types";
import {
  getAdminUser as getAdminUserRequest,
  getAdminUsers as getAdminUsersRequest,
  reviewAgentKyc as reviewAgentKycRequest,
  type UsersListData,
  type UsersListParams,
} from "./user-service";

export async function getAdminUsers(params: UsersListParams) {
  const res = await getAdminUsersRequest(params);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to load users.");
  }
  return res as ApiResponse<UsersListData>;
}

export async function getAdminUser(id: string) {
  const res = await getAdminUserRequest(id);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to load user.");
  }
  return res as ApiResponse<AdminUser>;
}

export async function reviewAgentKyc(id: string, action: "approve" | "reject") {
  const res = await reviewAgentKycRequest(id, action);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || `Unable to ${action} agent.`);
  }
  return res as ApiResponse<AdminUser>;
}
