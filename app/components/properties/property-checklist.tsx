import { Check, X } from "lucide-react";
import type { PropertyChecklistItem } from "~/services/api/types";

export function PropertyChecklist({ items }: { items: PropertyChecklistItem[] }) {
  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-5">
      <h2 className="text-base font-semibold text-[#111827]">
        Verification Checklist
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-[10px] bg-[#F3F4F6] px-4 py-3.5"
          >
            {item.done ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#BBF7D0] text-white">
                <Check className="size-3.5 text-[#16A34A]" strokeWidth={3} />
              </span>
            ) : (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FECACA] text-white">
                <X className="size-3.5 text-[#DC2626]" strokeWidth={3} />
              </span>
            )}
            <span className="text-sm font-medium text-[#111827]">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
