"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/app/lib/format";
import { yoy } from "@/app/lib/kpis";
import DeltaBadge from "./DeltaBadge";

interface ComparisonCardProps {
  title: string;
  icon: LucideIcon;
  currentValue: number;
  currentYear: number;
  compareValue?: number;
  compareYear?: number;
  format?: "number" | "percentage";
  decimals?: number;
  subtitle?: string;
}

export default function ComparisonCard({
  title,
  icon: Icon,
  currentValue,
  currentYear,
  compareValue,
  compareYear,
  format = "number",
  decimals = 0,
  subtitle,
}: ComparisonCardProps) {
  const delta = compareValue !== undefined ? yoy(currentValue, compareValue) : null;

  const formatValue = (value: number) => {
    if (format === "percentage") {
      return `${value.toFixed(1)}%`;
    }
    return formatNumber(value, decimals);
  };


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header avec icône et titre */}
      <div className="flex items-center gap-2 text-slate-600">
        <Icon size={16} />
        <span className="text-sm font-medium">{title}</span>
      </div>

      {/* Valeur principale */}
      <div className="mt-2 flex items-center gap-3">
        <div className="text-3xl font-semibold text-slate-900">
          {formatValue(currentValue)}
        </div>
        
        <DeltaBadge delta={delta} />
      </div>

      {/* Comparaison et subtitle */}
      <div className="mt-1 space-y-1">
        {compareValue !== undefined && compareYear && (
          <div className="text-xs text-slate-500">
            {formatValue(compareValue)} ({compareYear})
          </div>
        )}

        {subtitle && (
          <div className="text-xs text-slate-500">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}