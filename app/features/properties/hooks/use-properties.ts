import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getAdminProperties } from "../services";
import type { PropertiesListParams } from "../services";

export function useProperties(params: PropertiesListParams) {
  return useQuery({
    queryKey: queryKeys.properties.list(params),
    queryFn: () => getAdminProperties(params),
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
