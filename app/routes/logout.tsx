import { redirect } from "react-router";
import { buildClearSessionCookies } from "~/lib/auth/session";

export function action() {
  const headers = new Headers();
  for (const cookie of buildClearSessionCookies()) {
    headers.append("Set-Cookie", cookie);
  }
  throw redirect("/login", { headers });
}

export function loader() {
  throw redirect("/login");
}
