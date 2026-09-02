export function FlagBadge({
  label,
  tone,
}: {
  label: string;
  tone: "flagged" | "featured";
}) {
  const styles =
    tone === "flagged"
      ? "bg-[#FEECEC] text-[#E11D48]"
      : "bg-[#FFF1E7] text-[#E55B13]";
  const dot = tone === "flagged" ? "bg-[#E11D48]" : "bg-[#E55B13]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] ${styles}`}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
