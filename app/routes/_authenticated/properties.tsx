import { Link } from "react-router";
import type { Route } from "./+types/properties";
import { PageHeader } from "~/components/layout/page-header";
import { DataTable } from "~/components/ui/data-table";
import { StatusBadge } from "~/components/ui/status-badge";
import { MOCK_PROPERTIES } from "~/services/api/mocks";
import { formatNaira } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Properties · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "property" })(request);
  return { properties: MOCK_PROPERTIES };
}

function verificationTone(status: string) {
  if (status === "verified") return "success" as const;
  if (status === "pending") return "warning" as const;
  return "neutral" as const;
}

export default function Properties({ loaderData }: Route.ComponentProps) {
  const { properties } = loaderData;

  return (
    <div>
      <PageHeader title="Properties" description="Listing moderation and verification status." />
      <DataTable
        headers={["Property", "Type", "Location", "Price", "Verification", ""]}
        rows={properties.map((property) => [
          <div key={`${property.id}-title`}>
            <p className="font-medium">{property.title}</p>
            <p className="text-xs text-muted">{property.ownerName}</p>
          </div>,
          property.type,
          `${property.city}, ${property.state}`,
          formatNaira(property.price),
          <StatusBadge
            key={`${property.id}-status`}
            tone={verificationTone(property.verificationStatus)}
          >
            {property.verificationStatus}
          </StatusBadge>,
          <Link
            key={`${property.id}-link`}
            to={`/properties/${property.id}`}
            className="text-accent"
          >
            View
          </Link>,
        ])}
      />
    </div>
  );
}
