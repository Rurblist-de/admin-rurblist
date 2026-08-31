import { Check, UserRound } from "lucide-react";
import type { PropertyAgent } from "~/services/api/types";

export function PropertyAgentCard({ agent }: { agent?: PropertyAgent }) {
  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white">
      <h2 className="border-b border-[#E5E7EB] px-5 py-4 text-sm font-semibold text-[#111827]">
        Agent
      </h2>
      <div className="px-5 py-4">
        {agent ? (
          <div className="flex items-center gap-3">
            <span className="relative shrink-0">
              <span className="flex size-10 items-center justify-center rounded-full border-[1.5px] border-[#22C55E] text-[#22C55E]">
                <UserRound className="size-5" strokeWidth={1.75} />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#22C55E] text-white ring-2 ring-white">
                <Check className="size-2" strokeWidth={3} />
              </span>
            </span>
            <p className="text-sm font-medium text-[#111827]">{agent.name}</p>
          </div>
        ) : (
          <p className="text-sm text-[#6B7280]">No agent assigned.</p>
        )}
      </div>
    </section>
  );
}
