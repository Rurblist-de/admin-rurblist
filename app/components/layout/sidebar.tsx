import { NavLink } from "react-router";
import {
  Bell,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Newspaper,
  ScrollText,
  Users,
  Wallet,
} from "lucide-react";
import { Can } from "~/lib/permissions";
import type { Resource } from "~/services/api/types";
import { useSidebar } from "~/components/layout/sidebar-context";

const nav = [
  {
    to: "/overview",
    label: "Overview",
    icon: LayoutDashboard,
    resource: "overview" as Resource,
  },
  { to: "/users", label: "Users", icon: Users, resource: "user" as Resource },
  {
    to: "/properties",
    label: "Properties",
    icon: FileText,
    resource: "property" as Resource,
  },
  {
    to: "/escrow",
    label: "Escrow & Payments",
    icon: Wallet,
    resource: "payment" as Resource,
  },
  {
    to: "/content",
    label: "Blog/Content",
    icon: Newspaper,
    resource: "content" as Resource,
  },
  {
    to: "/audit-logs",
    label: "Audit Logs",
    icon: ScrollText,
    resource: "audit_log" as Resource,
  },
  {
    to: "/support",
    label: "Support/Ticket",
    icon: LifeBuoy,
    resource: "ticket" as Resource,
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: Bell,
    resource: "notification" as Resource,
    badge: true,
  },
];

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const { isMobile, setOpenMobile } = useSidebar();

  function onNavigate() {
    if (isMobile) setOpenMobile(false);
  }

  return (
    <nav
      className={[
        "flex flex-1 flex-col gap-1 pt-10 pb-5",
        collapsed ? "px-1" : "px-4",
      ].join(" ")}
    >
      {nav.map((item) => (
        <Can key={item.to} action="read" resource={item.resource}>
          <NavLink
            to={item.to}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "relative flex items-center rounded-lg py-2.5 text-sm transition-colors",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                isActive
                  ? "bg-accent font-medium text-white"
                  : "text-sidebar-muted hover:bg-canvas hover:text-ink",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className="size-4 shrink-0"
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span className={collapsed ? "sr-only" : undefined}>
                  {item.label}
                </span>
                {"badge" in item && item.badge ? (
                  <span
                    className={[
                      "size-2 rounded-full",
                      collapsed ? "absolute right-1.5 top-1.5" : "absolute right-3",
                      isActive ? "bg-white" : "bg-accent",
                    ].join(" ")}
                  />
                ) : null}
              </>
            )}
          </NavLink>
        </Can>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const { state, open, openMobile, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <>
      {openMobile ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-18 z-30 bg-black/30 md:hidden"
          aria-label="Close sidebar"
          onClick={() => setOpenMobile(false)}
        />
      ) : null}

      <aside
        data-state={isMobile ? (openMobile ? "open" : "closed") : state}
        className={[
          "flex shrink-0 flex-col border-r border-stroke bg-white",
          "transition-[width,transform] duration-200 ease-linear",
          isMobile
            ? [
                "fixed bottom-0 left-0 top-18 z-40 w-60",
                openMobile ? "translate-x-0" : "-translate-x-full",
              ].join(" ")
            : [
                "sticky top-18 h-[calc(100vh-4.5rem)]",
                open ? "w-60" : "w-12 overflow-hidden",
              ].join(" "),
          isMobile ? "" : "hidden md:flex",
        ].join(" ")}
      >
        <SidebarNav collapsed={!isMobile && collapsed} />
      </aside>
    </>
  );
}
