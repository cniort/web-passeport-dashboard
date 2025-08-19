"use client";

import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, BarChart3, MapPin } from "lucide-react";

// Hooks
import { useDashboardState } from "@/app/hooks/useDashboardState";
import { useCache } from "@/app/hooks/useCache";

// Types et fonctions
import { fetchSupabaseResponses, type RawRow } from "@/app/lib/supabase-data";
import { computeComprehensiveKpis, type ComprehensiveKpis } from "@/app/lib/comprehensive-kpis";

// Composants
import FilterSection from "@/app/components/FilterSection";
import ComparisonCard from "@/app/components/ComparisonCard";
import DataTable from "@/app/components/DataTable";
import ExportButton from "@/app/components/ExportButton";
import { DashboardSkeleton } from "@/app/components/SkeletonLoaders";

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
        const comprehensiveKpis = computeComprehensiveKpis(rawData, filters.selectedYear, filters.compareYear);
        setKpis(comprehensiveKpis);
        
        // Filtrer les données pour le tableau selon les filtres actuels
        const filtered = rawData.filter((row) => {
          const d = row.orderDate ? new Date(row.orderDate) : null;
          if (!d) return false;
          
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
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header avec titre et export */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard – Opération Passeport
          </h1>
          
          <ExportButton
            data={filteredData}
            kpis={kpis}
            fileName={`dashboard-${filters.selectedYear}-${filters.period}`}
          />
        </header>

        {/* Section des filtres */}
        <FilterSection 
          filters={filters}
          setFilters={setFilters}
          availableYears={Array.from(AVAILABLE_YEARS)}
        />

        {/* KPIs principaux avec comparaison */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ComparisonCard
            title="Commandes totales"
            icon={ShoppingCart}
            currentValue={kpis.totalOrders}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.totalOrders}
            compareYear={filters.compareYear}
          />

          <ComparisonCard
            title="Passeports commandés"
            icon={Package}
            currentValue={kpis.passportsOrdered}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.passportsOrdered}
            compareYear={filters.compareYear}
          />

          <ComparisonCard
            title="Moy. passeports/commande"
            icon={BarChart3}
            currentValue={kpis.avgPassportsPerOrder}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.avgPassportsPerOrder}
            compareYear={filters.compareYear}
            format="number"
            decimals={2}
          />

          <ComparisonCard
            title="Coups de tampon totaux"
            icon={BarChart3}
            currentValue={kpis.totalStamps}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.totalStamps}
            compareYear={filters.compareYear}
          />
        </section>

        {/* KPIs tampons */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
          <ComparisonCard
            title="Moy. tampons/passeport"
            icon={Package}
            currentValue={kpis.avgStampsPerPassport}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.avgStampsPerPassport}
            compareYear={filters.compareYear}
            format="number"
          />

          <ComparisonCard
            title="Points relais actifs"
            icon={MapPin}
            currentValue={kpis.activeRelayPoints}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.activeRelayPoints}
            compareYear={filters.compareYear}
            subtitle={`${kpis.relayOrdersPercentage.toFixed(1)}% des commandes`}
          />

          <ComparisonCard
            title="Tampons uniques"
            icon={MapPin}
            currentValue={kpis.uniqueStamps}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.uniqueStamps}
            compareYear={filters.compareYear}
          />

          <ComparisonCard
            title="Clientèle française"
            icon={MapPin}
            currentValue={kpis.frenchClientele}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.frenchClientele}
            compareYear={filters.compareYear}
            format="percentage"
          />
        </section>

        {/* KPIs géographiques */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
          <ComparisonCard
            title="Région Bretagne"
            icon={MapPin}
            currentValue={kpis.regionalDistribution.BZH}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.regionalDistribution.BZH}
            compareYear={filters.compareYear}
            subtitle="BZH"
          />

          <ComparisonCard
            title="Région Pays de Loire"
            icon={MapPin}
            currentValue={kpis.regionalDistribution.PDL}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.regionalDistribution.PDL}
            compareYear={filters.compareYear}
            subtitle="PDL"
          />

          <ComparisonCard
            title="Région Nouvelle-Aquitaine"
            icon={MapPin}
            currentValue={kpis.regionalDistribution.NAQ}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.regionalDistribution.NAQ}
            compareYear={filters.compareYear}
            subtitle="NAQ"
          />

          <ComparisonCard
            title="Point relais top"
            icon={MapPin}
            currentValue={kpis.mostSolicitedRelay.passportCount}
            currentYear={filters.selectedYear}
            compareValue={kpis.comparison?.mostSolicitedRelay.passportCount}
            compareYear={filters.compareYear}
            subtitle={kpis.mostSolicitedRelay.name.split(' ').slice(0, 3).join(' ')}
          />
        </section>

        {/* Section répartition trimestrielle */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Répartition trimestrielle {filters.selectedYear}
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{kpis.quarterlyDistribution.Q1}</div>
                <div className="text-sm text-slate-600">T1 (Jan-Mar)</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{kpis.quarterlyDistribution.Q2}</div>
                <div className="text-sm text-slate-600">T2 (Avr-Jun)</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{kpis.quarterlyDistribution.Q3}</div>
                <div className="text-sm text-slate-600">T3 (Jul-Sep)</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{kpis.quarterlyDistribution.Q4}</div>
                <div className="text-sm text-slate-600">T4 (Oct-Déc)</div>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs comportementaux et saisonniers */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Comportements de commande
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Jour le plus fréquent</span>
                <span className="font-bold text-blue-600">
                  {kpis.mostFrequentOrderDay.dayName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Heure la plus fréquente</span>
                <span className="font-bold text-blue-600">
                  {kpis.mostFrequentOrderHour.hour}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Mois le plus actif</span>
                <span className="font-bold text-blue-600">
                  {kpis.mostActiveMonth.monthName}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-600" />
              Saisonnalité
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Pleine saison (Jul-Aoû)</span>
                <span className="font-bold text-blue-600">
                  {kpis.highSeasonPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Hors saison</span>
                <span className="font-bold text-slate-600">
                  {kpis.offSeasonPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Passeports été</span>
                <span className="font-bold text-slate-800">
                  {kpis.highSeasonPassports.toLocaleString("fr-FR")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-600" />
              Clientèles étrangères
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Espagne (ES)</span>
                <span className="font-bold text-slate-800">
                  {kpis.foreignClientele.ES.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Allemagne (DE)</span>
                <span className="font-bold text-slate-800">
                  {kpis.foreignClientele.DE.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Royaume-Uni (UK)</span>
                <span className="font-bold text-slate-800">
                  {kpis.foreignClientele.UK.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Belgique (BE)</span>
                <span className="font-bold text-slate-800">
                  {kpis.foreignClientele.BE.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </section>


        {/* Tableau de données détaillées */}
        <section>
          <DataTable
            data={filteredData}
            title={`Données détaillées (${filteredData.length} entrées)`}
            maxRows={50}
          />
        </section>
      </div>
    </div>
  );
}