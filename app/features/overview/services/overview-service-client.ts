import type { ApiResponse } from "~/shared/api/base-response";
import {
  getOverviewAttention as getOverviewAttentionRequest,
  getOverviewEscrow as getOverviewEscrowRequest,
  getOverviewEscrowTrend as getOverviewEscrowTrendRequest,
  getOverviewListings as getOverviewListingsRequest,
  getOverviewListingsByState as getOverviewListingsByStateRequest,
  getOverviewVerifications as getOverviewVerificationsRequest,
} from "./overview-service";

function unwrap<T>(res: ApiResponse<T>): ApiResponse<T> {
  if (res.statusCode >= 400) {
    throw new Error(res.message);
  }
  return res;
}

export async function getOverviewListings() {
  return unwrap(await getOverviewListingsRequest());
}

export async function getOverviewEscrow() {
  return unwrap(await getOverviewEscrowRequest());
}

export async function getOverviewVerifications() {
  return unwrap(await getOverviewVerificationsRequest());
}

export async function getOverviewEscrowTrend() {
  return unwrap(await getOverviewEscrowTrendRequest());
}

export async function getOverviewListingsByState() {
  return unwrap(await getOverviewListingsByStateRequest());
}

export async function getOverviewAttention() {
  return unwrap(await getOverviewAttentionRequest());
}
