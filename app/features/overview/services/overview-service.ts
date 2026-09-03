import { api } from "~/shared/api/call-apis";
import type {
  AttentionItem,
  EscrowTrendPoint,
  ListingByState,
} from "~/services/api/types";

export type ListingsStats = {
  activeListings: number;
  listingChangePct: number;
};

export type EscrowStats = {
  escrowVolumeNgn: number;
  escrowChangePct: number;
};

export type VerificationStats = {
  pendingVerification: number;
  pendingPriorityLabel: string;
};

export async function getOverviewListings() {
  return api.authGet<ListingsStats>("/admin/overview/listings");
}

export async function getOverviewEscrow() {
  return api.authGet<EscrowStats>("/admin/overview/escrow");
}

export async function getOverviewVerifications() {
  return api.authGet<VerificationStats>("/admin/overview/verifications");
}

export async function getOverviewEscrowTrend() {
  return api.authGet<EscrowTrendPoint[]>("/admin/overview/escrow-trend");
}

export async function getOverviewListingsByState() {
  return api.authGet<ListingByState[]>("/admin/overview/listings-by-state");
}

export async function getOverviewAttention() {
  return api.authGet<AttentionItem[]>("/admin/overview/attention");
}
