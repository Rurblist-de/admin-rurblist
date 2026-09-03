import type { Route } from "./+types/overview";
import { requirePermission } from "~/lib/permissions";
import { OverviewDashboard } from "~/features/overview/components/overview-dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Overview · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "overview" })(request);
  return null;
}

export default function Overview() {
  return <OverviewDashboard />;
}
