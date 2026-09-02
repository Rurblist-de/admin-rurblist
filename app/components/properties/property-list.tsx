import { Link } from "react-router";
import { Eye } from "lucide-react";
import { formatPropertyPrice } from "~/lib/format";
import { StatusBadge } from "~/components/ui/status-badge";
import { FlagBadge } from "~/components/properties/flag-badge";
import type { AdminProperty, PropertyBoardStatus } from "~/services/api/types";

const STATUS_LABEL: Record<PropertyBoardStatus, string> = {
  pending_review: "Pending Review",
  verified: "Verified",
  published: "Published",
  sold_delisted: "Sold/ Delisted",
};

export function PropertyList({ properties }: { properties: AdminProperty[] }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E5E7EB] text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            <tr>
              <th className="px-5 py-3 font-medium">Property</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Flags</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td
                  className="px-5 py-10 text-center text-[#6B7280]"
                  colSpan={7}
                >
                  No properties match these filters.
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-[#E5E7EB] last:border-0"
                >
                  <td className="px-5 py-3.5">
                    <span className="block font-medium text-[#111827]">
                      {property.title}
                    </span>
                    <span className="block text-xs text-[#6B7280]">
                      {property.ownerName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#6B7280]">{property.type}</td>
                  <td className="px-5 py-3.5 text-[#6B7280]">
                    {property.city}, {property.state}
                  </td>
                  <td className="px-5 py-3.5 text-[#111827]">
                    {formatPropertyPrice(property.price, property.pricePeriod)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge tone={statusTone(property.boardStatus)}>
                      {STATUS_LABEL[property.boardStatus]}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {property.flagged ? (
                        <FlagBadge label="FLAGGED" tone="flagged" />
                      ) : null}
                      {property.featured ? (
                        <FlagBadge label="FEATURED" tone="featured" />
                      ) : null}
                      {!property.flagged && !property.featured ? (
                        <span className="text-xs text-[#6B7280]">—</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      to={`/properties/${property.id}`}
                      aria-label={`View ${property.title}`}
                      className="flex size-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"
                    >
                      <Eye className="size-4" strokeWidth={1.75} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function statusTone(status: PropertyBoardStatus) {
  if (status === "published") return "success" as const;
  if (status === "verified") return "success" as const;
  if (status === "pending_review") return "warning" as const;
  return "neutral" as const;
}
