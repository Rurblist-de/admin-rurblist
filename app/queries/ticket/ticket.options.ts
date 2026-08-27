import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_TICKETS } from "~/services/api/mocks";
import type { SupportTicket } from "~/services/api/types";

async function listTickets(): Promise<SupportTicket[]> {
  return MOCK_TICKETS;
}

async function getTicket(id: string): Promise<SupportTicket | undefined> {
  return MOCK_TICKETS.find((t) => t.id === id);
}

export class TicketOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.tickets.list(),
      queryFn: listTickets,
    });

  static readonly get = (id: string) =>
    queryOptions({
      queryKey: queryKeys.tickets.get(id),
      queryFn: () => getTicket(id),
      enabled: Boolean(id),
    });
}
