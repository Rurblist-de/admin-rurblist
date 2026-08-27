import type { Route } from "./+types/audit-logs";
import { PageHeader } from "~/components/layout/page-header";
import { DataTable } from "~/components/ui/data-table";
import { MOCK_AUDIT_LOGS } from "~/services/api/mocks";
import { formatDate } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Audit logs · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "audit_log" })(request);
  return { logs: MOCK_AUDIT_LOGS };
}

export default function AuditLogs({ loaderData }: Route.ComponentProps) {
  const { logs } = loaderData;

  return (
    <div>
      <PageHeader
        title="Audit logs"
        description="Who changed KYC, listings, escrow stages, or payouts. Backend model does not exist yet."
      />
      <DataTable
        headers={["When", "Actor", "Action", "Resource", "Summary"]}
        rows={logs.map((log) => [
          formatDate(log.createdAt),
          log.actor,
          log.action,
          log.resource,
          log.summary,
        ])}
      />
    </div>
  );
}
