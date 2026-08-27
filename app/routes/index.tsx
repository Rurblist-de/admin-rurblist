import { redirect } from "react-router";
import type { Route } from "./+types/index";
import { getTokenFromRequest } from "~/lib/auth/session";

export function loader({ request }: Route.LoaderArgs) {
  throw redirect(getTokenFromRequest(request) ? "/overview" : "/login");
}
