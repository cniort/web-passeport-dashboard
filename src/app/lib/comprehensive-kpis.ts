// src/app/lib/comprehensive-kpis.ts
import { RawRow } from "./supabase-data";
import { getRegionFromRelay } from "../config/relay-regions";

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
  quarterlyPercentages: {
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
  };
  regionalPercentages: {
    BZH: number; // Bretagne %
    PDL: number; // Pays de la Loire %
    NAQ: number; // Nouvelle-Aquitaine %
  };
  frenchClientele: number; // Pourcentage
  foreignClientele: {
    totalPercentage: number; // % d'étrangers total
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

  // 8. Répartition des passeports par commande
  ordersWithOnePassport: number;
  ordersWithTwoPassports: number;
  ordersWithThreePassports: number;
  ordersWithFourPassports: number;
  ordersWithFivePlusPassports: number;

  // Données pour comparaison année précédente
  comparison?: ComprehensiveKpis;
}

/**
 * Calcule tous les KPIs demandés à partir des données
 */
export function computeComprehensiveKpis(
  data: RawRow[], 
  year?: number,
  compareYear?: number
): ComprehensiveKpis {
  let currentYearData: RawRow[];
  
  if (year) {
    console.log(`📊 Calcul des KPIs complets pour ${year}...`);
    // Filtrer les données pour l'année courante
    currentYearData = data.filter(row => {
      if (!row.orderDate) return false;
      return new Date(row.orderDate).getFullYear() === year;
    });
  } else {
    console.log(`📊 Calcul des KPIs complets pour TOUTES les données...`);
    // Utiliser toutes les données sans filtre d'année
    currentYearData = data;
  }

  const kpis = calculateKpisForYear(currentYearData);

  // Calcul de comparaison si année de comparaison fournie
  if (compareYear && year) { // Comparaison seulement si on a une année de base
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
  const avgStampsPerPassport = 10; // Fixé à 10 comme demandé

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
  const regionalCounts = { BZH: 0, PDL: 0, NAQ: 0 };
  const countryCounts: { [key: string]: number } = {};
  let frenchOrders = 0;
  let unmappedRelayOrders = 0;
  let noRelayOrders = 0;
  const unmappedRelays = new Set<string>();

  yearData.forEach(row => {
    // Utiliser le champ boolean 'france' de Supabase
    if (row.france === true) {
      frenchOrders++;
    }
    
    // Déterminer la région à partir du point relais
    const region = getRegionFromRelay(row.relay);
    if (region && region in regionalCounts) {
      regionalCounts[region as keyof typeof regionalCounts]++;
    } else if (row.relay) {
      // Point relais présent mais non mappé
      unmappedRelayOrders++;
      unmappedRelays.add(row.relay);
      
      // Point relais non mappé (debug désactivé)
    } else {
      // Pas de point relais
      noRelayOrders++;
    }
    
    countryCounts[row.country || 'Inconnu'] = (countryCounts[row.country || 'Inconnu'] || 0) + 1;
  });

  // Debug: vérifier la cohérence des totaux
  const mappedRegionalTotal = regionalCounts.BZH + regionalCounts.PDL + regionalCounts.NAQ;
  const calculatedTotal = mappedRegionalTotal + unmappedRelayOrders + noRelayOrders;
  
  console.log(`📊 Debug répartition régionale:`);
  console.log(`   - Total commandes: ${totalOrders}`);
  console.log(`   - Commandes mappées (BZH+PDL+NAQ): ${mappedRegionalTotal}`);
  console.log(`   - Points relais non mappés: ${unmappedRelayOrders}`);
  console.log(`   - Sans point relais: ${noRelayOrders}`);
  console.log(`   - Total calculé: ${calculatedTotal}`);
  console.log(`   - Différence: ${totalOrders - calculatedTotal}`);
  
  if (unmappedRelays.size > 0) {
    console.log(`🚨 Points relais non mappés (${unmappedRelays.size}) :`, Array.from(unmappedRelays));
  }

  // Clientèle française = % de français parmi les commandes de la période filtrée
  const frenchClientele = totalOrders > 0 ? (frenchOrders / totalOrders) * 100 : 0;
  const foreignOrdersCount = totalOrders - frenchOrders;
  const foreignClientelePercentage = totalOrders > 0 ? (foreignOrdersCount / totalOrders) * 100 : 0;
  
  const foreignClientele = {
    totalPercentage: foreignClientelePercentage,
    ES: foreignOrdersCount > 0 ? ((countryCounts['Espagne'] || 0) / foreignOrdersCount) * 100 : 0,
    DE: foreignOrdersCount > 0 ? ((countryCounts['Allemagne'] || 0) / foreignOrdersCount) * 100 : 0,
    UK: foreignOrdersCount > 0 ? ((countryCounts['Royaume-Uni'] || 0) / foreignOrdersCount) * 100 : 0,
    BE: foreignOrdersCount > 0 ? ((countryCounts['Belgique'] || 0) / foreignOrdersCount) * 100 : 0,
  };

  // Calcul des pourcentages régionaux
  const totalRegionalOrders = regionalCounts.BZH + regionalCounts.PDL + regionalCounts.NAQ;
  const regionalPercentages = {
    BZH: totalRegionalOrders > 0 ? (regionalCounts.BZH / totalRegionalOrders) * 100 : 0,
    PDL: totalRegionalOrders > 0 ? (regionalCounts.PDL / totalRegionalOrders) * 100 : 0,
    NAQ: totalRegionalOrders > 0 ? (regionalCounts.NAQ / totalRegionalOrders) * 100 : 0,
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

  // 8. Répartition des passeports par commande
  let ordersWithOnePassport = 0;
  let ordersWithTwoPassports = 0;
  let ordersWithThreePassports = 0;
  let ordersWithFourPassports = 0;
  let ordersWithFivePlusPassports = 0;

  yearData.forEach(row => {
    const passportCount = row.passports || 0;
    if (passportCount === 1) {
      ordersWithOnePassport++;
    } else if (passportCount === 2) {
      ordersWithTwoPassports++;
    } else if (passportCount === 3) {
      ordersWithThreePassports++;
    } else if (passportCount === 4) {
      ordersWithFourPassports++;
    } else if (passportCount >= 5) {
      ordersWithFivePlusPassports++;
    }
  });

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
    quarterlyPercentages: {
      Q1: totalOrders > 0 ? (quarterlyData.Q1 / totalOrders) * 100 : 0,
      Q2: totalOrders > 0 ? (quarterlyData.Q2 / totalOrders) * 100 : 0,
      Q3: totalOrders > 0 ? (quarterlyData.Q3 / totalOrders) * 100 : 0,
      Q4: totalOrders > 0 ? (quarterlyData.Q4 / totalOrders) * 100 : 0,
    },
    mostActiveMonth: {
      month: mostActiveMonth.month,
      monthName: monthNames[mostActiveMonth.month - 1] || 'Inconnu',
      count: mostActiveMonth.count
    },

    // 4. Répartition géographique
    regionalDistribution: regionalCounts,
    regionalPercentages,
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
    offSeasonPercentage,

    // 8. Répartition des passeports par commande
    ordersWithOnePassport,
    ordersWithTwoPassports,
    ordersWithThreePassports,
    ordersWithFourPassports,
    ordersWithFivePlusPassports
  };
}