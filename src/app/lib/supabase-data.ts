// src/app/lib/supabase-data.ts
import { createClient } from "@supabase/supabase-js";
import { isValidVelodysseeRelay } from "../config/velodyssee-relays";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseResponse = {
  id?: number;
  prenom: string;
  nom: string;
  email: string;
  pays: string;
  france: boolean;
  departement: string | null;
  point_relais: string;
  quantite: number;
  date_retrait: string;
  newsletter: boolean;
  date_commande: string;
  typeform_response_id?: string;
  created_at?: string;
  // Nouveaux champs pour les tampons
  tampons?: string | null; // JSON array des tampons collectés
  nb_tampons?: number | null; // Nombre de tampons
  region?: string | null; // Région (BZH, PDL, NAQ)
  heure_commande?: string | null; // Heure de commande
  jour_semaine?: string | null; // Jour de la semaine
};

export type RawRow = {
  id?: number;
  passports: number | null;
  country: string | null;
  france: boolean; // Champ boolean pour déterminer si client français
  relay: string | null;
  newsletter: boolean;
  orderDate: string | null;
  department?: string | null;
  withdrawalDate?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  // Nouveaux champs étendus
  tampons?: string[] | null; // Tampons collectés
  nbTampons?: number | null; // Nombre de tampons
  region?: string | null; // Région
  orderHour?: number | null; // Heure de commande (0-23)
  orderWeekday?: number | null; // Jour semaine (0=dimanche, 6=samedi)
  orderMonth?: number | null; // Mois (1-12)
  isValidRelay?: boolean; // Point relais Vélodyssée officiel
};

/**
 * Récupère toutes les réponses depuis Supabase
 */
export async function fetchSupabaseResponses(): Promise<RawRow[]> {
  try {
    console.log("📊 Récupération des données depuis Supabase...");
    
    // Récupérer d'abord le count total
    const { count: totalCount, error: countError } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.warn("⚠️ Erreur lors du comptage Supabase:", countError.message);
      return generateMockDataForDevelopment();
    }

    console.log(`📊 Total d'entrées dans Supabase: ${totalCount}`);

    // Récupérer TOUTES les données avec pagination
    const PAGE_SIZE = 1000;
    const allData: SupabaseResponse[] = [];
    let page = 0;

    while (allData.length < totalCount) {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      console.log(`📄 Récupération page ${page + 1} (${from}-${to})...`);

      const { data: pageData, error } = await supabase
        .from('responses')
        .select('*')
        .order('date_retrait', { ascending: false })
        .range(from, to);

      if (error) {
        console.warn("⚠️ Erreur Supabase page", page + 1, ":", error.message);
        break;
      }

      if (!pageData || pageData.length === 0) {
        console.log(`📄 Fin des données à la page ${page + 1}`);
        break;
      }

      allData.push(...pageData);
      console.log(`✅ Page ${page + 1}: ${pageData.length} entrées (total: ${allData.length})`);

      // Si nous avons récupéré moins d'entrées que PAGE_SIZE, c'est la dernière page
      if (pageData.length < PAGE_SIZE) {
        break;
      }

      page++;

      // Sécurité: éviter les boucles infinies (5 pages = 5000 entrées max)
      if (page > 5) {
        console.warn("⚠️ Limite de sécurité atteinte (5 pages = 5000 entrées)");
        break;
      }
    }

    if (allData.length === 0) {
      console.warn("📊 Aucune donnée trouvée dans Supabase, utilisation des données de développement");
      return generateMockDataForDevelopment();
    }

    console.log(`✅ ${allData.length} entrées récupérées depuis Supabase (sur ${totalCount} total)`);
    
    // Vérifier si nous avons récupéré toutes les données
    if (allData.length < totalCount) {
      console.warn(`⚠️ Attention: seulement ${allData.length}/${totalCount} entrées récupérées`);
    }
    
    // Transformation des données Supabase vers RawRow
    return allData.map(transformSupabaseToRawRow);
    
  } catch (error) {
    console.error("❌ Erreur lors de la récupération Supabase:", error);
    console.log("🔄 Utilisation des données de développement");
    return generateMockDataForDevelopment();
  }
}

/**
 * Transforme une réponse Supabase en RawRow
 */
