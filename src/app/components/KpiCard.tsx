// src/app/components/KpiCard.tsx
import React from "react";
import type { LucideIcon } from "lucide-react";
import DeltaBadge from "./DeltaBadge";
import { formatNumber } from "@/app/lib/format";

type Props = {
  title: string;
  icon: LucideIcon;
  value: number | null | undefined;
  delta?: number | null;
  subtitle?: string;
};

export default function KpiCard({ title, icon: Icon, value, delta, subtitle }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-600">
        <Icon size={16} />
        <span className="text-sm font-medium">{title}</span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div className="text-3xl font-semibold text-slate-900">
          {formatNumber(value, 0)}
        </div>
        <DeltaBadge delta={delta} />
      </div>

      {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
    </div>
  );
}
