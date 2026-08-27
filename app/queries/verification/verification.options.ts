import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_VERIFICATIONS } from "~/services/api/mocks";
import type { AdminVerification } from "~/services/api/types";

async function listVerifications(): Promise<AdminVerification[]> {
  return MOCK_VERIFICATIONS;
}

async function getVerification(
  id: string,
): Promise<AdminVerification | undefined> {
  return MOCK_VERIFICATIONS.find((v) => v.id === id);
}

export class VerificationOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.verifications.list(),
      queryFn: listVerifications,
    });

  static readonly get = (id: string) =>
    queryOptions({
      queryKey: queryKeys.verifications.get(id),
      queryFn: () => getVerification(id),
      enabled: Boolean(id),
    });
}
