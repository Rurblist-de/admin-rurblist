import { Link } from "react-router";
import type { Route } from "./+types/escrow.$verificationId";
import { PageHeader } from "~/components/layout/page-header";
import { StatusBadge } from "~/components/ui/status-badge";
import { MOCK_VERIFICATIONS } from "~/services/api/mocks";
import { formatNaira } from "~/lib/format";
import { Can, requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Escrow timeline · Rublist Admin" }];
}

export function loader({ request, params }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "verification" })(request);
  return {
    verification:
      MOCK_VERIFICATIONS.find((v) => v.id === params.verificationId) ?? null,
  };
}

export default function EscrowDetail({ loaderData }: Route.ComponentProps) {
  const { verification } = loaderData;

  if (!verification) {
    return <p className="text-sm text-muted">Verification not found.</p>;
  }

  return (
    <div>
      <Link to="/escrow" className="text-sm text-muted hover:text-ink">
        Escrow & Payments
      </Link>
      <PageHeader
        title={verification.paymentReference}
        description={`${verification.propertyTitle} · ${formatNaira(verification.amount)}`}
        actions={
          <Can action="approve" resource="payment">
            <button
              type="button"
              className="h-9 rounded-md bg-accent px-3 text-sm text-white"
              disabled={verification.fundsReleased}
            >
              {verification.fundsReleased ? "Funds released" : "Release funds"}
            </button>
          </Can>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-stroke bg-white p-5">
          <h2 className="text-sm font-medium">Transaction timeline</h2>
          <ol className="mt-4 space-y-4">
            {verification.timeline.map((event) => (
              <li key={event.id} className="flex gap-3">
                <span
                  className={`mt-1 size-2.5 shrink-0 rounded-full ${
                    event.status === "done"
                      ? "bg-emerald-500"
                      : event.status === "current"
                        ? "bg-accent"
                        : "bg-stroke"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted">{event.description}</p>
                  {event.date ? (
                    <p className="text-xs text-muted">{event.date}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-lg border border-stroke bg-white p-5">
          <h2 className="text-sm font-medium">Documents</h2>
          <ul className="mt-4 space-y-2">
            {verification.documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between rounded-md border border-stroke px-3 py-2 text-sm"
              >
                <span>{doc.name}</span>
                <StatusBadge
                  tone={
                    doc.status === "verified"
                      ? "success"
                      : doc.status === "rejected"
                        ? "danger"
                        : "warning"
                  }
                >
                  {doc.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted">Buyer</dt>
              <dd>{verification.buyerName}</dd>
            </div>
            <div>
              <dt className="text-muted">Agent</dt>
              <dd>{verification.agentName}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
