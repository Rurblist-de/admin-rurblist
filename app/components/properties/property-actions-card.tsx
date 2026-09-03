import { Check, Flag, X } from "lucide-react";
import { Can } from "~/lib/permissions";
import type { AdminProperty } from "~/services/api/types";
import { usePropertyMutations } from "~/features/properties/hooks/use-property-mutations";

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

  const handleReview = async (action: "approve" | "reject" | "flag") => {
    try {
      await reviewListing.mutateAsync(action);
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
            onClick={() => handleReview("approve")}
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
            onClick={() => handleReview("reject")}
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
            onClick={() => handleReview("flag")}
            className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-[#F3F4F6] px-4 text-sm font-medium text-[#4B5563] hover:bg-[#E5E7EB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
              <Flag className="size-3 text-[#4B5563]" strokeWidth={2} />
            </span>
            Flag
          </button>
          {!canApprove && !approved && !sold ? (
            <p className="text-xs text-[#6B7280]">
              Approve requires verified title documents and owner identity.
            </p>
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
    </section>
  );
}
