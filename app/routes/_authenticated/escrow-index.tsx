import { Scale } from "lucide-react";

export default function EscrowIndex() {
  return (
    <section className="flex min-h-105 flex-col items-center justify-center px-6 text-center">
      <div className="flex min-h-90 w-full flex-col items-center justify-center rounded-xl border border-stroke">
        <Scale className="size-12 text-muted" strokeWidth={1.25} />
        <p className="mt-4 text-sm font-medium text-muted">
          Select A Dispute to view details
        </p>
      </div>
    </section>
  );
}
