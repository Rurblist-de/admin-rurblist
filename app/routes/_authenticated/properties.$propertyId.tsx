import type { Route } from "./+types/properties.$propertyId";
import { requirePermission } from "~/lib/permissions";
import { PropertyDetailPage } from "~/features/properties/components/property-detail-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Property · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "property" })(request);
  return null;
}

export default function PropertyDetail({ params }: Route.ComponentProps) {
  return <PropertyDetailPage propertyId={params.propertyId} />;
}
