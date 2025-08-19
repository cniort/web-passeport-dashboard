import React from 'react';
import { Package, ShoppingCart, BarChart3, CheckCircle } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import { formatDecimal } from '@/app/lib/format';

interface MainKpisCardProps {
  kpis: ComprehensiveKpis;
  selectedYear: number;
  compareYear?: number;
}

interface KpiData {
  title: string;
  icon: React.ComponentType<any>;
  currentValue: number | string;
  currentYear: number;
  compareValue?: number | string;
  compareYear?: number;
  format?: 'number' | 'count';
  decimals?: number;
  subtitle?: string;
}

export function MainKpisCard({ kpis, selectedYear, compareYear }: MainKpisCardProps) {
  // Préparer les données des 4 KPIs principaux
  const kpisData: KpiData[] = [
    {
      title: 'Passeports commandés',
      icon: Package,
      currentValue: kpis.passportsOrdered,
      currentYear: selectedYear,
      compareValue: kpis.comparison?.passportsOrdered,
      compareYear: compareYear,
      format: 'count'
    },
    {
      title: 'Commandes totales',
      icon: ShoppingCart,
      currentValue: kpis.totalOrders,
      currentYear: selectedYear,
      compareValue: kpis.comparison?.totalOrders,
      compareYear: compareYear,
      format: 'count'
    },
    {
      title: 'Moy. passeports/commande',
      icon: BarChart3,
      currentValue: kpis.avgPassportsPerOrder,
      currentYear: selectedYear,
      compareValue: kpis.comparison?.avgPassportsPerOrder,
      compareYear: compareYear,
      format: 'number',
      decimals: 2
    },
    {
      title: 'Estimation coups de tampon',
      icon: CheckCircle,
      currentValue: kpis.totalStamps,
      currentYear: selectedYear,
      compareValue: kpis.comparison?.totalStamps,
      compareYear: compareYear,
      format: 'count'
    }
  ];

  const formatValue = (value: number | string, format?: string, decimals?: number): string => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'number':
        return formatDecimal(value, decimals || 1);
      case 'count':
      default:
        return value.toLocaleString('fr-FR');
    }
  };

  const calculateDelta = (current: number | string, compare?: number | string): { 
    percentage: number; 
    isPositive: boolean; 
    isNeutral: boolean 
  } | null => {
    if (!compare || typeof current === 'string' || typeof compare === 'string') return null;
    
    const delta = ((current - compare) / compare) * 100;
    return {
      percentage: Math.abs(delta),
      isPositive: delta > 0,
      isNeutral: Math.abs(delta) < 0.1
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          KPIs principaux
        </h3>
      </div>

      {/* Grid des 4 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpisData.map((kpi, index) => {
          const delta = calculateDelta(kpi.currentValue, kpi.compareValue);
          const IconComponent = kpi.icon;
          
          // Mettre en valeur le premier KPI (Passeports commandés) - style "Hors saison"
          const isHighlighted = index === 0;
          const cardClass = isHighlighted 
            ? "bg-blue-50 rounded-lg p-4" 
            : "bg-gray-50 rounded-lg p-4";
          const iconColor = isHighlighted ? "text-blue-600" : "text-blue-600";
          const titleColor = isHighlighted ? "text-blue-900" : "text-gray-900";
          const valueColor = isHighlighted ? "text-blue-900" : "text-blue-900";
          
          return (
            <div key={index} className={cardClass}>
              {/* Header avec icône et titre */}
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className={`w-4 h-4 ${iconColor}`} />
                <span className={`text-sm font-medium ${titleColor}`}>{kpi.title}</span>
              </div>
              
              {/* Valeur principale */}
              <div className={`text-2xl font-bold ${valueColor} mb-1`}>
                {formatValue(kpi.currentValue, kpi.format, kpi.decimals)}
              </div>
              
              {/* Comparaison avec année précédente */}
              {delta && kpi.compareYear && !kpi.subtitle && (
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    delta.isNeutral 
                      ? 'bg-gray-100 text-gray-600'
                      : delta.isPositive 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {delta.isNeutral ? (
                      '='
                    ) : delta.isPositive ? (
                      <span>↗ +{formatDecimal(delta.percentage)}%</span>
                    ) : (
                      <span>↘ -{formatDecimal(delta.percentage)}%</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">vs {kpi.compareYear}</span>
                </div>
              )}
              
              {/* Comparaison avec marge si sous-titre présent */}
              {delta && kpi.compareYear && kpi.subtitle && (
                <div className="flex items-center gap-2 mb-1">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    delta.isNeutral 
                      ? 'bg-gray-100 text-gray-600'
                      : delta.isPositive 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {delta.isNeutral ? (
                      '='
                    ) : delta.isPositive ? (
                      <span>↗ +{formatDecimal(delta.percentage)}%</span>
                    ) : (
                      <span>↘ -{formatDecimal(delta.percentage)}%</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">vs {kpi.compareYear}</span>
                </div>
              )}
              
              {/* Sous-titre si présent */}
              {kpi.subtitle && (
                <div className="text-xs text-gray-600">
                  {kpi.subtitle}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}