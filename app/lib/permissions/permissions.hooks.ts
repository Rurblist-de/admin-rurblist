import { useContext } from "react";
import { PermissionContext } from "./permissions.context";
import type { Action, Resource } from "~/services/api/types";

export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }

  const { ability, roles } = ctx;

  function can(
    action: Action,
    resource: Resource,
    data?: Record<string, unknown>,
  ): boolean {
    return ability.can(action, resource, data);
  }

  function hasRole(name: string): boolean {
    return roles.some((r) => r.name.toLowerCase() === name.toLowerCase());
  }

  return { ...ctx, can, hasRole };
}
