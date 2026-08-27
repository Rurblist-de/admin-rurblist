const AUTH_COOKIE = "rublist_admin_token";
const AUTH_STORAGE_KEY = "rublist-admin-auth";

export { AUTH_COOKIE, AUTH_STORAGE_KEY };

export function parseCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function getTokenFromRequest(request: Request): string | null {
  return parseCookie(request.headers.get("Cookie"), AUTH_COOKIE);
}

export function getTokenFromDocument(): string | null {
  if (typeof document === "undefined") return null;
  return parseCookie(document.cookie, AUTH_COOKIE);
}

export function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}
