import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getAdminUser } from "../services";

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.get(id),
    queryFn: () => getAdminUser(id),
    enabled:
      typeof window !== "undefined" &&
      Boolean(id) &&
      Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.detail,
  });
}
