import { Link } from "react-router";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pageCount,
  from,
  to,
  total,
  noun = "results",
  hrefForPage,
}: {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  noun?: string;
  hrefForPage: (page: number) => string;
}) {
  const items = pageItems(page, pageCount);

  return (
    <div className="flex flex-col gap-3 border-t border-stroke px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        Showing {from}-{to} of {total} {noun}
      </p>
      <nav className="flex items-center gap-2" aria-label="Pagination">
        <PaginationLink
          to={hrefForPage(page - 1)}
          disabled={page <= 1}
          className="px-3"
        >
          Previous
        </PaginationLink>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`e-${index}`} className="px-1 text-sm text-muted">
              …
            </span>
          ) : (
            <PaginationLink
              key={item}
              to={hrefForPage(item)}
              current={item === page}
              className="min-w-9 justify-center px-2"
            >
              {item}
            </PaginationLink>
          ),
        )}
        <PaginationLink
          to={hrefForPage(page + 1)}
          disabled={page >= pageCount}
          accent={page < pageCount}
          className="gap-1 px-3"
        >
          Next
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </PaginationLink>
      </nav>
    </div>
  );
}

function PaginationLink({
  to,
  children,
  disabled,
  current,
  accent,
  className,
}: {
  to: string;
  children: ReactNode;
  disabled?: boolean;
  current?: boolean;
  accent?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex h-9 items-center rounded-md text-sm font-medium";

  if (disabled) {
    return (
      <span
        className={`${base} cursor-not-allowed border border-stroke px-3 text-muted ${className ?? ""}`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-current={current ? "page" : undefined}
      className={[
        base,
        className,
        current || accent
          ? "border border-accent bg-accent text-white hover:bg-accent"
          : "border border-stroke bg-white text-ink hover:bg-canvas",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function pageItems(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, "ellipsis", pageCount];
  }
  if (page >= pageCount - 2) {
    return [1, "ellipsis", pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "ellipsis", page, "ellipsis", pageCount];
}
