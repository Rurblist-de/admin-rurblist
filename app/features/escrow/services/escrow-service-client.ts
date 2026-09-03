import type { ApiResponse } from "~/shared/api/base-response";
import {
  completeEscrowInspection as completeEscrowInspectionRequest,
  getAdminEscrow as getAdminEscrowRequest,
  getAdminEscrowById as getAdminEscrowByIdRequest,
  reviewEscrowCase as reviewEscrowCaseRequest,
  reviewEscrowDocument as reviewEscrowDocumentRequest,
  scheduleEscrowInspection as scheduleEscrowInspectionRequest,
  type EscrowCaseAction,
  type EscrowDetailData,
  type EscrowDocumentAction,
  type EscrowListData,
  type EscrowListParams,
} from "./escrow-service";

export async function getAdminEscrow(params: EscrowListParams) {
  const res = await getAdminEscrowRequest(params);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to load escrow.");
  }
  return res as ApiResponse<EscrowListData>;
}

export async function getAdminEscrowById(id: string) {
  const res = await getAdminEscrowByIdRequest(id);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to load escrow record.");
  }
  return res as ApiResponse<EscrowDetailData>;
}

export async function reviewEscrowDocument(
  id: string,
  documentId: string,
  action: EscrowDocumentAction,
  note?: string,
) {
  const res = await reviewEscrowDocumentRequest(id, documentId, action, note);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || `Unable to ${action} document.`);
  }
  return res as ApiResponse<EscrowDetailData>;
}

export async function scheduleEscrowInspection(
  id: string,
  payload: { scheduledAt: string; note?: string },
) {
  const res = await scheduleEscrowInspectionRequest(id, payload);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to schedule inspection.");
  }
  return res as ApiResponse<EscrowDetailData>;
}

export async function completeEscrowInspection(
  id: string,
  payload?: { note?: string },
) {
  const res = await completeEscrowInspectionRequest(id, payload);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || "Unable to complete inspection.");
  }
  return res as ApiResponse<EscrowDetailData>;
}

export async function reviewEscrowCase(
  id: string,
  action: EscrowCaseAction,
  payload?: { note?: string; rejectionReason?: string },
) {
  const res = await reviewEscrowCaseRequest(id, action, payload);
  if (res.statusCode >= 400 || !res.data) {
    throw new Error(res.message || `Unable to ${action} escrow.`);
  }
  return res as ApiResponse<EscrowDetailData>;
}
