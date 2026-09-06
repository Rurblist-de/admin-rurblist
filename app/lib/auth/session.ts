import { ADMIN_SESSION_COOKIE } from "~/shared/config/api-links";

/** UI/SSR marker only — not a JWT. Real auth is httpOnly cookies on the API host. */
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export { ADMIN_SESSION_COOKIE as AUTH_COOKIE };

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

function isActiveSessionMarker(value: string | null) {
  return value === "1";
}

export function hasSessionFromRequest(request: Request): boolean {
  return isActiveSessionMarker(
    parseCookie(request.headers.get("Cookie"), ADMIN_SESSION_COOKIE),
  );
}

export function hasSessionFromDocument(): boolean {
  if (typeof document === "undefined") return false;
  return isActiveSessionMarker(
    parseCookie(document.cookie, ADMIN_SESSION_COOKIE),
  );
}

/** @deprecated Use hasSessionFromRequest — no JWT is stored on the admin origin. */
export function getTokenFromRequest(request: Request): string | null {
  return hasSessionFromRequest(request) ? "1" : null;
}

/** @deprecated Use hasSessionFromDocument — no JWT is stored on the admin origin. */
export function getTokenFromDocument(): string | null {
  return hasSessionFromDocument() ? "1" : null;
}

function buildSetSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=1; Path=/; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${cookieSecureFlag()}`;
}

function buildClearSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${cookieSecureFlag()}`;
}

function buildClearLegacyAuthCookie() {
  return `rublist_admin_token=; Path=/; Max-Age=0; SameSite=Lax${cookieSecureFlag()}`;
}

function buildClearLegacyRefreshCookie() {
  return `rublist_admin_refresh=; Path=/; Max-Age=0; SameSite=Lax${cookieSecureFlag()}`;
}

/** SSR Set-Cookie values that clear the session marker + legacy JWT mirrors. */
export function buildClearSessionCookies(): string[] {
  return [
    buildClearSessionCookie(),
    buildClearLegacyAuthCookie(),
    buildClearLegacyRefreshCookie(),
  ];
}

/** @deprecated Prefer buildClearSessionCookies() */
export function buildClearAuthCookie() {
  return buildClearSessionCookie();
}

/** @deprecated Prefer buildClearSessionCookies() */
export function buildClearRefreshCookie() {
  return buildClearLegacyRefreshCookie();
}

/** Mark the admin UI as signed in. API JWTs stay in httpOnly API cookies only. */
export function setAuthSession() {
  if (typeof document === "undefined") return;
  document.cookie = buildSetSessionCookie();
  try {
    localStorage.removeItem("rublist-admin-auth");
  } catch {
    // ignore
  }
}

export function setAuthCookie() {
  setAuthSession();
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = buildClearSessionCookie();
  // Legacy JWT mirrors from older builds
  document.cookie = `rublist_admin_token=; Path=/; Max-Age=0; SameSite=Lax${cookieSecureFlag()}`;
  document.cookie = `rublist_admin_refresh=; Path=/; Max-Age=0; SameSite=Lax${cookieSecureFlag()}`;
  try {
    localStorage.removeItem("rublist-admin-auth");
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
