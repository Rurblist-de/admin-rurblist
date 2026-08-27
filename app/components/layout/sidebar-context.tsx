import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, Menu } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";

const SIDEBAR_SHORTCUT = "b";

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [open, setOpenState] = useState(true);

  const setOpen = useCallback((value: boolean | ((current: boolean) => boolean)) => {
    setOpenState((current) =>
      typeof value === "function" ? value(current) : value,
    );
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current);
      return;
    }
    setOpen((current) => !current);
  }, [isMobile, setOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key === SIDEBAR_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
      if (event.key === "Escape") {
        setOpenMobile(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  useEffect(() => {
    if (!isMobile) setOpenMobile(false);
  }, [isMobile]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  const expanded = isMobile ? openMobile : open;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-expanded={expanded}
      className={
        className ??
        "flex size-8 shrink-0 translate-x-2 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink"
      }
      aria-label="Toggle sidebar"
    >
      {isMobile ? (
        <Menu className="size-5" strokeWidth={1.75} />
      ) : (
        <ChevronLeft
          className={[
            "size-5 transition-transform duration-200",
            expanded ? "" : "rotate-180",
          ].join(" ")}
          strokeWidth={1.75}
        />
      )}
    </button>
  );
}