function transformSupabaseToRawRow(supabaseRow: SupabaseResponse): RawRow {
  // Utiliser les bonnes sources pour chaque date
  const orderDate = supabaseRow.date_commande ? new Date(supabaseRow.date_commande) : null;
  const withdrawalDate = supabaseRow.date_retrait ? new Date(supabaseRow.date_retrait) : null;
  
  // Debug pour vérifier la transformation (à supprimer après test)
  if (Math.random() < 0.001) { // Log 0.1% des entrées seulement
    console.log('🔧 Debug transformation:', {
      date_commande: supabaseRow.date_commande,
      date_retrait: supabaseRow.date_retrait,
      orderDate: orderDate?.toISOString(),
      withdrawalDate: withdrawalDate?.toISOString(),
    });
  }
  
  return {
    id: supabaseRow.id,
    passports: supabaseRow.quantite || 0,
    country: supabaseRow.pays || null,
    france: supabaseRow.france || false, // Mapper le champ boolean france
    relay: supabaseRow.point_relais || null,
    newsletter: supabaseRow.newsletter || false,
    orderDate: supabaseRow.date_commande || null, // Date de commande
    department: supabaseRow.departement || null,
    withdrawalDate: supabaseRow.date_retrait || null, // Date de retrait
    firstName: supabaseRow.prenom || null,
    lastName: supabaseRow.nom || null,
    email: supabaseRow.email || null,
    // Nouveaux champs
    tampons: supabaseRow.tampons ? JSON.parse(supabaseRow.tampons) as string[] : null,
    nbTampons: supabaseRow.nb_tampons || null,
    region: supabaseRow.region || determineRegionFromDepartment(supabaseRow.departement),
    orderHour: orderDate ? orderDate.getHours() : null,
    orderWeekday: orderDate ? orderDate.getDay() : null,
    orderMonth: orderDate ? orderDate.getMonth() + 1 : null,
    isValidRelay: supabaseRow.point_relais ? isValidVelodysseeRelay(supabaseRow.point_relais) : false
  };
}

/**
 * Détermine la région à partir du département
 */
function determineRegionFromDepartment(department: string | null): string | null {
  if (!department) return null;
  
  // Bretagne (BZH)
  if (['22', '29', '35', '56'].includes(department)) return 'BZH';
  
  // Pays de la Loire (PDL) 
  if (['44', '49', '53', '72', '85'].includes(department)) return 'PDL';
  
  // Nouvelle-Aquitaine (NAQ)
  if (['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'].includes(department)) return 'NAQ';
  
  return 'Autre';
}


/**
 * Génère des données de développement réalistes basées sur les vrais points relais
 */
