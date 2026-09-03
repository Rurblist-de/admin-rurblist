import { api } from "~/shared/api/call-apis";
import type { AdminProperty, PropertyBoardStatus } from "~/services/api/types";

export type PropertiesView = "board" | "list";

export type PropertiesListParams = {
  q?: string;
  type?: string;
  state?: string;
  view?: PropertiesView;
  page?: number;
  limit?: number;
};

export type PropertiesListData = {
  properties: AdminProperty[];
  counts: Record<PropertyBoardStatus, number>;
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  from: number;
  to: number;
  typeOptions: string[];
  stateOptions: string[];
  queueCount: number;
};

export function propertiesQueryString(params: PropertiesListParams) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type) search.set("type", params.type);
  if (params.state) search.set("state", params.state);
  const view = params.view === "list" ? "list" : "board";
  search.set("view", view);
  search.set("page", String(params.page ?? 1));
  search.set(
    "limit",
    String(params.limit ?? (view === "list" ? 12 : 200)),
  );
  return search.toString();
}

export async function getAdminProperties(params: PropertiesListParams) {
  return api.authGet<PropertiesListData>(
    `/admin/properties?${propertiesQueryString(params)}`,
  );
}

export type PropertyDetailData = {
  property: AdminProperty;
  queueCount: number;
};

export async function getAdminProperty(id: string) {
  return api.authGet<PropertyDetailData>(`/admin/properties/${id}`);
}

export type PropertyDocumentType =
  | "certificate_of_occupancy"
  | "survey_plan"
  | "deed_of_assignment";

export type PropertyDocumentAction = "approve" | "reject";
export type PropertyListingAction = "approve" | "reject" | "flag";

export async function reviewPropertyDocument(
  id: string,
  docType: PropertyDocumentType,
  action: PropertyDocumentAction,
) {
  return api.authPatch<PropertyDetailData>(
    `/admin/properties/${id}/documents/${docType}/${action}`,
  );
}

export async function schedulePropertyInspection(
  id: string,
  payload: { scheduledAt: string; note?: string },
) {
  return api.authPatch<PropertyDetailData>(
    `/admin/properties/${id}/inspection/schedule`,
    payload,
  );
}

export async function completePropertyInspection(
  id: string,
  payload?: { note?: string },
) {
  return api.authPatch<PropertyDetailData>(
    `/admin/properties/${id}/inspection/complete`,
    payload,
  );
}

export async function reviewPropertyListing(
  id: string,
  action: PropertyListingAction,
) {
  return api.authPatch<PropertyDetailData>(
    `/admin/properties/${id}/review/${action}`,
  );
}
