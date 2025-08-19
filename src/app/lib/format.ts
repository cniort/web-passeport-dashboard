// src/app/lib/format.ts
export function formatNumber(n: number | null | undefined, digits = 0): string {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return v.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPercent(n: number | null | undefined, digits = 2): string {
  return `${formatNumber(n, digits)} %`;
}

export function safeNumber(n: number | null | undefined): number {
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}
