import React from 'react';
import { Package, ShoppingCart, BarChart3, CheckCircle, Stamp } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import { formatDecimal } from '@/app/lib/format';

interface MainKpisV2CardProps {
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

export function MainKpisV2Card({ kpis, selectedYear, compareYear }: MainKpisV2CardProps) {
  // Calculs pour les nouveaux KPIs
  const avgStampsPerPassport = 10; // Moyenne de coups de tampon par passeport
  const totalStampsEstimated = kpis.passportsOrdered * avgStampsPerPassport;

  // Préparer les données des 4 KPIs principaux réorganisés
  const kpisData: KpiData[] = [
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
      title: 'Estimation coups de tampon',
      icon: Stamp,
      currentValue: totalStampsEstimated,
      currentYear: selectedYear,
      compareValue: kpis.comparison?.totalOrders ? kpis.comparison.totalOrders * avgStampsPerPassport : undefined,
      compareYear: compareYear,
      format: 'count'
    },
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
      title: 'Moy. coups de tampon',
      icon: CheckCircle,
      currentValue: avgStampsPerPassport,
      currentYear: selectedYear,
      compareValue: avgStampsPerPassport, // Valeur fixe pour la comparaison
      compareYear: compareYear,
      format: 'number',
      decimals: 0
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

  // Données pour le graphique donut
  const donutData = [
    { label: '1', value: kpis.ordersWithOnePassport || 0, color: '#3b82f6' },
    { label: '2', value: kpis.ordersWithTwoPassports || 0, color: '#10b981' },
    { label: '3', value: kpis.ordersWithThreePassports || 0, color: '#f59e0b' },
    { label: '4', value: kpis.ordersWithFourPassports || 0, color: '#ef4444' },
    { label: '5+', value: kpis.ordersWithFivePlusPassports || 0, color: '#8b5cf6' }
  ];

  const totalOrders = donutData.reduce((sum, item) => sum + item.value, 0);

  // Calcul des angles pour le donut
  const donutSegments = donutData.map((item, index) => {
    const percentage = totalOrders > 0 ? (item.value / totalOrders) * 100 : 0;
    const startAngle = donutData.slice(0, index).reduce((sum, prev) => {
      const prevPercentage = totalOrders > 0 ? (prev.value / totalOrders) * 100 : 0;
      return sum + (prevPercentage * 3.6);
    }, 0);
    const endAngle = startAngle + (percentage * 3.6);
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle
    };
  });

  // Fonction pour créer un arc SVG
  const createArc = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          KPIs principaux V2
        </h3>
      </div>

      <div className="flex gap-6">
        {/* Grid des 4 KPIs - 2x2 */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {kpisData.map((kpi, index) => {
            const delta = calculateDelta(kpi.currentValue, kpi.compareValue);
            const IconComponent = kpi.icon;
            
            // Mettre en valeur les KPIs des passeports (indices 2 et 3)
            const isHighlighted = index >= 2;
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
                <div className={`text-2xl font-bold ${valueColor} mb-3`}>
                  {formatValue(kpi.currentValue, kpi.format, kpi.decimals)}
                </div>
                
                {/* Comparaison avec année précédente - ne pas afficher pour moy. coups de tampon */}
                {delta && kpi.compareYear && kpi.title !== 'Moy. coups de tampon' && (
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
                    <span className="text-xs text-gray-500">vs {kpi.compareYear}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Graphique donut et moyenne passeports/commande */}
        <div className="w-80 flex flex-col items-center justify-center">
          {/* Titre du graphique - style identique à "Saisonnalité et répartition trimestrielle" */}
          <div className="flex items-center gap-3 mb-6 w-full justify-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Répartition des passeports par commande
            </h3>
          </div>
          
          {/* Graphique donut */}
          <div className="relative mb-4">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {donutSegments.map((segment, index) => (
                <path
                  key={index}
                  d={createArc(100, 100, 80, segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              {/* Cercle intérieur */}
              <circle
                cx="100"
                cy="100"
                r="40"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              {/* Texte central */}
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="text-sm font-medium fill-gray-900"
              >
                {totalOrders.toLocaleString('fr-FR')}
              </text>
              <text
                x="100"
                y="110"
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                commandes
              </text>
            </svg>
          </div>

          {/* Légende du donut */}
          <div className="space-y-3 mb-6">
            {donutSegments.filter(segment => segment.value > 0).map((segment, index) => (
              <div key={index} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {segment.label} passeport{(segment.label !== '1' && segment.label !== '5+') ? 's' : (segment.label === '5+' ? 's et +' : '')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {segment.value.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDecimal(segment.percentage)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Moyenne passeports par commande */}
          <div className="bg-purple-50 rounded-lg p-4 text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                Moy. passeports/commande
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {formatDecimal(kpis.avgPassportsPerOrder, 2)}
            </div>
            {kpis.comparison?.avgPassportsPerOrder && compareYear && (
              <div className="mt-2">
                {(() => {
                  const delta = calculateDelta(kpis.avgPassportsPerOrder, kpis.comparison.avgPassportsPerOrder);
                  return delta ? (
                    <div className="flex items-center justify-center gap-2">
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
                      <span className="text-xs text-gray-500">vs {compareYear}</span>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}