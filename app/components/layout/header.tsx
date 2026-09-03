import { Link } from "react-router";
import { useState } from "react";
import { Bell } from "lucide-react";
import { useMe } from "~/features/auth/hooks/use-me";
import { useLogout } from "~/features/auth/hooks/use-logout";
import { initials } from "~/lib/format";
import {
  SidebarTrigger,
  useSidebar,
} from "~/components/layout/sidebar-context";

export function Header() {
  const { data: me } = useMe();
  const logout = useLogout();
  const { open } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = me?.user.fullName ?? "Admin";

  return (
    <header className="sticky top-0 z-50 flex h-18 shrink-0 items-center border-b border-stroke bg-white">
      <div
        className={[
          "flex shrink-0 items-center transition-[width] duration-200 ease-linear",
          open
            ? "w-12 justify-center md:w-60 md:justify-between md:pl-4 md:pr-1"
            : "w-12 justify-center",
        ].join(" ")}
      >
        <Link
          to="/overview"
          className={[
            "flex flex-col items-center justify-center gap-1 overflow-hidden",
            open ? "hidden md:flex" : "hidden",
          ].join(" ")}
        >
          <img
            src="/rublist-mark.svg"
            alt=""
            className="h-10 w-8 object-contain"
          />
          <span className="text-[11px] font-medium tracking-wide text-ink">
            Rublist
          </span>
        </Link>
        <SidebarTrigger />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-4 px-4 md:px-8">
        <label className="relative flex w-full max-w-[360px] items-center">
          <img
            src="/icons/search.svg"
            alt=""
            className="pointer-events-none absolute left-4 size-5"
          />
          <input
            type="search"
            placeholder="Search Anything..."
            className="h-12 w-full rounded-full border border-stroke bg-white pl-12 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
          />
        </label>

        <button
          type="button"
          className="relative flex size-11 items-center justify-center text-ink"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={1.75} />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
            aria-label="Account menu"
          >
            {initials(name) || "A"}
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-stroke bg-white shadow-lg">
              <p className="truncate px-4 py-2.5 text-sm text-ink">{name}</p>
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-canvas disabled:opacity-70"
              >
                {logout.isPending ? "Signing out..." : "Log out"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
