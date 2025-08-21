import React, { useState, useMemo } from 'react';
import { MapPin, ChevronDown, ChevronRight, Award } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import type { RawRow } from "@/app/lib/supabase-data";
import { REGION_STATS, getDepartmentFromRelay } from '@/app/config/relay-regions';
import { formatDecimal } from '@/app/lib/format';
import { RelayPointModalV2 } from './RelayPointModalV2';

interface RegionalDistributionV2WithTableModalProps {
  kpis: ComprehensiveKpis;
  rawData?: RawRow[];
  selectedYear?: number;
}

interface DepartmentData {
  code: string;
  name: string;
  count: number;
  percentage: number;
}

interface RegionData {
  code: string;
  name: string;
  count: number;
  percentage: number;
  departments: DepartmentData[];
}

export function RegionalDistributionV2WithTableModal({ kpis, rawData, selectedYear }: RegionalDistributionV2WithTableModalProps) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [showAllRelaysModal, setShowAllRelaysModal] = useState<boolean>(false);

  // Mapping des codes départements vers leurs noms
  const departmentNames: Record<string, string> = {
    "22": "Côtes-d'Armor",
    "29": "Finistère", 
    "35": "Ille-et-Vilaine",
    "56": "Morbihan",
    "44": "Loire-Atlantique",
    "85": "Vendée",
    "17": "Charente-Maritime",
    "33": "Gironde",
    "40": "Landes", 
    "64": "Pyrénées-Atlantiques"
  };

  // Calculer les données départementales et le top relay à partir des données brutes
  const { regionsWithDepartments, topRelay, relayCounts, relayPassportCounts, totalYearlyOrders } = useMemo(() => {
    if (!rawData) return { regionsWithDepartments: [], topRelay: null, relayCounts: {}, relayPassportCounts: {}, totalYearlyOrders: 0 };

    // Filtrer les données seulement si une année est sélectionnée
    const currentYearData = selectedYear ? rawData.filter(row => {
      const orderDate = row.orderDate ? new Date(row.orderDate) : null;
      return orderDate && orderDate.getFullYear() === selectedYear;
    }) : rawData; // Si pas d'année sélectionnée = toutes les données

    const totalYearlyOrders = kpis.totalOrders;

    // Calculer les données par département (basé sur les points relais)
    const departmentCounts: Record<string, number> = {};
    
    // Calculer aussi le top point relais avec le nombre de passeports
    const relayCounts: Record<string, number> = {};
    const relayPassportCounts: Record<string, number> = {};
    
    currentYearData.forEach(row => {
      if (row.relay) {
        const department = getDepartmentFromRelay(row.relay);
        if (department) {
          departmentCounts[department] = (departmentCounts[department] || 0) + 1;
        }
        
        // Compter aussi par point relais (commandes)
        relayCounts[row.relay] = (relayCounts[row.relay] || 0) + 1;
        
        // Compter les passeports par point relais
        const passportCount = row.passports || 0;
        relayPassportCounts[row.relay] = (relayPassportCounts[row.relay] || 0) + passportCount;
      }
    });

    // Trouver le point relais avec le plus de commandes
    let topRelayData = null;
    if (Object.keys(relayCounts).length > 0) {
      const topRelayEntry = Object.entries(relayCounts).reduce((max, [relay, count]) => 
        count > max.count ? { relay, count } : max, 
        { relay: '', count: 0 }
      );
      
      const topRelayPercentage = totalYearlyOrders > 0 ? (topRelayEntry.count / totalYearlyOrders) * 100 : 0;
      const topRelayPassports = relayPassportCounts[topRelayEntry.relay] || 0;
      
      topRelayData = {
        name: topRelayEntry.relay,
        count: topRelayEntry.count,
        percentage: topRelayPercentage,
        passports: topRelayPassports
      };
    }

    // Définir l'ordre nord-sud pour les régions et départements
    const regionOrder = [
      { code: 'BZH', name: 'Bretagne', departments: ['29', '22', '56', '35'] }, // Nord à Sud-Est
      { code: 'PDL', name: 'Pays de la Loire', departments: ['44', '85'] }, // Nord à Sud  
      { code: 'NAQ', name: 'Nouvelle-Aquitaine', departments: ['17', '33', '40', '64'] } // Nord à Sud
    ];

    const regions: RegionData[] = [];
    
    regionOrder.forEach(regionInfo => {
      const regionDepartments: DepartmentData[] = [];

      // Suivre l'ordre prédéfini pour les départements (nord à sud)
      regionInfo.departments.forEach(deptCode => {
        const count = departmentCounts[deptCode] || 0;
        const percentage = totalYearlyOrders > 0 ? (count / totalYearlyOrders) * 100 : 0;

        regionDepartments.push({
          code: deptCode,
          name: departmentNames[deptCode] || `Département ${deptCode}`,
          count,
          percentage
        });
      });

      // Utiliser les données des KPIs pour le total régional (plus fiable)
      const actualRegionCount = kpis.regionalDistribution[regionInfo.code as keyof typeof kpis.regionalDistribution] || 0;
      const regionPercentage = kpis.regionalPercentages?.[regionInfo.code as keyof typeof kpis.regionalPercentages] || 0;

      regions.push({
        code: regionInfo.code,
        name: regionInfo.name,
        count: actualRegionCount,
        percentage: regionPercentage,
        departments: regionDepartments // Conserver l'ordre nord-sud
      });
    });

    return { 
      regionsWithDepartments: regions, 
      topRelay: topRelayData, 
      relayCounts,
      relayPassportCounts,
      totalYearlyOrders
    }; // Conserver l'ordre nord-sud
  }, [rawData, selectedYear, kpis, departmentNames]);

  const toggleRegion = (regionCode: string) => {
    setExpandedRegion(expandedRegion === regionCode ? null : regionCode);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <MapPin className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Répartition géographique
        </h3>
      </div>

      {/* KPI Point relais top */}
      {topRelay && (
        <div className="mb-8">
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">Point relais n°1</span>
            </div>
            <div className="text-2xl font-bold text-amber-900 mb-1">
              {topRelay.name}
            </div>
            <div className="text-xs text-amber-700">
              {formatDecimal(topRelay.percentage)}% ｜ {topRelay.count.toLocaleString('fr-FR')} commandes ｜ {topRelay.passports.toLocaleString('fr-FR')} passeports
            </div>
          </div>
          
          {/* Bouton pour voir tous les points relais */}
          <div className="mt-3">
            <div 
              onClick={() => setShowAllRelaysModal(true)}
              className="flex items-center justify-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                <span className="text-sm font-medium text-gray-700">
                  Voir l&apos;intégralité des points relais ({Object.keys(relayCounts).length})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Titre pour la répartition régionale */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Répartition régionale</h4>

      <div className="space-y-2">
        {regionsWithDepartments.map((region) => {
          const isExpanded = expandedRegion === region.code;

          return (
            <div key={region.code} className="space-y-2">
              {/* Cellule régionale cliquable */}
              <div 
                onClick={() => toggleRegion(region.code)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                    <span className="font-bold text-gray-900">{region.name}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">{formatDecimal(region.percentage)}%</span>
                  <span>{region.count.toLocaleString('fr-FR')} commandes</span>
                </div>
              </div>

              {/* Section intercalée pour le détail départemental */}
              {isExpanded && (
                <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-2 pb-2">
                  {region.departments.map((department) => (
                    <div key={department.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{department.code} - {department.name}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="text-blue-600 font-semibold">{formatDecimal(department.percentage)}%</span>
                        <span>{department.count.toLocaleString('fr-FR')} commandes</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal pour tous les points relais V2 avec tableau */}
      <RelayPointModalV2
        isOpen={showAllRelaysModal}
        onClose={() => setShowAllRelaysModal(false)}
        relayCounts={relayCounts}
        relayPassportCounts={relayPassportCounts}
        totalYearlyOrders={totalYearlyOrders}
      />
    </div>
  );
}