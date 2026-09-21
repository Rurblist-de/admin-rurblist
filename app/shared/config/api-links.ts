export const API_URL = (
  import.meta.env.VITEAPIURL ?? "http://localhost:6003"
).replace(/\/$/, "");

/** Non-JWT marker for Remix loaders / query `enabled` — real tokens are API httpOnly cookies. */
export const ADMIN_SESSION_COOKIE = "rublist_admin_session";
/** @deprecated Legacy names kept for logout cleanup only */
export const AUTHENTICATION_COOKIE = "rublist_admin_token";
export const REFRESH_TOKEN_COOKIE = "rublist_admin_refresh";
export const AUTH_STORAGE_KEY = "rublist-admin-auth";
