// src/app/lib/comprehensive-kpis.ts
import { RawRow } from "./supabase-data";

export interface ComprehensiveKpis {
  // 1. Passeports et commandes
  passportsOrdered: number;
  totalOrders: number;
  avgPassportsPerOrder: number;

  // 2. Tampons
  avgStampsPerPassport: number;
  totalStamps: number;
  uniqueStamps: number;

  // 3. Évolution et répartition temporelle
  evolution: {
    percentage: number;
    period: string;
  };
  quarterlyDistribution: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
  mostActiveMonth: {
    month: number;
    monthName: string;
    count: number;
  };

  // 4. Répartition géographique
  regionalDistribution: {
    BZH: number; // Bretagne
    PDL: number; // Pays de la Loire
    NAQ: number; // Nouvelle-Aquitaine
    Autre: number;
  };
  frenchClientele: number; // Pourcentage
  foreignClientele: {
    ES: number; // Espagne
    DE: number; // Allemagne
    UK: number; // Royaume-Uni
    BE: number; // Belgique
  };

  // 5. Points relais
  activeRelayPoints: number;
  mostSolicitedRelay: {
    name: string;
    passportCount: number;
  };
  relayOrdersPercentage: number;

  // 6. Comportements de commande
  mostFrequentOrderDay: {
    day: number; // 0-6
    dayName: string;
    count: number;
  };
  mostFrequentOrderHour: {
    hour: number; // 0-23
    count: number;
  };

  // 7. Saison
  highSeasonPassports: number; // Juillet-Août
  offSeasonPassports: number; // Hors juillet-août
  highSeasonPercentage: number;
  offSeasonPercentage: number;

  // Données pour comparaison année précédente
  comparison?: ComprehensiveKpis;
}

/**
 * Calcule tous les KPIs demandés à partir des données
 */
export function computeComprehensiveKpis(
  data: RawRow[], 
  year: number,
  compareYear?: number
): ComprehensiveKpis {
  console.log(`📊 Calcul des KPIs complets pour ${year}...`);
  
  // Filtrer les données pour l'année courante
  const currentYearData = data.filter(row => {
    if (!row.orderDate) return false;
    return new Date(row.orderDate).getFullYear() === year;
  });

  const kpis = calculateKpisForYear(currentYearData);

  // Calcul de comparaison si année de comparaison fournie
  if (compareYear) {
    const compareYearData = data.filter(row => {
      if (!row.orderDate) return false;
      return new Date(row.orderDate).getFullYear() === compareYear;
    });
    
    if (compareYearData.length > 0) {
      kpis.comparison = calculateKpisForYear(compareYearData);
    }
  }

  console.log(`✅ KPIs calculés: ${currentYearData.length} entrées analysées`);
  return kpis;
}

/**
 * Calcule les KPIs pour une année donnée
 */
