import { API_URL } from "~/shared/config/api-links";
import {
  getRefreshTokenFromDocument,
  setAuthSession,
} from "~/lib/auth/session";
import type { ApiResponse } from "./base-response";

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function refreshTokenRequest(): Promise<
  ApiResponse<RefreshResponse>
> {
  const refreshToken = getRefreshTokenFromDocument();

  if (!refreshToken) {
    return {
      message: "Refresh token missing",
      statusCode: 401,
      error: "SESSION_EXPIRED",
    };
  }

  const response = await fetch(new URL("/api/v1/auth/refresh-token", API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    credentials: "include",
    cache: "no-store",
  });

  const res = (await response.json()) as ApiResponse<RefreshResponse>;

  if (response.ok) {
    const accessToken = res.data?.accessToken;
    const nextRefreshToken = res.data?.refreshToken;

    if (accessToken && nextRefreshToken) {
      setAuthSession(accessToken, nextRefreshToken);
    }

    return {
      ...res,
      statusCode: response.status,
      message: res.message || "success",
    };
  }

  return {
    ...res,
    statusCode: response.status,
    message: res.message || "Refresh failed",
    error: res.error || "SESSION_EXPIRED",
  };
}
