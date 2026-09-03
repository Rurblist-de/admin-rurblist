import {
  AUTHENTICATION_COOKIE,
  AUTH_STORAGE_KEY,
  REFRESH_TOKEN_COOKIE,
} from "~/shared/config/api-links";

const ACCESS_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export { AUTHENTICATION_COOKIE as AUTH_COOKIE, AUTH_STORAGE_KEY, REFRESH_TOKEN_COOKIE };

function cookieSecureFlag() {
  return import.meta.env.PROD ? "; Secure" : "";
}

export function parseCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function isStubToken(token: string | null) {
  return !token || token === "dev-admin";
}

export function getTokenFromRequest(request: Request): string | null {
  const token = parseCookie(request.headers.get("Cookie"), AUTHENTICATION_COOKIE);
  return isStubToken(token) ? null : token;
}

export function getRefreshTokenFromRequest(request: Request): string | null {
  return parseCookie(request.headers.get("Cookie"), REFRESH_TOKEN_COOKIE);
}

export function getTokenFromDocument(): string | null {
  if (typeof document === "undefined") return null;
  const token = parseCookie(document.cookie, AUTHENTICATION_COOKIE);
  return isStubToken(token) ? null : token;
}

export function getRefreshTokenFromDocument(): string | null {
  if (typeof document === "undefined") return null;
  return parseCookie(document.cookie, REFRESH_TOKEN_COOKIE);
}

export function buildSetAuthCookie(token: string) {
  return `${AUTHENTICATION_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=${ACCESS_MAX_AGE_SECONDS}${cookieSecureFlag()}`;
}

export function buildSetRefreshCookie(token: string) {
  return `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=${REFRESH_MAX_AGE_SECONDS}${cookieSecureFlag()}`;
}

export function buildClearAuthCookie() {
  return `${AUTHENTICATION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${cookieSecureFlag()}`;
}

export function buildClearRefreshCookie() {
  return `${REFRESH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${cookieSecureFlag()}`;
}

export function setAuthSession(accessToken: string, refreshToken?: string) {
  if (typeof document === "undefined") return;
  document.cookie = buildSetAuthCookie(accessToken);
  if (refreshToken) {
    document.cookie = buildSetRefreshCookie(refreshToken);
  }
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
  } catch {
    // ignore
  }
}

export function setAuthCookie(token: string) {
  setAuthSession(token);
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = buildClearAuthCookie();
  document.cookie = buildClearRefreshCookie();
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function logoutClient() {
  clearAuthCookie();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
