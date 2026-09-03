import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getOverviewEscrow } from "../services";

export function useOverviewEscrow() {
  return useQuery({
    queryKey: queryKeys.overview.escrow,
    queryFn: getOverviewEscrow,
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
