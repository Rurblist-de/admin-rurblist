import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_USERS } from "~/services/api/mocks";
import type { AdminUser } from "~/services/api/types";

async function listUsers(): Promise<AdminUser[]> {
  return MOCK_USERS;
}

async function getUser(id: string): Promise<AdminUser | undefined> {
  return MOCK_USERS.find((u) => u.id === id);
}

export class UserOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.users.list(),
      queryFn: listUsers,
    });

  static readonly get = (id: string) =>
    queryOptions({
      queryKey: queryKeys.users.get(id),
      queryFn: () => getUser(id),
      enabled: Boolean(id),
    });
}
