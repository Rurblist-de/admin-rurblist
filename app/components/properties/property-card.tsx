import { Link } from "react-router";
import { formatPropertyPrice } from "~/lib/format";
import type { AdminProperty } from "~/services/api/types";
import { FlagBadge } from "./flag-badge";

export function PropertyCard({ property }: { property: AdminProperty }) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="block rounded-[10px] border border-[#ECECEC] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      <p className="text-[13px] font-semibold leading-5 text-[#111827]">
        {property.title} - {property.city}, {property.state}
      </p>
      <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">
        {formatPropertyPrice(property.price, property.pricePeriod)}
      </p>
      {property.flagged || property.featured ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {property.flagged ? <FlagBadge label="FLAGGED" tone="flagged" /> : null}
          {property.featured ? (
            <FlagBadge label="FEATURED" tone="featured" />
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}
