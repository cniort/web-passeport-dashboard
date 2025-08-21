"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Settings, Calendar, TrendingUp, RotateCcw, Zap, Download, Database, ChevronDown } from "lucide-react";
import type { DashboardFilters } from "@/app/hooks/useDashboardState";
import type { RawRow } from "@/app/lib/clean";

interface FilterSectionV3Props {
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  availableYears: number[];
  filteredData?: RawRow[];
  totalData?: RawRow[];
  onExport?: () => void;
}

export default function FilterSectionV3({ 
  filters, 
  setFilters, 
  availableYears, 
  filteredData = [],
  totalData = [],
  onExport 
}: FilterSectionV3Props) {
  
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  // Options de période dans un style segmenté
  const periodOptions = [
    { value: 'year', label: 'Année', icon: '📅' },
    { value: 'quarter', label: 'Trimestre', icon: '📊' },
    { value: 'month', label: 'Mois', icon: '📝' },
    { value: 'custom', label: 'Personnalisé', icon: '🔧' }
  ];

  // Options rapides de temporalité
  const quickFilters = [
    { 
      id: 'current-year',
      label: '2025',
      description: 'Année en cours',
      action: () => setFilters({ 
        selectedYear: 2025, 
        period: "year", 
        compareYear: 2024,
        selectedMonth: undefined,
        selectedQuarter: undefined,
        customStartDate: undefined,
        customEndDate: undefined
      })
    },
    { 
      id: 'last-year',
      label: '2024',
      description: 'Année précédente',
      action: () => setFilters({ 
        selectedYear: 2024, 
        period: "year",
        compareYear: 2023,
        selectedMonth: undefined,
        selectedQuarter: undefined,
        customStartDate: undefined,
        customEndDate: undefined
      })
    },
    { 
      id: 'current-quarter',
      label: 'T4 2025',
      description: 'Trimestre actuel',
      action: () => setFilters({ 
        selectedYear: 2025, 
        period: "quarter", 
        selectedQuarter: 4,
        compareYear: 2024,
        selectedMonth: undefined,
        customStartDate: undefined,
        customEndDate: undefined
      })
    },
    { 
      id: 'last-30-days',
      label: '30j',
      description: 'Derniers 30 jours',
      action: () => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        setFilters({
          period: "custom",
          customStartDate: thirtyDaysAgo.toISOString().split('T')[0],
          customEndDate: now.toISOString().split('T')[0],
          compareYear: undefined,
          selectedMonth: undefined,
          selectedQuarter: undefined
        });
      }
    }
  ];

  // Détecter le filtre actif
  const getActiveQuickFilter = () => {
    if (filters.period === 'year' && filters.selectedYear === 2025 && filters.compareYear === 2024) return 'current-year';
    if (filters.period === 'year' && filters.selectedYear === 2024 && filters.compareYear === 2023) return 'last-year';
    if (filters.period === 'quarter' && filters.selectedYear === 2025 && filters.selectedQuarter === 4) return 'current-quarter';
    if (filters.period === 'custom' && filters.customStartDate && filters.customEndDate) {
      const start = new Date(filters.customStartDate);
      const end = new Date(filters.customEndDate);
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 35 && diffDays >= 28) return 'last-30-days';
    }
    return null;
  };

  const activeQuickFilter = getActiveQuickFilter();

  // Stats rapides
  const stats = useMemo(() => {
    const totalEntries = totalData.length;
    const filteredEntries = filteredData.length;
    const filterRate = totalEntries > 0 ? (filteredEntries / totalEntries) * 100 : 0;
    
    return {
      total: totalEntries,
      filtered: filteredEntries,
      rate: filterRate
    };
  }, [totalData, filteredData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Filtres et période
        </h3>
        <div className="flex-1" />
        <div className="text-sm text-gray-500">
          {stats.filtered.toLocaleString('fr-FR')} / {stats.total.toLocaleString('fr-FR')} entrées ({stats.rate.toFixed(1)}%)
        </div>
      </div>

      {/* Filtres rapides style iOS/macOS */}
      <div className="space-y-4">
        {/* Sélection rapide de période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Période d'analyse</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={filter.action}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  activeQuickFilter === filter.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${
                    activeQuickFilter === filter.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {filter.label}
                  </span>
                  {activeQuickFilter === filter.id && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <span className={`text-xs ${
                  activeQuickFilter === filter.id ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {filter.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Options avancées repliables */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Options avancées
          </button>
          
          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              {/* Sélecteur d'année */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année principale
                  </label>
                  <select
                    value={filters.selectedYear}
                    onChange={(e) => setFilters({ selectedYear: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année de comparaison
                  </label>
                  <select
                    value={filters.compareYear || ''}
                    onChange={(e) => setFilters({ 
                      compareYear: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Aucune</option>
                    {availableYears.filter(year => year !== filters.selectedYear).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type de période */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de période
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilters({ 
                        period: option.value as any,
                        selectedMonth: undefined,
                        selectedQuarter: undefined,
                        customStartDate: undefined,
                        customEndDate: undefined
                      })}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        filters.period === option.value
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtres spécifiques selon le type */}
              {filters.period === 'month' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mois
                  </label>
                  <select
                    value={filters.selectedMonth || ''}
                    onChange={(e) => setFilters({ 
                      selectedMonth: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les mois</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(2025, month - 1).toLocaleDateString('fr-FR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {filters.period === 'quarter' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trimestre
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(quarter => (
                      <button
                        key={quarter}
                        onClick={() => setFilters({ selectedQuarter: quarter })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.selectedQuarter === quarter
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        T{quarter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filters.period === 'custom' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={filters.customStartDate || ''}
                      onChange={(e) => setFilters({ customStartDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={filters.customEndDate || ''}
                      onChange={(e) => setFilters({ customEndDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {onExport && (
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              data-export-button
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}