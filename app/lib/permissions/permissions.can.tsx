import type { ReactNode } from "react";
import { usePermission } from "./permissions.hooks";
import type { Action, Resource } from "~/services/api/types";

type CanProps = {
  action: Action;
  resource: Resource;
  children: ReactNode;
  fallback?: ReactNode;
  subject?: Record<string, unknown>;
};

export function Can({
  action,
  resource,
  children,
  fallback = null,
  subject: subjectData,
}: CanProps) {
  const { can } = usePermission();
  const allowed = subjectData
    ? can(action, resource, subjectData)
    : can(action, resource);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
