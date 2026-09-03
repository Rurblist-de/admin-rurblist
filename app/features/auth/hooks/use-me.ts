import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getAdminMe } from "../services";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getAdminMe,
    enabled: typeof window !== "undefined" && Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.static,
  });
}
