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

interface PrototypeYearSelectorProps {
  selectedYear?: number; // Peut être undefined pour "toutes les années"
  availableYears: number[];
  onYearChange: (year: number | undefined) => void; // Accepte aussi undefined
  compareYear?: number;
  onCompareYearChange?: (year: number | undefined) => void;
}

export default function PrototypeYearSelector({
  selectedYear,
  availableYears,
  onYearChange,
  compareYear,
  onCompareYearChange,
}: PrototypeYearSelectorProps) {
  
  const handleYearClick = (year: number) => {
    // Si on clique sur l'année déjà sélectionnée, la désélectionner (retour à "tout")
    if (year === selectedYear) {
      onYearChange(undefined); // Désélectionner = pas d'année = toutes les données
    } else {
      onYearChange(year); // Sélectionner cette année
    }
  };
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Année :</span>
      </div>
      
      <div className="flex items-center gap-1">
        {availableYears.map((year) => (
          <Button
            key={year}
            variant="outline"
            size="sm"
            onClick={() => handleYearClick(year)}
            style={{
              backgroundColor: year === selectedYear ? '#2563eb' : '#ffffff',
              color: year === selectedYear ? '#ffffff' : '#334155',
              borderColor: year === selectedYear ? '#2563eb' : '#cbd5e1',
              fontWeight: '500'
            }}
            className="border rounded-md px-3 py-1 text-sm transition-colors hover:bg-slate-100"
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
            <SelectTrigger className="w-40 border-slate-300 bg-white text-slate-700 hover:border-slate-400">
              <SelectValue placeholder="Comparer à..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="none" className="text-slate-700">Aucune comparaison</SelectItem>
              {availableYears
                .filter(year => year !== selectedYear)
                .map((year) => (
                  <SelectItem key={year} value={year.toString()} className="text-slate-700">
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