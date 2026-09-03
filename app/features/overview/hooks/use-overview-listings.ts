import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getOverviewListings } from "../services";

export function useOverviewListings() {
  return useQuery({
    queryKey: queryKeys.overview.listings,
    queryFn: getOverviewListings,
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
