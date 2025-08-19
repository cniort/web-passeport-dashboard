// src/app/lib/enhanced-kpis.ts
import { parseISO, getYear, getMonth, getQuarter, format } from "date-fns";
import { fr } from "date-fns/locale";
import type { RawRow } from "./supabase-data";
import type { DashboardFilters } from "@/app/hooks/useDashboardState";
import { isValidVelodysseeRelay, getRelayType, OFFICIAL_VELODYSSEE_RELAYS } from "../config/velodyssee-relays";

export type TimeSeriesData = {
  period: string;
  orders: number;
  passports: number;
  avgPassportsPerOrder: number;
  date: Date;
};

export type TopItem = {
  name: string;
  count: number;
  percentage: number;
};

export type EnhancedKpis = {
  current: {
    orders: number;
    totalPassports: number;
    avgPassportsPerOrder: number;
    pointsRelaisCount: number;
    activeRelaysCount: number;
    frSharePct: number;
    newsletterConvPct: number;
    totalValidRelays: number;
    invalidRelaysCount: number;
  };
  comparison?: {
    orders: number;
    totalPassports: number;
    avgPassportsPerOrder: number;
    pointsRelaisCount: number;
    activeRelaysCount: number;
    frSharePct: number;
    newsletterConvPct: number;
    totalValidRelays: number;
    invalidRelaysCount: number;
  };
  timeSeries: TimeSeriesData[];
  topRelays: TopItem[];
  topValidRelays: TopItem[];
  topCountries: TopItem[];
  topDepartments: TopItem[];
  relayTypes: TopItem[];
  monthlyData: { month: string; orders: number; passports: number }[];
  yearlyTotals: { year: number; orders: number; passports: number }[];
};

function filterRowsByPeriod(rows: RawRow[], filters: DashboardFilters): RawRow[] {
  return rows.filter((r) => {
    const d = r.orderDate ? parseISO(r.orderDate) : null;
    if (!d || !Number.isFinite(d.getTime())) return false;

    const year = getYear(d);
    if (year !== filters.selectedYear) return false;

    if (filters.period === "month" && filters.selectedMonth) {
      return getMonth(d) + 1 === filters.selectedMonth; // getMonth is 0-based
    }

    if (filters.period === "quarter" && filters.selectedQuarter) {
      return getQuarter(d) === filters.selectedQuarter;
    }

    return true;
  });
}

