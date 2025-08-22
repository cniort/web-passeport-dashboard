"use client";

import { useState } from "react";

export type FilterPeriod = "year" | "month" | "quarter" | "custom";

export interface DashboardFilters {
  selectedYear?: number; // Optionnel pour permettre "toutes les années"
  selectedMonth?: number;
  selectedQuarter?: number;
  period: FilterPeriod;
  compareYear?: number;
  customStartDate?: string;
  customEndDate?: string;
  filtersEnabled: boolean; // Nouveau champ pour activer/désactiver les filtres
}

export interface DashboardState {
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: DashboardFilters = {
  selectedYear: new Date().getFullYear(), // Par défaut : année en cours
  period: "year",
  filtersEnabled: true, // Activer les filtres par défaut avec l'année en cours
};

export function useDashboardState(): DashboardState {
  const [filters, setFiltersState] = useState<DashboardFilters>(defaultFilters);

  const setFilters = (newFilters: Partial<DashboardFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  return {
    filters,
    setFilters,
    resetFilters,
  };
}