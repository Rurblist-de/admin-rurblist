import { createContext, useMemo, type ReactNode } from "react";
import { buildAbility, type AppAbility } from "./permissions.ability";
import { useMe } from "~/features/auth/hooks/use-me";
import type { AuthMe, Role } from "~/services/api/types";

const LOADING_ADMIN: AuthMe = {
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

type PermissionContextValue = {
  ability: AppAbility;
  roles: Role[];
  isReady: boolean;
  me: AuthMe | null;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

function PermissionProvider({ children }: { children: ReactNode }) {
  const meQuery = useMe();
  const me = meQuery.data ?? null;

  const value = useMemo<PermissionContextValue>(() => {
    const resolved = me ?? LOADING_ADMIN;
    return {
      ability: buildAbility(resolved),
      roles: resolved.roles,
      isReady: Boolean(me) || meQuery.isError,
      me,
    };
  }, [me, meQuery.isError]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export { PermissionContext, PermissionProvider };
