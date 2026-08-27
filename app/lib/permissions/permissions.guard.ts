import { redirect } from "react-router";
import { getTokenFromRequest } from "~/lib/auth/session";
import { STUB_ADMIN } from "~/lib/auth/stub-me";
import { buildAbility } from "./permissions.ability";
import type { Action, Resource } from "~/services/api/types";

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
    requireAuth(request);
    // Until /auth/me exists on Rublist-Backend, CASL uses the stub admin.
    const ability = buildAbility(STUB_ADMIN);
    const allowed = ability.can(opts.action, opts.resource);
    if (!allowed) {
      throw redirect("/403");
    }
  };
}
