import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_AUDIT_LOGS } from "~/services/api/mocks";
import type { AuditLog } from "~/services/api/types";

async function listAuditLogs(): Promise<AuditLog[]> {
  return MOCK_AUDIT_LOGS;
}

export class AuditLogOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.auditLogs.list(),
      queryFn: listAuditLogs,
    });
}
