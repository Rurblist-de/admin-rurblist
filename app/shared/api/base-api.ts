import { API_URL } from "~/shared/config/api-links";
import {
  getTokenFromDocument,
  logoutClient,
} from "~/lib/auth/session";
import {
  getRefreshing,
  onRefreshed,
  setRefreshing,
  subscribeTokenRefresh,
} from "~/shared/utils/token-manager";
import type { ApiErrorPayload, ApiResponse, HttpMethod } from "./base-response";
import { getErrorMessage, normalizeApiErrors } from "./errors";
import { refreshTokenRequest } from "./refresh-token";

const DEFAULT_TIMEOUT = 30_000;

function buildErrorResponse(
  message: string,
  statusCode: number,
  error = "Request failed",
  errors?: ApiErrorPayload,
): ApiResponse<never> {
  return {
    error,
    message,
    statusCode,
    errors: normalizeApiErrors(errors),
  };
}

export type BlobResponse = {
  blob: Blob;
  headers: Record<string, string>;
};

type ParsedApiResponse = {
  data?: unknown;
  message?: string | string[];
  statusCode?: number;
  error?: string;
  errors?: ApiErrorPayload;
  success?: boolean;
  count?: number;
  hasNextPage?: boolean;
  nextCursor?: ApiResponse<unknown>["nextCursor"];
};

type RequestOptions = {
  payload?: unknown;
  protected?: boolean;
  retries?: number;
  responseType?: "json" | "blob";
  retried?: boolean;
};

export async function request<T = unknown>(
  method: HttpMethod,
  path: string,
  options?: Omit<RequestOptions, "responseType"> & { responseType?: "json" },
): Promise<ApiResponse<T>>;

export async function request(
  method: HttpMethod,
  path: string,
  options: Omit<RequestOptions, "responseType"> & { responseType: "blob" },
): Promise<BlobResponse | ApiResponse<never>>;

export async function request<T = unknown>(
  method: HttpMethod,
  path: string,
  options?: RequestOptions,
): Promise<ApiResponse<T> | BlobResponse> {
  const payload = options?.payload;
  const protectedRoute = options?.protected;
  const retries = options?.retries ?? 1;
  const responseType = options?.responseType ?? "json";
  const retried = options?.retried ?? false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const token = getTokenFromDocument();
    const headers: HeadersInit = {};
    const isFormData = payload instanceof FormData;

    if (!isFormData && responseType === "json") {
      headers["Content-Type"] = "application/json";
    }

    if (protectedRoute && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(`/api/v1${path}`, API_URL);

    const response = await fetch(url, {
      method,
      headers,
      body:
        method !== "GET" && payload
          ? payload instanceof FormData
            ? payload
            : JSON.stringify(payload)
          : undefined,
      cache: "no-store",
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeout);

    if (response.status === 401 && protectedRoute && !retried) {
      if (!getRefreshing()) {
        setRefreshing(true);
        try {
          const refreshRes = await refreshTokenRequest();
          const newToken = refreshRes.data?.accessToken;

          if (!newToken) throw new Error("Refresh failed");

          onRefreshed(newToken);
          setRefreshing(false);

          return request<T>(method, path, {
            payload,
            protected: protectedRoute,
            retried: true,
          });
        } catch {
          setRefreshing(false);
          logoutClient();
          return buildErrorResponse(
            "Session expired. Please login again.",
            401,
            "SESSION_EXPIRED",
          );
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh(async () => {
          const result = await request<T>(method, path, {
            payload,
            protected: protectedRoute,
            retried: true,
          });
          resolve(result);
        });
      });
    }

    if (responseType === "blob") {
      if (!response.ok) {
        const err = (await response.json()) as ParsedApiResponse;
        return buildErrorResponse(
          getErrorMessage(err) ?? "Something went wrong",
          err?.statusCode ?? response.status,
          err?.error ?? "Download failed",
          err?.errors,
        );
      }

      const headersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      return {
        blob: await response.blob(),
        headers: headersObj,
      };
    }

    const contentType = response.headers.get("content-type");
    let parsed: ParsedApiResponse | null = null;

    if (contentType?.includes("application/json")) {
      parsed = (await response.json()) as ParsedApiResponse;
    }

    if (!response.ok || parsed?.error || (parsed?.statusCode ?? 0) >= 400) {
      return buildErrorResponse(
        getErrorMessage(parsed) ?? "Something went wrong",
        parsed?.statusCode ?? response.status,
        parsed?.error ?? "Request failed",
        parsed?.errors,
      );
    }

    return {
      data: parsed?.data as T,
      message: getErrorMessage(parsed) ?? "Success",
      statusCode: response.status,
      errors: normalizeApiErrors(parsed?.errors),
      success: parsed?.success,
      count: parsed?.count,
      hasNextPage: parsed?.hasNextPage,
      nextCursor: parsed?.nextCursor,
    };
  } catch (error) {
    clearTimeout(timeout);

    if (retries > 0) {
      return request<T>(method, path, {
        payload,
        protected: protectedRoute,
        retries: retries - 1,
        retried,
      });
    }

    console.error("REQUEST ERROR:", error);

    return {
      error: "Network Error",
      message: "Unable to connect to server",
      statusCode: 500,
    };
  }
}
