import type { Route } from "./+types/properties";
import { AgentApprovalQueue } from "~/components/users/agent-approval-queue";
import { PropertyBoard } from "~/components/properties/property-board";
import {
  PropertyFilters,
  type PropertiesView,
} from "~/components/properties/property-filters";
import { PropertyList } from "~/components/properties/property-list";
import { MOCK_PROPERTIES, MOCK_USERS } from "~/services/api/mocks";
import { requirePermission } from "~/lib/permissions";
import type { PropertyBoardStatus } from "~/services/api/types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Properties · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "property" })(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const type = url.searchParams.get("type") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const viewParam = url.searchParams.get("view");
  const view: PropertiesView = viewParam === "list" ? "list" : "board";

  let properties = MOCK_PROPERTIES;

  if (q) {
    const needle = q.toLowerCase();
    properties = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(needle) ||
        property.ownerName.toLowerCase().includes(needle) ||
        property.city.toLowerCase().includes(needle) ||
        property.state.toLowerCase().includes(needle) ||
        (property.phone ?? "").includes(q),
    );
  }
  if (type) {
    properties = properties.filter(
      (property) => property.type.toLowerCase() === type.toLowerCase(),
    );
  }
  if (state) {
    properties = properties.filter(
      (property) => property.state.toLowerCase() === state.toLowerCase(),
    );
  }

  const counts = emptyCounts();
  for (const property of properties) {
    counts[property.boardStatus] += 1;
  }

  const typeOptions = uniqueSorted(MOCK_PROPERTIES.map((p) => p.type));
  const stateOptions = uniqueSorted(MOCK_PROPERTIES.map((p) => p.state));
  const queueCount = MOCK_USERS.filter(
    (user) =>
      user.agentStatus === "pending" || user.agentStatus === "under_review",
  ).length;

  return {
    properties,
    counts,
    q,
    type,
    state,
    view,
    typeOptions,
    stateOptions,
    queueCount,
  };
}

export default function Properties({ loaderData }: Route.ComponentProps) {
  const {
    properties,
    counts,
    q,
    type,
    state,
    view,
    typeOptions,
    stateOptions,
    queueCount,
  } = loaderData;

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight text-[#111827]">
            Properties
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7280]">
            Review, verify, and manage property listings.
          </p>
        </div>
        <AgentApprovalQueue count={queueCount} />
      </div>

      <PropertyFilters
        q={q}
        type={type}
        state={state}
        view={view}
        typeOptions={typeOptions}
        stateOptions={stateOptions}
      />

      {view === "list" ? (
        <PropertyList properties={properties} />
      ) : (
        <PropertyBoard properties={properties} counts={counts} />
      )}
    </div>
  );
}

function emptyCounts(): Record<PropertyBoardStatus, number> {
  return {
    pending_review: 0,
    verified: 0,
    published: 0,
    sold_delisted: 0,
  };
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
