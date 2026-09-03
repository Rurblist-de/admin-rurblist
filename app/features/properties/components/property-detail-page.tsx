import { useState } from "react";
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
import { useProperty } from "../hooks/use-property";
import { PropertyChecklistPanel } from "./property-checklist-panel";

export function PropertyDetailPage({ propertyId }: { propertyId: string }) {
  const propertyQuery = useProperty(propertyId);
  const property = propertyQuery.data?.property;
  const queueCount = propertyQuery.data?.queueCount ?? 0;
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(
    null,
  );

  if (propertyQuery.isLoading) {
    return <p className="text-sm text-[#6B7280]">Loading property...</p>;
  }

  if (propertyQuery.error || !property) {
    return (
      <div>
        <BackButton to="/properties" label="Back to Properties" />
        <p className="mt-4 text-sm text-[#6B7280]">
          {propertyQuery.error instanceof Error
            ? propertyQuery.error.message
            : "Property not found."}
        </p>
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
          <PropertyChecklist
            items={property.checklist ?? []}
            selectedId={selectedChecklistId}
            onSelect={(id) =>
              setSelectedChecklistId((current) => (current === id ? null : id))
            }
          />
          <PropertyChecklistPanel
            property={property}
            selectedId={selectedChecklistId}
          />
        </div>

        <div className="flex flex-col gap-4">
          <PropertyInfoCard property={property} />
          <PropertyAgentCard agent={property.agent} />
          <PropertyActionsCard property={property} />
        </div>
      </div>
    </div>
  );
}
