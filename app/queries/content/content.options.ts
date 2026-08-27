import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";

export type ContentItem = {
  id: string;
  title: string;
  status: "draft" | "published";
  updatedAt: string;
};

async function listContent(): Promise<ContentItem[]> {
  return [
    {
      id: "post-1",
      title: "How to verify a listing on Rublist",
      status: "published",
      updatedAt: "2026-08-10",
    },
  ];
}

export class ContentOptions {
  static readonly list = () =>
    queryOptions({
      queryKey: queryKeys.content.list,
      queryFn: listContent,
    });
}
