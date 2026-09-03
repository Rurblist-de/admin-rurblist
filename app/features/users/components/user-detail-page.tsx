import { useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { BackButton } from "~/components/layout/back-button";
import { StatusBadge } from "~/components/ui/status-badge";
import { Can } from "~/lib/permissions";
import { formatDate, formatNaira, initials } from "~/lib/format";
import type { AdminUser, AgentStatus } from "~/services/api/types";
import { useReviewAgent } from "../hooks/use-review-agent";
import { useUser } from "../hooks/use-user";

export function UserDetailPage({ userId }: { userId: string }) {
  const userQuery = useUser(userId);
  const reviewAgent = useReviewAgent(userId);
  const user = userQuery.data;
  const [actionsOpen, setActionsOpen] = useState(false);

  if (userQuery.isLoading) {
    return <p className="text-sm text-muted">Loading user...</p>;
  }

  if (userQuery.error || !user) {
    return (
      <div>
        <div className="mb-4">
          <BackButton to="/users" />
        </div>
        <p className="text-sm text-muted">
          {userQuery.error instanceof Error
            ? userQuery.error.message
            : "User not found."}
        </p>
      </div>
    );
  }

  const listings = user.listings ?? [];
  const commissions = user.commissions ?? [];
  const documents = user.documents ?? [];
  const isBuyer = user.role === "Home_Seeker";
  const isSeller =
    user.role === "Agent" ||
    user.role === "Landlord" ||
    user.role === "Developer";
  const showKycActions = isSeller || isBuyer;
  const kycSubmitted = user.agentStatus && user.agentStatus !== "not_submitted";
  const ninVerified = documents.some(
    (doc) => doc.id === "government-id" && doc.verified,
  );
  const canApprove =
    kycSubmitted && ninVerified && user.agentStatus !== "approved";
  const canReject = kycSubmitted && user.agentStatus !== "rejected";

  const handleReview = async (action: "approve" | "reject") => {
    try {
      await reviewAgent.mutateAsync(action);
      setActionsOpen(false);
    } catch {
      // error is shown from reviewAgent.error
    }
  };

  return (
    <div>
      <div className="mb-4">
        <BackButton to="/users" />
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{user.fullName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <AgentKycBadge status={user.agentStatus} verified={user.verified} />
            {isBuyer || user.trustScore == null ? null : (
              <span className="inline-flex items-center rounded-full border border-stroke bg-white px-2.5 py-0.5 text-xs font-medium text-muted">
                Trust Score - {user.trustScore}
              </span>
            )}
          </div>
        </div>
        {showKycActions ? (
          <Can action="approve" resource="agent">
            <div className="relative">
              <button
                type="button"
                onClick={() => setActionsOpen((open) => !open)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white"
              >
                Admin Actions
                <ChevronDown className="size-4" strokeWidth={1.75} />
              </button>
              {actionsOpen ? (
                <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-stroke bg-white shadow-lg">
                  <button
                    type="button"
                    disabled={!canApprove || reviewAgent.isPending}
                    onClick={() => handleReview("approve")}
                    className="block w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-canvas disabled:cursor-not-allowed disabled:text-muted"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={!canReject || reviewAgent.isPending}
                    onClick={() => handleReview("reject")}
                    className="block w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-canvas disabled:cursor-not-allowed disabled:text-muted"
                  >
                    Reject
                  </button>
                  {reviewAgent.error ? (
                    <p className="border-t border-stroke px-4 py-2 text-xs text-red-500">
                      {reviewAgent.error instanceof Error
                        ? reviewAgent.error.message
                        : "Unable to update KYC."}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Can>
        ) : null}
      </div>

      <div
        className={
          isBuyer
            ? "mx-auto w-full max-w-xl"
            : "grid items-start gap-4 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.25fr)]"
        }
      >
        <section className="rounded-xl border border-stroke bg-white p-6">
          <div className="flex flex-col items-center text-center">
            <UserAvatar user={user} />
            <h2 className="mt-3 text-base font-semibold text-accent">
              {user.fullName}
            </h2>
            <p className="mt-0.5 text-sm text-muted">{user.email}</p>
            {user.company ? (
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                {user.company}
              </p>
            ) : null}
          </div>

          <dl className="mt-6 space-y-3">
            <Field label="Phone" value={user.phone ?? "—"} />
            <Field label="State" value={user.state} />
            {isBuyer ? null : (
              <Field label="CAC Number" value={user.cacNumber ?? "—"} />
            )}
            <Field label="Joined" value={formatDate(user.joinedAt)} />
            <Field label="Approved" value={formatDate(user.approvedAt ?? "")} />
            <Field label="Approved By" value={user.approvedBy ?? "—"} />
            {isBuyer ? null : (
              <>
                <Field
                  label="Bank"
                  value={
                    user.bankName
                      ? `${user.bankName} ${user.bankAccountMasked ?? ""}`.trim()
                      : "—"
                  }
                />
                <Field
                  label="Total Commissions"
                  value={
                    user.totalCommissionsNgn != null
                      ? formatNaira(user.totalCommissionsNgn)
                      : "—"
                  }
                />
              </>
            )}
          </dl>

          <div className="mt-6 border-t border-stroke pt-5">
            <h3 className="text-sm font-semibold text-ink">
              Verification Documents
            </h3>
            {documents.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No documents uploaded.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-stroke px-4 py-3"
                  >
                    <span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-ink hover:text-accent"
                      >
                        {doc.name}
                      </a>
                      {doc.uploadedAt ? (
                        <span className="mt-0.5 block text-xs text-muted">
                          Uploaded {formatDate(doc.uploadedAt)}
                        </span>
                      ) : null}
                    </span>
                    {doc.verified ? <DocumentVerified /> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {isBuyer ? null : (
          <div className="flex flex-col gap-4">
            <TableCard
              title="Owned Listings"
              count={listings.length}
              headers={["ID", "Title", "Price", "Status", "Date"]}
              empty="No listings."
              rows={listings.map((listing) => [
                listing.id,
                listing.title,
                formatNaira(listing.price),
                <StatusPill
                  key={`${listing.id}-status`}
                  label={listing.status.replaceAll("_", " ")}
                  tone={listingStatusTone(listing.status)}
                />,
                formatDate(listing.date),
              ])}
            />
            <TableCard
              title="Commission History"
              count={commissions.length}
              headers={["ID", "Property", "Amount", "Status", "Date"]}
              empty="No commission history."
              rows={commissions.map((row) => [
                row.id,
                row.propertyTitle,
                formatNaira(row.amount),
                <StatusPill
                  key={`${row.id}-status`}
                  label={row.status}
                  tone={row.status === "paid" ? "success" : "warning"}
                />,
                formatDate(row.date),
              ])}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function UserAvatar({ user }: { user: AdminUser }) {
  const [failed, setFailed] = useState(false);

  if (user.profileImage && !failed) {
    return (
      <img
        src={user.profileImage}
        alt=""
        className="size-20 rounded-full object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="flex size-20 items-center justify-center rounded-full bg-accent text-xl font-semibold text-white">
      {initials(user.fullName) || "?"}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="whitespace-nowrap text-sm font-medium text-ink">
        {value}
      </dd>
    </div>
  );
}

function AgentKycBadge({
  status,
  verified,
}: {
  status?: AgentStatus | null;
  verified?: boolean;
}) {
  if (verified || status === "approved") {
    return <VerifiedBadge />;
  }

  if (!status) return null;

  const tone =
    status === "rejected"
      ? ("danger" as const)
      : status === "not_submitted"
        ? ("neutral" as const)
        : ("warning" as const);

  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
      <Check className="size-3" strokeWidth={2.5} />
      Verified
    </span>
  );
}

function DocumentVerified() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Verified
    </span>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning" | "info" | "neutral";
}) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-sky-50 text-sky-700",
    neutral: "bg-canvas text-muted",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

function listingStatusTone(status: string) {
  if (status === "published") return "success" as const;
  if (status === "sold") return "info" as const;
  if (status === "pending") return "warning" as const;
  return "neutral" as const;
}

function TableCard({
  title,
  count,
  headers,
  rows,
  empty,
}: {
  title: string;
  count: number;
  headers: string[];
  rows: Array<Array<string | ReactNode>>;
  empty: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-stroke bg-white">
      <h3 className="px-5 py-4 text-sm font-semibold uppercase tracking-wide text-ink">
        {title} ({count})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-max min-w-full text-left text-xs">
          <thead className="border-y border-stroke text-[10px] font-medium uppercase tracking-wide text-muted">
            <tr>
              {headers.map((header, headerIndex) => (
                <th
                  key={header}
                  className={[
                    "whitespace-nowrap px-5 py-2.5 font-medium",
                    headerIndex === headers.length - 1 ? "text-right" : "",
                  ].join(" ")}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-5 py-8 text-center text-muted"
                  colSpan={headers.length}
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-stroke last:border-0"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={[
                        "whitespace-nowrap px-5 py-3 align-middle",
                        cellIndex === row.length - 1 ? "text-right" : "",
                      ].join(" ")}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
