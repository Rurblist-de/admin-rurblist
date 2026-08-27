import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("login", "routes/login.tsx"),
  route("403", "routes/forbidden.tsx"),
  layout("routes/_authenticated.tsx", [
    route("overview", "routes/_authenticated/overview.tsx"),
    route("users", "routes/_authenticated/users.tsx"),
    route("users/:userId", "routes/_authenticated/users.$userId.tsx"),
    route("properties", "routes/_authenticated/properties.tsx"),
    route("properties/:propertyId", "routes/_authenticated/properties.$propertyId.tsx"),
    route("escrow", "routes/_authenticated/escrow.tsx", [
      index("routes/_authenticated/escrow-index.tsx"),
      route(":verificationId", "routes/_authenticated/escrow.$verificationId.tsx"),
    ]),
    route("content", "routes/_authenticated/content.tsx"),
    route("audit-logs", "routes/_authenticated/audit-logs.tsx"),
    route("support", "routes/_authenticated/support.tsx"),
    route("support/:ticketId", "routes/_authenticated/support.$ticketId.tsx"),
    route("notifications", "routes/_authenticated/notifications.tsx"),
  ]),
] satisfies RouteConfig;
