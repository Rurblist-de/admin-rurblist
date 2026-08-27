import type { FormEvent } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { getTokenFromRequest, setAuthCookie } from "~/lib/auth/session";

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
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthCookie("dev-admin");
    window.location.href = "/overview";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-stroke bg-white p-8"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          Rublist
        </p>
        <h1 className="mt-2 text-xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Local stub until Rublist-Backend exposes admin `/auth/me`.
        </p>
        <button
          type="submit"
          className="mt-6 h-10 w-full rounded-md bg-accent text-sm font-medium text-white"
        >
          Continue as admin
        </button>
      </form>
    </main>
  );
}
