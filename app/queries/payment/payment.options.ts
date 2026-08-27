import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_PAYMENTS } from "~/services/api/mocks";
import type { AdminPayment } from "~/services/api/types";

async function listPayments(): Promise<AdminPayment[]> {
  return MOCK_PAYMENTS;
}

export class PaymentOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.payments.list(),
      queryFn: listPayments,
    });
}
