import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getOverviewVerifications } from "../services";

export function useOverviewVerifications() {
  return useQuery({
    queryKey: queryKeys.overview.verifications,
    queryFn: getOverviewVerifications,
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
