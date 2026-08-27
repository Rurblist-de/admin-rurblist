import { Link } from "react-router";
import type { Route } from "./+types/properties.$propertyId";
import { PageHeader } from "~/components/layout/page-header";
import { StatusBadge } from "~/components/ui/status-badge";
import { MOCK_PROPERTIES } from "~/services/api/mocks";
import { formatNaira } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Property · Rublist Admin" }];
}

export function loader({ request, params }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "property" })(request);
  return {
    property: MOCK_PROPERTIES.find((p) => p.id === params.propertyId) ?? null,
  };
}

export default function PropertyDetail({ loaderData }: Route.ComponentProps) {
  const { property } = loaderData;

  if (!property) {
    return <p className="text-sm text-muted">Property not found.</p>;
  }

  return (
    <div>
      <Link to="/properties" className="text-sm text-muted hover:text-ink">
        Properties
      </Link>
      <PageHeader title={property.title} description={`${property.type} · ${property.ownerName}`} />
      <section className="rounded-lg border border-stroke bg-white p-5">
        <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          <div>
            <dt className="text-muted">Price</dt>
            <dd>{formatNaira(property.price)}</dd>
          </div>
          <div>
            <dt className="text-muted">Location</dt>
            <dd>
              {property.city}, {property.state}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Verification</dt>
            <dd>
              <StatusBadge tone="warning">{property.verificationStatus}</StatusBadge>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