function generateTimeSeries(rows: RawRow[], filters: DashboardFilters): TimeSeriesData[] {
  const dataMap = new Map<string, { orders: number; passports: number; date: Date }>();
  
  for (const row of rows) {
    const d = row.orderDate ? parseISO(row.orderDate) : null;
    if (!d || !Number.isFinite(d.getTime())) continue;

    const year = getYear(d);
    if (year !== filters.selectedYear) continue;

    let key: string;
    let date: Date;

    if (filters.period === "month") {
      key = format(d, "yyyy-MM", { locale: fr });
      date = new Date(year, getMonth(d), 1);
    } else if (filters.period === "quarter") {
      const quarter = getQuarter(d);
      key = `${year}-Q${quarter}`;
      date = new Date(year, (quarter - 1) * 3, 1);
    } else {
      key = year.toString();
      date = new Date(year, 0, 1);
    }

    const existing = dataMap.get(key) || { orders: 0, passports: 0, date };
    existing.orders += 1;
    existing.passports += Number(row.passports) || 0;
    dataMap.set(key, existing);
  }

  return Array.from(dataMap.entries())
    .map(([period, data]) => ({
      period,
      orders: data.orders,
      passports: data.passports,
      avgPassportsPerOrder: data.orders ? data.passports / data.orders : 0,
      date: data.date,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function computeTopItems<T>(
  rows: RawRow[],
  extractor: (row: RawRow) => T,
  limit = 5
): TopItem[] {
  const countMap = new Map<string, number>();
  
  for (const row of rows) {
    const value = extractor(row);
    if (value) {
      const key = String(value);
      countMap.set(key, (countMap.get(key) || 0) + 1);
    }
  }

  const total = rows.length;
  return Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total ? (count * 100) / total : 0,
    }));
}

export function computeEnhancedKpis(
  rows: RawRow[],
  filters: DashboardFilters
): EnhancedKpis {
  const filteredRows = filterRowsByPeriod(rows, filters);
  
  // Calculs corrigés pour la période actuelle
  const orders = filteredRows.length; // Nombre de commandes (1 commande = 1 ligne)
  const totalPassports = filteredRows.reduce((s, r) => s + (Number(r.passports) || 0), 0); // Somme des passeports commandés
  const avgPassportsPerOrder = orders ? Number((totalPassports / orders).toFixed(2)) : 0;
  
  // Analyse des points relais
  const relayMap = new Map<string, number>();
  const validRelayMap = new Map<string, number>();
  let frCount = 0;
  let newsletterYes = 0;
  let invalidRelaysCount = 0;

  for (const r of filteredRows) {
    // Comptage des pays
    const country = r.country?.toLowerCase();
    if (country === "france" || country === "fr") frCount++;
    
    // Comptage newsletter
    if (r.newsletter) newsletterYes++;
    
    // Analyse des points relais
    if (r.relay && r.relay.trim()) {
      const relayName = r.relay.trim();
      relayMap.set(relayName, (relayMap.get(relayName) || 0) + 1);
      
      // Vérification si le point relais est valide (sur la Vélodyssée)
      if (isValidVelodysseeRelay(relayName)) {
        validRelayMap.set(relayName, (validRelayMap.get(relayName) || 0) + 1);
      } else {
        invalidRelaysCount++;
      }
    }
  }

  const current = {
    orders,
    totalPassports,
    avgPassportsPerOrder,
    pointsRelaisCount: relayMap.size, // Nombre de points relais différents
    activeRelaysCount: validRelayMap.size, // Nombre de points relais valides actifs
    frSharePct: orders ? Number(((frCount * 100) / orders).toFixed(1)) : 0,
    newsletterConvPct: orders ? Number(((newsletterYes * 100) / orders).toFixed(1)) : 0,
    totalValidRelays: OFFICIAL_VELODYSSEE_RELAYS.length, // 74 points relais officiels
    invalidRelaysCount,
  };

  // Calculs pour la période de comparaison si définie
  let comparison: typeof current | undefined;
  if (filters.compareYear) {
    const compareFilters = { ...filters, selectedYear: filters.compareYear };
    const compareRows = filterRowsByPeriod(rows, compareFilters);
    
    const compareOrders = compareRows.length;
    const compareTotalPassports = compareRows.reduce((s, r) => s + (Number(r.passports) || 0), 0);
    const compareAvgPassportsPerOrder = compareOrders ? Number((compareTotalPassports / compareOrders).toFixed(2)) : 0;
    
    const compareRelayMap = new Map<string, number>();
    const compareValidRelayMap = new Map<string, number>();
    let compareFrCount = 0;
    let compareNewsletterYes = 0;
    let compareInvalidRelaysCount = 0;

    for (const r of compareRows) {
      // Comptage des pays
      const country = r.country?.toLowerCase();
      if (country === "france" || country === "fr") compareFrCount++;
      
      // Comptage newsletter
      if (r.newsletter) compareNewsletterYes++;
      
      // Analyse des points relais
      if (r.relay && r.relay.trim()) {
        const relayName = r.relay.trim();
        compareRelayMap.set(relayName, (compareRelayMap.get(relayName) || 0) + 1);
        
        if (isValidVelodysseeRelay(relayName)) {
          compareValidRelayMap.set(relayName, (compareValidRelayMap.get(relayName) || 0) + 1);
        } else {
          compareInvalidRelaysCount++;
        }
      }
    }

    comparison = {
      orders: compareOrders,
      totalPassports: compareTotalPassports,
      avgPassportsPerOrder: compareAvgPassportsPerOrder,
      pointsRelaisCount: compareRelayMap.size,
      activeRelaysCount: compareValidRelayMap.size,
      frSharePct: compareOrders ? Number(((compareFrCount * 100) / compareOrders).toFixed(1)) : 0,
      newsletterConvPct: compareOrders ? Number(((compareNewsletterYes * 100) / compareOrders).toFixed(1)) : 0,
      totalValidRelays: OFFICIAL_VELODYSSEE_RELAYS.length,
      invalidRelaysCount: compareInvalidRelaysCount,
    };
  }

  // Séries temporelles
  const timeSeries = generateTimeSeries(rows, filters);
  
  // Top éléments
  const topRelays = computeTopItems(filteredRows, (r) => r.relay);
  const topValidRelays = computeTopItems(filteredRows.filter(r => r.relay && isValidVelodysseeRelay(r.relay)), (r) => r.relay);
  const topCountries = computeTopItems(filteredRows, (r) => r.country);
  const topDepartments = computeTopItems(filteredRows.filter(r => r.department), (r) => r.department);
  
  // Types de points relais
  const relayTypes = computeTopItems(filteredRows.filter(r => r.relay), (r) => getRelayType(r.relay!));
  
  // Données mensuelles pour l'année sélectionnée
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthRows = rows.filter((r) => {
      const d = r.orderDate ? parseISO(r.orderDate) : null;
      return d && getYear(d) === filters.selectedYear && getMonth(d) === i;
    });
    
    return {
      month: format(new Date(2024, i, 1), "MMM", { locale: fr }),
      orders: monthRows.length,
      passports: monthRows.reduce((s, r) => s + (Number(r.passports) || 0), 0),
    };
  });

  // Totaux par année (depuis 2023)
  const yearlyTotals = [2023, 2024, 2025].map(year => {
    const yearRows = rows.filter((r) => {
      const d = r.orderDate ? parseISO(r.orderDate) : null;
      return d && getYear(d) === year;
    });
    
    return {
      year,
      orders: yearRows.length,
      passports: yearRows.reduce((s, r) => s + (Number(r.passports) || 0), 0),
    };
  });

  return {
    current,
    comparison,
    timeSeries,
    topRelays,
    topValidRelays,
    topCountries,
    topDepartments,
    relayTypes,
    monthlyData,
    yearlyTotals,
  };
}