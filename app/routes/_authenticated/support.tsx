import { Link } from "react-router";
import type { Route } from "./+types/support";
import { PageHeader } from "~/components/layout/page-header";
import { DataTable } from "~/components/ui/data-table";
import { StatusBadge } from "~/components/ui/status-badge";
import { MOCK_TICKETS } from "~/services/api/mocks";
import { formatDate } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Support · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "ticket" })(request);
  return { tickets: MOCK_TICKETS };
}

export default function Support({ loaderData }: Route.ComponentProps) {
  const { tickets } = loaderData;

  return (
    <div>
      <PageHeader
        title="Support / Ticket"
        description="Inbound queue. No ticket API on Rublist-Backend yet."
      />
      <DataTable
        headers={["Subject", "Requester", "Status", "Opened", ""]}
        rows={tickets.map((ticket) => [
          ticket.subject,
          ticket.requester,
          <StatusBadge key={ticket.id} tone="warning">
            {ticket.status}
          </StatusBadge>,
          formatDate(ticket.createdAt),
          <Link key={`${ticket.id}-link`} to={`/support/${ticket.id}`} className="text-accent">
            Open
          </Link>,
        ])}
      />
    </div>
  );
}
