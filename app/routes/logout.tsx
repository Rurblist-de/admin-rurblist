import { redirect } from "react-router";
import {
  buildClearAuthCookie,
  buildClearRefreshCookie,
} from "~/lib/auth/session";

export function action() {
  const headers = new Headers();
  headers.append("Set-Cookie", buildClearAuthCookie());
  headers.append("Set-Cookie", buildClearRefreshCookie());
  throw redirect("/login", { headers });
}

export function loader() {
  throw redirect("/login");
}
