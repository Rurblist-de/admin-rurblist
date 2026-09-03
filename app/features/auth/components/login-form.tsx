import { useState, type FormEvent } from "react";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const login = useLogin();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError(null);
    login.mutate(
      { email, password },
      {
        onError: (err) => {
          setError(err.message || "Unable to sign in. Please try again.");
        },
      },
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-xl border border-stroke bg-white p-8"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-accent">
        Rublist
      </p>
      <h1 className="mt-2 text-xl font-semibold">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in with an Admin or Super Admin account.
      </p>

      <label className="mt-6 block text-sm font-medium text-ink">
        Email
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          className="mt-1.5 h-10 w-full rounded-md border border-stroke px-3 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-ink">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="mt-1.5 h-10 w-full rounded-md border border-stroke px-3 text-sm outline-none focus:border-accent"
        />
      </label>

      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={login.isPending}
        className="mt-6 h-10 w-full rounded-md bg-accent text-sm font-medium text-white disabled:opacity-70"
      >
        {login.isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
