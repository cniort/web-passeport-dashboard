import React, { useState, useMemo } from 'react';
import { Calendar, Sun, Leaf, ChevronDown, ChevronRight } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import { fetchSupabaseResponses, type RawRow } from "@/app/lib/supabase-data";
import { formatDecimal } from '@/app/lib/format';

interface SeasonalityCardTestProps {
  kpis: ComprehensiveKpis;
  rawData?: RawRow[];
  selectedYear?: number;
}

interface MonthlyData {
  month: number;
  monthName: string;
  count: number;
  percentage: number;
}

export function SeasonalityCardTest({ kpis, rawData, selectedYear = 2025 }: SeasonalityCardTestProps) {
  const [expandedQuarter, setExpandedQuarter] = useState<number | null>(null);
  
  const highSeasonPercentage = kpis.highSeasonPercentage;
  const offSeasonPercentage = kpis.offSeasonPercentage;
  
  // Restructurer les données trimestrielles pour l'affichage
  const quarters = [
    { 
      percentage: kpis.quarterlyPercentages.Q1, 
      count: kpis.quarterlyDistribution.Q1 
    },
    { 
      percentage: kpis.quarterlyPercentages.Q2, 
      count: kpis.quarterlyDistribution.Q2 
    },
    { 
      percentage: kpis.quarterlyPercentages.Q3, 
      count: kpis.quarterlyDistribution.Q3 
    },
    { 
      percentage: kpis.quarterlyPercentages.Q4, 
      count: kpis.quarterlyDistribution.Q4 
    }
  ];

  // Calculer les vraies données mensuelles à partir des données brutes
  const monthlyDataByQuarter = useMemo(() => {
    if (!rawData) return {}; // Fallback si pas de données brutes

    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Calculer le total de commandes pour l'année pour les pourcentages
    const totalYearlyOrders = kpis.totalOrders;

    // Grouper les données par mois (nombre de commandes)
    const monthlyOrderCounts: { [key: number]: number } = {};
    
    // Filtrer les données pour l'année sélectionnée
    const currentYearData = rawData.filter(row => {
      const orderDate = row.orderDate ? new Date(row.orderDate) : null;
      return orderDate && orderDate.getFullYear() === selectedYear;
    });

    currentYearData.forEach(row => {
      if (row.orderMonth) {
        monthlyOrderCounts[row.orderMonth] = (monthlyOrderCounts[row.orderMonth] || 0) + 1;
      }
    });

    // Organiser par trimestres
    const result: { [quarter: number]: MonthlyData[] } = {};
    
    for (let quarter = 1; quarter <= 4; quarter++) {
      const startMonth = (quarter - 1) * 3 + 1;
      const months: MonthlyData[] = [];
      
      for (let i = 0; i < 3; i++) {
        const month = startMonth + i;
        const count = monthlyOrderCounts[month] || 0;
        const percentage = totalYearlyOrders > 0 ? (count / totalYearlyOrders) * 100 : 0;
        
        months.push({
          month,
          monthName: monthNames[month - 1],
          count,
          percentage
        });
      }
      
      result[quarter] = months;
    }

    return result;
  }, [rawData, kpis.totalOrders]);

  const getMonthlyDataForQuarter = (quarterIndex: number): MonthlyData[] => {
    const quarter = quarterIndex + 1;
    return monthlyDataByQuarter[quarter] || [];
  };

  const toggleQuarter = (quarterIndex: number) => {
    setExpandedQuarter(expandedQuarter === quarterIndex ? null : quarterIndex);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Saisonnalité et répartition trimestrielle
        </h3>
      </div>

      {/* Saisonnalité */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Pleine saison</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 mb-1">
            {formatDecimal(highSeasonPercentage)}%
          </div>
          <div className="text-xs text-orange-700">Juillet & Août</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Hors saison</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-1">
            {formatDecimal(offSeasonPercentage)}%
          </div>
          <div className="text-xs text-blue-700">Reste de l'année</div>
        </div>
      </div>

      {/* Répartition trimestrielle */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Répartition trimestrielle</h4>
        {quarters.map((quarter, index) => {
          const trimesterNames = [
            'Janvier - Mars',
            'Avril - Juin', 
            'Juillet - Septembre',
            'Octobre - Décembre'
          ];
          
          const trimesterLabels = ['T1', 'T2', 'T3', 'T4'];
          const isExpanded = expandedQuarter === index;

          return (
            <div key={index} className="space-y-2">
              {/* Cellule trimestrielle cliquable */}
              <div 
                onClick={() => toggleQuarter(index)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                    <span className="font-bold text-gray-900">{trimesterLabels[index]}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-600">{trimesterNames[index]}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">{formatDecimal(quarter.percentage)}%</span>
                  <span>{quarter.count.toLocaleString('fr-FR')} commandes</span>
                </div>
              </div>

              {/* Section intercalée pour le détail mensuel */}
              {isExpanded && (
                <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-2 pb-2">
                  {getMonthlyDataForQuarter(index).map((monthData) => (
                    <div key={monthData.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{monthData.monthName}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="text-blue-600 font-semibold">{formatDecimal(monthData.percentage)}%</span>
                        <span>{monthData.count.toLocaleString('fr-FR')} commandes</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}