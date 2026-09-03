import type { Route } from "./+types/users";
import { requirePermission } from "~/lib/permissions";
import { UsersPage } from "~/features/users/components/users-page";
import type { UsersListParams } from "~/features/users/services";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Users · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "user" })(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || undefined;
  const role = url.searchParams.get("role") || undefined;
  const state = url.searchParams.get("state") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const filters: UsersListParams = {
    ...(q ? { q } : {}),
    ...(role ? { role } : {}),
    ...(state ? { state } : {}),
    ...(status ? { status } : {}),
    queue: url.searchParams.get("queue") === "approvals",
    page: Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1),
    limit: 8,
  };

  return { filters };
}

export default function Users({ loaderData }: Route.ComponentProps) {
  return <UsersPage filters={loaderData.filters} />;
}
