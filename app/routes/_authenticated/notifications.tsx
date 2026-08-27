import type { Route } from "./+types/notifications";
import { PageHeader } from "~/components/layout/page-header";
import { MOCK_NOTIFICATIONS } from "~/services/api/mocks";
import { formatDate } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Notifications · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "notification" })(request);
  return { items: MOCK_NOTIFICATIONS };
}

export default function Notifications({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="In-app admin alerts. Today Rublist only sends email."
      />
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-stroke bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
              <p className="text-xs text-muted">{formatDate(item.createdAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
