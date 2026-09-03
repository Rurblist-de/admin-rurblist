import type { Route } from "./+types/escrow.$verificationId";
import { requirePermission } from "~/lib/permissions";
import { EscrowDetailPage } from "~/features/escrow/components/escrow-detail-page";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.verificationId} · Escrow · Rublist Admin` }];
}

export function loader({ request }: Route.LoaderArgs) {
  requirePermission({ action: "read", resource: "verification" })(request);
  return null;
}

export default function EscrowDetail({ params }: Route.ComponentProps) {
  return <EscrowDetailPage verificationId={params.verificationId} />;
}