function calculateKpisForYear(yearData: RawRow[]): ComprehensiveKpis {
  // 1. Passeports et commandes
  const totalOrders = yearData.length;
  const passportsOrdered = yearData.reduce((sum, row) => sum + (row.passports || 0), 0);
  const avgPassportsPerOrder = totalOrders > 0 ? passportsOrdered / totalOrders : 0;

  // 2. Tampons
  const allStamps = yearData.flatMap(row => row.tampons || []);
  const uniqueStampSet = new Set(allStamps);
  // Nouveau calcul: totalStamps = passportsOrdered × 10
  const totalStamps = passportsOrdered * 10;
  const avgStampsPerPassport = passportsOrdered > 0 ? totalStamps / passportsOrdered : 0;

  // 3. Évolution et répartition temporelle
  const quarterlyData = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  const monthlyData: { [key: number]: number } = {};

  yearData.forEach(row => {
    if (row.orderMonth) {
      const quarter = Math.ceil(row.orderMonth / 3);
      if (quarter === 1) quarterlyData.Q1++;
      else if (quarter === 2) quarterlyData.Q2++;
      else if (quarter === 3) quarterlyData.Q3++;
      else if (quarter === 4) quarterlyData.Q4++;

      monthlyData[row.orderMonth] = (monthlyData[row.orderMonth] || 0) + (row.passports || 0);
    }
  });

  // Mois le plus actif
  const mostActiveMonth = Object.entries(monthlyData).reduce(
    (max, [month, count]) => count > max.count ? { month: parseInt(month), count } : max,
    { month: 1, count: 0 }
  );

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // 4. Répartition géographique
  const regionalCounts = { BZH: 0, PDL: 0, NAQ: 0, Autre: 0 };
  const countryCounts: { [key: string]: number } = {};
  let frenchOrders = 0;

  yearData.forEach(row => {
    if (row.country === 'France') {
      frenchOrders++;
      if (row.region) {
        regionalCounts[row.region as keyof typeof regionalCounts]++;
      }
    }
    countryCounts[row.country || 'Inconnu'] = (countryCounts[row.country || 'Inconnu'] || 0) + 1;
  });

  const frenchClientele = totalOrders > 0 ? (frenchOrders / totalOrders) * 100 : 0;
  const foreignClientele = {
    ES: totalOrders > 0 ? ((countryCounts['Espagne'] || 0) / totalOrders) * 100 : 0,
    DE: totalOrders > 0 ? ((countryCounts['Allemagne'] || 0) / totalOrders) * 100 : 0,
    UK: totalOrders > 0 ? ((countryCounts['Royaume-Uni'] || 0) / totalOrders) * 100 : 0,
    BE: totalOrders > 0 ? ((countryCounts['Belgique'] || 0) / totalOrders) * 100 : 0,
  };

  // 5. Points relais
  const relayStats: { [key: string]: number } = {};
  let relayOrders = 0;

  yearData.forEach(row => {
    if (row.relay) {
      relayOrders++;
      relayStats[row.relay] = (relayStats[row.relay] || 0) + (row.passports || 0);
    }
  });

  const activeRelayPoints = Object.keys(relayStats).length;
  const mostSolicitedRelay = Object.entries(relayStats).reduce(
    (max, [name, count]) => count > max.passportCount ? { name, passportCount: count } : max,
    { name: '', passportCount: 0 }
  );
  const relayOrdersPercentage = totalOrders > 0 ? (relayOrders / totalOrders) * 100 : 0;

  // 6. Comportements de commande
  const dayStats: { [key: number]: number } = {};
  const hourStats: { [key: number]: number } = {};

  yearData.forEach(row => {
    if (row.orderWeekday !== null && row.orderWeekday !== undefined) {
      dayStats[row.orderWeekday] = (dayStats[row.orderWeekday] || 0) + 1;
    }
    if (row.orderHour !== null && row.orderHour !== undefined) {
      hourStats[row.orderHour] = (hourStats[row.orderHour] || 0) + 1;
    }
  });

  const mostFrequentDay = Object.entries(dayStats).reduce(
    (max, [day, count]) => count > max.count ? { day: parseInt(day), count } : max,
    { day: 0, count: 0 }
  );

  const mostFrequentHour = Object.entries(hourStats).reduce(
    (max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max,
    { hour: 0, count: 0 }
  );

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // 7. Saison
  let highSeasonPassports = 0;
  let offSeasonPassports = 0;

  yearData.forEach(row => {
    const passportCount = row.passports || 0;
    if (row.orderMonth === 7 || row.orderMonth === 8) { // Juillet-Août
      highSeasonPassports += passportCount;
    } else {
      offSeasonPassports += passportCount;
    }
  });

  const totalSeasonPassports = highSeasonPassports + offSeasonPassports;
  const highSeasonPercentage = totalSeasonPassports > 0 ? (highSeasonPassports / totalSeasonPassports) * 100 : 0;
  const offSeasonPercentage = 100 - highSeasonPercentage;

  return {
    // 1. Passeports et commandes
    passportsOrdered,
    totalOrders,
    avgPassportsPerOrder,

    // 2. Tampons
    avgStampsPerPassport,
    totalStamps,
    uniqueStamps: uniqueStampSet.size,

    // 3. Évolution et répartition temporelle
    evolution: {
      percentage: 0, // Sera calculé lors de la comparaison
      period: `${new Date().getFullYear()}`
    },
    quarterlyDistribution: quarterlyData,
    mostActiveMonth: {
      month: mostActiveMonth.month,
      monthName: monthNames[mostActiveMonth.month - 1] || 'Inconnu',
      count: mostActiveMonth.count
    },

    // 4. Répartition géographique
    regionalDistribution: regionalCounts,
    frenchClientele,
    foreignClientele,

    // 5. Points relais
    activeRelayPoints,
    mostSolicitedRelay,
    relayOrdersPercentage,

    // 6. Comportements de commande
    mostFrequentOrderDay: {
      day: mostFrequentDay.day,
      dayName: dayNames[mostFrequentDay.day] || 'Inconnu',
      count: mostFrequentDay.count
    },
    mostFrequentOrderHour: {
      hour: mostFrequentHour.hour,
      count: mostFrequentHour.count
    },

    // 7. Saison
    highSeasonPassports,
    offSeasonPassports,
    highSeasonPercentage,
    offSeasonPercentage
  };
}