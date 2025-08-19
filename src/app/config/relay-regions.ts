// Mapping des points relais vers les régions pour la répartition régionale
// Basé sur la géolocalisation des points relais officiels de la Vélodyssée

export const RELAY_REGION_MAPPING: Record<string, string> = {
  // BRETAGNE (BZH)
  "Office de Tourisme de Roscoff": "BZH",
  "Office de Tourisme de Baie de Morlaix": "BZH",
  "Office de Tourisme Monts d'Arrée Communauté - Huelgoat": "BZH",
  "Office de Tourisme de Carhaix": "BZH",
  "Bureau d'Information Touristique de Guerlédan": "BZH",
  "Electrothèque du Lac de Guerlédan": "BZH",
  "Office de Tourisme de Pontivy Communauté": "BZH",
  "Bureau d'Information Touristique de Rohan": "BZH",
  "Office de Tourisme de Josselin": "BZH",
  "Office de Tourisme de Malestroit": "BZH",
  "Office de Tourisme de La Gacilly": "BZH",
  "Office de Tourisme de Redon": "BZH",

  // PAYS DE LA LOIRE (PDL)
  "Office de Tourisme de Guenrouët": "PDL",
  "Office de Tourisme de Blain": "PDL",
  "Office de Tourisme de Nort-sur-Erdre": "PDL",
  "Office de Tourisme de Sucé-sur-Erdre": "PDL",
  "Office de Tourisme de Nantes Métropole": "PDL",
  "Office de Tourisme de Paimboeuf": "PDL",
  "Point Accueil Vélo de Saint-Brevin-les-Pins": "PDL",
  "Office de Tourisme de Saint-Brevin-les-Pins": "PDL",
  "Office de Tourisme de Tharon Plage": "PDL",
  "Office de Tourisme de La Plaine-sur-Mer": "PDL",
  "Office de Tourisme de Préfailles": "PDL",
  "Office de Tourisme de Pornic": "PDL",
  "Office de Tourisme de La Bernerie-en-Retz": "PDL",
  "Office de Tourisme de Les Moutiers en Retz": "PDL",
  "Office de Tourisme de Villeneuve-en-Retz": "PDL",
  "Office de Tourisme de Beauvoir-sur-Mer": "PDL",
  "Office de Tourisme du Passage du Gois - Beauvoir-sur-Mer": "PDL",
  "Bureau d'Information Touristique de Sallertaine": "PDL",
  "Bureau d'Information Touristique de Challans": "PDL",
  "Office de Tourisme de La Barre-de-Monts": "PDL",
  "Office de Tourisme de Saint Jean de Monts": "PDL",
  "Office de Tourisme de Saint Gilles Croix de Vie": "PDL",
  "Office de Tourisme de Saint Hilaire de Riez": "PDL",
  "Office de Tourisme de Brétignolles sur Mer": "PDL",
  "Office de Tourisme de Brem-sur-Mer": "PDL",
  "Office de Tourisme de Sables d'Olonne": "PDL", // Apostrophe droite
  [`Office de Tourisme de Sables d${String.fromCharCode(8217)}Olonne`]: "PDL", // Apostrophe courbe (8217)
  "Office de Tourisme des Sables d'Olonne": "PDL", // Variante orthographique
  "Office de Tourisme de Port Olona": "PDL",
  "Office de Tourisme de Navarin": "PDL",
  "Office de Tourisme de l'Île d'Olonne": "PDL",
  "Office de Tourisme de la Gare": "PDL", // Sables d'Olonne
  "Office de Tourisme de Jard-sur-Mer": "PDL",
  "Office de Tourisme de La Tranche-sur-Mer": "PDL",
  "Office de Tourisme de La Faute-sur-Mer": "PDL",
  "Office de Tourisme de L'Aiguillon-sur-Mer": "PDL",
  "Office de Tourisme de Saint-Michel-en-l'Herm": "PDL",

  // NOUVELLE-AQUITAINE (NAQ)
  "Office de Tourisme Le Comptoir Local Aunis Marais Poitevin": "NAQ",
  "Office de Tourisme de La Rochelle": "NAQ",
  "Office de Tourisme de Châtelaillon": "NAQ",
  "Office de Tourisme de Rochefort Océan": "NAQ",
  "Bureau d'Information Touristique Abbaye de Trizay": "NAQ",
  "Office de Tourisme de Marennes": "NAQ",
  "Bureau d'Information Touristique de Ronce-les-Bains": "NAQ",
  "Office de Tourisme de La Tremblade": "NAQ",
  "Office de Tourisme de La Palmyre": "NAQ",
  "Office de Tourisme de Royan": "NAQ",
  "Office de Tourisme de Soulac-sur-Mer": "NAQ",
  "Office de Tourisme de Vendays-Montalivet": "NAQ",
  "Office de Tourisme de Naujac-sur-Mer": "NAQ",
  "Office de Tourisme d'Hourtin Ville": "NAQ",
  "Office de Tourisme de Carcans-Maubuisson": "NAQ",
  "Office de Tourisme de Lacanau": "NAQ",
  "Bureau d'Information Touristique La Pignotte au Porge-Océan": "NAQ",
  "Office de Tourisme d'Arès": "NAQ",
  "Office de Tourisme de Andernos-les-Bains": "NAQ",
  "Bureau d'Information Touristique de Biganos": "NAQ",
  "Point d'information du Grand Site de la Dune du Pilat": "NAQ",
  "Bureau d'Information Touristique Biscarosse Plage": "NAQ",
  "Bureau d'Information Touristique de Parentis en Born": "NAQ",
  "Office de Tourisme de Mimizan": "NAQ",
  "Office de Tourisme de Vieux-Boucau-les-Bains": "NAQ",
  "Office de Tourisme de Hossegor": "NAQ",
  "Office de Tourisme de Capbreton": "NAQ",
  "Office de Tourisme de Labenne": "NAQ",
  "Office de Tourisme de Soustons": "NAQ",
  "Office de Tourisme de Messanges": "NAQ",
  "Office de Tourisme de Moliets": "NAQ",
  "Office de Tourisme de Saint Vincent de Tyrosse": "NAQ",
  
  // Points relais additionnels identifiés dans les données 2024/2023
  // Côte Basque (Nouvelle-Aquitaine - Pyrénées-Atlantiques)
  "Office de Tourisme de Bayonne": "NAQ",
  "Office de Tourisme de Saint Jean de Luz": "NAQ", 
  "Office de Tourisme d'Hendaye": "NAQ", // Apostrophe droite
  [`Office de Tourisme d${String.fromCharCode(8217)}Hendaye`]: "NAQ", // Apostrophe courbe (8217)
  "Office de Tourisme de Biarritz": "NAQ",
  "Office de Tourisme de Bidart": "NAQ",
  "Office de Tourisme de Anglet": "NAQ",
  "Office de Tourisme de Guéthary": "NAQ",
  
  // Gironde (Nouvelle-Aquitaine)
  "Point Informations Dune du Pilat": "NAQ",
  
  // Pays de la Loire - Loire-Atlantique
  "Point Accueil Vélo de Saint-Brevin": "PDL",
  
  // Landes (Nouvelle-Aquitaine)
  "Bureau d'Information Touristique de Léon": "NAQ",
  
  // Bretagne - Côtes-d'Armor
  "Office de Tourisme de Rostrenen": "BZH",
  "Bureau d'Information Touristique de Bon-Repos": "BZH",
  
  // Points relais temporaires ou en cours d'identification
  "Office Test": "PDL" // À vérifier/corriger selon localisation réelle
};

