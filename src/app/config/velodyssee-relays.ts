// Liste officielle des points relais de la Vélodyssée pour l'Opération Passeport

export const OFFICIAL_VELODYSSEE_RELAYS = [
  "Office de Tourisme de Roscoff",
  "Office de Tourisme de Baie de Morlaix",
  "Office de Tourisme Monts d'Arrée Communauté - Huelgoat",
  "Office de Tourisme de Carhaix",
  "Bureau d'Information Touristique de Guerlédan",
  "Electrothèque du Lac de Guerlédan",
  "Office de Tourisme de Pontivy Communauté",
  "Bureau d'Information Touristique de Rohan",
  "Office de Tourisme de Josselin",
  "Office de Tourisme de Malestroit",
  "Office de Tourisme de La Gacilly",
  "Office de Tourisme de Redon",
  "Office de Tourisme de Guenrouët",
  "Office de Tourisme de Blain",
  "Office de Tourisme de Nort-sur-Erdre",
  "Office de Tourisme de Sucé-sur-Erdre",
  "Office de Tourisme de Nantes Métropole",
  "Office de Tourisme de Paimboeuf",
  "Point Accueil Vélo de Saint-Brevin-les-Pins",
  "Office de Tourisme de Saint-Brevin-les-Pins",
  "Office de Tourisme de Tharon Plage",
  "Office de Tourisme de La Plaine-sur-Mer",
  "Office de Tourisme de Préfailles",
  "Office de Tourisme de Pornic",
  "Office de Tourisme de La Bernerie-en-Retz",
  "Office de Tourisme de Les Moutiers en Retz",
  "Office de Tourisme de Villeneuve-en-Retz",
  "Office de Tourisme de Beauvoir-sur-Mer",
  "Office de Tourisme du Passage du Gois - Beauvoir-sur-Mer",
  "Bureau d'Information Touristique de Sallertaine",
  "Bureau d'Information Touristique de Challans",
  "Office de Tourisme de La Barre-de-Monts",
  "Office de Tourisme de Saint Jean de Monts",
  "Office de Tourisme de Saint Gilles Croix de Vie",
  "Office de Tourisme de Saint Hilaire de Riez",
  "Office de Tourisme de Brétignolles sur Mer",
  "Office de Tourisme de Brem-sur-Mer",
  "Office de Tourisme de Sables d'Olonne",
  "Office de Tourisme de Port Olona",
  "Office de Tourisme de Navarin",
  "Office de Tourisme de l'Île d'Olonne",
  "Office de Tourisme de Jard-sur-Mer",
  "Office de Tourisme de La Tranche-sur-Mer",
  "Office de Tourisme de La Faute-sur-Mer",
  "Office de Tourisme de L'Aiguillon-sur-Mer",
  "Office de Tourisme de Saint-Michel-en-l'Herm",
  "Office de Tourisme Le Comptoir Local Aunis Marais Poitevin",
  "Office de Tourisme de La Rochelle",
  "Office de Tourisme de Châtelaillon",
  "Office de Tourisme de Rochefort Océan",
  "Bureau d'Information Touristique Abbaye de Trizay",
  "Office de Tourisme de Marennes",
  "Bureau d'Information Touristique de Ronce-les-Bains",
  "Office de Tourisme de La Tremblade",
  "Office de Tourisme de La Palmyre",
  "Office de Tourisme de Royan",
  "Office de Tourisme de Soulac-sur-Mer",
  "Office de Tourisme de Vendays-Montalivet",
  "Office de Tourisme de Naujac-sur-Mer",
  "Office de Tourisme d'Hourtin Ville",
  "Office de Tourisme de Carcans-Maubuisson",
  "Office de Tourisme de Lacanau",
  "Bureau d'Information Touristique La Pignotte au Porge-Océan",
  "Office de Tourisme d'Arès",
  "Office de Tourisme de Andernos-les-Bains",
  "Bureau d'Information Touristique de Biganos",
  "Point d'information du Grand Site de la Dune du Pilat",
  "Bureau d'Information Touristique Biscarosse Plage",
  "Bureau d'Information Touristique de Parentis en Born",
  "Office de Tourisme de Mimizan",
  "Office de Tourisme de Vieux-Boucau-les-Bains",
  "Office de Tourisme de Hossegor",
  "Office de Tourisme de Capbreton",
  "Office de Tourisme de Labenne",
  "Office de Tourisme de Soustons",
  "Office de Tourisme de Messanges",
  "Office de Tourisme de Moliets",
  "Office de Tourisme de Saint Vincent de Tyrosse"
] as const;

// Nombre total de points relais officiels
export const TOTAL_OFFICIAL_RELAYS = OFFICIAL_VELODYSSEE_RELAYS.length;

// Types de points relais pour classification
export const RELAY_TYPES = {
  OFFICE_TOURISME: "Office de Tourisme",
  BUREAU_INFO: "Bureau d'Information Touristique", 
  POINT_ACCUEIL: "Point Accueil",
  ELECTROTHEQUE: "Electrothèque",
  POINT_INFO: "Point d'information"
} as const;

// Fonction pour déterminer le type d'un point relais
export function getRelayType(relayName: string): string {
  if (relayName.startsWith("Office de Tourisme")) {
    return RELAY_TYPES.OFFICE_TOURISME;
  }
  if (relayName.startsWith("Bureau d'Information Touristique")) {
    return RELAY_TYPES.BUREAU_INFO;
  }
  if (relayName.startsWith("Point Accueil")) {
    return RELAY_TYPES.POINT_ACCUEIL;
  }
  if (relayName.includes("Electrothèque")) {
    return RELAY_TYPES.ELECTROTHEQUE;
  }
  if (relayName.startsWith("Point d'information")) {
    return RELAY_TYPES.POINT_INFO;
  }
  return "Autre";
}

// Fonction pour vérifier si un point relais est valide
export function isValidVelodysseeRelay(relayName: string): boolean {
  return OFFICIAL_VELODYSSEE_RELAYS.includes(relayName as typeof OFFICIAL_VELODYSSEE_RELAYS[number]);
}

// Fonction pour nettoyer et normaliser le nom d'un point relais
export function normalizeRelayName(relayName: string): string {
  const trimmed = relayName.trim();
  
  // Recherche par correspondance exacte d'abord
  const exactMatch = OFFICIAL_VELODYSSEE_RELAYS.find(relay => relay === trimmed);
  if (exactMatch) return exactMatch;
  
  // Recherche par correspondance partielle (pour gérer les variations mineures)
  const partialMatch = OFFICIAL_VELODYSSEE_RELAYS.find(relay => 
    relay.toLowerCase().includes(trimmed.toLowerCase()) ||
    trimmed.toLowerCase().includes(relay.toLowerCase())
  );
  
  return partialMatch || trimmed;
}