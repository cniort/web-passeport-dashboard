"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { TimeSeriesData } from "@/app/lib/enhanced-kpis";

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  type?: "line" | "bar";
  dataKey: "orders" | "passports" | "avgPassportsPerOrder";
  title: string;
  color?: string;
}

export default function TimeSeriesChart({
  data,
  type = "line",
  dataKey,
  title,
  color = "#3b82f6",
}: TimeSeriesChartProps) {
  const formatTooltip = (value: number) => {
    let label = "";
    let formattedValue = value;

    switch (dataKey) {
      case "orders":
        label = "Commandes";
        formattedValue = Math.round(value);
        break;
      case "passports":
        label = "Passeports";
        formattedValue = Math.round(value);
        break;
      case "avgPassportsPerOrder":
        label = "Moyenne passeports/commande";
        formattedValue = Number(value.toFixed(2));
        break;
    }

    return [formattedValue, label];
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
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
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
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
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}