import { formatDate, formatPropertyPrice } from "~/lib/format";
import type {
  AdminProperty,
  PropertyBoardStatus,
  PropertyDocument,
} from "~/services/api/types";

const STATUS_LABEL: Record<PropertyBoardStatus, string> = {
  pending_review: "Pending Review",
  verified: "Verified",
  published: "Published",
  sold_delisted: "Sold/ Delisted",
};

export function PropertyStatusBadge({
  status,
}: {
  status: PropertyBoardStatus;
}) {
  const tones = {
    pending_review: "bg-[#FFF1E7] text-[#E55B13]",
    verified: "bg-[#ECFDF5] text-[#059669]",
    published: "bg-[#ECFDF5] text-[#059669]",
    sold_delisted: "bg-[#F3F4F6] text-[#6B7280]",
  };
  const dots = {
    pending_review: "bg-[#E55B13]",
    verified: "bg-[#059669]",
    published: "bg-[#059669]",
    sold_delisted: "bg-[#9CA3AF]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] ${tones[status]}`}
    >
      <span className={`size-1.5 rounded-full ${dots[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PropertyInfoCard({ property }: { property: AdminProperty }) {
  const rows = [
    {
      label: "Price",
      value: formatPropertyPrice(property.price, property.pricePeriod),
    },
    { label: "Type", value: property.type },
    { label: "State", value: property.state },
    { label: "Listed", value: formatListedDate(property.listedAt) },
    ...(property.totalUnits && property.totalUnits > 1
      ? [
          {
            label: "Units",
            value: `${property.availableUnits ?? property.totalUnits} of ${property.totalUnits} remaining`,
          },
        ]
      : []),
  ];
  const documents = property.documents ?? [];

  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white">
      <h2 className="border-b border-[#E5E7EB] px-5 py-4 text-sm font-semibold text-[#111827]">
        Property Info
      </h2>

      <dl className="space-y-4 px-5 py-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3"
          >
            <dt className="text-sm text-[#6B7280]">{row.label}</dt>
            <dd className="text-sm font-semibold text-[#111827]">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-[#6B7280]">Trust Score</dt>
          <dd>
            <TrustBadge score={property.trustScore} />
          </dd>
        </div>
      </dl>

      <div className="border-t border-[#E5E7EB] px-5 py-4">
        <h3 className="text-sm font-semibold text-[#111827]">Documents</h3>
        {documents.length === 0 ? (
          <p className="mt-3 text-sm text-[#6B7280]">No documents uploaded.</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-[#E5E7EB] px-4 py-3"
              >
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
                  {doc.uploadedAt ? (
                    <span className="mt-0.5 block text-xs text-[#6B7280]">
                      Uploaded {formatDate(doc.uploadedAt)}
                    </span>
                  ) : null}
                </span>
                <DocumentStatusBadge status={doc.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function TrustBadge({
  score,
}: {
  score: AdminProperty["trustScore"];
}) {
  if (score === "passed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#059669]">
        <span className="size-1.5 rounded-full bg-[#059669]" />
        Passed
      </span>
    );
  }
  if (score === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#DC2626]">
        <span className="size-1.5 rounded-full bg-[#DC2626]" />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#E55B13]">
      <span className="size-1.5 rounded-full bg-[#E55B13]" />
      Pending
    </span>
  );
}

function DocumentStatusBadge({
  status,
}: {
  status: PropertyDocument["status"];
}) {
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

function formatListedDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
