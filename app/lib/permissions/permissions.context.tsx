import { createContext, useMemo, type ReactNode } from "react";
import { buildAbility, type AppAbility } from "./permissions.ability";
import { useMe } from "~/queries/auth/use-auth";
import { STUB_ADMIN } from "~/lib/auth/stub-me";
import type { Role } from "~/services/api/types";

type PermissionContextValue = {
  ability: AppAbility;
  roles: Role[];
  isReady: boolean;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

function PermissionProvider({ children }: { children: ReactNode }) {
  const { me, isLoading } = useMe();

  const value = useMemo<PermissionContextValue>(
    () => ({
      ability: buildAbility(me ?? (isLoading ? STUB_ADMIN : null)),
      roles: me?.roles ?? (isLoading ? STUB_ADMIN.roles : []),
      isReady: !isLoading,
    }),
    [me, isLoading],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export { PermissionContext, PermissionProvider };
