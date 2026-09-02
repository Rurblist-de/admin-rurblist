import type { ReactNode } from "react";
import { Form, Link } from "react-router";
import { ChevronDown, LayoutGrid, List } from "lucide-react";

export type PropertiesView = "board" | "list";

export function PropertyFilters({
  q,
  type,
  state,
  view,
  typeOptions,
  stateOptions,
}: {
  q: string;
  type: string;
  state: string;
  view: PropertiesView;
  typeOptions: string[];
  stateOptions: string[];
}) {
  return (
    <Form method="get" className="mb-5">
      <input type="hidden" name="view" value={view} />
      <div className="flex flex-col gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-3 lg:flex-row lg:items-center lg:gap-3">
        <label className="relative min-w-0 flex-1">
          <img
            src="/icons/search.svg"
            alt=""
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 opacity-60"
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name, phone number..."
            className="h-11 w-full rounded-full border border-[#E5E7EB] bg-white pl-12 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#E55B13]"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect name="type" label="Types" value={type}>
            {typeOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect name="state" label="States" value={state}>
            {stateOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </FilterSelect>
          <div className="inline-flex items-center gap-1 rounded-[10px] border border-[#E5E7EB] bg-white p-1">
            <ViewToggle
              to={viewHref({ q, type, state, view: "board" })}
              active={view === "board"}
              label="Board view"
            >
              <LayoutGrid className="size-[18px]" strokeWidth={1.75} />
            </ViewToggle>
            <ViewToggle
              to={viewHref({ q, type, state, view: "list" })}
              active={view === "list"}
              label="List view"
            >
              <List className="size-[18px]" strokeWidth={1.75} />
            </ViewToggle>
          </div>
        </div>
      </div>
    </Form>
  );
}

function FilterSelect({
  name,
  label,
  value,
  children,
}: {
  name: string;
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <label className="relative">
      <select
        name={name}
        defaultValue={value}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-11 min-w-[7.5rem] appearance-none rounded-[8px] border border-[#E5E7EB] bg-white py-2 pl-4 pr-10 text-sm text-[#111827] outline-none focus:border-[#E55B13]"
      >
        <option value="">{label}</option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
    </label>
  );
}

function ViewToggle({
  to,
  active,
  label,
  children,
}: {
  to: string;
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={[
        "flex size-9 items-center justify-center rounded-[8px] transition-colors",
        active
          ? "bg-[#E55B13] text-white"
          : "text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#111827]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function viewHref({
  q,
  type,
  state,
  view,
}: {
  q: string;
  type: string;
  state: string;
  view: PropertiesView;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type) params.set("type", type);
  if (state) params.set("state", state);
  if (view !== "board") params.set("view", view);
  const query = params.toString();
  return query ? `/properties?${query}` : "/properties";
}
