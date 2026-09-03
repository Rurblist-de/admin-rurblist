export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPropertyPrice(
  amount: number,
  period: "sale" | "month" = "sale",
): string {
  const base = `N${amount.toLocaleString("en-NG")}`;
  return period === "month" ? `${base}/mo` : base;
}

export function formatCompactNaira(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const value =
      millions % 1 === 0 ? String(millions) : millions.toFixed(1);
    return `N${value}M`;
  }
  return formatNaira(amount);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
