import { Link } from "react-router";
import type { ReactNode } from "react";
import { AlertTriangle, Home, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "~/components/ui/chart";
import { StatusBadge } from "~/components/ui/status-badge";
import { formatCompactNaira } from "~/lib/format";
import { useMe } from "~/features/auth/hooks/use-me";
import { useOverviewListings } from "../hooks/use-overview-listings";
import { useOverviewEscrow } from "../hooks/use-overview-escrow";
import { useOverviewVerifications } from "../hooks/use-overview-verifications";
import { useOverviewEscrowTrend } from "../hooks/use-overview-escrow-trend";
import { useOverviewListingsByState } from "../hooks/use-overview-listings-by-state";
import { useOverviewAttention } from "../hooks/use-overview-attention";
import type { EscrowTrendPoint } from "~/services/api/types";

const VOLUME_COLOR = "#3B6FF5";
const RELEASED_COLOR = "#E85D04";

export function OverviewDashboard() {
  const me = useMe();
  const listings = useOverviewListings();
  const escrow = useOverviewEscrow();
  const verifications = useOverviewVerifications();
  const trend = useOverviewEscrowTrend();
  const byState = useOverviewListingsByState();
  const attention = useOverviewAttention();

  const listingAxis = listingAxisScale(byState.data ?? []);
  const welcomeName = me.data?.user.fullName ?? "there";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back, {welcomeName}. Here&apos;s what&apos;s happening across
          the platform today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QueryPanel
          isLoading={listings.isLoading}
          error={listings.error}
          skeleton={<KpiSkeleton />}
        >
          <Kpi
            label="Active listing"
            value={(listings.data?.activeListings ?? 0).toLocaleString()}
            hint={percentHint(listings.data?.listingChangePct ?? 0)}
            hintTone={(listings.data?.listingChangePct ?? 0) >= 0 ? "success" : "danger"}
            icon={
              <span className="flex size-10 items-center justify-center rounded-lg bg-orange-50 text-accent">
                <Home className="size-5" strokeWidth={1.75} />
              </span>
            }
          />
        </QueryPanel>
        <QueryPanel
          isLoading={escrow.isLoading}
          error={escrow.error}
          skeleton={<KpiSkeleton />}
        >
          <Kpi
            label="Escrow volume"
            value={formatCompactNaira(escrow.data?.escrowVolumeNgn ?? 0)}
            hint={percentHint(escrow.data?.escrowChangePct ?? 0)}
            hintTone={(escrow.data?.escrowChangePct ?? 0) >= 0 ? "success" : "danger"}
            icon={
              <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Wallet className="size-5" strokeWidth={1.75} />
              </span>
            }
          />
        </QueryPanel>
        <QueryPanel
          isLoading={verifications.isLoading}
          error={verifications.error}
          skeleton={<KpiSkeleton />}
        >
          <Kpi
            label="Pending verifications"
            value={String(verifications.data?.pendingVerification ?? 0)}
            hint={verifications.data?.pendingPriorityLabel ?? "All clear"}
            hintTone="danger"
            icon={
              <span className="flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <AlertTriangle className="size-5" strokeWidth={1.75} />
              </span>
            }
          />
        </QueryPanel>
      </div>

      <section className="mt-6 rounded-xl border border-stroke bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
          Escrow volume trend
        </h2>
        <QueryPanel
          isLoading={trend.isLoading}
          error={trend.error}
          skeleton={<div className="mt-4 h-[280px] animate-pulse rounded-lg bg-canvas" />}
        >
          <ChartFrame className="mt-4 h-[280px] w-full">
            <AreaChart data={trend.data ?? []} accessibilityLayer>
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={VOLUME_COLOR} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={VOLUME_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="releasedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={RELEASED_COLOR} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={RELEASED_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEF0F3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value: number) => `${value / 1_000_000}`}
              />
              <Tooltip content={<TrendTooltip />} />
              <Area
                type="monotone"
                dataKey="released"
                name="Released"
                stroke={RELEASED_COLOR}
                fill="url(#releasedFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="volume"
                name="Volume"
                stroke={VOLUME_COLOR}
                fill="url(#volumeFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartFrame>
          <div className="mt-2 flex items-center justify-center gap-5 text-xs text-muted">
            <LegendDot color={RELEASED_COLOR} label="Released" />
            <LegendDot color={VOLUME_COLOR} label="Volume" />
          </div>
        </QueryPanel>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-stroke bg-white px-6 py-5">
          <h2 className="text-sm font-semibold text-ink">Listings</h2>
          <QueryPanel
            isLoading={byState.isLoading}
            error={byState.error}
            skeleton={<div className="mt-5 h-[220px] animate-pulse rounded-lg bg-canvas" />}
          >
            {(byState.data ?? []).length === 0 ? (
              <p className="mt-8 text-sm text-muted">No listings to chart yet.</p>
            ) : (
              <>
                <ChartFrame className="mt-5 h-[220px] w-full">
                  <BarChart
                    data={byState.data}
                    layout="vertical"
                    margin={{ top: 12, left: 12, right: 48, bottom: 4 }}
                    barCategoryGap="42%"
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="#EEF0F3"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      type="number"
                      orientation="top"
                      domain={[0, listingAxis.max]}
                      ticks={listingAxis.ticks}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="state"
                      tickLine={false}
                      axisLine={false}
                      width={64}
                      tick={{ fill: "#6B7280", fontSize: 13 }}
                    />
                    <Bar
                      dataKey="count"
                      name="Total Listings"
                      fill={RELEASED_COLOR}
                      radius={0}
                    >
                      <LabelList
                        dataKey="count"
                        position="right"
                        fill="#4B5563"
                        fontSize={14}
                        fontWeight={500}
                      />
                    </Bar>
                  </BarChart>
                </ChartFrame>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
                  <span
                    className="size-2.5 rounded-sm"
                    style={{ backgroundColor: RELEASED_COLOR }}
                  />
                  Total Listings
                </div>
              </>
            )}
          </QueryPanel>
        </section>

        <section className="rounded-xl border border-stroke bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Needs attention</h2>
          <QueryPanel
            isLoading={attention.isLoading}
            error={attention.error}
            skeleton={<div className="mt-4 h-40 animate-pulse rounded-lg bg-canvas" />}
          >
            {(attention.data ?? []).length === 0 ? (
              <p className="mt-8 text-sm text-muted">You&apos;re all caught up.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {(attention.data ?? []).map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      className="flex items-start justify-between gap-3 rounded-md p-2 hover:bg-canvas"
                    >
                      <span>
                        <span className="block text-sm font-medium text-ink">
                          {item.title}
                        </span>
                        {item.detail ? (
                          <span className="mt-0.5 block text-xs text-muted">
                            {item.detail}
                          </span>
                        ) : null}
                      </span>
                      <StatusBadge
                        tone={item.priority === "high" ? "danger" : "warning"}
                      >
                        {item.priority}
                      </StatusBadge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </QueryPanel>
        </section>
      </div>
    </div>
  );
}

function QueryPanel({
  isLoading,
  error,
  skeleton,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  skeleton: ReactNode;
  children: ReactNode;
}) {
  if (isLoading) return <>{skeleton}</>;
  if (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return <p className="mt-4 text-sm text-red-500">{message}</p>;
  }
  return <>{children}</>;
}

function percentHint(changePct: number) {
  const prefix = changePct > 0 ? "+" : "";
  return `${prefix}${changePct}% This Month`;
}

function listingAxisScale(rows: Array<{ count: number }>) {
  const highest = Math.max(1, ...rows.map((row) => row.count));
  const max = Math.max(4, Math.ceil(highest / 4) * 4);
  const step = max / 4;
  return {
    max,
    ticks: [0, step, step * 2, step * 3, max],
  };
}

function KpiSkeleton() {
  return (
    <div className="h-[132px] animate-pulse rounded-xl border border-stroke bg-white" />
  );
}

function Kpi({
  label,
  value,
  hint,
  hintTone,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  hintTone: "success" | "danger";
  icon: ReactNode;
}) {
  return (
    <div className="relative rounded-xl border border-stroke bg-white p-5">
      <div className="absolute right-5 top-5">{icon}</div>
      <p className="pr-14 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      <p
        className={[
          "mt-2 text-sm font-medium",
          hintTone === "success" ? "text-emerald-600" : "text-red-500",
        ].join(" ")}
      >
        {hint}
      </p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0] as { payload?: EscrowTrendPoint };
  const row = point.payload;
  if (!row) return null;

  return (
    <div className="rounded-lg border border-stroke bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold uppercase tracking-wide text-ink">
        {monthHeading(label)} {new Date().getFullYear()}
      </p>
      <p className="mt-1 text-muted">
        Released: {formatCompactNaira(row.released)}
      </p>
      <p className="text-muted">Volume: {formatCompactNaira(row.volume)}</p>
    </div>
  );
}

function monthHeading(month?: string) {
  const names: Record<string, string> = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    July: "July",
  };
  return month ? (names[month] ?? month) : "";
}
