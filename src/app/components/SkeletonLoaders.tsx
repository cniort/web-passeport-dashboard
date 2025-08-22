"use client";

import React from "react";

// Skeleton pour les cartes KPI
export function KpiCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 bg-slate-200 rounded"></div>
        <div className="w-24 h-4 bg-slate-200 rounded"></div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="w-20 h-8 bg-slate-200 rounded"></div>
        <div className="w-12 h-5 bg-slate-200 rounded"></div>
      </div>
      <div className="w-16 h-3 bg-slate-200 rounded mt-2"></div>
    </div>
  );
}

// Skeleton pour les graphiques
export function ChartSkeleton({ title }: { title?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      {title && (
        <div className="mb-4">
          <div className="w-48 h-6 bg-slate-200 rounded"></div>
        </div>
      )}
      <div className="h-80 bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Chargement du graphique...</div>
      </div>
    </div>
  );
}

// Skeleton pour les tableaux
export function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-6 bg-slate-200 rounded"></div>
          <div className="w-20 h-8 bg-slate-200 rounded"></div>
        </div>
        <div className="w-full h-10 bg-slate-200 rounded"></div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-3">
                  <div className="w-16 h-4 bg-slate-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                {[1, 2, 3, 4, 5].map((j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton pour la carte des pays
export function CountryMapSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-slate-200 rounded"></div>
        <div className="w-32 h-6 bg-slate-200 rounded"></div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-slate-200 rounded"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-200 rounded"></div>
              <div className="w-12 h-3 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="w-8 h-6 bg-slate-200 rounded"></div>
                <div>
                  <div className="w-20 h-4 bg-slate-200 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-8 h-4 bg-slate-200 rounded mb-1"></div>
                <div className="w-12 h-3 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="w-8 h-6 bg-slate-200 rounded mb-1 mx-auto"></div>
                <div className="w-12 h-3 bg-slate-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton pour les sélecteurs
export function SelectorSkeleton() {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-200 rounded"></div>
        <div className="w-12 h-4 bg-slate-200 rounded"></div>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-8 bg-slate-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

// Skeleton pour le header complet
export function HeaderSkeleton() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 animate-pulse">
      <div className="w-64 h-8 bg-slate-200 rounded"></div>
      <div className="flex items-center gap-4">
        <SelectorSkeleton />
        <div className="w-24 h-8 bg-slate-200 rounded-lg"></div>
      </div>
    </header>
  );
}

// Skeleton pour la grille des KPI
export function KpiGridSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <KpiCardSkeleton key={i} />
      ))}
    </section>
  );
}

// Skeleton pour la page complète
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header avec titre et export */}
        <header className="flex flex-wrap items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-80 h-8 bg-slate-200 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-6 bg-green-100 rounded-full"></div>
              <div className="w-48 h-6 bg-gray-100 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-24 h-8 bg-slate-200 rounded"></div>
            <div className="w-20 h-8 bg-slate-200 rounded"></div>
          </div>
        </header>

        {/* Section des filtres */}
        <div className="rounded-lg border border-dashed border-blue-300 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 shadow-sm p-6 animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-600 p-2 w-8 h-8"></div>
              <div className="w-48 h-6 bg-slate-200 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-slate-200 rounded"></div>
              <div className="w-16 h-8 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* KPIs principaux */}
        <section className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-40 h-6 bg-slate-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="w-12 h-6 bg-slate-200 rounded mb-2 mx-auto"></div>
                  <div className="w-16 h-4 bg-slate-200 rounded mb-1 mx-auto"></div>
                  <div className="w-20 h-3 bg-slate-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section saisonnalité et répartition géographique */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </section>

        {/* Section clientèles et comportements */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </section>
      </div>
    </div>
  );
}