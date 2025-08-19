"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface YearSelectorProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  compareYear?: number;
  onCompareYearChange?: (year: number | undefined) => void;
}

export default function YearSelector({
  selectedYear,
  availableYears,
  onYearChange,
  compareYear,
  onCompareYearChange,
}: YearSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Année :</span>
      </div>
      
      <div className="flex items-center gap-1">
        {availableYears.map((year) => (
          <Button
            key={year}
            variant={year === selectedYear ? "default" : "outline"}
            size="sm"
            onClick={() => onYearChange(year)}
            className={year === selectedYear 
              ? "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white" 
              : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
            }
          >
            {year}
          </Button>
        ))}
      </div>

      {onCompareYearChange && (
        <>
          <div className="text-slate-500 text-sm">vs</div>
          <Select
            value={compareYear?.toString() || "none"}
            onValueChange={(value) => onCompareYearChange(value === "none" ? undefined : Number(value))}
          >
            <SelectTrigger className="w-40 border-slate-300 text-slate-700">
              <SelectValue placeholder="Comparer à..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune comparaison</SelectItem>
              {availableYears
                .filter(year => year !== selectedYear)
                .map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}