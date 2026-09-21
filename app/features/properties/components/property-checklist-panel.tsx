import { useEffect, useState } from "react";
import { Link } from "react-router";
import { formatDate, formatDateTime } from "~/lib/format";
import { Can } from "~/lib/permissions";
import { StatusBadge } from "~/components/ui/status-badge";
import type {
  AdminProperty,
  AgentStatus,
  PropertyDocument,
  PropertyDocumentStatus,
  PropertyInspectionStep,
} from "~/services/api/types";
import type { PropertyDocumentType } from "../services";
import { usePropertyMutations } from "../hooks/use-property-mutations";

const DOC_ORDER: PropertyDocumentType[] = [
  "certificate_of_occupancy",
  "survey_plan",
  "deed_of_assignment",
  "governors_consent",
  "power_of_attorney",
  "other_supporting",
];

const OPTIONAL_DOC_TYPES = new Set<PropertyDocumentType>([
  "governors_consent",
  "power_of_attorney",
  "other_supporting",
]);

const KYC_TONE: Record<AgentStatus, "success" | "warning" | "danger" | "neutral"> = {
  approved: "success",
  pending: "warning",
  under_review: "warning",
  rejected: "danger",
  not_submitted: "neutral",
};

export function PropertyChecklistPanel({
  property,
  selectedId,
}: {
  property: AdminProperty;
  selectedId: string | null;
}) {
  if (!selectedId) return null;

  if (selectedId === "title-documents") {
    return <TitleDocumentsPanel property={property} />;
  }
  if (selectedId === "owner-identity") {
    return <OwnerIdentityPanel property={property} />;
  }
  if (selectedId === "site-inspection") {
    return <SiteInspectionPanel property={property} />;
  }
  return null;
}

function TitleDocumentsPanel({ property }: { property: AdminProperty }) {
  const { reviewDocument } = usePropertyMutations(property.id);
  const documents = sortDocuments(property.documents ?? []);

  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-5">
      <h3 className="text-sm font-semibold text-[#111827]">Title Documents</h3>
      <p className="mt-1 text-xs text-[#6B7280]">
        At least 2 core title documents must be verified (C of O, Survey Plan,
        or Deed of Assignment). Governor&apos;s Consent, Power of Attorney, and
        other supporting documents are optional.
      </p>
      {documents.length === 0 ? (
        <p className="mt-4 text-sm text-[#6B7280]">
          No documents uploaded. Listing owners must submit at least 2 title
          documents.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="rounded-[10px] border border-[#E5E7EB] px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm font-semibold text-[#111827] hover:text-[#E55B13]"
                    >
                      {doc.name}
                    </a>
                  ) : (
                    <span className="block text-sm font-semibold text-[#111827]">
                      {doc.name}
                    </span>
                  )}
                  {doc.type && OPTIONAL_DOC_TYPES.has(doc.type as PropertyDocumentType) ? (
                    <span className="mt-0.5 block text-xs text-[#6B7280]">Optional</span>
                  ) : null}
                  {doc.uploadedAt ? (
                    <span className="mt-0.5 block text-xs text-[#6B7280]">
                      Uploaded {formatDate(doc.uploadedAt)}
                    </span>
                  ) : null}
                </span>
                <DocumentStatusBadge status={doc.status} />
              </div>
              {doc.type ? (
                <Can action="approve" resource="property">
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={
                        doc.status === "verified" || reviewDocument.isPending
                      }
                      onClick={() =>
                        reviewDocument.mutate({
                          docType: doc.type as PropertyDocumentType,
                          action: "approve",
                        })
                      }
                      className="inline-flex h-8 items-center rounded-lg bg-[#22C55E] px-3 text-xs font-medium text-white hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
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
                          docType: doc.type as PropertyDocumentType,
                          action: "reject",
                        })
                      }
                      className="inline-flex h-8 items-center rounded-lg bg-[#FEE2E2] px-3 text-xs font-medium text-[#DC2626] hover:bg-[#FECACA] disabled:cursor-not-allowed disabled:opacity-50"
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
        <p className="mt-3 text-xs text-[#DC2626]">
          {mutationMessage(reviewDocument.error, "Unable to update document.")}
        </p>
      ) : null}
    </section>
  );
}

