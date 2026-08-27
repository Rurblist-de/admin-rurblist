import { Link, NavLink, Outlet, useParams, useSearchParams } from "react-router";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { Route } from "./+types/escrow";
import { PageHeader } from "~/components/layout/page-header";
import {
  MOCK_DISPUTES,
  MOCK_ESCROW_SUMMARY,
  MOCK_PAYMENTS,
  MOCK_PAYOUTS,
} from "~/services/api/mocks";
import { formatDate, formatNaira } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";
import type { DisputeStatus, EscrowLedgerStatus } from "~/services/api/types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Escrow & Payments · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "payment" })(request);
  return {
    disputes: MOCK_DISPUTES,
    payments: MOCK_PAYMENTS,
    payouts: MOCK_PAYOUTS,
    summary: MOCK_ESCROW_SUMMARY,
  };
}

type EscrowTab = "ledger" | "disputes" | "payouts";

export default function Escrow({ loaderData }: Route.ComponentProps) {
  const { disputes, payments, payouts, summary } = loaderData;
  const { verificationId } = useParams();
  const [searchParams] = useSearchParams();
  const tab = resolveTab(verificationId, searchParams.get("tab"));
  const txSelected = Boolean(verificationId && !verificationId.startsWith("DSP"));

  if (txSelected) {
    return <Outlet />;
  }

  return (
    <div>
      <PageHeader
        title="Escrow & Payments"
        description="Track transactions, handle disputes, and manage payouts."
      />

      <nav className="mb-5 inline-flex rounded-lg border border-stroke bg-white p-1">
        <TabLink to="/escrow?tab=ledger" active={tab === "ledger"}>
          Transaction Ledger
        </TabLink>
        <TabLink
          to="/escrow?tab=disputes"
          active={tab === "disputes"}
          count={disputes.length}
        >
          Disputes
        </TabLink>
        <TabLink to="/escrow?tab=payouts" active={tab === "payouts"}>
          Agents Payouts
        </TabLink>
      </nav>

      {tab === "ledger" ? (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="overflow-x-auto rounded-xl border border-stroke bg-white">
            <table className="w-max min-w-full text-left text-xs">
              <thead className="border-b border-stroke text-[10px] font-medium uppercase tracking-wide text-muted">
                <tr>
                  {["ID", "Property", "Amount", "Status", "Date", ""].map(
                    (header) => (
                      <th
                        key={header || "actions"}
                        className="whitespace-nowrap px-5 py-2.5 font-medium"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-stroke last:border-0"
                  >
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-ink">
                      {payment.reference}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-ink">
                      {payment.propertyTitle}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-ink">
                      {formatNaira(payment.amount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <LedgerStatus status={payment.escrowStatus} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <Link
                        to={`/escrow/${payment.id}`}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-stroke bg-white px-2.5 text-[11px] font-medium uppercase tracking-wide text-ink"
                      >
                        View
                        <ChevronDown className="size-3.5" strokeWidth={1.75} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="rounded-xl border border-stroke bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <SummaryRow
                label="Total Volume"
                value={formatNaira(summary.totalVolume)}
              />
              <SummaryRow
                label="In Escrow"
                value={formatNaira(summary.inEscrow)}
                valueClass="text-slate-500"
              />
              <SummaryRow
                label="Released"
                value={formatNaira(summary.released)}
                valueClass="text-emerald-600"
              />
              <SummaryRow
                label="Disputed"
                value={formatNaira(summary.disputed)}
                valueClass="text-red-600"
              />
            </dl>
          </aside>
        </div>
      ) : null}

      {tab === "payouts" ? (
        <div className="overflow-hidden rounded-xl border border-stroke bg-white">
          <table className="w-max min-w-full text-left text-xs">
            <thead className="border-b border-stroke text-[10px] font-medium uppercase tracking-wide text-muted">
              <tr>
                {["ID", "Agent", "Amount", "Status", "Date"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-5 py-2.5 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="border-b border-stroke last:border-0">
                  <td className="whitespace-nowrap px-5 py-3 font-medium">{payout.id}</td>
                  <td className="whitespace-nowrap px-5 py-3">{payout.agentName}</td>
                  <td className="whitespace-nowrap px-5 py-3">
                    {formatNaira(payout.amount)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <LedgerStatus
                      status={payout.status === "paid" ? "released" : "initiated"}
                    />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted">
                    {formatDate(payout.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "disputes" ? (
        <div className="grid overflow-hidden rounded-xl border border-stroke bg-white lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.25fr)]">
          <ul className="divide-y divide-stroke border-r border-stroke">
            {disputes.map((dispute) => (
              <li key={dispute.id}>
                <NavLink
                  to={`/escrow/${dispute.id}`}
                  className={({ isActive }) =>
                    [
                      "block px-4 py-4",
                      isActive ? "bg-sky-50" : "bg-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <div
                      className={[
                        "rounded-xl border px-4 py-3.5",
                        isActive ? "border-sky-400 bg-white" : "border-stroke",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-ink">{dispute.id}</p>
                        <DisputeBadge status={dispute.status} />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">
                        {dispute.description}
                      </p>
                      <p className="mt-3 flex items-center justify-between border-t border-stroke pt-2.5 text-xs text-muted">
                        <span className="font-medium text-ink">
                          {formatNaira(dispute.amount)}
                        </span>
                        <span>{dispute.date}</span>
                      </p>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <Outlet />
        </div>
      ) : null}
    </div>
  );
}

function resolveTab(
  verificationId: string | undefined,
  search: string | null,
): EscrowTab {
  if (verificationId?.startsWith("DSP")) return "disputes";
  if (verificationId) return "ledger";
  if (search === "ledger" || search === "payouts" || search === "disputes") {
    return search;
  }
  return "ledger";
}

function TabLink({
  to,
  active,
  count,
  children,
}: {
  to: string;
  active: boolean;
  count?: number;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm",
        active
          ? "bg-accent font-medium text-white"
          : "text-muted hover:text-ink",
      ].join(" ")}
    >
      {children}
      {count != null ? (
        <span
          className={[
            "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
            active ? "bg-white text-accent" : "bg-accent text-white",
          ].join(" ")}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "text-ink",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-medium ${valueClass}`}>{value}</dd>
    </div>
  );
}

function LedgerStatus({ status }: { status: EscrowLedgerStatus }) {
  const styles: Record<EscrowLedgerStatus, string> = {
    released: "bg-emerald-50 text-emerald-700",
    held_in_escrow: "bg-slate-100 text-slate-600",
    initiated: "bg-orange-50 text-orange-700",
    disputed: "bg-red-50 text-red-600",
  };
  const dots: Record<EscrowLedgerStatus, string> = {
    released: "bg-emerald-500",
    held_in_escrow: "bg-slate-400",
    initiated: "bg-accent",
    disputed: "bg-red-500",
  };
  const labels: Record<EscrowLedgerStatus, string> = {
    released: "Released",
    held_in_escrow: "Held in Escrow",
    initiated: "Initiated",
    disputed: "Disputed",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles[status]}`}
    >
      <span className={`size-1.5 rounded-full ${dots[status]}`} />
      {labels[status]}
    </span>
  );
}

function DisputeBadge({ status }: { status: DisputeStatus }) {
  const styles = {
    new: "bg-red-500 text-white",
    open: "border border-red-400 bg-white text-red-600",
    resolved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}
