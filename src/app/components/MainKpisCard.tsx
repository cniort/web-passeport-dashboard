import React from 'react';
import { Package, ShoppingCart, BarChart3, CheckCircle } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import { formatDecimal } from '@/app/lib/format';
import { PassportDistributionDonut } from '@/app/components/PassportDistributionDonut';

interface MainKpisCardProps {
  kpis: ComprehensiveKpis;
  selectedYear: number;
  compareYear?: number;
}

interface KpiData {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  currentValue: number | string;
  currentYear: number;
  compareValue?: number | string;
  compareYear?: number;
  format?: 'number' | 'count';
  decimals?: number;
  subtitle?: string;
}

export function MainKpisCard({ kpis, selectedYear, compareYear }: MainKpisCardProps) {
  // Préparer les données des 2 KPIs principaux
  const kpisData: KpiData[] = [
    {
      title: 'Passeports retirés',
      icon: Package,
      currentValue: kpis.passportsOrdered,
      currentYear: selectedYear,
      compareValue: kpis.comparison?.passportsOrdered,
      compareYear: compareYear,
      format: 'count',
      subtitle: `${kpis.totalOrders.toLocaleString('fr-FR')} commande${kpis.totalOrders <= 1 ? '' : 's'}`
    },
    {
      title: 'Estimation tampons collectionnés',
      icon: CheckCircle,
      currentValue: kpis.totalStamps,
      currentYear: selectedYear,
      compareValue: kpis.comparison?.totalStamps,
      compareYear: compareYear,
      format: 'count',
      subtitle: '10 tampons en moyenne par passeport'
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

      <div className="flex gap-4">
        {/* Section gauche : KPIs (50% de largeur) */}
        <div className="w-1/2 grid grid-cols-1 gap-4">
        {kpisData.map((kpi, index) => {
          const delta = calculateDelta(kpi.currentValue, kpi.compareValue);
          const IconComponent = kpi.icon;
          
          // Mettre en valeur seulement le premier KPI (Passeports en circulation) - style "Hors saison"
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
                
                {/* Valeur principale avec comparaison à droite */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`text-2xl font-bold ${valueColor}`}>
                    {formatValue(kpi.currentValue, kpi.format, kpi.decimals)}
                  </div>
                  
                  {/* Comparaison avec année précédente */}
                  {delta && kpi.compareYear && (
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
                          <span>+{formatDecimal(delta.percentage)}%</span>
                        ) : (
                          <span>-{formatDecimal(delta.percentage)}%</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{typeof kpi.compareValue === 'number' ? kpi.compareValue.toLocaleString('fr-FR') : kpi.compareValue} en {kpi.compareYear}</span>
                    </div>
                  )}
                </div>
                
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

        {/* Section droite : Graphique donut (50% de largeur) */}
        <div className="w-1/2 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-medium text-gray-900">
              Nombre de passeports par commande
            </h4>
          </div>
          <PassportDistributionDonut kpis={kpis} />
        </div>
      </div>
    </div>
  );
}