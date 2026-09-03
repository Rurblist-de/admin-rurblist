import type { EscrowLedgerStatus } from "~/services/api/types";

const styles: Record<EscrowLedgerStatus, string> = {
  released: "bg-emerald-50 text-emerald-700",
  held_in_escrow: "bg-slate-100 text-slate-600",
  initiated: "bg-orange-50 text-orange-700",
  disputed: "bg-red-50 text-red-600",
};
const dots: Record<EscrowLedgerStatus, string> = {
  released: "bg-emerald-500",
  held_in_escrow: "bg-slate-400",
  initiated: "bg-accent",
  disputed: "bg-red-500",
};
const labels: Record<EscrowLedgerStatus, string> = {
  released: "Released",
  held_in_escrow: "Held in Escrow",
  initiated: "Initiated",
  disputed: "Disputed",
};

export function LedgerStatus({ status }: { status: EscrowLedgerStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles[status]}`}
    >
      <span className={`size-1.5 rounded-full ${dots[status]}`} />
      {labels[status]}
    </span>
  );
}
