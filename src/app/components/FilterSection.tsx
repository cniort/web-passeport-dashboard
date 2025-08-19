"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Filter, Calendar, TrendingUp } from "lucide-react";
import YearSelector from "@/app/components/YearSelector";
import PeriodSelector from "@/app/components/PeriodSelector";
import type { DashboardFilters } from "@/app/hooks/useDashboardState";

interface FilterSectionProps {
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  availableYears: number[];
}

export default function FilterSection({ filters, setFilters, availableYears }: FilterSectionProps) {
  const clearFilters = () => {
    setFilters({
      selectedYear: new Date().getFullYear(),
      compareYear: undefined,
      period: "year",
      selectedMonth: undefined,
      selectedQuarter: undefined,
    });
  };

  return (
    <Card className="border-slate-200 bg-slate-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Filter className="h-5 w-5 text-slate-600" />
          Filtres et période d&apos;analyse
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sélection d'année */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <YearSelector
              selectedYear={filters.selectedYear}
              availableYears={availableYears}
              onYearChange={(year) => setFilters({ selectedYear: year })}
              compareYear={filters.compareYear}
              onCompareYearChange={(year) => setFilters({ compareYear: year })}
            />
          </div>

          {/* Sélection de période */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-500" />
            <PeriodSelector
              period={filters.period}
              onPeriodChange={(period) => setFilters({ period })}
              selectedMonth={filters.selectedMonth}
              selectedQuarter={filters.selectedQuarter}
              onMonthChange={(month) => setFilters({ selectedMonth: month })}
              onQuarterChange={(quarter) => setFilters({ selectedQuarter: quarter })}
            />
          </div>

          {/* Bouton de remise à zéro */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Réinitialiser
          </Button>
        </div>
        
        {/* Résumé des filtres actifs */}
        <div className="text-sm text-slate-700">
          <strong>Période analysée :</strong> {filters.selectedYear}
          {filters.period === "month" && filters.selectedMonth && ` - Mois ${filters.selectedMonth}`}
          {filters.period === "quarter" && filters.selectedQuarter && ` - Trimestre ${filters.selectedQuarter}`}
          {filters.compareYear && ` (comparé à ${filters.compareYear})`}
        </div>
      </CardContent>
    </Card>
  );
}