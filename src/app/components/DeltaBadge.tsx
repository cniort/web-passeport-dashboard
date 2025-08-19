// src/app/components/DeltaBadge.tsx
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { formatPercent } from "@/app/lib/format";

type Props = { delta?: number | null };

export default function DeltaBadge({ delta }: Props) {
  // Si delta est null/undefined, ne pas afficher de pastille
  if (delta === null || delta === undefined) {
    return null;
  }

  const v = typeof delta === "number" && Number.isFinite(delta) ? delta : 0;
  const isZero = v === 0;
  const isPos = v > 0;

  const Icon = isZero ? Minus : isPos ? ArrowUpRight : ArrowDownRight;
  // Couleurs avec contraste élevé pour une meilleure visibilité
  const color = isZero
    ? "text-gray-600 bg-gray-200"
    : isPos
    ? "text-green-800 bg-green-200"
    : "text-red-800 bg-red-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${color}`}>
      <Icon size={14} />
      {formatPercent(v, 2)}
    </span>
  );
}
