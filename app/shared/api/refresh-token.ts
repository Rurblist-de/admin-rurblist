import { API_URL } from "~/shared/config/api-links";
import { setAuthSession } from "~/lib/auth/session";
import type { ApiResponse } from "./base-response";

export type RefreshResponse = {
  authenticated?: boolean;
};

export async function refreshTokenRequest(): Promise<
  ApiResponse<RefreshResponse>
> {
  const response = await fetch(new URL("/api/v1/auth/refresh-token", API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });

  const res = (await response.json()) as ApiResponse<RefreshResponse>;

  if (response.ok && res.data?.authenticated) {
    setAuthSession();

    return {
      ...res,
      statusCode: response.status,
      message: res.message || "success",
      data: { authenticated: true },
    };
  }

  return {
    ...res,
    statusCode: response.status,
    message: res.message || "Refresh failed",
    error: res.error || "SESSION_EXPIRED",
  };
}
