import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getAdminProperty } from "../services";

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.get(id),
    queryFn: () => getAdminProperty(id),
    enabled:
      typeof window !== "undefined" &&
      Boolean(id) &&
      Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.detail,
  });
}
