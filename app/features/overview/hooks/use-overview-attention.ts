import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getOverviewAttention } from "../services";

export function useOverviewAttention() {
  return useQuery({
    queryKey: queryKeys.overview.attention,
    queryFn: getOverviewAttention,
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
