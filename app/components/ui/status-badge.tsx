type Tone = "neutral" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-ink",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-orange-50 text-orange-700",
  danger: "bg-red-50 text-red-700",
};

const dots: Record<Tone, string> = {
  neutral: "bg-gray-400",
  success: "bg-emerald-500",
  warning: "bg-orange-500",
  danger: "bg-red-500",
};

export function StatusBadge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: string;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${tones[tone]}`}
    >
      {dot ? <span className={`size-1.5 rounded-full ${dots[tone]}`} /> : null}
      {children.replaceAll("_", " ")}
    </span>
  );
}
