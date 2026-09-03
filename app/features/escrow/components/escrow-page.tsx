import { Form, Link, Outlet, useNavigate } from "react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "~/components/layout/page-header";
import { Pagination } from "~/components/ui/pagination";
import { formatDate, formatNaira } from "~/lib/format";
import type { DisputeStatus, EscrowLedgerStatus } from "~/services/api/types";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { useEscrow } from "../hooks/use-escrow";
import type { EscrowListParams, EscrowTab } from "../services";
import { LedgerStatus } from "./ledger-status";

const EMPTY_SUMMARY = {
  totalVolume: 0,
  inEscrow: 0,
  released: 0,
  disputed: 0,
};

export function EscrowPage({
  filters,
  verificationId,
}: {
  filters: EscrowListParams;
  verificationId?: string;
}) {
  const navigate = useNavigate();
  const searchFocused = useRef(false);
  const q = filters.q ?? "";
  const status = filters.status ?? "";
  const tab: EscrowTab = filters.tab ?? "ledger";
  const [qInput, setQInput] = useState(q);
  const debouncedQ = useDebouncedValue(qInput.trim(), 300);
  const searchChanged = debouncedQ !== q.trim();
  const listFilters: EscrowListParams = {
    ...filters,
    q: debouncedQ || undefined,
    page: searchChanged ? 1 : filters.page,
  };
  const escrowQuery = useEscrow(listFilters, !verificationId);
  const data = escrowQuery.data;
  const payments = data?.payments ?? [];
  const disputes = data?.disputes ?? [];
  const payouts = data?.payouts ?? [];
  const summary = data?.summary ?? EMPTY_SUMMARY;
  const total = data?.total ?? 0;
  const page = data?.page ?? listFilters.page ?? 1;
  const pageCount = data?.pageCount ?? 1;
  const from = data?.from ?? 0;
  const to = data?.to ?? 0;

  useEffect(() => {
    if (!searchFocused.current) {
      setQInput(q);
    }
  }, [q]);

  useEffect(() => {
    if (!searchChanged) return;
    navigate(escrowHref({ q: debouncedQ, status, tab: "ledger", page: 1 }), {
      replace: true,
    });
  }, [debouncedQ, searchChanged, status, navigate]);

  if (verificationId) {
    return <Outlet />;
  }

  return (
    <div>
      <PageHeader
        title="Escrow & Payments"
        description="Track transactions, handle disputes, and manage payouts."
      />

      <nav className="mb-5 inline-flex rounded-lg border border-stroke bg-white p-1">
        <TabLink to={escrowHref({ q, status, tab: "ledger", page: 1 })} active={tab === "ledger"}>
          Transaction Ledger
        </TabLink>
        <TabLink
          to="/escrow?tab=disputes"
          active={tab === "disputes"}
          count={escrowQuery.isSuccess ? disputes.length : undefined}
        >
          Disputes
        </TabLink>
        <TabLink
          to="/escrow?tab=payouts"
          active={tab === "payouts"}
          count={escrowQuery.isSuccess ? payouts.length : undefined}
        >
          Agents Payouts
        </TabLink>
      </nav>

      {tab === "ledger" ? (
        <>
          <Form
            method="get"
            className="mb-4"
            key={status}
          >
            <input type="hidden" name="tab" value="ledger" />
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
                  placeholder="Search by reference, property, buyer, or agent..."
                  autoComplete="off"
                  className="h-11 w-full rounded-full border border-stroke bg-white pl-12 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
                />
              </label>
              <label className="relative">
                <select
                  name="status"
                  defaultValue={status}
                  onChange={(event) => event.currentTarget.form?.requestSubmit()}
                  className="h-11 appearance-none rounded-md border border-stroke bg-white py-2 pl-4 pr-10 text-sm text-ink outline-none focus:border-accent"
                >
                  <option value="">Status</option>
                  <option value="initiated">Initiated</option>
                  <option value="held_in_escrow">Held in escrow</option>
                  <option value="released">Released</option>
                  <option value="disputed">Disputed</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              </label>
            </div>
          </Form>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="overflow-hidden rounded-xl border border-stroke bg-white">
              <div className="overflow-x-auto">
                <table className="w-max min-w-full text-left text-xs">
                  <thead className="border-b border-stroke text-[10px] font-medium uppercase tracking-wide text-muted">
                    <tr>
                      {["ID", "Property", "Amount", "Status", "Date", ""].map(
                        (header) => (
                          <th
                            key={header || "actions"}
                            className="whitespace-nowrap px-5 py-2.5 font-medium"
                          >
                            {header}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {escrowQuery.isLoading ? (
                      <tr>
                        <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                          Loading transactions...
                        </td>
                      </tr>
                    ) : escrowQuery.error && payments.length === 0 ? (
                      <tr>
                        <td className="px-5 py-10 text-center text-red-500" colSpan={6}>
                          {escrowQuery.error instanceof Error
                            ? escrowQuery.error.message
                            : "Unable to load escrow."}
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                          No escrow transactions match these filters.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-stroke last:border-0"
                        >
                          <td className="whitespace-nowrap px-5 py-3 font-medium text-ink">
                            {payment.reference}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-ink">
                            {payment.propertyTitle}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-ink">
                            {formatNaira(payment.amount)}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3">
                            <LedgerStatus status={payment.escrowStatus} />
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-muted">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3">
                            <Link
                              to={`/escrow/${payment.id}`}
                              className="inline-flex h-8 items-center gap-1 rounded-md border border-stroke bg-white px-2.5 text-[11px] font-medium uppercase tracking-wide text-ink"
                            >
                              View
                              <ChevronDown className="size-3.5" strokeWidth={1.75} />
                            </Link>
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
                noun="transactions"
                hrefForPage={(nextPage) =>
                  escrowHref({
                    q: qInput.trim(),
                    status,
                    tab: "ledger",
                    page: nextPage,
                  })
                }
              />
            </div>

            <aside className="rounded-xl border border-stroke bg-white p-5">
              <h2 className="text-sm font-semibold text-ink">Summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <SummaryRow
                  label="Total Volume"
                  value={formatNaira(summary.totalVolume)}
                />
                <SummaryRow
                  label="In Escrow"
                  value={formatNaira(summary.inEscrow)}
                  valueClass="text-slate-500"
                />
                <SummaryRow
                  label="Released"
                  value={formatNaira(summary.released)}
                  valueClass="text-emerald-600"
                />
                <SummaryRow
                  label="Disputed"
                  value={formatNaira(summary.disputed)}
                  valueClass="text-red-600"
                />
              </dl>
            </aside>
          </div>
        </>
      ) : null}

      {tab === "disputes" ? (
        <div className="overflow-hidden rounded-xl border border-stroke bg-white">
          {escrowQuery.isLoading ? (
            <p className="px-5 py-10 text-center text-sm text-muted">Loading disputes...</p>
          ) : escrowQuery.error && disputes.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-red-500">
              {escrowQuery.error instanceof Error
                ? escrowQuery.error.message
                : "Unable to load disputes."}
            </p>
          ) : disputes.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">
              No disputed escrow transactions yet.
            </p>
          ) : (
            <ul className="divide-y divide-stroke">
              {disputes.map((dispute) => (
                <li key={dispute.id}>
                  <Link to={`/escrow/${dispute.id}`} className="block px-4 py-4 hover:bg-canvas">
                    <div className="rounded-xl border border-stroke px-4 py-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-ink">
                          {dispute.propertyTitle}
                        </p>
                        <DisputeBadge status={dispute.status} />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">
                        {dispute.description}
                      </p>
                      <p className="mt-3 flex items-center justify-between border-t border-stroke pt-2.5 text-xs text-muted">
                        <span className="font-medium text-ink">
                          {formatNaira(dispute.amount)}
                        </span>
                        <span>{formatDate(dispute.date)}</span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "payouts" ? (
        <div className="overflow-hidden rounded-xl border border-stroke bg-white">
          <table className="w-max min-w-full text-left text-xs">
            <thead className="border-b border-stroke text-[10px] font-medium uppercase tracking-wide text-muted">
              <tr>
                {["ID", "Agent", "Amount", "Status", "Date", ""].map((header) => (
                  <th key={header || "actions"} className="whitespace-nowrap px-5 py-2.5 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {escrowQuery.isLoading ? (
                <tr>
                  <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                    Loading payouts...
                  </td>
                </tr>
              ) : escrowQuery.error && payouts.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-red-500" colSpan={6}>
                    {escrowQuery.error instanceof Error
                      ? escrowQuery.error.message
                      : "Unable to load payouts."}
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                    No released funds yet.
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-stroke last:border-0">
                    <td className="whitespace-nowrap px-5 py-3 font-medium">{payout.id}</td>
                    <td className="whitespace-nowrap px-5 py-3">{payout.agentName}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      {formatNaira(payout.amount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <LedgerStatus
                        status={payout.status === "paid" ? "released" : "initiated"}
                      />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted">
                      {formatDate(payout.date)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      {payout.verificationId ? (
                        <Link
                          to={`/escrow/${payout.verificationId}`}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-stroke bg-white px-2.5 text-[11px] font-medium uppercase tracking-wide text-ink"
                        >
                          View
                          <ChevronDown className="size-3.5" strokeWidth={1.75} />
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function TabLink({
  to,
  active,
  count,
  children,
}: {
  to: string;
  active: boolean;
  count?: number;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm",
        active
          ? "bg-accent font-medium text-white"
          : "text-muted hover:text-ink",
      ].join(" ")}
    >
      {children}
      {count != null ? (
        <span
          className={[
            "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
            active ? "bg-white text-accent" : "bg-accent text-white",
          ].join(" ")}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function DisputeBadge({ status }: { status: DisputeStatus }) {
  const styles = {
    new: "bg-red-500 text-white",
    open: "border border-red-400 bg-white text-red-600",
    resolved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "text-ink",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-medium ${valueClass}`}>{value}</dd>
    </div>
  );
}

function escrowHref({
  q,
  status,
  tab,
  page,
}: {
  q: string;
  status: string;
  tab: EscrowTab;
  page: number;
}) {
  const params = new URLSearchParams();
  if (tab !== "ledger") params.set("tab", tab);
  if (tab === "ledger") {
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (page > 1) params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `/escrow?${query}` : "/escrow";
}

export function parseEscrowStatus(
  value: string | null,
): EscrowLedgerStatus | undefined {
  if (
    value === "initiated" ||
    value === "held_in_escrow" ||
    value === "released" ||
    value === "disputed"
  ) {
    return value;
  }
  return undefined;
}

export function parseEscrowTab(value: string | null): EscrowTab {
  if (value === "disputes" || value === "payouts" || value === "ledger") {
    return value;
  }
  return "ledger";
}
