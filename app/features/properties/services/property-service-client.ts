import type { ApiResponse } from "~/shared/api/base-response";
import {
  completePropertyInspection as completePropertyInspectionRequest,
  getAdminProperties as getAdminPropertiesRequest,
  getAdminProperty as getAdminPropertyRequest,
  reviewPropertyDocument as reviewPropertyDocumentRequest,
  reviewPropertyListing as reviewPropertyListingRequest,
  schedulePropertyInspection as schedulePropertyInspectionRequest,
  type PropertiesListData,
  type PropertiesListParams,
  type PropertyDetailData,
  type PropertyDocumentAction,
  type PropertyDocumentType,
  type PropertyListingAction,
} from "./property-service";

export async function getAdminProperties(params: PropertiesListParams) {
  const res = await getAdminPropertiesRequest(params);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to load properties.");
  }
  return res as ApiResponse<PropertiesListData>;
}

export async function getAdminProperty(id: string) {
  const res = await getAdminPropertyRequest(id);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to load property.");
  }
  return res as ApiResponse<PropertyDetailData>;
}

export async function reviewPropertyDocument(
  id: string,
  docType: PropertyDocumentType,
  action: PropertyDocumentAction,
) {
  const res = await reviewPropertyDocumentRequest(id, docType, action);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || `Unable to ${action} document.`);
  }
  return res as ApiResponse<PropertyDetailData>;
}

export async function schedulePropertyInspection(
  id: string,
  payload: { scheduledAt: string; note?: string },
) {
  const res = await schedulePropertyInspectionRequest(id, payload);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to schedule inspection.");
  }
  return res as ApiResponse<PropertyDetailData>;
}

export async function completePropertyInspection(
  id: string,
  payload?: { note?: string },
) {
  const res = await completePropertyInspectionRequest(id, payload);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to complete inspection.");
  }
  return res as ApiResponse<PropertyDetailData>;
}

export async function reviewPropertyListing(
  id: string,
  action: PropertyListingAction,
) {
  const res = await reviewPropertyListingRequest(id, action);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || `Unable to ${action} listing.`);
  }
  return res as ApiResponse<PropertyDetailData>;
}
