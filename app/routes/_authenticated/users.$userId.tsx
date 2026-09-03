import type { Route } from "./+types/users.$userId";
import { requirePermission } from "~/lib/permissions";
import { UserDetailPage } from "~/features/users/components/user-detail-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "User · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "user" })(request);
  return null;
}

export default function UserDetail({ params }: Route.ComponentProps) {
  return <UserDetailPage userId={params.userId} />;
}
