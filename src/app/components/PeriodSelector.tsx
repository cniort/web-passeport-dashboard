"use client";

import React from "react";
import { Clock } from "lucide-react";
import type { FilterPeriod } from "@/app/hooks/useDashboardState";
// import { Button } from "@/app/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/app/components/ui/select";

interface PeriodSelectorProps {
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

export default function PeriodSelector({
  period,
  onPeriodChange,
  selectedMonth,
  selectedQuarter,
  onMonthChange,
  onQuarterChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Période :</span>
      </div>
      
      <div className="flex items-center gap-2">
        {(["year", "quarter", "month"] as FilterPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
              p === period
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {p === "year" ? "Année" : p === "quarter" ? "Trimestre" : "Mois"}
          </button>
        ))}
      </div>

      {period === "month" && onMonthChange && (
        <select
          value={selectedMonth || ""}
          onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-slate-300 focus:border-slate-400 focus:outline-none"
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
          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-slate-300 focus:border-slate-400 focus:outline-none"
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