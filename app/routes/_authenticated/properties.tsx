import type { Route } from "./+types/properties";
import { requirePermission } from "~/lib/permissions";
import { PropertiesPage } from "~/features/properties/components/properties-page";
import type { PropertiesListParams } from "~/features/properties/services";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Properties · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "property" })(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || undefined;
  const type = url.searchParams.get("type") || undefined;
  const state = url.searchParams.get("state") || undefined;
  const viewParam = url.searchParams.get("view");
  const filters: PropertiesListParams = {
    ...(q ? { q } : {}),
    ...(type ? { type } : {}),
    ...(state ? { state } : {}),
    view: viewParam === "list" ? "list" : "board",
    page: Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1),
  };

  return { filters };
}

export default function Properties({ loaderData }: Route.ComponentProps) {
  return <PropertiesPage filters={loaderData.filters} />;
}