function OwnerIdentityPanel({ property }: { property: AdminProperty }) {
  const agent = property.agent;
  const kycStatus = agent?.kycStatus;

  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-5">
      <h3 className="text-sm font-semibold text-[#111827]">Owner Identity</h3>
      <p className="mt-1 text-xs text-[#6B7280]">
        Owner KYC is confirmed on the user profile. It cannot be approved from
        this listing.
      </p>
      {agent ? (
        <dl className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-[#6B7280]">Name</dt>
            <dd className="text-sm font-semibold text-[#111827]">{agent.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-[#6B7280]">KYC status</dt>
            <dd>
              {kycStatus ? (
                <StatusBadge tone={KYC_TONE[kycStatus]}>{kycStatus}</StatusBadge>
              ) : (
                <span className="text-sm text-[#6B7280]">—</span>
              )}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-sm text-[#6B7280]">No owner linked.</p>
      )}
      {agent?.id ? (
        <Link
          to={`/users/${agent.id}`}
          className="mt-4 inline-flex text-sm font-medium text-[#E55B13] hover:underline"
        >
          View owner profile
        </Link>
      ) : null}
    </section>
  );
}

function SiteInspectionPanel({ property }: { property: AdminProperty }) {
  const inspection = property.inspection;
  const { scheduleInspection, completeInspection } = usePropertyMutations(
    property.id,
  );
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
  const completed = status === "completed";
  const canComplete = status === "scheduled";
  const timeline = inspection?.timeline ?? [];

  const handleSchedule = async () => {
    if (!scheduledAt) return;
    try {
      await scheduleInspection.mutateAsync({
        scheduledAt: new Date(scheduledAt).toISOString(),
        note: scheduleNote.trim() || undefined,
      });
    } catch {
      // shown from mutation error
    }
  };

  const handleComplete = async () => {
    try {
      await completeInspection.mutateAsync({
        note: completeNote.trim() || undefined,
      });
      setCompleteNote("");
    } catch {
      // shown from mutation error
    }
  };

  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#111827]">Site Inspection</h3>
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
        <p className="mt-4 text-sm text-[#6B7280]">
          No inspection activity yet.
        </p>
      )}

      {completed ? null : (
        <Can action="approve" resource="property">
          <div className="mt-5 space-y-4 border-t border-[#E5E7EB] pt-4">
            <div>
              <p className="text-sm font-medium text-[#111827]">
                {status === "scheduled" ? "Reschedule" : "Schedule inspection"}
              </p>
              <label className="mt-2 block text-xs text-[#6B7280]">
                Date and time
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                  className="mt-1 block h-10 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm text-[#111827]"
                />
              </label>
              <label className="mt-2 block text-xs text-[#6B7280]">
                Note
                <textarea
                  value={scheduleNote}
                  onChange={(event) => setScheduleNote(event.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827]"
                />
              </label>
              <button
                type="button"
                disabled={!scheduledAt || scheduleInspection.isPending}
                onClick={handleSchedule}
                className="mt-3 inline-flex h-10 items-center rounded-[10px] bg-[#111827] px-4 text-sm font-medium text-white hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {scheduleInspection.isPending ? "Saving..." : "Schedule"}
              </button>
              {scheduleInspection.error ? (
                <p className="mt-2 text-xs text-[#DC2626]">
                  {mutationMessage(
                    scheduleInspection.error,
                    "Unable to schedule inspection.",
                  )}
                </p>
              ) : null}
            </div>

            {canComplete ? (
              <div>
                <p className="text-sm font-medium text-[#111827]">
                  Complete inspection
                </p>
                <label className="mt-2 block text-xs text-[#6B7280]">
                  Note
                  <textarea
                    value={completeNote}
                    onChange={(event) => setCompleteNote(event.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827]"
                  />
                </label>
                <button
                  type="button"
                  disabled={completeInspection.isPending}
                  onClick={handleComplete}
                  className="mt-3 inline-flex h-10 items-center rounded-[10px] bg-[#22C55E] px-4 text-sm font-medium text-white hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {completeInspection.isPending ? "Saving..." : "Mark completed"}
                </button>
                {completeInspection.error ? (
                  <p className="mt-2 text-xs text-[#DC2626]">
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
      )}
    </section>
  );
}

function InspectionStepRow({
  step,
  last,
}: {
  step: PropertyInspectionStep;
  last: boolean;
}) {
  const tone =
    step.status === "success"
      ? "bg-[#22C55E]"
      : step.status === "failed"
        ? "bg-[#DC2626]"
        : step.status === "warning"
          ? "bg-[#E55B13]"
          : "bg-[#9CA3AF]";

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {last ? null : (
        <span className="absolute left-[7px] top-4 h-full w-px bg-[#E5E7EB]" />
      )}
      <span className={`relative z-10 mt-1 size-[15px] shrink-0 rounded-full ${tone}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-[#111827]">{step.title}</p>
          {step.date ? (
            <p className="shrink-0 text-xs text-[#6B7280]">
              {formatDateTime(step.date)}
            </p>
          ) : null}
        </div>
        {step.description ? (
          <p className="mt-0.5 text-xs text-[#6B7280]">{step.description}</p>
        ) : null}
      </div>
    </li>
  );
}

function DocumentStatusBadge({ status }: { status: PropertyDocumentStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#059669]">
        <span className="size-1.5 rounded-full bg-[#059669]" />
        Verified
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#DC2626]">
        <span className="size-1.5 rounded-full bg-[#DC2626]" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FFF1E7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#E55B13]">
      <span className="size-1.5 rounded-full bg-[#E55B13]" />
      Pending
    </span>
  );
}

function sortDocuments(documents: PropertyDocument[]) {
  return [...documents].sort((a, b) => {
    const aIndex = a.type ? DOC_ORDER.indexOf(a.type) : DOC_ORDER.length;
    const bIndex = b.type ? DOC_ORDER.indexOf(b.type) : DOC_ORDER.length;
    return aIndex - bIndex;
  });
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
