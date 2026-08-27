import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { MOCK_PROPERTIES } from "~/services/api/mocks";
import type { AdminProperty } from "~/services/api/types";

async function listProperties(): Promise<AdminProperty[]> {
  return MOCK_PROPERTIES;
}

async function getProperty(id: string): Promise<AdminProperty | undefined> {
  return MOCK_PROPERTIES.find((p) => p.id === id);
}

export class PropertyOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.properties.list(),
      queryFn: listProperties,
    });

  static readonly get = (id: string) =>
    queryOptions({
      queryKey: queryKeys.properties.get(id),
      queryFn: () => getProperty(id),
      enabled: Boolean(id),
    });
}
