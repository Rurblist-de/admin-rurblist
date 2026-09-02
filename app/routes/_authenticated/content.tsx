import type { Route } from "./+types/content";
import { PageHeader } from "~/components/layout/page-header";
import { DataTable } from "~/components/ui/data-table";
import { StatusBadge } from "~/components/ui/status-badge";
import { formatDate } from "~/lib/format";
import { requirePermission } from "~/lib/permissions";
import { Link } from "react-router";

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
        headers={["Link To Sanity"]}
        rows={posts.map((post) => [
          <Link key={post.id} to={`/content/${post.id}`}>
            {post.title}
          </Link>,
          // <span key={post.id}>{formatDate(post.updatedAt)}</span>,
        ])}
      />
    </div>
  );
}
