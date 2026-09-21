import { useState } from "react";
import { Check, Flag, X } from "lucide-react";
import { Can } from "~/lib/permissions";
import type { AdminProperty } from "~/services/api/types";
import { usePropertyMutations } from "~/features/properties/hooks/use-property-mutations";

type FeedbackAction = "reject" | "flag";

export function PropertyActionsCard({ property }: { property: AdminProperty }) {
  const { reviewListing } = usePropertyMutations(property.id);
  const titleDone = property.checklist?.some(
    (item) => item.id === "title-documents" && item.done,
  );
  const ownerDone = property.checklist?.some(
    (item) => item.id === "owner-identity" && item.done,
  );
  const sold = Boolean(property.isSold);
  const approved = property.listingReview === "approved";
  const rejected = property.listingReview === "rejected";
  const flagged = Boolean(property.flagged);
  const pending = reviewListing.isPending;

  const canApprove = Boolean(titleDone && ownerDone) && !approved && !sold;
  const canReject = !rejected && !sold;
  const canFlag = !flagged && !sold;

  const [feedbackAction, setFeedbackAction] = useState<FeedbackAction | null>(
    null,
  );
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [feedbackIssues, setFeedbackIssues] = useState("");

  const resetFeedbackForm = () => {
    setFeedbackAction(null);
    setFeedbackTitle("");
    setFeedbackDescription("");
    setFeedbackIssues("");
  };

  const handleApprove = async () => {
    try {
      await reviewListing.mutateAsync({ action: "approve" });
    } catch {
      // shown from reviewListing.error
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackAction) return;

    const title = feedbackTitle.trim();
    const description = feedbackDescription.trim();
    if (!title || !description) return;

    const issues = feedbackIssues
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      await reviewListing.mutateAsync({
        action: feedbackAction,
        feedback: {
          title,
          description,
          issues,
        },
      });
      resetFeedbackForm();
    } catch {
      // shown from reviewListing.error
    }
  };

  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white">
      <h2 className="border-b border-[#E5E7EB] px-5 py-4 text-sm font-semibold text-[#111827]">
        Actions
      </h2>
      <Can
        action="approve"
        resource="property"
        fallback={
          <p className="px-5 py-4 text-sm text-[#6B7280]">
            You do not have permission to review listings.
          </p>
        }
      >
        <div className="flex flex-col gap-2.5 px-5 py-4">
          <button
            type="button"
            disabled={!canApprove || pending}
            onClick={handleApprove}
            className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-[#22C55E] px-4 text-sm font-medium text-white hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
              <Check className="size-3.5 text-[#22C55E]" strokeWidth={2.75} />
            </span>
            Approve Listing
          </button>
          <button
            type="button"
            disabled={!canReject || pending}
            onClick={() => setFeedbackAction("reject")}
            className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-[#FEE2E2] px-4 text-sm font-medium text-[#DC2626] hover:bg-[#FECACA] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
              <X className="size-3.5 text-[#DC2626]" strokeWidth={2.75} />
            </span>
            Reject Listing
          </button>
          <button
            type="button"
            disabled={!canFlag || pending}
            onClick={() => setFeedbackAction("flag")}
            className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-[#F3F4F6] px-4 text-sm font-medium text-[#4B5563] hover:bg-[#E5E7EB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
              <Flag className="size-3 text-[#4B5563]" strokeWidth={2} />
            </span>
            Flag / Request changes
          </button>
          {!canApprove && !approved && !sold ? (
            <p className="text-xs text-[#6B7280]">
              Approve requires at least 2 verified title documents and owner
              identity.
            </p>
          ) : null}
          {property.reviewFeedback?.title ? (
            <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-xs text-[#374151]">
              <p className="font-semibold text-[#111827]">
                Last feedback: {property.reviewFeedback.title}
              </p>
              {property.reviewFeedback.description ? (
                <p className="mt-1">{property.reviewFeedback.description}</p>
              ) : null}
            </div>
          ) : null}
          {reviewListing.error ? (
            <p className="text-xs text-[#DC2626]">
              {reviewListing.error instanceof Error
                ? reviewListing.error.message
                : "Unable to update listing."}
            </p>
          ) : null}
        </div>
      </Can>

      {feedbackAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[12px] bg-white shadow-xl">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h3 className="text-sm font-semibold text-[#111827]">
                {feedbackAction === "reject"
                  ? "Reject listing"
                  : "Flag listing / request changes"}
              </h3>
              <p className="mt-1 text-xs text-[#6B7280]">
                This message is emailed to whoever uploaded the listing.
              </p>
            </div>
            <div className="flex flex-col gap-3 px-5 py-4">
              <label className="block text-xs font-medium text-[#374151]">
                Title
                <input
                  value={feedbackTitle}
                  onChange={(event) => setFeedbackTitle(event.target.value)}
                  placeholder="e.g. Incomplete title documents"
                  className="mt-1.5 h-10 w-full rounded-[8px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#ec6c10]"
                />
              </label>
              <label className="block text-xs font-medium text-[#374151]">
                Description
                <textarea
                  value={feedbackDescription}
                  onChange={(event) =>
                    setFeedbackDescription(event.target.value)
                  }
                  rows={4}
                  placeholder="Explain what needs to change or why the listing was rejected."
                  className="mt-1.5 w-full rounded-[8px] border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#ec6c10]"
                />
              </label>
              <label className="block text-xs font-medium text-[#374151]">
                Issues (optional, one per line)
                <textarea
                  value={feedbackIssues}
                  onChange={(event) => setFeedbackIssues(event.target.value)}
                  rows={3}
                  placeholder={"Missing survey plan\nBlurry exterior photos"}
                  className="mt-1.5 w-full rounded-[8px] border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#ec6c10]"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-[#E5E7EB] px-5 py-4">
              <button
                type="button"
                onClick={resetFeedbackForm}
                disabled={pending}
                className="h-10 rounded-[8px] px-4 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  pending || !feedbackTitle.trim() || !feedbackDescription.trim()
                }
                onClick={handleSubmitFeedback}
                className={`h-10 rounded-[8px] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  feedbackAction === "reject"
                    ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                    : "bg-[#4B5563] hover:bg-[#374151]"
                }`}
              >
                {pending
                  ? "Sending..."
                  : feedbackAction === "reject"
                    ? "Reject & email"
                    : "Flag & email"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