function generateMockDataForDevelopment(): RawRow[] {
  console.log("🔄 Génération des données de démonstration...");
  const mockData: RawRow[] = [];
  
  // Points relais réels de la Vélodyssée avec répartition réaliste
  const relaysWithWeights = [
    { name: "Office de Tourisme de La Rochelle", weight: 15, dept: "17", region: "NAQ" },
    { name: "Office de Tourisme de Nantes Métropole", weight: 12, dept: "44", region: "PDL" },
    { name: "Office de Tourisme de Sables d'Olonne", weight: 10, dept: "85", region: "PDL" },
    { name: "Office de Tourisme de Royan", weight: 8, dept: "17", region: "NAQ" },
    { name: "Office de Tourisme de Saint Jean de Monts", weight: 7, dept: "85", region: "PDL" },
    { name: "Office de Tourisme de Pornic", weight: 6, dept: "44", region: "PDL" },
    { name: "Office de Tourisme de Hossegor", weight: 6, dept: "40", region: "NAQ" },
    { name: "Office de Tourisme de Lacanau", weight: 5, dept: "33", region: "NAQ" },
    { name: "Office de Tourisme de Rochefort Océan", weight: 5, dept: "17", region: "NAQ" },
    { name: "Office de Tourisme de Redon", weight: 4, dept: "35", region: "BZH" },
    { name: "Office de Tourisme de Josselin", weight: 4, dept: "56", region: "BZH" },
    { name: "Office de Tourisme de Pontivy Communauté", weight: 3, dept: "56", region: "BZH" },
    { name: "Office de Tourisme de Carhaix", weight: 3, dept: "29", region: "BZH" },
    { name: "Office de Tourisme de Roscoff", weight: 2, dept: "29", region: "BZH" },
    { name: "Office de Tourisme de Capbreton", weight: 4, dept: "40", region: "NAQ" },
    { name: "Office de Tourisme de Mimizan", weight: 3, dept: "40", region: "NAQ" },
    { name: "Office de Tourisme de Andernos-les-Bains", weight: 4, dept: "33", region: "NAQ" },
    { name: "Office de Tourisme de Saint Gilles Croix de Vie", weight: 5, dept: "85", region: "PDL" }
  ];

  const countries = [
    { name: "France", weight: 75 },
    { name: "Belgique", weight: 8 },
    { name: "Pays-Bas", weight: 6 },
    { name: "Allemagne", weight: 4 },
    { name: "Royaume-Uni", weight: 3 },
    { name: "Suisse", weight: 2 },
    { name: "Espagne", weight: 2 }
  ];

  // Tampons possibles sur la Vélodyssée
  const availableStamps = [
    "Roscoff", "Morlaix", "Carhaix", "Pontivy", "Josselin", "Redon", "Nantes", 
    "Pornic", "Saint Jean de Monts", "Saint Gilles Croix de Vie", "Sables d'Olonne",
    "La Rochelle", "Rochefort", "Royan", "Bordeaux", "Lacanau", "Mimizan", 
    "Hossegor", "Capbreton", "Bayonne"
  ];

  const totalEntries = 500; // Réduit pour les tests
  
  for (let i = 0; i < totalEntries; i++) {
    // Répartition réaliste par année
    let year: number;
    const yearRand = Math.random();
    if (yearRand < 0.45) year = 2023; // 45% en 2023
    else if (yearRand < 0.85) year = 2024; // 40% en 2024  
    else year = 2025; // 15% en 2025

    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 24);
    const orderDate = new Date(year, month, day, hour);
    
    // Sélection pondérée du pays
    const countryRand = Math.random() * 100;
    let selectedCountry = "France";
    let cumWeight = 0;
    for (const country of countries) {
      cumWeight += country.weight;
      if (countryRand <= cumWeight) {
        selectedCountry = country.name;
        break;
      }
    }

    // Sélection pondérée du point relais
    const relayRand = Math.random() * relaysWithWeights.reduce((sum, r) => sum + r.weight, 0);
    let selectedRelayData = relaysWithWeights[0];
    let cumRelayWeight = 0;
    for (const relay of relaysWithWeights) {
      cumRelayWeight += relay.weight;
      if (relayRand <= cumRelayWeight) {
        selectedRelayData = relay;
        break;
      }
    }

    // Génération des tampons collectés (simulation réaliste)
    const nbPassports = Math.floor(Math.random() * 4) + 1;
    const tamponsPerPassport = Math.floor(Math.random() * 8) + 3; // 3-10 tampons par passeport
    const totalTampons = nbPassports * tamponsPerPassport;
    const selectedTampons: string[] = [];
    
    // Sélection aléatoire de tampons uniques
    const shuffledStamps = [...availableStamps].sort(() => 0.5 - Math.random());
    const uniqueTampons = Math.min(totalTampons, shuffledStamps.length);
    for (let t = 0; t < uniqueTampons; t++) {
      selectedTampons.push(shuffledStamps[t]);
    }

    mockData.push({
      id: i + 1,
      passports: nbPassports,
      country: selectedCountry,
      france: selectedCountry === "France", // Utiliser le champ boolean france
      relay: selectedRelayData.name,
      newsletter: Math.random() > 0.35, // 65% acceptent la newsletter
      orderDate: orderDate.toISOString(),
      department: selectedCountry === "France" ? selectedRelayData.dept : null,
      withdrawalDate: new Date(year, month + 1, day + Math.floor(Math.random() * 30)).toISOString(),
      firstName: "Prénom" + i,
      lastName: "Nom" + i,
      email: `user${i}@example.com`,
      // Nouveaux champs
      tampons: selectedTampons,
      nbTampons: totalTampons,
      region: selectedCountry === "France" ? selectedRelayData.region : null,
      orderHour: hour,
      orderWeekday: orderDate.getDay(),
      orderMonth: month + 1,
      isValidRelay: true // Tous nos mock relays sont valides
    });
  }

  console.log(`✅ Données de développement générées: ${mockData.length} entrées`);
  return mockData;
}

/**
 * Fonction pour synchroniser les données Typeform vers Supabase
 * (à utiliser pour l'import initial des données)
 */
export async function syncTypeformToSupabase() {
  // Cette fonction pourrait être utilisée pour importer les données Typeform vers Supabase
  console.log("Synchronisation Typeform → Supabase à implémenter si nécessaire");
}