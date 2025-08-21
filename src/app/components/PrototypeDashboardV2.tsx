"use client";

import React, { useEffect, useState } from "react";
import { useDashboardState } from "@/app/hooks/useDashboardState";
import { useCache } from "@/app/hooks/useCache";
import { fetchSupabaseResponses, type RawRow } from "@/app/lib/supabase-data";
import { computeComprehensiveKpis, type ComprehensiveKpis } from "@/app/lib/comprehensive-kpis";
import PrototypeFilterSection from "@/app/components/PrototypeFilterSection";
import ShareButton from "@/app/components/ShareButton";
import { DashboardSkeleton } from "@/app/components/SkeletonLoaders";
import { RegionalDistributionV2WithTableModal } from "@/app/components/RegionalDistributionV2WithTableModal";
import { ClienteleCard } from "@/app/components/ClienteleCard";
import { MainKpisCard } from "@/app/components/MainKpisCard";
import { BehaviorCard } from "@/app/components/BehaviorCard";

const AVAILABLE_YEARS = [2025, 2024, 2023] as const;

export default function PrototypeDashboardV2() {
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
          
          // Filtrer les données par année sélectionnée
          const currentYearData = rawData.filter(row => {
            const orderDate = row.orderDate ? new Date(row.orderDate) : null;
            return orderDate && orderDate.getFullYear() === filters.selectedYear;
          });
          setFilteredData(currentYearData);
        }
      } catch (error) {
        console.error('Erreur lors du calcul des KPIs:', error);
        setKpis(null);
        setFilteredData([]);
      } finally {
        setKpisLoading(false);
      }
    }
  }, [rawData, dataLoading, filters.selectedYear, filters.compareYear, filters.filtersEnabled]);

  const loading = dataLoading || kpisLoading;
  const hasError = dataError || (!loading && !kpis);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">Impossible de charger les données du dashboard.</p>
          {dataError && (
            <p className="text-sm text-red-600 mt-2">
              Détails: {dataError.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header avec titre et bouton de partage */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Opération Passeport V2
            </h1>
            <p className="text-gray-600 mt-2">
              Tableau de bord analytique des commandes de passeports
            </p>
          </div>
          <ShareButton />
        </div>

        {/* Section des filtres */}
        <PrototypeFilterSection 
          filters={filters}
          onFiltersChange={setFilters}
          availableYears={AVAILABLE_YEARS}
        />

        {/* Grille des composants */}
        <div className="grid gap-8">
          {/* KPIs principaux */}
          <MainKpisCard 
            kpis={kpis!}
            showComparison={filters.filtersEnabled}
          />

          {/* Répartition géographique avec modal V2 */}
          <RegionalDistributionV2WithTableModal 
            kpis={kpis!}
            rawData={filteredData}
            selectedYear={filters.filtersEnabled ? filters.selectedYear : undefined}
          />

          {/* Clientèle */}
          <ClienteleCard 
            kpis={kpis!}
            rawData={filteredData}
            selectedYear={filters.filtersEnabled ? filters.selectedYear : undefined}
          />

          {/* Comportement d'achat */}
          <BehaviorCard 
            kpis={kpis!}
          />
        </div>
      </div>
    </div>
  );
}