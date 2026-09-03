import { api } from "~/shared/api/call-apis";
import type {
  AdminDispute,
  AdminPayment,
  AdminPayout,
  EscrowLedgerStatus,
  EscrowSummary,
} from "~/services/api/types";

export type EscrowTab = "ledger" | "disputes" | "payouts";

export type EscrowListParams = {
  q?: string;
  status?: EscrowLedgerStatus;
  tab?: EscrowTab;
  page?: number;
  limit?: number;
};

export type EscrowListData = {
  payments: AdminPayment[];
  disputes: AdminDispute[];
  payouts: AdminPayout[];
  summary: EscrowSummary;
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  from: number;
  to: number;
};

export type EscrowDetailData = {
  payment: AdminPayment;
};

export type EscrowDocumentAction = "approve" | "reject";
export type EscrowCaseAction = "release" | "reject";

export function escrowQueryString(params: EscrowListParams) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.status) search.set("status", params.status);
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 12));
  return search.toString();
}

export async function getAdminEscrow(params: EscrowListParams) {
  return api.authGet<EscrowListData>(`/admin/escrow?${escrowQueryString(params)}`);
}

export async function getAdminEscrowById(id: string) {
  return api.authGet<EscrowDetailData>(`/admin/escrow/${id}`);
}

export async function reviewEscrowDocument(
  id: string,
  documentId: string,
  action: EscrowDocumentAction,
  note?: string,
) {
  return api.authPatch<EscrowDetailData>(
    `/admin/escrow/${id}/documents/${documentId}/${action}`,
    note ? { note } : undefined,
  );
}

export async function scheduleEscrowInspection(
  id: string,
  payload: { scheduledAt: string; note?: string },
) {
  return api.authPatch<EscrowDetailData>(
    `/admin/escrow/${id}/inspection/schedule`,
    payload,
  );
}

export async function completeEscrowInspection(
  id: string,
  payload?: { note?: string },
) {
  return api.authPatch<EscrowDetailData>(
    `/admin/escrow/${id}/inspection/complete`,
    payload,
  );
}

export async function reviewEscrowCase(
  id: string,
  action: EscrowCaseAction,
  payload?: { note?: string; rejectionReason?: string },
) {
  return api.authPatch<EscrowDetailData>(
    `/admin/escrow/${id}/review/${action}`,
    payload,
  );
}
