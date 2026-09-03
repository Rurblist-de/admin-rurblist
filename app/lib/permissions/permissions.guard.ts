import { redirect } from "react-router";
import { getTokenFromRequest } from "~/lib/auth/session";
import { buildAbility } from "./permissions.ability";
import type { Action, AuthMe, Resource } from "~/services/api/types";

const AUTHENTICATED_ADMIN: AuthMe = {
  user: {
    id: "session",
    email: "",
    fullName: "",
    type: "admin",
  },
  roles: [{ id: "Admin", name: "Admin" }],
  permissions: [{ action: "manage", resource: "all" }],
  rules: [{ action: "manage", subject: "all" }],
};

type GuardOpts = {
  action: Action;
  resource: Resource;
};

export function requireAuth(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    throw redirect("/login");
  }
  return token;
}

export function requirePermission(opts: GuardOpts) {
  return (request: Request) => {
    const token = requireAuth(request);
    const ability = buildAbility(AUTHENTICATED_ADMIN);
    const allowed = ability.can(opts.action, opts.resource);
    if (!allowed) {
      throw redirect("/403");
    }
    return token;
  };
}
