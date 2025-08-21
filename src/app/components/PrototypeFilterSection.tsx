"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Settings, Calendar, TrendingUp, RotateCcw, Zap, Download, Database, Power, PowerOff, Eye, EyeOff, ChevronUp, ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import PrototypeYearSelector from "@/app/components/PrototypeYearSelector";
import PrototypePeriodSelector from "@/app/components/PrototypePeriodSelector";
import type { DashboardFilters } from "@/app/hooks/useDashboardState";
import type { RawRow } from "@/app/lib/clean";

interface PrototypeFilterSectionProps {
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  availableYears: number[];
  filteredData?: RawRow[];
  totalData?: RawRow[];
}

export default function PrototypeFilterSection({ 
  filters, 
  setFilters, 
  availableYears, 
  filteredData = [],
  totalData = []
}: PrototypeFilterSectionProps) {
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const clearFilters = () => {
    // Reset pour afficher TOUTES les données sans filtre temporel
    setFilters({
      selectedYear: undefined, // Pas d'année spécifique = toutes les années
      compareYear: undefined,
      period: "year",
      selectedMonth: undefined,
      selectedQuarter: undefined,
      customStartDate: undefined,
      customEndDate: undefined,
      filtersEnabled: false, // Désactiver tous les filtres temporels
    });
  };

  // Raccourcis temporels intelligents
  const applyQuickFilter = (type: 'currentYear' | 'allData' | 'compareN1') => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    switch (type) {
      case 'currentYear':
        setFilters({
          filtersEnabled: true,
          selectedYear: currentYear,
          period: "year",
          selectedMonth: undefined,
          selectedQuarter: undefined,
          compareYear: undefined
        });
        break;
        
      case 'allData':
        setFilters({
          selectedYear: undefined,
          compareYear: undefined,
          period: "year",
          selectedMonth: undefined,
          selectedQuarter: undefined,
          customStartDate: undefined,
          customEndDate: undefined,
          filtersEnabled: false
        });
        break;
        
      case 'compareN1':
        setFilters({
          filtersEnabled: true,
          selectedYear: currentYear,
          period: "year",
          selectedMonth: undefined,
          selectedQuarter: undefined,
          compareYear: currentYear - 1
        });
        break;
    }
  };

  // Fonction pour déterminer si un raccourci est actif
  const isQuickFilterActive = (type: 'currentYear' | 'allData' | 'compareN1'): boolean => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    switch (type) {
      case 'currentYear':
        return filters.filtersEnabled && filters.selectedYear === currentYear && !filters.compareYear;
      case 'allData':
        return !filters.filtersEnabled && !filters.selectedYear;
      case 'compareN1':
        return filters.filtersEnabled && filters.selectedYear === currentYear && filters.compareYear === currentYear - 1;
      default:
        return false;
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
      period: "custom",
      filtersEnabled: true // Activer les filtres lors de la sélection de dates
    };
    
    if (field === 'start') {
      updates.customStartDate = value;
    } else {
      updates.customEndDate = value;
    }
    
    setFilters(updates);
  };

  return (
    <div className={`rounded-lg border border-dashed border-blue-300 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 shadow-sm transition-all duration-300 p-6`}>
      
      {/* Header avec toggle principal */}
      <div className={`flex items-center justify-between ${isCollapsed ? 'mb-0' : 'mb-6'}`}>
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-600 p-2 shadow-sm">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Paramètres d&apos;analyse
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Bouton pour rétracter/déployer */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              borderColor: '#818cf8',
              color: '#4338ca',
              backgroundColor: '#ffffff',
              fontWeight: '500'
            }}
            className="hover:bg-indigo-50"
          >
            {isCollapsed ? (
              <>
                <Maximize2 className="h-4 w-4 mr-2" />
                Déployer
              </>
            ) : (
              <>
                <Minimize2 className="h-4 w-4 mr-2" />
                Rétracter
              </>
            )}
          </Button>
          
          {/* Bouton de remise à zéro */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            style={{
              borderColor: '#94a3b8',
              color: '#334155',
              backgroundColor: '#ffffff',
              fontWeight: '500'
            }}
            className="hover:bg-slate-100"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Contenu des filtres (rétractable) */}
      {!isCollapsed && (
        <div className="transition-all duration-300 animate-in slide-in-from-top-2">
        
        
        {/* Raccourcis temporels */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-slate-800">Raccourcis rapides</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyQuickFilter('currentYear')}
              style={{
                borderColor: isQuickFilterActive('currentYear') ? '#3b82f6' : '#94a3b8',
                color: isQuickFilterActive('currentYear') ? '#1d4ed8' : '#64748b',
                backgroundColor: isQuickFilterActive('currentYear') ? '#dbeafe' : '#ffffff',
                fontSize: '12px',
                fontWeight: isQuickFilterActive('currentYear') ? '600' : '500'
              }}
              className="hover:bg-blue-50"
            >
              Année en cours
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyQuickFilter('allData')}
              style={{
                borderColor: isQuickFilterActive('allData') ? '#3b82f6' : '#94a3b8',
                color: isQuickFilterActive('allData') ? '#1d4ed8' : '#64748b',
                backgroundColor: isQuickFilterActive('allData') ? '#dbeafe' : '#ffffff',
                fontSize: '12px',
                fontWeight: isQuickFilterActive('allData') ? '600' : '500'
              }}
              className="hover:bg-blue-50"
            >
              Toute l'opération
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyQuickFilter('compareN1')}
              style={{
                borderColor: isQuickFilterActive('compareN1') ? '#3b82f6' : '#94a3b8',
                color: isQuickFilterActive('compareN1') ? '#1d4ed8' : '#64748b',
                backgroundColor: isQuickFilterActive('compareN1') ? '#dbeafe' : '#ffffff',
                fontSize: '12px',
                fontWeight: isQuickFilterActive('compareN1') ? '600' : '500'
              }}
              className="hover:bg-blue-50"
            >
              Comparaison N-1
            </Button>
          </div>
        </div>

        {/* Contrôles de filtres */}
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
              <PrototypeYearSelector
                selectedYear={filters.selectedYear}
                availableYears={availableYears}
                onYearChange={(year) => setFilters({ 
                  selectedYear: year, 
                  filtersEnabled: year !== undefined,  // Si year undefined, désactiver les filtres
                  compareYear: year === undefined ? undefined : filters.compareYear // Reset comparaison si on désactive
                })}
                compareYear={filters.compareYear}
                onCompareYearChange={(year) => setFilters({ compareYear: year, filtersEnabled: true })}
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
              <PrototypePeriodSelector
                period={filters.period}
                onPeriodChange={(period) => setFilters({ period, filtersEnabled: true })}
                selectedMonth={filters.selectedMonth}
                selectedQuarter={filters.selectedQuarter}
                onMonthChange={(month) => setFilters({ selectedMonth: month, filtersEnabled: true })}
                onQuarterChange={(quarter) => setFilters({ selectedQuarter: quarter, filtersEnabled: true })}
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
                  {!filters.filtersEnabled || !filters.selectedYear ? (
                    "Toutes les données"
                  ) : (
                    <>
                      {filters.selectedYear}
                      {filters.period === "month" && filters.selectedMonth && ` • Mois ${filters.selectedMonth}`}
                      {filters.period === "quarter" && filters.selectedQuarter && ` • T${filters.selectedQuarter}`}
                      {filters.period === "custom" && filters.customStartDate && filters.customEndDate && 
                        ` • ${filters.customStartDate} → ${filters.customEndDate}`
                      }
                      {filters.compareYear && ` • vs ${filters.compareYear}`}
                    </>
                  )}
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
      )}
    </div>
  );
}