"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthlyData {
  month: string;
  orders: number;
  passports: number;
}

interface MonthlyChartProps {
  data: MonthlyData[];
  title: string;
}

export default function MonthlyChart({ data, title }: MonthlyChartProps) {
  const formatTooltip = (value: number, name: string) => {
    switch (name) {
      case "orders":
        return [Math.round(value), "Commandes"];
      case "passports":
        return [Math.round(value), "Passeports"];
      default:
        return [value, name];
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={formatTooltip}
              labelStyle={{ color: "#334155" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="orders"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Commandes"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="passports"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              name="Passeports"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}