import { Form, Link, useNavigate } from "react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Eye, UserCog } from "lucide-react";
import { PageHeader } from "~/components/layout/page-header";
import { AgentApprovalQueue } from "~/components/users/agent-approval-queue";
import { Pagination } from "~/components/ui/pagination";
import { StatusBadge } from "~/components/ui/status-badge";
import { formatDate, initials } from "~/lib/format";
import type { AdminUser, UserStatus } from "~/services/api/types";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useUsers } from "../hooks/use-users";
import type { UsersListParams } from "../services";

export function UsersPage({ filters }: { filters: UsersListParams }) {
  const navigate = useNavigate();
  const searchFocused = useRef(false);
  const q = filters.q ?? "";
  const role = filters.role ?? "";
  const state = filters.state ?? "";
  const status = filters.status ?? "";
  const queue = Boolean(filters.queue);
  const [qInput, setQInput] = useState(q);
  const debouncedQ = useDebouncedValue(qInput.trim(), 300);
  const searchChanged = debouncedQ !== q.trim();
  const listFilters: UsersListParams = {
    ...filters,
    q: debouncedQ || undefined,
    page: searchChanged ? 1 : filters.page,
  };
  const usersQuery = useUsers(listFilters);
  const data = usersQuery.data;
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? listFilters.page ?? 1;
  const pageCount = data?.pageCount ?? 1;
  const queueCount = data?.queueCount ?? 0;
  const from = data?.from ?? 0;
  const to = data?.to ?? 0;

  useEffect(() => {
    if (!searchFocused.current) {
      setQInput(q);
    }
  }, [q]);

  useEffect(() => {
    if (!searchChanged) return;
    navigate(usersHref({ q: debouncedQ, role, state, status, queue, page: 1 }), {
      replace: true,
    });
  }, [debouncedQ, searchChanged, role, state, status, queue, navigate]);

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage buyers, agents, and verification approvals."
        actions={<AgentApprovalQueue count={queueCount} />}
      />

      <Form
        method="get"
        className="mb-4"
        key={`${role}|${state}|${status}|${queue}`}
      >
        {queue ? <input type="hidden" name="queue" value="approvals" /> : null}
        <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-white p-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <img
              src="/icons/search.svg"
              alt=""
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2"
            />
            <input
              type="search"
              name="q"
              value={qInput}
              onFocus={() => {
                searchFocused.current = true;
              }}
              onBlur={() => {
                searchFocused.current = false;
              }}
              onChange={(event) => setQInput(event.currentTarget.value)}
              placeholder="Search by name, email, or phone..."
              autoComplete="off"
              className="h-11 w-full rounded-full border border-stroke bg-white pl-12 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <FilterSelect name="role" label="Roles" value={role}>
              <option value="buyer">Buyer</option>
              <option value="agent">Agent</option>
              <option value="landlord">Landlord</option>
              <option value="developer">Developer</option>
            </FilterSelect>
            <FilterSelect name="state" label="States" value={state}>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="enugu">Enugu</option>
              <option value="delta">Delta</option>
            </FilterSelect>
            <FilterSelect name="status" label="Status" value={status}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="inactive">Inactive</option>
            </FilterSelect>
          </div>
        </div>
      </Form>

      <div className="overflow-hidden rounded-xl border border-stroke bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stroke text-xs font-medium uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 text-center font-medium">Role</th>
                <th className="px-5 py-3 font-medium">State</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.isLoading ? (
                <tr>
                  <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                    Loading users...
                  </td>
                </tr>
              ) : usersQuery.error && users.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-red-500" colSpan={6}>
                    {usersQuery.error instanceof Error
                      ? usersQuery.error.message
                      : "Unable to load users."}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                    No users match these filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-stroke last:border-0"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-ink">
                            {user.fullName}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {user.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex rounded-full border border-stroke bg-canvas px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                        {displayRole(user.role)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-ink">
                      {user.state}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={statusTone(user.status)} dot>
                        {user.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      {formatDate(user.joinedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/users/${user.id}`}
                          aria-label={`View ${user.fullName}`}
                          className="flex size-8 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink"
                        >
                          <Eye className="size-4" strokeWidth={1.75} />
                        </Link>
                        <Link
                          to={`/users/${user.id}`}
                          aria-label={`Manage ${user.fullName}`}
                          className="flex size-8 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink"
                        >
                          <UserCog className="size-4" strokeWidth={1.75} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          pageCount={pageCount}
          from={from}
          to={to}
          total={total}
          noun="users"
          hrefForPage={(nextPage) =>
            usersHref({
              q: qInput.trim(),
              role,
              state,
              status,
              queue,
              page: nextPage,
            })
          }
        />
      </div>
    </div>
  );
}

function UserAvatar({ user }: { user: AdminUser }) {
  const [failed, setFailed] = useState(false);

  if (user.profileImage && !failed) {
    return (
      <img
        src={user.profileImage}
        alt=""
        className="size-9 shrink-0 rounded-full object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-accent">
      {initials(user.fullName) || "?"}
    </span>
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
        className="h-11 appearance-none rounded-md border border-stroke bg-white py-2 pl-4 pr-10 text-sm text-ink outline-none focus:border-accent"
      >
        <option value="">{label}</option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </label>
  );
}

function usersHref({
  q,
  role,
  state,
  status,
  queue,
  page,
}: {
  q: string;
  role: string;
  state: string;
  status: string;
  queue: boolean;
  page: number;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (role) params.set("role", role);
  if (state) params.set("state", state);
  if (status) params.set("status", status);
  if (queue) params.set("queue", "approvals");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/users?${query}` : "/users";
}

function displayRole(role: AdminUser["role"]) {
  if (role === "Home_Seeker") return "Buyer";
  if (role === "Super_Admin") return "Super admin";
  return role;
}

function statusTone(status: UserStatus) {
  if (status === "active") return "success" as const;
  if (status === "pending") return "warning" as const;
  if (status === "flagged") return "danger" as const;
  return "neutral" as const;
}
