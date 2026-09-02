import type { AdminProperty, PropertyBoardStatus } from "~/services/api/types";
import { PropertyCard } from "./property-card";

const COLUMNS: Array<{
  status: PropertyBoardStatus;
  label: string;
}> = [
  { status: "pending_review", label: "Pending Review" },
  { status: "verified", label: "Verified" },
  { status: "published", label: "Published" },
  { status: "sold_delisted", label: "Sold/ Delisted" },
];

export function PropertyBoard({
  properties,
  counts,
}: {
  properties: AdminProperty[];
  counts: Record<PropertyBoardStatus, number>;
}) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="grid min-w-[68rem] grid-cols-4 items-stretch gap-4">
        {COLUMNS.map((column) => {
          const items = properties.filter(
            (property) => property.boardStatus === column.status,
          );

          return (
            <section
              key={column.status}
              className="flex min-h-[32rem] flex-col rounded-[12px] border border-[#ECECEC] bg-[#F3F4F6] p-3"
            >
              <header className="mb-3 flex items-center gap-2 px-1 pt-0.5">
                <h2 className="text-[13px] font-semibold text-[#111827]">
                  {column.label}
                </h2>
                <span className="flex size-[22px] items-center justify-center rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#6B7280]">
                  {counts[column.status]}
                </span>
              </header>
              <div className="flex flex-1 flex-col gap-3">
                {items.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
