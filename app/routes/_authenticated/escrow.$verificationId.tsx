import { Check } from "lucide-react";
import type { Route } from "./+types/escrow.$verificationId";
import { BackButton } from "../../components/layout/back-button";
import { MOCK_DISPUTES, MOCK_PAYMENTS } from "~/services/api/mocks";
import { formatNaira } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";
import type {
  AdminDispute,
  AdminPayment,
  DisputeStatus,
  EscrowLedgerStatus,
  EscrowTimelineStep,
} from "~/services/api/types";

type DetailLoaderData = {
  payment: AdminPayment | null;
  dispute: AdminDispute | null;
};

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.verificationId} · Escrow · Rublist Admin` }];
}

export function loader({
  request,
  params,
}: Route.LoaderArgs): DetailLoaderData {
  requirePermission({ action: "read", resource: "verification" })(request);
  const id = params.verificationId;
  return {
    payment: MOCK_PAYMENTS.find((item) => item.id === id) ?? null,
    dispute: MOCK_DISPUTES.find((item) => item.id === id) ?? null,
  };
}

export default function EscrowDetail({
  loaderData,
}: {
  loaderData: DetailLoaderData;
}) {
  const { payment, dispute } = loaderData;

  if (payment) {
    return <TransactionPanel payment={payment} />;
  }

  if (dispute) {
    return <DisputePanel dispute={dispute} />;
  }

  return (
    <section className="p-6">
      <p className="text-sm text-muted">Record not found.</p>
    </section>
  );
}

function TransactionPanel({ payment }: { payment: AdminPayment }) {
  const steps = payment.timeline?.length
    ? payment.timeline
    : defaultTimeline(payment);

  return (
    <div>
      <div className="mb-4">
        <BackButton to="/escrow?tab=ledger" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold text-ink">{payment.reference}</h1>
        <LedgerStatusBadge status={payment.escrowStatus} />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
        <section className="rounded-xl border border-stroke bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Transaction Timeline</h2>
          <Timeline steps={steps} />
        </section>

        <section className="rounded-xl border border-stroke bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="Amount" value={formatNaira(payment.amount)} />
            <DetailRow label="Property" value={payment.propertyTitle} />
            <DetailRow label="Buyer" value={payment.buyerName ?? "—"} />
            <DetailRow label="Agent" value={payment.agentName ?? "—"} />
            <DetailRow label="Provider" value={payment.provider ?? "—"} />
            <DetailRow label="Initiated" value={payment.initiatedAt ?? "—"} />
            <DetailRow label="Funded" value={payment.fundedAt ?? "—"} />
          </dl>
        </section>
      </div>
    </div>
  );
}

function DisputePanel({ dispute }: { dispute: AdminDispute }) {
  const payment = dispute.verificationId
    ? (MOCK_PAYMENTS.find((item) => item.id === dispute.verificationId) ?? null)
    : null;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <section className="rounded-xl border border-stroke bg-white p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-ink">{dispute.id}</h2>
          <DisputeBadge status={dispute.status} />
        </div>
        <p className="mt-3 text-sm text-ink">{dispute.description}</p>
        <p className="mt-4 flex items-center justify-between text-sm text-muted">
          <span className="font-medium text-ink">{formatNaira(dispute.amount)}</span>
          <span>{dispute.date}</span>
        </p>
      </section>

      {payment ? (
        <>
          <section className="rounded-xl border border-stroke bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-ink">{payment.reference}</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                <span className="size-1.5 rounded-full bg-red-500" />
                Dispute
              </span>
            </div>
            <h3 className="mt-5 text-sm font-semibold text-ink">
              Transaction Timeline
            </h3>
            <Timeline steps={payment.timeline ?? []} />
          </section>
          <section className="rounded-xl border border-stroke bg-white p-5">
            <h3 className="text-sm font-semibold text-ink">Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Amount" value={formatNaira(payment.amount)} />
              <DetailRow label="Property" value={payment.propertyTitle} />
              <DetailRow label="Buyer" value={payment.buyerName ?? "—"} />
              <DetailRow label="Agent" value={payment.agentName ?? "—"} />
              <DetailRow label="Provider" value={payment.provider ?? "—"} />
              <DetailRow label="Initiated" value={payment.initiatedAt ?? "—"} />
              <DetailRow label="Funded" value={payment.fundedAt ?? "—"} />
            </dl>
          </section>
        </>
      ) : (
        <section className="rounded-xl border border-stroke bg-white p-5">
          <h3 className="text-sm font-semibold text-ink">Details</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="Amount" value={formatNaira(dispute.amount)} />
            <DetailRow label="Property" value={dispute.propertyTitle} />
            <DetailRow label="Buyer" value={dispute.buyerName} />
            <DetailRow label="Agent" value={dispute.agentName} />
          </dl>
        </section>
      )}
    </div>
  );
}

function Timeline({ steps }: { steps: EscrowTimelineStep[] }) {
  return (
    <ol className="mt-4">
      {steps.map((step, index) => (
        <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
          {index < steps.length - 1 ? (
            <span className="absolute left-[9px] top-5 h-full w-px bg-stroke" />
          ) : null}
          {step.done ? (
            <span className="relative z-10 flex size-[19px] shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <Check className="size-3 text-white" strokeWidth={2.5} />
            </span>
          ) : (
            <span className="relative z-10 size-[19px] shrink-0 rounded-full bg-gray-300" />
          )}
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">{step.title}</p>
              <p className="text-xs text-muted">{step.actor}</p>
            </div>
            <p className="shrink-0 whitespace-nowrap text-xs text-muted">
              {step.timestamp}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function defaultTimeline(payment: AdminPayment): EscrowTimelineStep[] {
  const started = payment.initiatedAt
    ? `${payment.initiatedAt} 10:30 AM`
    : "—";
  const funded = payment.fundedAt
    ? `${payment.fundedAt} 10:30 AM`
    : started;
  const held =
    payment.escrowStatus === "held_in_escrow" ||
    payment.escrowStatus === "released" ||
    payment.escrowStatus === "disputed";
  const released = payment.escrowStatus === "released";

  return [
    {
      id: `${payment.id}-init`,
      title: "Transaction Initiated",
      actor: payment.buyerName ?? "Buyer",
      timestamp: started,
      done: true,
    },
    {
      id: `${payment.id}-deposit`,
      title: "Funds Deposited",
      actor: "System",
      timestamp: funded,
      done: payment.escrowStatus !== "initiated",
    },
    {
      id: `${payment.id}-escrow`,
      title: "Funds held in Escrow",
      actor: "System",
      timestamp: funded,
      done: held,
    },
    {
      id: `${payment.id}-release`,
      title: "Funds Released",
      actor: "System",
      timestamp: funded,
      done: released,
    },
  ];
}

function LedgerStatusBadge({ status }: { status: EscrowLedgerStatus }) {
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
    disputed: "Dispute",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      <span className={`size-1.5 rounded-full ${dots[status]}`} />
      {labels[status]}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
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