/**
 * Détermine la région à partir du nom du point relais
 */
export function getRegionFromRelay(relayName: string | null): string | null {
  if (!relayName) return null;
  
  // Debug désactivé pour éviter spam (seulement en cas de besoin)
  // if (relayName.includes("Sables")) {
  //   console.log(`🏢 getRegionFromRelay called with: "${relayName}"`);
  //   console.log(`🏢 RELAY_REGION_MAPPING has key: ${relayName in RELAY_REGION_MAPPING}`);
  //   console.log(`🏢 Result: ${RELAY_REGION_MAPPING[relayName] || null}`);
  // }
  
  return RELAY_REGION_MAPPING[relayName] || null;
}

/**
 * Obtient tous les points relais d'une région donnée
 */
export function getRelaysInRegion(region: string): string[] {
  return Object.entries(RELAY_REGION_MAPPING)
    .filter(([_, regionCode]) => regionCode === region)
    .map(([relayName]) => relayName);
}

/**
 * Mapping des points relais vers les départements
 */
export const RELAY_DEPARTMENT_MAPPING: Record<string, string> = {
  // BRETAGNE (BZH)
  "Office de Tourisme de Roscoff": "29",
  "Office de Tourisme de Baie de Morlaix": "29",
  "Office de Tourisme Monts d'Arrée Communauté - Huelgoat": "29",
  "Office de Tourisme de Carhaix": "29",
  "Bureau d'Information Touristique de Guerlédan": "56",
  "Electrothèque du Lac de Guerlédan": "56",
  "Office de Tourisme de Pontivy Communauté": "56",
  "Bureau d'Information Touristique de Rohan": "56",
  "Office de Tourisme de Josselin": "56",
  "Office de Tourisme de Malestroit": "56",
  "Office de Tourisme de La Gacilly": "56",
  "Office de Tourisme de Redon": "35",

  // PAYS DE LA LOIRE (PDL)
  "Office de Tourisme de Guenrouët": "44",
  "Office de Tourisme de Blain": "44",
  "Office de Tourisme de Nort-sur-Erdre": "44",
  "Office de Tourisme de Sucé-sur-Erdre": "44",
  "Office de Tourisme de Nantes Métropole": "44",
  "Office de Tourisme de Paimboeuf": "44",
  "Point Accueil Vélo de Saint-Brevin-les-Pins": "44",
  "Office de Tourisme de Saint-Brevin-les-Pins": "44",
  "Office de Tourisme de Tharon Plage": "44",
  "Office de Tourisme de La Plaine-sur-Mer": "44",
  "Office de Tourisme de Préfailles": "44",
  "Office de Tourisme de Pornic": "44",
  "Office de Tourisme de La Bernerie-en-Retz": "44",
  "Office de Tourisme de Les Moutiers en Retz": "44",
  "Office de Tourisme de Villeneuve-en-Retz": "44",
  "Office de Tourisme de Beauvoir-sur-Mer": "85",
  "Office de Tourisme du Passage du Gois - Beauvoir-sur-Mer": "85",
  "Bureau d'Information Touristique de Sallertaine": "85",
  "Bureau d'Information Touristique de Challans": "85",
  "Office de Tourisme de La Barre-de-Monts": "85",
  "Office de Tourisme de Saint Jean de Monts": "85",
  "Office de Tourisme de Saint Gilles Croix de Vie": "85",
  "Office de Tourisme de Saint Hilaire de Riez": "85",
  "Office de Tourisme de Brétignolles sur Mer": "85",
  "Office de Tourisme de Brem-sur-Mer": "85",
  "Office de Tourisme de Sables d'Olonne": "85", // Apostrophe droite
  [`Office de Tourisme de Sables d${String.fromCharCode(8217)}Olonne`]: "85", // Apostrophe courbe (8217)
  "Office de Tourisme des Sables d'Olonne": "85", // Variante orthographique
  "Office de Tourisme de Port Olona": "85",
  "Office de Tourisme de Navarin": "85",
  "Office de Tourisme de l'Île d'Olonne": "85",
  "Office de Tourisme de la Gare": "85", // Sables d'Olonne
  "Office de Tourisme de Jard-sur-Mer": "85",
  "Office de Tourisme de La Tranche-sur-Mer": "85",
  "Office de Tourisme de La Faute-sur-Mer": "85",
  "Office de Tourisme de L'Aiguillon-sur-Mer": "85",
  "Office de Tourisme de Saint-Michel-en-l'Herm": "85",

  // NOUVELLE-AQUITAINE (NAQ)
  "Office de Tourisme Le Comptoir Local Aunis Marais Poitevin": "17",
  "Office de Tourisme de La Rochelle": "17",
  "Office de Tourisme de Châtelaillon": "17",
  "Office de Tourisme de Rochefort Océan": "17",
  "Bureau d'Information Touristique Abbaye de Trizay": "17",
  "Office de Tourisme de Marennes": "17",
  "Bureau d'Information Touristique de Ronce-les-Bains": "17",
  "Office de Tourisme de La Tremblade": "17",
  "Office de Tourisme de La Palmyre": "17",
  "Office de Tourisme de Royan": "17",
  "Office de Tourisme de Soulac-sur-Mer": "33",
  "Office de Tourisme de Vendays-Montalivet": "33",
  "Office de Tourisme de Naujac-sur-Mer": "33",
  "Office de Tourisme d'Hourtin Ville": "33",
  "Office de Tourisme de Carcans-Maubuisson": "33",
  "Office de Tourisme de Lacanau": "33",
  "Bureau d'Information Touristique La Pignotte au Porge-Océan": "33",
  "Office de Tourisme d'Arès": "33",
  "Office de Tourisme de Andernos-les-Bains": "33",
  "Bureau d'Information Touristique de Biganos": "33",
  "Point d'information du Grand Site de la Dune du Pilat": "33",
  "Bureau d'Information Touristique Biscarosse Plage": "40",
  "Bureau d'Information Touristique de Parentis en Born": "40",
  "Office de Tourisme de Mimizan": "40",
  "Office de Tourisme de Vieux-Boucau-les-Bains": "40",
  "Office de Tourisme de Hossegor": "40",
  "Office de Tourisme de Capbreton": "40",
  "Office de Tourisme de Labenne": "40",
  "Office de Tourisme de Soustons": "40",
  "Office de Tourisme de Messanges": "40",
  "Office de Tourisme de Moliets": "40",
  "Office de Tourisme de Saint Vincent de Tyrosse": "40",
  
  // Points relais additionnels identifiés dans les données 2024/2023  
  // Côte Basque (Pyrénées-Atlantiques - 64)
  "Office de Tourisme de Bayonne": "64",
  "Office de Tourisme de Saint Jean de Luz": "64",
  "Office de Tourisme d'Hendaye": "64", // Apostrophe droite
  [`Office de Tourisme d${String.fromCharCode(8217)}Hendaye`]: "64", // Apostrophe courbe (8217) 
  "Office de Tourisme de Biarritz": "64",
  "Office de Tourisme de Bidart": "64",
  "Office de Tourisme de Anglet": "64",
  "Office de Tourisme de Guéthary": "64",
  
  // Gironde (33)
  "Point Informations Dune du Pilat": "33",
  
  // Loire-Atlantique (44)
  "Point Accueil Vélo de Saint-Brevin": "44",
  
  // Landes (40)
  "Bureau d'Information Touristique de Léon": "40",
  
  // Côtes-d'Armor (22) 
  "Office de Tourisme de Rostrenen": "22",
  "Bureau d'Information Touristique de Bon-Repos": "22",
  
  // Points relais temporaires ou en cours d'identification
  "Office Test": "85" // À vérifier/corriger selon localisation réelle
};

