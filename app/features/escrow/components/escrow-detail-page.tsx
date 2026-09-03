import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { BackButton } from "~/components/layout/back-button";
import { StatusBadge } from "~/components/ui/status-badge";
import { formatDate, formatDateTime, formatNaira } from "~/lib/format";
import { Can } from "~/lib/permissions";
import type {
  AdminPayment,
  EscrowDocumentStatus,
  EscrowInspectionStep,
  EscrowTimelineStep,
} from "~/services/api/types";
import { useEscrowDetail } from "../hooks/use-escrow-detail";
import { useEscrowMutations } from "../hooks/use-escrow-mutations";
import { LedgerStatus } from "./ledger-status";

export function EscrowDetailPage({ verificationId }: { verificationId: string }) {
  const detailQuery = useEscrowDetail(verificationId);
  const payment = detailQuery.data?.payment;

  if (detailQuery.isLoading) {
    return <p className="text-sm text-muted">Loading transaction...</p>;
  }

  if (detailQuery.error || !payment) {
    return (
      <div>
        <BackButton to="/escrow?tab=ledger" />
        <p className="mt-4 text-sm text-muted">
          {detailQuery.error instanceof Error
            ? detailQuery.error.message
            : "Record not found."}
        </p>
      </div>
    );
  }

  const steps = payment.timeline?.length
    ? payment.timeline
    : defaultTimeline(payment);
  const backTo =
    payment.escrowStatus === "disputed"
      ? "/escrow?tab=disputes"
      : payment.escrowStatus === "released"
        ? "/escrow?tab=payouts"
        : "/escrow?tab=ledger";

  return (
    <div>
      <div className="mb-4">
        <BackButton to={backTo} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold text-ink">{payment.reference}</h1>
        <LedgerStatus status={payment.escrowStatus} />
      </div>

      {payment.currentStage?.title ? (
        <p className="mb-5 text-sm text-muted">
          <span className="font-medium text-ink">{payment.currentStage.title}</span>
          {payment.currentStage.description
            ? ` — ${payment.currentStage.description}`
            : null}
        </p>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)]">
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-stroke bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">Transaction Timeline</h2>
            <Timeline steps={steps} />
          </section>

          <DocumentsPanel payment={payment} verificationId={verificationId} />
          <InspectionPanel payment={payment} verificationId={verificationId} />
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-stroke bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Amount" value={formatNaira(payment.amount)} />
              <DetailRow label="Property" value={payment.propertyTitle} />
              <DetailRow label="Buyer" value={payment.buyerName ?? "—"} />
              <DetailRow label="Agent" value={payment.agentName ?? "—"} />
              <DetailRow label="Provider" value={payment.provider ?? "—"} />
              <DetailRow
                label="Initiated"
                value={
                  payment.initiatedAt ? formatDateTime(payment.initiatedAt) : "—"
                }
              />
              <DetailRow
                label="Funded"
                value={payment.fundedAt ? formatDateTime(payment.fundedAt) : "—"}
              />
              {payment.fundsReleasedAt ? (
                <DetailRow
                  label="Released"
                  value={formatDateTime(payment.fundsReleasedAt)}
                />
              ) : null}
              {payment.rejectionReason ? (
                <DetailRow label="Reason" value={payment.rejectionReason} />
              ) : null}
              {payment.certificate?.id ? (
                <DetailRow label="Certificate" value={payment.certificate.id} />
              ) : null}
            </dl>
          </section>

          <EscrowActionsCard payment={payment} verificationId={verificationId} />
        </div>
      </div>
    </div>
  );
}

