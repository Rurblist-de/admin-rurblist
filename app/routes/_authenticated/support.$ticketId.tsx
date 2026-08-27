import { Link } from "react-router";
import type { Route } from "./+types/support.$ticketId";
import { PageHeader } from "~/components/layout/page-header";
import { StatusBadge } from "~/components/ui/status-badge";
import { MOCK_TICKETS } from "~/services/api/mocks";
import { formatDate } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Ticket · Rublist Admin" }];
}

export function loader({ request, params }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "ticket" })(request);
  return { ticket: MOCK_TICKETS.find((t) => t.id === params.ticketId) ?? null };
}

export default function TicketDetail({ loaderData }: Route.ComponentProps) {
  const { ticket } = loaderData;

  if (!ticket) {
    return <p className="text-sm text-muted">Ticket not found.</p>;
  }

  return (
    <div>
      <Link to="/support" className="text-sm text-muted hover:text-ink">
        Support
      </Link>
      <PageHeader
        title={ticket.subject}
        description={`${ticket.requester} · ${formatDate(ticket.createdAt)}`}
      />
      <section className="rounded-lg border border-stroke bg-white p-5 text-sm">
        <StatusBadge tone="warning">{ticket.status}</StatusBadge>
        <p className="mt-4 text-muted">Thread and replies land here when the ticket API exists.</p>
      </section>
    </div>
  );
}
