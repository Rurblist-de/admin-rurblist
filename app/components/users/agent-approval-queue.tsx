import { Link } from "react-router";
import { ChevronRight, FileSearch } from "lucide-react";

export function AgentApprovalQueue({
  count,
  to = "/users?queue=approvals",
  trailing = "count",
}: {
  count: number;
  to?: string;
  trailing?: "count" | "chevron";
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-[14px] rounded-full px-7 py-[14px] text-sm font-medium text-[#E55B13]"
      style={{ backgroundColor: "rgba(229, 91, 19, 0.18)" }}
    >
      <FileSearch className="size-5 shrink-0" strokeWidth={1.75} />
      Agent Approval Queue
      {trailing === "chevron" ? (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E55B13] text-white">
          <ChevronRight className="size-3.5" strokeWidth={2.5} />
        </span>
      ) : (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E55B13] text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
