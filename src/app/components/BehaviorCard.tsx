import React, { useMemo } from 'react';
import { Clock, Calendar, Timer, Home } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import type { RawRow } from "@/app/lib/supabase-data";
import { formatDecimal } from '@/app/lib/format';

interface BehaviorCardProps {
  kpis: ComprehensiveKpis;
  rawData?: RawRow[];
  selectedYear?: number;
}

interface BehaviorData {
  averageDaysBetweenOrderAndWithdrawal: number;
  mostPopularOrderMonth: { month: number; monthName: string; count: number };
  mostPopularOrderDay: { day: number; dayName: string; count: number };
  mostPopularOrderHour: { hour: number; count: number };
  sameOrderWithdrawalDayPercentage: number;
  sameOrderWithdrawalDayCount: number;
  topWithdrawalDays: Array<{ day: number; dayName: string; count: number; rank: number }>;
}

export function BehaviorCard({ kpis, rawData, selectedYear = 2025 }: BehaviorCardProps) {
  // Calculer les données comportementales à partir des données brutes
  const behaviorData = useMemo((): BehaviorData => {
    if (!rawData) {
      return {
        averageDaysBetweenOrderAndWithdrawal: 0,
        mostPopularOrderMonth: { month: 1, monthName: 'Janvier', count: 0 },
        mostPopularOrderDay: { day: 0, dayName: 'Dimanche', count: 0 },
        mostPopularOrderHour: { hour: 0, count: 0 },
        sameOrderWithdrawalDayPercentage: 0,
        sameOrderWithdrawalDayCount: 0,
        topWithdrawalDays: []
      };
    }

    // Filtrer les données pour l'année sélectionnée
    const currentYearData = rawData.filter(row => {
      const orderDate = row.orderDate ? new Date(row.orderDate) : null;
      return orderDate && orderDate.getFullYear() === selectedYear;
    });

    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    // 1. Calculer le temps moyen entre commande et retrait
    let totalDays = 0;
    let validPairs = 0;
    
    const monthStats: { [key: number]: number } = {};
    const orderDayStats: { [key: number]: number } = {};
    const orderHourStats: { [key: number]: number } = {};
    const withdrawalDayStats: { [key: number]: number } = {};
    let sameOrderWithdrawalDayCount = 0;

    currentYearData.forEach(row => {
      const orderDate = row.orderDate ? new Date(row.orderDate) : null;
      const withdrawalDate = row.withdrawalDate ? new Date(row.withdrawalDate) : null;

      if (orderDate && withdrawalDate) {
        // Calcul temps entre commande et retrait (en jours calendaires)
        const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        const withdrawalDateOnly = new Date(withdrawalDate.getFullYear(), withdrawalDate.getMonth(), withdrawalDate.getDate());
        const dayDiff = Math.floor((withdrawalDateOnly.getTime() - orderDateOnly.getTime()) / (1000 * 3600 * 24));
        
        if (dayDiff >= 0) {
          totalDays += dayDiff;
          validPairs++;
        }

        // Vérifier si même jour pour commande et retrait (commande au point relais)
        if (dayDiff === 0) {
          sameOrderWithdrawalDayCount++;
        }

        // Stats jour de retrait
        const withdrawalWeekday = withdrawalDate.getDay();
        withdrawalDayStats[withdrawalWeekday] = (withdrawalDayStats[withdrawalWeekday] || 0) + 1;
      }

      if (orderDate) {
        // Stats mois de commande
        const month = orderDate.getMonth() + 1;
        monthStats[month] = (monthStats[month] || 0) + 1;

        // Stats jour de commande
        const weekday = orderDate.getDay();
        orderDayStats[weekday] = (orderDayStats[weekday] || 0) + 1;
      }

      // Stats heure de commande
      if (row.orderHour !== null && row.orderHour !== undefined) {
        orderHourStats[row.orderHour] = (orderHourStats[row.orderHour] || 0) + 1;
      }
    });

    const averageDaysBetweenOrderAndWithdrawal = validPairs > 0 ? totalDays / validPairs : 0;

    // Trouver les stats les plus populaires
    const mostPopularOrderMonth = Object.entries(monthStats).reduce(
      (max, [month, count]) => count > max.count ? { month: parseInt(month), count } : max,
      { month: 1, count: 0 }
    );

    const mostPopularOrderDay = Object.entries(orderDayStats).reduce(
      (max, [day, count]) => count > max.count ? { day: parseInt(day), count } : max,
      { day: 0, count: 0 }
    );

    const mostPopularOrderHour = Object.entries(orderHourStats).reduce(
      (max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max,
      { hour: 0, count: 0 }
    );

    // Créer le podium des 3 jours les plus plébiscités pour les retraits
    const topWithdrawalDays = Object.entries(withdrawalDayStats)
      .map(([day, count]) => ({
        day: parseInt(day),
        dayName: dayNames[parseInt(day)] || 'Inconnu',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));

    const sameOrderWithdrawalDayPercentage = currentYearData.length > 0 
      ? (sameOrderWithdrawalDayCount / currentYearData.length) * 100 
      : 0;

    // Debug: analyser le problème des calculs
    console.log('🔍 Debug Comportements:');
    console.log(`Total commandes ${selectedYear}:`, currentYearData.length);
    console.log('Commandes avec dates valides:', validPairs);
    console.log('Commandes même jour (commande au point relais):', sameOrderWithdrawalDayCount);
    console.log('Pourcentage calculé:', formatDecimal(sameOrderWithdrawalDayPercentage) + '%');
    console.log('Heure la plus fréquente:', mostPopularOrderHour.hour + 'h (' + mostPopularOrderHour.count + ' commandes)');
    console.log('Stats heures (échantillon):', Object.entries(orderHourStats).slice(0, 5));
    
    // Examiner un échantillon de données
    const sample = currentYearData.slice(0, 5).map(row => ({
      orderDate: row.orderDate,
      withdrawalDate: row.withdrawalDate,
      orderHour: row.orderHour,
      sameDay: row.orderDate && row.withdrawalDate ? 
        new Date(row.orderDate).toDateString() === new Date(row.withdrawalDate).toDateString() : 
        'dates manquantes'
    }));
    console.log('Échantillon de données:', sample);

    return {
      averageDaysBetweenOrderAndWithdrawal,
      mostPopularOrderMonth: {
        month: mostPopularOrderMonth.month,
        monthName: monthNames[mostPopularOrderMonth.month - 1] || 'Inconnu',
        count: mostPopularOrderMonth.count
      },
      mostPopularOrderDay: {
        day: mostPopularOrderDay.day,
        dayName: dayNames[mostPopularOrderDay.day] || 'Inconnu',
        count: mostPopularOrderDay.count
      },
      mostPopularOrderHour: {
        hour: mostPopularOrderHour.hour,
        count: mostPopularOrderHour.count
      },
      sameOrderWithdrawalDayPercentage,
      sameOrderWithdrawalDayCount,
      topWithdrawalDays
    };
  }, [rawData, selectedYear]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Clock className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Comportements
        </h3>
      </div>

      {/* Section 1: Comportement de commande */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Comportement de commande</h4>
        
        {/* Ligne 1: Mois, Jour, Heure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Mois le plus plébiscité */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Mois favori</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">
              {behaviorData.mostPopularOrderMonth.monthName}
            </div>
            <div className="text-xs text-green-700">
              {behaviorData.mostPopularOrderMonth.count.toLocaleString('fr-FR')} commandes
            </div>
          </div>

          {/* Jour le plus plébiscité */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Jour favori</span>
            </div>
            <div className="text-2xl font-bold text-orange-900 mb-1">
              {behaviorData.mostPopularOrderDay.dayName}
            </div>
            <div className="text-xs text-orange-700">
              {behaviorData.mostPopularOrderDay.count.toLocaleString('fr-FR')} commandes
            </div>
          </div>

          {/* Heure la plus plébiscitée */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Heure favorite</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">
              {behaviorData.mostPopularOrderHour.hour}h
            </div>
            <div className="text-xs text-purple-700">
              {behaviorData.mostPopularOrderHour.count.toLocaleString('fr-FR')} commandes
            </div>
          </div>
        </div>

        {/* Ligne 2: Délai moyen et Commande au point relais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temps moyen entre commande et retrait */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Délai moy. commande/retrait</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {formatDecimal(behaviorData.averageDaysBetweenOrderAndWithdrawal)}
            </div>
            <div className="text-xs text-blue-700">jours</div>
          </div>

          {/* KPI Commande au point relais */}
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">Commandes au point relais</span>
            </div>
            <div className="text-2xl font-bold text-amber-900 mb-1">
              {formatDecimal(behaviorData.sameOrderWithdrawalDayPercentage)}%
            </div>
            <div className="text-xs text-amber-700">
              {behaviorData.sameOrderWithdrawalDayCount.toLocaleString('fr-FR')} commandes
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Comportement de retrait */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Comportement de retrait</h4>
        
        {/* Podium des 3 jours les plus plébiscités pour retrait */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {behaviorData.topWithdrawalDays.map((dayData) => {
            // Couleurs et styles selon le rang
            const getRankStyle = (rank: number) => {
              switch (rank) {
                case 1:
                  return {
                    bg: 'bg-yellow-50',
                    iconColor: 'text-yellow-600',
                    titleColor: 'text-yellow-900',
                    valueColor: 'text-yellow-900',
                    subtitleColor: 'text-yellow-700',
                    medal: '🥇'
                  };
                case 2:
                  return {
                    bg: 'bg-gray-50',
                    iconColor: 'text-gray-600',
                    titleColor: 'text-gray-900',
                    valueColor: 'text-gray-900',
                    subtitleColor: 'text-gray-700',
                    medal: '🥈'
                  };
                case 3:
                  return {
                    bg: 'bg-orange-50',
                    iconColor: 'text-orange-600',
                    titleColor: 'text-orange-900',
                    valueColor: 'text-orange-900',
                    subtitleColor: 'text-orange-700',
                    medal: '🥉'
                  };
                default:
                  return {
                    bg: 'bg-gray-50',
                    iconColor: 'text-gray-600',
                    titleColor: 'text-gray-900',
                    valueColor: 'text-gray-900',
                    subtitleColor: 'text-gray-700',
                    medal: ''
                  };
              }
            };

            const style = getRankStyle(dayData.rank);

            return (
              <div key={dayData.day} className={`${style.bg} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium ${style.titleColor}`}>
                    {style.medal} {dayData.rank === 1 ? '1ᵉʳ' : dayData.rank === 2 ? '2ᵉ' : '3ᵉ'} jour
                  </span>
                </div>
                <div className={`text-2xl font-bold ${style.valueColor} mb-1`}>
                  {dayData.dayName}
                </div>
                <div className={`text-xs ${style.subtitleColor}`}>
                  {dayData.count.toLocaleString('fr-FR')} retraits
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}