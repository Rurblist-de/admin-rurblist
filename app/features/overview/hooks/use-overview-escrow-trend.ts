import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getOverviewEscrowTrend } from "../services";

export function useOverviewEscrowTrend() {
  return useQuery({
    queryKey: queryKeys.overview.escrowTrend,
    queryFn: getOverviewEscrowTrend,
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
