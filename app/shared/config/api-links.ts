export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:6003"
).replace(/\/$/, "");

export const AUTHENTICATION_COOKIE = "rublist_admin_token";
export const REFRESH_TOKEN_COOKIE = "rublist_admin_refresh";
export const AUTH_STORAGE_KEY = "rublist-admin-auth";
