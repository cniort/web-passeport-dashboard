"use client";

import React, { useEffect, useState } from "react";

// Hooks
import { useDashboardState } from "@/app/hooks/useDashboardState";
import { useCache } from "@/app/hooks/useCache";

// Types et fonctions
import { fetchSupabaseResponses, type RawRow } from "@/app/lib/supabase-data";
import { computeComprehensiveKpis, type ComprehensiveKpis } from "@/app/lib/comprehensive-kpis";

// Composants
import PrototypeFilterSection from "@/app/components/PrototypeFilterSection";
import ExportButton from "@/app/components/ExportButton";
import ShareButton from "@/app/components/ShareButton";
import DownloadButton from "@/app/components/DownloadButton";
import { DashboardSkeleton } from "@/app/components/SkeletonLoaders";
import { SeasonalityCardTest } from "@/app/components/SeasonalityCard.test";
import { RegionalDistributionV2 } from "@/app/components/RegionalDistributionV2";
import { ClienteleCard } from "@/app/components/ClienteleCard";
import { MainKpisCard } from "@/app/components/MainKpisCard";
import { BehaviorCard } from "@/app/components/BehaviorCard";
import { NewsletterCard } from "@/app/components/NewsletterCard";

const AVAILABLE_YEARS = [2025, 2024, 2023] as const;

export default function DashboardContent() {
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
        // Filtrer les données selon les filtres actuels
        const filtered = rawData.filter((row) => {
          const d = row.orderDate ? new Date(row.orderDate) : null;
          if (!d) return false;
          
          // Si les filtres sont désactivés, inclure toutes les données
          if (filters.filtersEnabled === false) {
            return true;
          }
          
          // Mode plage personnalisée
          if (filters.period === "custom") {
            if (filters.customStartDate && filters.customEndDate) {
              const startDate = new Date(filters.customStartDate);
              const endDate = new Date(filters.customEndDate);
              endDate.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
              return d >= startDate && d <= endDate;
            }
            return true;
          }
          
          // Filtres classiques par année (seulement si une année est sélectionnée)
          if (filters.selectedYear !== undefined) {
            const year = d.getFullYear();
            if (year !== filters.selectedYear) return false;
            
            if (filters.period === "month" && filters.selectedMonth) {
              return d.getMonth() + 1 === filters.selectedMonth;
            }
            
            if (filters.period === "quarter" && filters.selectedQuarter) {
              const quarter = Math.floor(d.getMonth() / 3) + 1;
              return quarter === filters.selectedQuarter;
            }
          }
          
          return true;
        });
        
        setFilteredData(filtered);
        
        // Calculer les KPIs sur les données filtrées
        console.log('🔍 DashboardContent filters:', {
          selectedYear: filters.selectedYear,
          compareYear: filters.compareYear,
          filtersEnabled: filters.filtersEnabled
        });
        const comprehensiveKpis = computeComprehensiveKpis(filtered, filters.selectedYear, filters.compareYear);
        setKpis(comprehensiveKpis);
        
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
        {/* Header avec titre et export */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard – Opération Passeport
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Version stable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')} {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DownloadButton filters={filters} kpis={kpis} rawData={rawData} />
            <ShareButton />
          </div>
        </header>

        {/* Section des filtres */}
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
            selectedYear={filters.selectedYear || new Date().getFullYear()}
            compareYear={filters.compareYear}
          />
        </section>


        {/* Section saisonnalité et répartition géographique */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          {/* Nouvelle card saisonnalité et répartition trimestrielle */}
          <SeasonalityCardTest kpis={kpis} rawData={filteredData} selectedYear={filters.selectedYear} />
          
          {/* Nouvelle card répartition géographique V2 */}
          <RegionalDistributionV2 kpis={kpis} rawData={filteredData} selectedYear={filters.selectedYear} />
        </section>

        {/* Section clientèles et comportements */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
          <ClienteleCard kpis={kpis} rawData={filteredData} selectedYear={filters.selectedYear} />
          <BehaviorCard kpis={kpis} rawData={filteredData} selectedYear={filters.selectedYear} />
        </section>

        {/* Section Newsletter */}
        <section>
          <NewsletterCard kpis={kpis} selectedYear={filters.selectedYear} />
        </section>

      </div>
    </div>
  );
}