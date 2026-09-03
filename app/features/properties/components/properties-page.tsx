import { Form, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { AgentApprovalQueue } from "~/components/users/agent-approval-queue";
import { PropertyBoard } from "~/components/properties/property-board";
import {
  PropertyFilters,
  viewHref,
  type PropertiesView,
} from "~/components/properties/property-filters";
import { PropertyList } from "~/components/properties/property-list";
import { PageHeader } from "~/components/layout/page-header";
import { Pagination } from "~/components/ui/pagination";
import type { PropertyBoardStatus } from "~/services/api/types";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useProperties } from "../hooks/use-properties";
import type { PropertiesListParams } from "../services";

const EMPTY_COUNTS: Record<PropertyBoardStatus, number> = {
  pending_review: 0,
  verified: 0,
  published: 0,
  sold_delisted: 0,
};

export function PropertiesPage({ filters }: { filters: PropertiesListParams }) {
  const navigate = useNavigate();
  const searchFocused = useRef(false);
  const q = filters.q ?? "";
  const type = filters.type ?? "";
  const state = filters.state ?? "";
  const view: PropertiesView = filters.view === "list" ? "list" : "board";
  const [qInput, setQInput] = useState(q);
  const debouncedQ = useDebouncedValue(qInput.trim(), 300);
  const searchChanged = debouncedQ !== q.trim();
  const listFilters: PropertiesListParams = {
    ...filters,
    q: debouncedQ || undefined,
    view,
    page: searchChanged ? 1 : filters.page,
  };
  const propertiesQuery = useProperties(listFilters);
  const data = propertiesQuery.data;
  const properties = data?.properties ?? [];
  const counts = data?.counts ?? EMPTY_COUNTS;
  const total = data?.total ?? 0;
  const page = data?.page ?? listFilters.page ?? 1;
  const pageCount = data?.pageCount ?? 1;
  const queueCount = data?.queueCount ?? 0;
  const from = data?.from ?? 0;
  const to = data?.to ?? 0;
  const typeOptions = mergeOption(type, data?.typeOptions);
  const stateOptions = mergeOption(state, data?.stateOptions);

  useEffect(() => {
    if (!searchFocused.current) {
      setQInput(q);
    }
  }, [q]);

  useEffect(() => {
    if (!searchChanged) return;
    navigate(viewHref({ q: debouncedQ, type, state, view, page: 1 }), {
      replace: true,
    });
  }, [debouncedQ, searchChanged, type, state, view, navigate]);

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Review, verify, and manage property listings."
        actions={<AgentApprovalQueue count={queueCount} />}
      />

      <PropertyFilters
        q={qInput}
        type={type}
        state={state}
        view={view}
        typeOptions={typeOptions}
        stateOptions={stateOptions}
        onQChange={setQInput}
        onQFocus={() => {
          searchFocused.current = true;
        }}
        onQBlur={() => {
          searchFocused.current = false;
        }}
      />

      {propertiesQuery.isLoading && properties.length === 0 ? (
        <p className="text-sm text-muted">Loading properties...</p>
      ) : propertiesQuery.error && properties.length === 0 ? (
        <p className="text-sm text-red-500">
          {propertiesQuery.error instanceof Error
            ? propertiesQuery.error.message
            : "Unable to load properties."}
        </p>
      ) : view === "list" ? (
        <PropertyList
          properties={properties}
          footer={
            <Pagination
              page={page}
              pageCount={pageCount}
              from={from}
              to={to}
              total={total}
              noun="properties"
              hrefForPage={(nextPage) =>
                viewHref({
                  q: qInput.trim(),
                  type,
                  state,
                  view,
                  page: nextPage,
                })
              }
            />
          }
        />
      ) : (
        <PropertyBoard properties={properties} counts={counts} />
      )}
    </div>
  );
}

function mergeOption(current: string, options?: string[]) {
  const values = [...(options ?? [])];
  if (current && !values.some((value) => value.toLowerCase() === current.toLowerCase())) {
    values.unshift(current);
  }
  return values;
}