function DocumentsPanel({
  payment,
  verificationId,
}: {
  payment: AdminPayment;
  verificationId: string;
}) {
  const { reviewDocument } = useEscrowMutations(verificationId);
  const documents = payment.documents ?? [];
  const locked =
    payment.escrowStatus === "released" ||
    payment.escrowStatus === "disputed" ||
    payment.escrowStatus === "initiated";

  return (
    <section className="rounded-xl border border-stroke bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">Escrow Documents</h2>
      <p className="mt-1 text-xs text-muted">
        Review title documents attached to this transaction. Listing checklist
        documents live on the property page.
      </p>
      {documents.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No documents on this verification yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {documents.map((doc) => (
            <li key={doc.id} className="rounded-[10px] border border-stroke px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm font-semibold text-ink hover:text-accent"
                    >
                      {doc.name}
                    </a>
                  ) : (
                    <span className="block text-sm font-semibold text-ink">
                      {doc.name}
                    </span>
                  )}
                  {doc.submittedAt ? (
                    <span className="mt-0.5 block text-xs text-muted">
                      Submitted {formatDate(doc.submittedAt)}
                    </span>
                  ) : null}
                  {doc.note ? (
                    <span className="mt-1 block text-xs text-muted">{doc.note}</span>
                  ) : null}
                </span>
                <DocumentStatusBadge status={doc.status} />
              </div>
              {!locked ? (
                <Can action="approve" resource="verification">
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={
                        doc.status === "verified" || reviewDocument.isPending
                      }
                      onClick={() =>
                        reviewDocument.mutate({
                          documentId: doc.id,
                          action: "approve",
                        })
                      }
                      className="inline-flex h-8 items-center rounded-lg bg-emerald-500 px-3 text-xs font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={
                        doc.status === "rejected" || reviewDocument.isPending
                      }
                      onClick={() =>
                        reviewDocument.mutate({
                          documentId: doc.id,
                          action: "reject",
                          note: "Document rejected by admin",
                        })
                      }
                      className="inline-flex h-8 items-center rounded-lg bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </Can>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {reviewDocument.error ? (
        <p className="mt-3 text-xs text-red-600">
          {mutationMessage(reviewDocument.error, "Unable to update document.")}
        </p>
      ) : null}
    </section>
  );
}

function InspectionPanel({
  payment,
  verificationId,
}: {
  payment: AdminPayment;
  verificationId: string;
}) {
  const inspection = payment.inspection;
  const { scheduleInspection, completeInspection } =
    useEscrowMutations(verificationId);
  const [scheduledAt, setScheduledAt] = useState(
    toDatetimeLocalValue(inspection?.scheduledAt) || defaultScheduleValue(),
  );
  const [scheduleNote, setScheduleNote] = useState(inspection?.note ?? "");
  const [completeNote, setCompleteNote] = useState("");

  useEffect(() => {
    setScheduledAt(
      toDatetimeLocalValue(inspection?.scheduledAt) || defaultScheduleValue(),
    );
    setScheduleNote(inspection?.note ?? "");
  }, [inspection?.scheduledAt, inspection?.note]);

  const status = inspection?.status ?? "not_started";
  const locked =
    payment.escrowStatus === "released" || payment.escrowStatus === "disputed";
  const canSchedule =
    !locked &&
    payment.escrowStatus !== "initiated" &&
    status !== "completed";
  const canComplete = !locked && status === "scheduled";
  const timeline = inspection?.timeline ?? [];

  return (
    <section className="rounded-xl border border-stroke bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Escrow Inspection</h2>
        <StatusBadge
          tone={
            status === "completed"
              ? "success"
              : status === "failed"
                ? "danger"
                : status === "scheduled"
                  ? "warning"
                  : "neutral"
          }
        >
          {status}
        </StatusBadge>
      </div>

      {timeline.length > 0 ? (
        <ol className="mt-4">
          {timeline.map((step, index) => (
            <InspectionStepRow
              key={step.id}
              step={step}
              last={index === timeline.length - 1}
            />
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-muted">No inspection events yet.</p>
      )}

      {canSchedule || canComplete ? (
        <Can action="update" resource="verification">
          <div className="mt-5 space-y-4 border-t border-stroke pt-4">
            {canSchedule ? (
              <div>
                <p className="text-sm font-medium text-ink">Schedule inspection</p>
                <label className="mt-2 block text-xs text-muted">
                  Date & time
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) => setScheduledAt(event.target.value)}
                    className="mt-1 block w-full rounded-lg border border-stroke px-3 py-2 text-sm text-ink"
                  />
                </label>
                <label className="mt-2 block text-xs text-muted">
                  Note
                  <textarea
                    value={scheduleNote}
                    onChange={(event) => setScheduleNote(event.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-stroke px-3 py-2 text-sm text-ink"
                  />
                </label>
                <button
                  type="button"
                  disabled={!scheduledAt || scheduleInspection.isPending}
                  onClick={async () => {
                    if (!scheduledAt) return;
                    try {
                      await scheduleInspection.mutateAsync({
                        scheduledAt: new Date(scheduledAt).toISOString(),
                        note: scheduleNote.trim() || undefined,
                      });
                    } catch {
                      // mutation error shown below
                    }
                  }}
                  className="mt-3 inline-flex h-10 items-center rounded-[10px] bg-accent px-4 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {scheduleInspection.isPending ? "Saving..." : "Schedule"}
                </button>
                {scheduleInspection.error ? (
                  <p className="mt-2 text-xs text-red-600">
                    {mutationMessage(
                      scheduleInspection.error,
                      "Unable to schedule inspection.",
                    )}
                  </p>
                ) : null}
              </div>
            ) : null}

            {canComplete ? (
              <div>
                <p className="text-sm font-medium text-ink">Complete inspection</p>
                <label className="mt-2 block text-xs text-muted">
                  Note
                  <textarea
                    value={completeNote}
                    onChange={(event) => setCompleteNote(event.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-stroke px-3 py-2 text-sm text-ink"
                  />
                </label>
                <button
                  type="button"
                  disabled={completeInspection.isPending}
                  onClick={async () => {
                    try {
                      await completeInspection.mutateAsync({
                        note: completeNote.trim() || undefined,
                      });
                      setCompleteNote("");
                    } catch {
                      // mutation error shown below
                    }
                  }}
                  className="mt-3 inline-flex h-10 items-center rounded-[10px] bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {completeInspection.isPending ? "Saving..." : "Mark completed"}
                </button>
                {completeInspection.error ? (
                  <p className="mt-2 text-xs text-red-600">
                    {mutationMessage(
                      completeInspection.error,
                      "Unable to complete inspection.",
                    )}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </Can>
      ) : null}
    </section>
  );
}

function EscrowActionsCard({
  payment,
  verificationId,
}: {
  payment: AdminPayment;
  verificationId: string;
}) {
  const { reviewCase } = useEscrowMutations(verificationId);
  const [rejectReason, setRejectReason] = useState("");
  const documents = payment.documents ?? [];
  const requiredDocs = documents.filter(
    (doc) => !/deed of assignment/i.test(doc.name),
  );
  const requiredDocsOk =
    requiredDocs.length > 0 &&
    requiredDocs.every((doc) => doc.status === "verified");
  const closed =
    payment.escrowStatus === "released" || payment.escrowStatus === "disputed";
  const pendingPayment = payment.escrowStatus === "initiated";
  const canRelease =
    !closed && !pendingPayment && requiredDocsOk && !payment.fundsReleased;
  const canReject = !closed && !pendingPayment;
  const pending = reviewCase.isPending;

  return (
    <section className="rounded-xl border border-stroke bg-white">
      <h2 className="border-b border-stroke px-5 py-4 text-sm font-semibold text-ink">
        Escrow Actions
      </h2>
      <Can
        action="approve"
        resource="verification"
        fallback={
          <p className="px-5 py-4 text-sm text-muted">
            You do not have permission to release or reject escrow.
          </p>
        }
      >
        <div className="flex flex-col gap-3 px-5 py-4">
          <button
            type="button"
            disabled={!canRelease || pending}
            onClick={async () => {
              try {
                await reviewCase.mutateAsync({ action: "release" });
              } catch {
                // mutation error shown below
              }
            }}
            className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
              <Check className="size-3.5 text-emerald-500" strokeWidth={2.75} />
            </span>
            Release Funds
          </button>

          <label className="block text-xs text-muted">
            Rejection reason
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              disabled={!canReject || pending}
              rows={2}
              placeholder="Required to reject / dispute"
              className="mt-1 block w-full rounded-lg border border-stroke px-3 py-2 text-sm text-ink disabled:opacity-50"
            />
          </label>
          <button
            type="button"
            disabled={!canReject || !rejectReason.trim() || pending}
            onClick={async () => {
              try {
                await reviewCase.mutateAsync({
                  action: "reject",
                  note: rejectReason.trim(),
                  rejectionReason: rejectReason.trim(),
                });
                setRejectReason("");
              } catch {
                // mutation error shown below
              }
            }}
            className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-red-50 px-4 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject / Mark Disputed
          </button>

          {closed ? (
            <p className="text-xs text-muted">
              This escrow is closed
              {payment.escrowStatus === "released"
                ? " after funds were released."
                : " as disputed."}
            </p>
          ) : pendingPayment ? (
            <p className="text-xs text-muted">
              Wait for payment confirmation before reviewing this case.
            </p>
          ) : !canRelease ? (
            <p className="text-xs text-muted">
              Approve required title documents (C of O and Survey Plan if
              present) before releasing funds.
            </p>
          ) : (
            <p className="text-xs text-muted">
              Release marks funds released in escrow. Bank payout to the agent is
              not wired yet.
            </p>
          )}

          {reviewCase.error ? (
            <p className="text-xs text-red-600">
              {mutationMessage(reviewCase.error, "Unable to update escrow.")}
            </p>
          ) : null}
        </div>
      </Can>
    </section>
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
              {formatDateTime(step.timestamp)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function InspectionStepRow({
  step,
  last,
}: {
  step: EscrowInspectionStep;
  last: boolean;
}) {
  const tone =
    step.status === "success"
      ? "bg-emerald-500"
      : step.status === "failed"
        ? "bg-red-500"
        : step.status === "warning"
          ? "bg-accent"
          : "bg-gray-400";

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {last ? null : (
        <span className="absolute left-[7px] top-4 h-full w-px bg-stroke" />
      )}
      <span className={`relative z-10 mt-1 size-[15px] shrink-0 rounded-full ${tone}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-ink">{step.title}</p>
          {step.date ? (
            <p className="shrink-0 text-xs text-muted">{formatDateTime(step.date)}</p>
          ) : null}
        </div>
        {step.description ? (
          <p className="mt-0.5 text-xs text-muted">{step.description}</p>
        ) : null}
      </div>
    </li>
  );
}

function DocumentStatusBadge({ status }: { status: EscrowDocumentStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Verified
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-red-600">
        <span className="size-1.5 rounded-full bg-red-500" />
        Rejected
      </span>
    );
  }
  if (status === "under_review" || status === "submitted") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-orange-700">
        <span className="size-1.5 rounded-full bg-accent" />
        {status === "submitted" ? "Submitted" : "Under review"}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-muted">
      <span className="size-1.5 rounded-full bg-gray-400" />
      Pending
    </span>
  );
}

function defaultTimeline(payment: AdminPayment): EscrowTimelineStep[] {
  const started = payment.initiatedAt ?? payment.createdAt;
  const funded = payment.fundedAt ?? started;
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function toDatetimeLocalValue(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultScheduleValue() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);
  return toDatetimeLocalValue(date.toISOString());
}

function mutationMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
