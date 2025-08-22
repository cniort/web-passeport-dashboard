// src/app/lib/kpis.ts
import { getYear, getMonth } from "date-fns";
import type { CleanResponse } from "./clean";

export type Kpis = {
  year: number;
  orders: number;
  totalPassports: number;
  avgPassportsPerOrder: number;
  totalStamps: number;
  uniqueStamps: number;
  pointsRelaisCount: number;
  topMonth: string | null;
  topRelay: string | null;
  frSharePct: number;
  newsletterConvPct: number;
};

export function computeKpis(rows: CleanResponse[], year: number): Kpis {
  const rowsY = rows.filter((r) => {
    return r.dateCommande && getYear(r.dateCommande) === year;
  });

  const orders = rowsY.length;
  const totalPassports = rowsY.reduce((s, r) => s + (r.quantite || 0), 0);
  const avgPassportsPerOrder = orders ? totalPassports / orders : 0;

  const relayMap = new Map<string, number>();
  const monthMap = new Map<number, number>();
  let frCount = 0;
  let newsletterYes = 0;

  for (const r of rowsY) {
    if (r.pointRelais) relayMap.set(r.pointRelais, (relayMap.get(r.pointRelais) ?? 0) + 1);

    if (r.dateCommande) {
      const m = getMonth(r.dateCommande); // 0..11
      monthMap.set(m, (monthMap.get(m) ?? 0) + 1);
    }

    if (r.france) frCount++;
    if (r.newsletter) newsletterYes++;
  }

  const topRelay = [...relayMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topMonthIdx = [...monthMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
  ];

  return {
    year,
    orders,
    totalPassports,
    avgPassportsPerOrder,
    totalStamps: 0,
    uniqueStamps: 0,
    pointsRelaisCount: relayMap.size,
    topMonth: topMonthIdx === null ? null : monthNames[topMonthIdx],
    topRelay,
    frSharePct: orders ? (frCount * 100) / orders : 0,
    newsletterConvPct: orders ? (newsletterYes * 100) / orders : 0,
  };
}

export function yoy(current: number, previous: number): number {
  if (!Number.isFinite(previous) || previous === 0) return 0;
  if (!Number.isFinite(current)) return 0;
  return ((current - previous) / previous) * 100;
}
