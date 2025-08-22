"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Settings, Calendar, TrendingUp, RotateCcw, Zap, Download, Database, Power, PowerOff, Eye, EyeOff, ChevronUp, ChevronDown, Maximize2, Minimize2, CalendarDays, ExternalLink } from "lucide-react";
import PrototypeYearSelector from "@/app/components/PrototypeYearSelector";
import PrototypePeriodSelector from "@/app/components/PrototypePeriodSelector";
import DateRangePicker from "@/app/components/DateRangePicker";
import type { DashboardFilters } from "@/app/hooks/useDashboardState";
import type { RawRow } from "@/app/lib/supabase-data";

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  
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
        console.log('🔍 Setting compareN1 filters:', {
          currentYear,
          compareYear: currentYear - 1
        });
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
      <div className={`flex items-center justify-between ${isCollapsed ? 'mb-4' : 'mb-6'}`}>
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
          {/* Bouton pour réduire/déployer */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-2 text-sm rounded-md transition-colors border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 font-medium flex items-center gap-2"
          >
            {isCollapsed ? (
              <>
                <Maximize2 className="h-4 w-4" />
                Déployer
              </>
            ) : (
              <>
                <Minimize2 className="h-4 w-4" />
                Réduire
              </>
            )}
          </button>
          
          {/* Bouton de remise à zéro */}
          <button 
            onClick={clearFilters}
            className="px-3 py-2 text-sm rounded-md transition-colors border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 font-medium flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Résumé des filtres quand réduit */}
      {isCollapsed && (
        <div className="transition-all duration-300 animate-in slide-in-from-top-2">
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
                      {filters.period === "month" && filters.selectedMonth && ` Mois ${filters.selectedMonth}`}
                      {filters.period === "quarter" && filters.selectedQuarter && ` T${filters.selectedQuarter}`}
                      {filters.period === "custom" && filters.customStartDate && filters.customEndDate && 
                        ` ${filters.customStartDate} → ${filters.customEndDate}`
                      }
                      {filters.compareYear && <span className="text-slate-400"> vs {filters.compareYear}</span>}
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
                  <span className="ml-1 text-sm text-slate-400">
                    ({dataMetrics.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu des filtres (réductible) */}
      {!isCollapsed && (
        <div className="transition-all duration-300 animate-in slide-in-from-top-2">
        
        
        {/* Raccourcis temporels */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-slate-800">Raccourcis rapides</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => applyQuickFilter('currentYear')}
              className={`px-3 py-2 text-sm rounded-md transition-colors font-medium ${
                isQuickFilterActive('currentYear')
                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                  : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Année en cours
            </button>
            <button 
              onClick={() => applyQuickFilter('allData')}
              className={`px-3 py-2 text-sm rounded-md transition-colors font-medium ${
                isQuickFilterActive('allData')
                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                  : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Toute l'opération
            </button>
            <button 
              onClick={() => applyQuickFilter('compareN1')}
              className={`px-3 py-2 text-sm rounded-md transition-colors font-medium ${
                isQuickFilterActive('compareN1')
                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                  : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Comparaison N-1
            </button>
          </div>
        </div>

        {/* Séparateur */}
        <div className="mb-6">
          <div className="border-t border-gray-200 mb-4"></div>
          <button 
            onClick={() => setShowDatePicker(true)}
            className="px-3 py-2 text-sm rounded-md transition-colors border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 font-medium inline-block"
          >
            Sélectionner une période
          </button>
        </div>

        {/* Contrôles de filtres - Section supprimée car remplacée par le sélectionneur de date */}
        <div className="space-y-5">

          
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
                      {filters.period === "month" && filters.selectedMonth && ` Mois ${filters.selectedMonth}`}
                      {filters.period === "quarter" && filters.selectedQuarter && ` T${filters.selectedQuarter}`}
                      {filters.period === "custom" && filters.customStartDate && filters.customEndDate && 
                        ` ${filters.customStartDate} → ${filters.customEndDate}`
                      }
                      {filters.compareYear && <span className="text-slate-400"> vs {filters.compareYear}</span>}
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
                  <span className="ml-1 text-sm text-slate-400">
                    ({dataMetrics.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Modal du sélecteur de dates */}
      {showDatePicker && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
          <DateRangePicker
            startDate={filters.customStartDate}
            endDate={filters.customEndDate}
            onDateRangeChange={(start, end) => {
              setFilters({
                period: "custom",
                customStartDate: start,
                customEndDate: end,
                filtersEnabled: true
              });
            }}
            onCompareRangeChange={(compareStart, compareEnd) => {
              // Pour l'instant, on va simuler l'année de comparaison
              // On peut extraire l'année de compareStart si définie
              if (compareStart) {
                const compareYear = new Date(compareStart).getFullYear();
                setFilters({ compareYear });
              } else {
                setFilters({ compareYear: undefined });
              }
            }}
            onCancel={() => setShowDatePicker(false)}
            onApply={() => setShowDatePicker(false)}
          />
        </div>
      )}
    </div>
  );
}