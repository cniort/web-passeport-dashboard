import { Calendar, TrendingUp, Users } from 'lucide-react';
import { DeltaBadge } from './DeltaBadge';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import { formatDecimal } from '@/app/lib/format';

interface SeasonalityCardProps {
  kpis: ComprehensiveKpis;
}

export function SeasonalityCard({ kpis }: SeasonalityCardProps) {
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
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Pleine saison</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 mb-1">
            {formatDecimal(highSeasonPercentage)}%
          </div>
          <div className="text-xs text-orange-700">Juillet & Août</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Hors saison</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-1">
            {formatDecimal(offSeasonPercentage)}%
          </div>
          <div className="text-xs text-blue-700">Reste de l&apos;année</div>
        </div>
      </div>

      {/* Répartition trimestrielle */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Répartition trimestrielle</h4>
        {quarters.map((quarter, index) => {
          const trimesterNames = [
            'T1 : Janvier - Mars',
            'T2 : Avril - Juin', 
            'T3 : Juillet - Septembre',
            'T4 : Octobre - Décembre'
          ];

          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-gray-900">
                  {formatDecimal(quarter.percentage)}%
                </div>
                <div className="text-sm text-gray-600">
                  {trimesterNames[index]}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {quarter.count.toLocaleString('fr-FR')} commandes
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}