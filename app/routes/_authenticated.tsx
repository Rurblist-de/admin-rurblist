import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_authenticated";
import { Header } from "~/components/layout/header";
import { Sidebar } from "~/components/layout/sidebar";
import { SidebarProvider } from "~/components/layout/sidebar-context";
import { PermissionProvider } from "~/lib/permissions";
import { getTokenFromRequest } from "~/lib/auth/session";

export async function loader({ request }: Route.LoaderArgs) {
  if (!getTokenFromRequest(request)) {
    throw redirect("/login");
  }
  return null;
}

export default function AuthenticatedLayout() {
  return (
    <PermissionProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-canvas">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="min-w-0 flex-1 px-6 pb-6 pt-4">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PermissionProvider>
  );
}
