import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

export function BackButton({
  to,
  label = "Back",
}: {
  to: string;
  label?: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
    >
      <ChevronLeft className="size-4" strokeWidth={1.75} />
      {label}
    </Link>
  );
}