/**
 * Détermine le département à partir du nom du point relais
 */
export function getDepartmentFromRelay(relayName: string | null): string | null {
  if (!relayName) return null;
  return RELAY_DEPARTMENT_MAPPING[relayName] || null;
}

/**
 * Obtient tous les points relais d'un département donné
 */
export function getRelaysInDepartment(department: string): string[] {
  return Object.entries(RELAY_DEPARTMENT_MAPPING)
    .filter(([_, dept]) => dept === department)
    .map(([relayName]) => relayName);
}

/**
 * Statistiques par région
 */
export const REGION_STATS = {
  BZH: {
    name: "Bretagne",
    code: "BZH",
    relayCount: Object.values(RELAY_REGION_MAPPING).filter(r => r === "BZH").length,
    departments: ["22", "29", "35", "56"]
  },
  PDL: {
    name: "Pays de la Loire", 
    code: "PDL",
    relayCount: Object.values(RELAY_REGION_MAPPING).filter(r => r === "PDL").length,
    departments: ["44", "85"]
  },
  NAQ: {
    name: "Nouvelle-Aquitaine",
    code: "NAQ", 
    relayCount: Object.values(RELAY_REGION_MAPPING).filter(r => r === "NAQ").length,
    departments: ["17", "33", "40", "64"]
  }
};