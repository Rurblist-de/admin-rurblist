import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getAdminEscrowById } from "../services";

export function useEscrowDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.escrow.get(id),
    queryFn: () => getAdminEscrowById(id),
    enabled:
      typeof window !== "undefined" &&
      Boolean(id) &&
      Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.detail,
  });
}
