import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_NOTIFICATIONS } from "~/services/api/mocks";
import type { AdminNotification } from "~/services/api/types";

async function listNotifications(): Promise<AdminNotification[]> {
  return MOCK_NOTIFICATIONS;
}

export class NotificationOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.notifications.list,
      queryFn: listNotifications,
    });
}
