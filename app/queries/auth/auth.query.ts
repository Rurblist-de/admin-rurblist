import { STUB_ADMIN } from "~/lib/auth/stub-me";
import { queryKeys } from "~/lib/query-keys";
import type { AuthMe } from "~/services/api/types";

export const authQueryKeys = queryKeys.auth;

async function getMe(): Promise<AuthMe> {
  // Swap for GET /api/v1/auth/me when the admin contract exists.
  return STUB_ADMIN;
}

const authQuery = { getMe };

export default authQuery;
