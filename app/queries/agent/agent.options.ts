import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_USERS } from "~/services/api/mocks";
import type { AdminUser } from "~/services/api/types";

async function listPendingKyc(): Promise<AdminUser[]> {
  return MOCK_USERS.filter(
    (u) => u.agentStatus === "pending" || u.agentStatus === "under_review",
  );
}

export class AgentOptions {
  static readonly kycQueue = () =>
    queryOptions({
      queryKey: queryKeys.agents.list({ queue: "kyc" }),
      queryFn: listPendingKyc,
    });
}
