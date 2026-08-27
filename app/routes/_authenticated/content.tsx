import type { Route } from "./+types/content";
import { PageHeader } from "~/components/layout/page-header";
import { DataTable } from "~/components/ui/data-table";
import { StatusBadge } from "~/components/ui/status-badge";
import { formatDate } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";

const posts = [
  {
    id: "post-1",
    title: "How to verify a listing on Rublist",
    status: "published" as const,
    updatedAt: "2026-08-10",
  },
];

export function meta({}: Route.MetaArgs) {
  return [{ title: "Content · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "content" })(request);
  return { posts };
}

export default function Content({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div>
      <PageHeader
        title="Blog / Content"
        description="Public content stays in Sanity. This list is a stub until Studio is embedded."
      />
      <DataTable
        headers={["Title", "Status", "Updated"]}
        rows={posts.map((post) => [
          post.title,
          <StatusBadge
            key={post.id}
            tone={post.status === "published" ? "success" : "neutral"}
          >
            {post.status}
          </StatusBadge>,
          formatDate(post.updatedAt),
        ])}
      />
    </div>
  );
}
