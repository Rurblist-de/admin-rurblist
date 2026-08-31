import type { Route } from "./+types/properties.$propertyId";
import { BackButton } from "~/components/layout/back-button";
import { AgentApprovalQueue } from "~/components/users/agent-approval-queue";
import { PropertyActionsCard } from "~/components/properties/property-actions-card";
import { PropertyAgentCard } from "~/components/properties/property-agent-card";
import { PropertyChecklist } from "~/components/properties/property-checklist";
import { PropertyDescription } from "~/components/properties/property-description";
import { PropertyGallery } from "~/components/properties/property-gallery";
import {
  PropertyInfoCard,
  PropertyStatusBadge,
} from "~/components/properties/property-info-card";
import { MOCK_PROPERTIES, MOCK_USERS } from "~/services/api/mocks";
import { requirePermission } from "~/lib/permissions";

export function meta({ params }: Route.MetaArgs) {
  const property = MOCK_PROPERTIES.find((item) => item.id === params.propertyId);
  const title = property
    ? `${property.title} - ${property.city}, ${property.state}`
    : "Property";
  return [{ title: `${title} · Rublist Admin` }];
}

export function loader({ request, params }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "property" })(request);
  const queueCount = MOCK_USERS.filter(
    (user) =>
      user.agentStatus === "pending" || user.agentStatus === "under_review",
  ).length;
  return {
    property: MOCK_PROPERTIES.find((p) => p.id === params.propertyId) ?? null,
    queueCount,
  };
}

export default function PropertyDetail({ loaderData }: Route.ComponentProps) {
  const { property, queueCount } = loaderData;

  if (!property) {
    return (
      <div>
        <BackButton to="/properties" label="Back to Properties" />
        <p className="mt-4 text-sm text-[#6B7280]">Property not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <BackButton to="/properties" label="Back to Properties" />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-semibold leading-tight text-[#111827]">
            {property.title} - {property.city}, {property.state}
          </h1>
          <PropertyStatusBadge status={property.boardStatus} />
        </div>
        <AgentApprovalQueue count={queueCount} trailing="chevron" />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <div className="flex flex-col gap-5">
          <PropertyGallery images={property.images ?? []} />
          <PropertyDescription description={property.description} />
          <PropertyChecklist items={property.checklist ?? []} />
        </div>

        <div className="flex flex-col gap-4">
          <PropertyInfoCard property={property} />
          <PropertyAgentCard agent={property.agent} />
          <PropertyActionsCard />
        </div>
      </div>
    </div>
  );
}
