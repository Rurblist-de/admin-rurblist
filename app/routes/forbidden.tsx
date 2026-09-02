import { Link } from "react-router";
import type { Route } from "./+types/forbidden";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Forbidden · Rublist Admin" }];
}

export default function Forbidden() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas">
      <h1 className="text-xl font-semibold">403</h1>
      <p className="text-sm text-muted">
        You do not have access to that resource.
      </p>
      <Link to="/overview" className="text-sm text-accent">
        Back to overview
      </Link>
    </main>
  );
}
