import { Check, ChevronRight, X } from "lucide-react";
import type { PropertyChecklistItem } from "~/services/api/types";

export function PropertyChecklist({
  items,
  selectedId,
  onSelect,
}: {
  items: PropertyChecklistItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-5">
      <h2 className="text-base font-semibold text-[#111827]">
        Verification Checklist
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => {
          const selected = selectedId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={[
                  "flex w-full items-center gap-3 rounded-[10px] px-4 py-3.5 text-left transition-colors",
                  selected
                    ? "bg-white ring-1 ring-[#E55B13]"
                    : "bg-[#F3F4F6] hover:bg-[#E5E7EB]",
                ].join(" ")}
              >
                {item.done ? (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#BBF7D0]">
                    <Check className="size-3.5 text-[#16A34A]" strokeWidth={3} />
                  </span>
                ) : (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FECACA]">
                    <X className="size-3.5 text-[#DC2626]" strokeWidth={3} />
                  </span>
                )}
                <span className="min-w-0 flex-1 text-sm font-medium text-[#111827]">
                  {item.label}
                </span>
                <ChevronRight
                  className={[
                    "size-4 shrink-0",
                    selected ? "text-[#E55B13]" : "text-[#9CA3AF]",
                  ].join(" ")}
                  strokeWidth={2}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
