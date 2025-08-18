// src/app/page.tsx
import React from "react";
import { computeKpis, yoy } from "@/app/lib/kpis";
import { fetchTypeformRows, type RawRow } from "@/app/lib/typeform";
import KpiCard from "@/app/components/KpiCard";
import { Package, ShoppingCart, BarChart3, Calendar } from "lucide-react";

const YEARS = [2025, 2024] as const;

export default async function Page() {
  let rows: RawRow[] = [];
  try {
    rows = await fetchTypeformRows();
  } catch {
    rows = [];
  }

  const y = YEARS[0];
  const kThis = computeKpis(rows, y);
  const kPrev = computeKpis(rows, y - 1);

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-slate-900">
            Dashboard – Opération Passeport
          </h1>
          <div className="flex items-center gap-2">
            {YEARS.map((yy, i) => (
              <span
                key={yy}
                className={`rounded-lg border px-3 py-1 text-sm ${yy === y ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"}`}
              >
                {yy}
              </span>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Passeports commandés"
            icon={Package}
            value={kThis.totalPassports}
            delta={yoy(kThis.totalPassports, kPrev.totalPassports)}
            subtitle="+ [xxx] passeports"
          />

          <KpiCard
            title="Commandes totales"
            icon={ShoppingCart}
            value={kThis.orders}
            delta={yoy(kThis.orders, kPrev.orders)}
            subtitle="+ [xxx] commandes"
          />

          <KpiCard
            title="Moy. de passeports / commande"
            icon={BarChart3}
            value={kThis.avgPassportsPerOrder}
            delta={yoy(kThis.avgPassportsPerOrder, kPrev.avgPassportsPerOrder)}
            subtitle="+ [xxx] passeports"
          />

          <KpiCard
            title="Mois le + actif"
            icon={Calendar}
            value={null} // affichage textuel séparé si tu veux
            subtitle={kThis.topMonth ?? "—"}
          />
        </section>
      </div>
    </div>
  );
}
