import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { getTokenFromRequest } from "~/lib/auth/session";
import { LoginForm } from "~/features/auth/components/login-form";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign in · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  if (getTokenFromRequest(request)) {
    throw redirect("/overview");
  }
  return null;
}

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas">
      <LoginForm />
    </main>
  );
}
