// src/app/components/DeltaBadge.tsx
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { formatPercent } from "@/app/lib/format";

type Props = { delta?: number | null };

export default function DeltaBadge({ delta }: Props) {
  const v = typeof delta === "number" && Number.isFinite(delta) ? delta : 0;
  const isZero = v === 0;
  const isPos = v > 0;

  const Icon = isZero ? Minus : isPos ? ArrowUpRight : ArrowDownRight;
  const color = isZero
    ? "text-slate-600 bg-slate-100"
    : isPos
    ? "text-emerald-700 bg-emerald-50"
    : "text-rose-700 bg-rose-50";

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${color}`}>
      <Icon size={14} />
      {formatPercent(v, 2)}
    </span>
  );
}
