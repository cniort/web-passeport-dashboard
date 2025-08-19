"use client";

import { useState } from "react";

export type FilterPeriod = "year" | "month" | "quarter";

export interface DashboardFilters {
  selectedYear: number;
  selectedMonth?: number;
  selectedQuarter?: number;
  period: FilterPeriod;
  compareYear?: number;
}

export interface DashboardState {
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: DashboardFilters = {
  selectedYear: 2025,
  period: "year",
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