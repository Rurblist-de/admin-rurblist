import { api } from "~/shared/api/call-apis";
import type { AdminUser } from "~/services/api/types";

export type UsersListParams = {
  q?: string;
  role?: string;
  state?: string;
  status?: string;
  queue?: boolean;
  page?: number;
  limit?: number;
};

export type UsersListData = {
  users: AdminUser[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  queueCount: number;
  from: number;
  to: number;
};

export function usersQueryString(params: UsersListParams) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.role) search.set("role", params.role);
  if (params.state) search.set("state", params.state);
  if (params.status) search.set("status", params.status);
  if (params.queue) search.set("queue", "approvals");
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 8));
  return search.toString();
}

export async function getAdminUsers(params: UsersListParams) {
  return api.authGet<UsersListData>(`/admin/users?${usersQueryString(params)}`);
}

export async function getAdminUser(id: string) {
  return api.authGet<AdminUser>(`/admin/users/${id}`);
}

export async function reviewAgentKyc(id: string, action: "approve" | "reject") {
  return api.authPatch<AdminUser>(`/admin/users/${id}/agent/${action}`);
}
