import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { queryTiming } from "~/shared/react-query";
import { getTokenFromDocument } from "~/lib/auth/session";
import { getAdminEscrow } from "../services";
import type { EscrowListParams } from "../services";

export function useEscrow(params: EscrowListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.escrow.list(params),
    queryFn: () => getAdminEscrow(params),
    enabled:
      enabled &&
      typeof window !== "undefined" &&
      Boolean(getTokenFromDocument()),
    select: (res) => res.data,
    ...queryTiming.list,
  });
}
