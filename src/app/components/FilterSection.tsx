"use client";

import React, { useMemo } from "react";
import { Button } from "@/app/components/ui/button";
import { Settings, Calendar, TrendingUp, RotateCcw, Zap, Download, Database } from "lucide-react";
import YearSelector from "@/app/components/YearSelector";
import PeriodSelector from "@/app/components/PeriodSelector";
import type { DashboardFilters } from "@/app/hooks/useDashboardState";
import type { RawRow } from "@/app/lib/clean";

interface FilterSectionProps {
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  availableYears: number[];
  filteredData?: RawRow[];
  totalData?: RawRow[];
  onExport?: () => void;
}

export default function FilterSection({ 
  filters, 
  setFilters, 
  availableYears, 
  filteredData = [],
  totalData = [],
  onExport 
}: FilterSectionProps) {
  
  const clearFilters = () => {
    setFilters({
      selectedYear: new Date().getFullYear(),
      compareYear: undefined,
      period: "year",
      selectedMonth: undefined,
      selectedQuarter: undefined,
      customStartDate: undefined,
      customEndDate: undefined,
    });
  };

  // Raccourcis temporels intelligents
  const applyQuickFilter = (type: 'last30' | 'currentQuarter' | 'currentYear' | 'autoCompare') => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    switch (type) {
      case 'last30':
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        setFilters({
          period: "custom",
          customStartDate: thirtyDaysAgo.toISOString().split('T')[0],
          customEndDate: now.toISOString().split('T')[0],
          compareYear: undefined
        });
        break;
        
      case 'currentQuarter':
        const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
        setFilters({
          selectedYear: currentYear,
          period: "quarter",
          selectedQuarter: currentQuarter,
          compareYear: currentYear - 1
        });
        break;
        
      case 'currentYear':
        setFilters({
          selectedYear: currentYear,
          period: "year",
          selectedMonth: undefined,
          selectedQuarter: undefined,
          compareYear: currentYear - 1
        });
        break;
        
      case 'autoCompare':
        if (!filters.compareYear && filters.selectedYear > availableYears[availableYears.length - 1]) {
          setFilters({
            compareYear: filters.selectedYear - 1
          });
        }
        break;
    }
  };

  // Calcul des métriques de données
  const dataMetrics = useMemo(() => {
    const filtered = filteredData.length;
    const total = totalData.length;
    const percentage = total > 0 ? (filtered / total) * 100 : 0;
    
    return { filtered, total, percentage };
  }, [filteredData.length, totalData.length]);

  // Gestion du mode plage libre
  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    const updates: Partial<DashboardFilters> = {
      period: "custom"
    };
    
    if (field === 'start') {
      updates.customStartDate = value;
    } else {
      updates.customEndDate = value;
    }
    
    setFilters(updates);
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 p-6 shadow-lg">
      {/* Header optimisé avec meilleurs contrastes */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2.5 shadow-sm">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Paramètres d&apos;analyse</h3>
            <p className="text-sm font-medium text-slate-700">Configurez la période et les comparaisons</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Bouton d'export avec filtres */}
          {onExport && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExport}
              className="border-emerald-400 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-500 font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter ({dataMetrics.filtered})
            </Button>
          )}
          
          {/* Bouton de remise à zéro avec meilleur contraste */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="border-blue-400 text-blue-800 hover:bg-blue-100 hover:border-blue-500 font-medium"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Raccourcis temporels */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-slate-800">Raccourcis rapides</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => applyQuickFilter('last30')}
            className="border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-medium"
          >
            30 derniers jours
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => applyQuickFilter('currentQuarter')}
            className="border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-medium"
          >
            Trimestre en cours
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => applyQuickFilter('currentYear')}
            className="border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-medium"
          >
            Année en cours
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => applyQuickFilter('autoCompare')}
            className="border-purple-300 text-purple-800 hover:bg-purple-50 text-xs font-medium"
          >
            + Comparaison auto
          </Button>
        </div>
      </div>

      {/* Contrôles de filtres réorganisés */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Sélection d'année */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-white shadow-sm p-2">
                <Calendar className="h-4 w-4 text-blue-700" />
              </div>
              <label className="text-sm font-bold text-slate-800">Année d&apos;analyse</label>
            </div>
            <YearSelector
              selectedYear={filters.selectedYear}
              availableYears={availableYears}
              onYearChange={(year) => setFilters({ selectedYear: year })}
              compareYear={filters.compareYear}
              onCompareYearChange={(year) => setFilters({ compareYear: year })}
            />
          </div>

          {/* Sélection de période */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-white shadow-sm p-2">
                <TrendingUp className="h-4 w-4 text-blue-700" />
              </div>
              <label className="text-sm font-bold text-slate-800">Granularité</label>
            </div>
            <PeriodSelector
              period={filters.period}
              onPeriodChange={(period) => setFilters({ period })}
              selectedMonth={filters.selectedMonth}
              selectedQuarter={filters.selectedQuarter}
              onMonthChange={(month) => setFilters({ selectedMonth: month })}
              onQuarterChange={(quarter) => setFilters({ selectedQuarter: quarter })}
            />
          </div>
        </div>

        {/* Mode plage libre */}
        {filters.period === "custom" && (
          <div className="rounded-lg bg-white/80 border-2 border-indigo-200 p-4">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Plage personnalisée</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Date de début</label>
                <input
                  type="date"
                  value={filters.customStartDate || ''}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Date de fin</label>
                <input
                  type="date"
                  value={filters.customEndDate || ''}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Résumé et indicateur de données */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Configuration active */}
          <div className="rounded-lg bg-white/80 border-2 border-blue-200 p-3">
            <div className="text-sm">
              <span className="font-bold text-blue-900">Configuration :</span>
              <span className="ml-2 text-slate-800 font-medium">
                {filters.selectedYear}
                {filters.period === "month" && filters.selectedMonth && ` • Mois ${filters.selectedMonth}`}
                {filters.period === "quarter" && filters.selectedQuarter && ` • T${filters.selectedQuarter}`}
                {filters.period === "custom" && filters.customStartDate && filters.customEndDate && 
                  ` • ${filters.customStartDate} → ${filters.customEndDate}`
                }
                {filters.compareYear && ` • vs ${filters.compareYear}`}
              </span>
            </div>
          </div>

          {/* Indicateur de données correspondantes */}
          <div className="rounded-lg bg-white/80 border-2 border-emerald-200 p-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-700" />
              <div className="text-sm">
                <span className="font-bold text-emerald-900">Données :</span>
                <span className="ml-2 text-slate-800 font-medium">
                  {dataMetrics.filtered.toLocaleString("fr-FR")} / {dataMetrics.total.toLocaleString("fr-FR")}
                </span>
                <span className="ml-1 text-xs text-slate-600">
                  ({dataMetrics.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}