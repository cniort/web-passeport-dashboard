"use client";

import React, { useEffect, useState } from "react";
import { useDashboardState } from "@/app/hooks/useDashboardState";
import { useCache } from "@/app/hooks/useCache";
import { fetchSupabaseResponses, type RawRow } from "@/app/lib/supabase-data";
import { computeComprehensiveKpis, type ComprehensiveKpis } from "@/app/lib/comprehensive-kpis";
import PrototypeFilterSection from "@/app/components/PrototypeFilterSection";
import ShareButton from "@/app/components/ShareButton";
import { DashboardSkeleton } from "@/app/components/SkeletonLoaders";
import { SeasonalityCardTest } from "@/app/components/SeasonalityCard.test";
import { RegionalDistributionV2 } from "@/app/components/RegionalDistributionV2";
import { ClienteleCard } from "@/app/components/ClienteleCard";
import { MainKpisCard } from "@/app/components/MainKpisCard";
import { BehaviorCard } from "@/app/components/BehaviorCard";

const AVAILABLE_YEARS = [2025, 2024, 2023] as const;

export default function PrototypeDashboard() {
  const { filters, setFilters } = useDashboardState();
  const [filteredData, setFilteredData] = useState<RawRow[]>([]);

  // Cache des données Supabase
  const { 
    data: rawData, 
    loading: dataLoading, 
    error: dataError 
  } = useCache(
    () => fetchSupabaseResponses(),
    [],
    { ttl: 5 * 60 * 1000, key: "supabase_data" }
  );

  // Calcul des KPIs complets
  const [kpis, setKpis] = useState<ComprehensiveKpis | null>(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  useEffect(() => {
    if (rawData && !dataLoading) {
      setKpisLoading(true);
      try {
        // Si les filtres sont désactivés ou selectedYear est undefined, afficher TOUTES les données
        if (!filters.filtersEnabled || !filters.selectedYear) {
          const comprehensiveKpis = computeComprehensiveKpis(rawData); // Pas de filtre d'année
          setKpis(comprehensiveKpis);
          setFilteredData(rawData); // Toutes les données
        } else {
          const comprehensiveKpis = computeComprehensiveKpis(rawData, filters.selectedYear, filters.compareYear);
          setKpis(comprehensiveKpis);
          
          // Filtrer les données selon les filtres actuels
          const filtered = rawData.filter((row) => {
            const d = row.orderDate ? new Date(row.orderDate) : null;
            if (!d) return false;
            
            // Mode plage personnalisée
            if (filters.period === "custom") {
              if (filters.customStartDate && filters.customEndDate) {
                const startDate = new Date(filters.customStartDate);
                const endDate = new Date(filters.customEndDate);
                endDate.setHours(23, 59, 59, 999);
                return d >= startDate && d <= endDate;
              }
              return true;
            }
            
            // Filtres classiques par année
            const year = d.getFullYear();
            if (year !== filters.selectedYear) return false;
            
            if (filters.period === "month" && filters.selectedMonth) {
              return d.getMonth() + 1 === filters.selectedMonth;
            }
            
            if (filters.period === "quarter" && filters.selectedQuarter) {
              const quarter = Math.floor(d.getMonth() / 3) + 1;
              return quarter === filters.selectedQuarter;
            }
            
            return true;
          });
          
          setFilteredData(filtered);
        }
      } catch (error) {
        console.error("Erreur lors du calcul des KPIs:", error);
      } finally {
        setKpisLoading(false);
      }
    }
  }, [rawData, filters, dataLoading]);

  if (dataLoading || kpisLoading || !kpis) {
    return <DashboardSkeleton />;
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 sm:p-10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">
            Erreur de chargement
          </h1>
          <p className="text-slate-600">
            Impossible de charger les données. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-content" className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header avec titre et partage */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard – Opération Passeport
            </h1>
            <p className="text-sm text-orange-600 font-medium mt-1">
              🧪 Version Prototype - Zone filtres améliorée
            </p>
          </div>
          
          <ShareButton />
        </header>

        {/* Section des filtres prototype */}
        <PrototypeFilterSection 
          filters={filters}
          setFilters={setFilters}
          availableYears={Array.from(AVAILABLE_YEARS)}
          filteredData={filteredData}
          totalData={rawData || []}
        />

        {/* KPIs principaux combinés */}
        <section>
          <MainKpisCard 
            kpis={kpis} 
            selectedYear={filters.selectedYear}
            compareYear={filters.compareYear}
          />
        </section>

        {/* Section saisonnalité et répartition géographique */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          <SeasonalityCardTest kpis={kpis} rawData={rawData} selectedYear={filters.selectedYear} />
          <RegionalDistributionV2 kpis={kpis} rawData={rawData} selectedYear={filters.selectedYear} />
        </section>

        {/* Section clientèles et comportements */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          <ClienteleCard kpis={kpis} rawData={rawData} selectedYear={filters.selectedYear} />
          <BehaviorCard kpis={kpis} rawData={rawData} selectedYear={filters.selectedYear} />
        </section>
      </div>
    </div>
  );
}