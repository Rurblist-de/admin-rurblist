import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_STATS } from "~/services/api/mocks";
import type { OverviewStats } from "~/services/api/types";

async function getStats(): Promise<OverviewStats> {
  return MOCK_STATS;
}

export class OverviewOptions {
  static readonly stats = () =>
    queryOptions({
      queryKey: queryKeys.overview.stats,
      queryFn: getStats,
    });
}
