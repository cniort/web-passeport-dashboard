import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';

interface PassportDistributionDonutProps {
  kpis: ComprehensiveKpis;
}

interface DonutSegment {
  label: string;
  value: number;
  percentage: number;
  color: string;
  hoverColor: string;
}

export function PassportDistributionDonut({ kpis }: PassportDistributionDonutProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Préparer les données pour le donut (simplifié en 3 groupes)
  const segments: DonutSegment[] = [
    {
      label: '1 passeport',
      value: kpis.ordersWithOnePassport,
      percentage: 0,
      color: '#3b82f6', // blue-500
      hoverColor: '#2563eb' // blue-600
    },
    {
      label: '2 passeports',
      value: kpis.ordersWithTwoPassports,
      percentage: 0,
      color: '#10b981', // emerald-500
      hoverColor: '#059669' // emerald-600
    },
    {
      label: '3 passeports et plus',
      value: kpis.ordersWithThreePassports + kpis.ordersWithFourPassports + kpis.ordersWithFivePlusPassports,
      percentage: 0,
      color: '#f59e0b', // amber-500
      hoverColor: '#d97706' // amber-600
    }
  ];

  // Calculer les pourcentages
  const totalOrders = segments.reduce((sum, segment) => sum + segment.value, 0);
  segments.forEach(segment => {
    segment.percentage = totalOrders > 0 ? (segment.value / totalOrders) * 100 : 0;
  });

  // Filtrer les segments avec des valeurs > 0
  const activeSegments = segments.filter(segment => segment.value > 0);

  // Calculer les angles pour le SVG
  let currentAngle = 0;
  const segmentsWithAngles = activeSegments.map(segment => {
    const angle = (segment.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    return {
      ...segment,
      startAngle,
      endAngle,
      angle
    };
  });

  // Fonction pour créer le path SVG d'un arc
  const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
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

  const centerX = 115;
  const centerY = 115;
  const radius = 95;
  const innerRadius = 82;

  return (
    <div className="flex items-center justify-between">
      {/* Légende à gauche */}
      <div className="flex flex-col space-y-2">
        {activeSegments.map((segment, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              hoveredSegment === index ? 'bg-gray-100 scale-105' : 'hover:bg-gray-50'
            }`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: hoveredSegment === index ? segment.hoverColor : segment.color,
                  transform: hoveredSegment === index ? 'scale(1.2)' : 'scale(1)'
                }}
              />
              <div className="text-sm font-semibold text-gray-900">
                {segment.label}
              </div>
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="text-blue-600 font-semibold">
                  {segment.percentage.toFixed(1)}%
                </span>
                <span>
                  {segment.value.toLocaleString('fr-FR')} commandes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique donut SVG à droite */}
      <div className="relative">
        <svg width="230" height="230" viewBox="0 0 230 230" className="transform transition-transform duration-300">
          {segmentsWithAngles.map((segment, index) => {
            const outerPath = createArcPath(centerX, centerY, radius, segment.startAngle, segment.endAngle);
            const innerPath = createArcPath(centerX, centerY, innerRadius, segment.startAngle, segment.endAngle);
            
            return (
              <g key={index}>
                {/* Segment principal */}
                <path
                  d={outerPath}
                  fill={hoveredSegment === index ? segment.hoverColor : segment.color}
                  stroke="white"
                  strokeWidth="0.3"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{
                    transform: hoveredSegment === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${centerX}px ${centerY}px`
                  }}
                />
                {/* Trou intérieur */}
                <path
                  d={innerPath}
                  fill="transparent"
                  className="pointer-events-none"
                />
              </g>
            );
          })}
        </svg>

        {/* Centre du donut avec moyenne */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-gray-50 rounded-full w-32 h-32 flex flex-col items-center justify-center">
            <div className="text-xl font-bold text-gray-900">
              {kpis.avgPassportsPerOrder.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-xs text-gray-500 leading-tight">
              passeports<br />par commande
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}