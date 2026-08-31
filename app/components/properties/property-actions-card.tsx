import { Check, Flag, X } from "lucide-react";

export function PropertyActionsCard() {
  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white">
      <h2 className="border-b border-[#E5E7EB] px-5 py-4 text-sm font-semibold text-[#111827]">
        Actions
      </h2>
      <div className="flex flex-col gap-2.5 px-5 py-4">
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-[#22C55E] px-4 text-sm font-medium text-white hover:bg-[#16A34A]"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
            <Check className="size-3.5 text-[#22C55E]" strokeWidth={2.75} />
          </span>
          Approve & Verify
        </button>
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-[#FEE2E2] px-4 text-sm font-medium text-[#DC2626] hover:bg-[#FECACA]"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
            <X className="size-3.5 text-[#DC2626]" strokeWidth={2.75} />
          </span>
          Reject Listing
        </button>
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-start gap-3 rounded-[10px] bg-[#F3F4F6] px-4 text-sm font-medium text-[#4B5563] hover:bg-[#E5E7EB]"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
            <Flag className="size-3 text-[#4B5563]" strokeWidth={2} />
          </span>
          Flag for Review
        </button>
      </div>
    </section>
  );
}
