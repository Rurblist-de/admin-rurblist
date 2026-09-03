import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getOverviewListingsByState } from "../services";

export function useOverviewListingsByState() {
  return useQuery({
    queryKey: queryKeys.overview.listingsByState,
    queryFn: getOverviewListingsByState,
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
