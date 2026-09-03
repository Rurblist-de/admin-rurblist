import { useParams } from "react-router";
import type { Route } from "./+types/escrow";
import { requirePermission } from "~/lib/permissions";
import {
  EscrowPage,
  parseEscrowStatus,
  parseEscrowTab,
} from "~/features/escrow/components/escrow-page";
import type { EscrowListParams } from "~/features/escrow/services";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Escrow & Payments · Rublist Admin" }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "list", resource: "payment" })(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || undefined;
  const status = parseEscrowStatus(url.searchParams.get("status"));
  const filters: EscrowListParams = {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    tab: parseEscrowTab(url.searchParams.get("tab")),
    page: Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1),
  };

  return { filters };
}

export default function Escrow({ loaderData }: Route.ComponentProps) {
  const { verificationId } = useParams();
  return (
    <EscrowPage
      filters={loaderData.filters}
      verificationId={verificationId}
    />
  );
}
