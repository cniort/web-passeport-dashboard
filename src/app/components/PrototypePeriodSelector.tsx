"use client";

import React from "react";
import { Clock } from "lucide-react";
import type { FilterPeriod } from "@/app/hooks/useDashboardState";

interface PrototypePeriodSelectorProps {
  period: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
  selectedMonth?: number;
  selectedQuarter?: number;
  onMonthChange?: (month: number | undefined) => void;
  onQuarterChange?: (quarter: number | undefined) => void;
}

const MONTHS = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

const QUARTERS = [
  { value: 1, label: "Q1 (Jan-Mar)" },
  { value: 2, label: "Q2 (Avr-Juin)" },
  { value: 3, label: "Q3 (Juil-Sep)" },
  { value: 4, label: "Q4 (Oct-Déc)" },
];

export default function PrototypePeriodSelector({
  period,
  onPeriodChange,
  selectedMonth,
  selectedQuarter,
  onMonthChange,
  onQuarterChange,
}: PrototypePeriodSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Période :</span>
      </div>
      
      <div className="flex items-center gap-2">
        {(["year", "quarter", "month", "custom"] as FilterPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            style={{
              backgroundColor: p === period ? '#2563eb' : '#ffffff',
              color: p === period ? '#ffffff' : '#334155',
              borderColor: p === period ? '#2563eb' : '#cbd5e1',
              fontWeight: '500'
            }}
            className="rounded-lg border px-3 py-1 text-sm transition-colors hover:bg-slate-50"
          >
            {p === "year" ? "Année" : p === "quarter" ? "Trimestre" : p === "month" ? "Mois" : "Plage libre"}
          </button>
        ))}
      </div>

      {period === "month" && onMonthChange && (
        <select
          value={selectedMonth || ""}
          onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        >
          <option value="">Tous les mois</option>
          {MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      )}

      {period === "quarter" && onQuarterChange && (
        <select
          value={selectedQuarter || ""}
          onChange={(e) => onQuarterChange(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        >
          <option value="">Tous les trimestres</option>
          {QUARTERS.map((quarter) => (
            <option key={quarter.value} value={quarter.value}>
              {quarter.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}