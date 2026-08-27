import { Link } from "react-router";
import type { Route } from "./+types/escrow";
import { PageHeader } from "~/components/layout/page-header";
import { DataTable } from "~/components/ui/data-table";
import { StatusBadge } from "~/components/ui/status-badge";
import { MOCK_PAYMENTS } from "~/services/api/mocks";
import { formatDate, formatNaira } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Escrow & Payments · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "payment" })(request);
  return { payments: MOCK_PAYMENTS };
}

function paymentTone(status: string) {
  if (status === "success") return "success" as const;
  if (status === "failed") return "danger" as const;
  if (status === "pending") return "warning" as const;
  return "neutral" as const;
}

export default function Escrow({ loaderData }: Route.ComponentProps) {
  const { payments } = loaderData;

  return (
    <div>
      <PageHeader
        title="Escrow & Payments"
        description="Transactions, document review, and payouts. Detail maps to Verification, not a second escrow model."
      />
      <DataTable
        headers={["Reference", "Property", "Amount", "Type", "Status", "Date", ""]}
        rows={payments.map((payment) => [
          payment.reference,
          payment.propertyTitle,
          formatNaira(payment.amount),
          payment.paymentFor,
          <StatusBadge key={`${payment.id}-status`} tone={paymentTone(payment.status)}>
            {payment.status}
          </StatusBadge>,
          formatDate(payment.createdAt),
          payment.verificationId ? (
            <Link
              key={`${payment.id}-link`}
              to={`/escrow/${payment.verificationId}`}
              className="text-accent"
            >
              Timeline
            </Link>
          ) : (
            "—"
          ),
        ])}
      />
    </div>
  );
}
