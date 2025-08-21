// Index kilométrique des points relais sur l'itinéraire de La Vélodyssée
// Roscoff (km 0) → Hendaye (km ~1200)

export const VELODYSSEE_KM_INDEX: Record<string, number> = {
  // À générer automatiquement via script de géocodage
  // Format: "Nom du point relais": position_km_sur_itinéraire
  
  // Points de référence connus (estimation)
  "Roscoff": 0,
  "Morlaix": 45,
  "Brest": 85,
  "Quimper": 165,
  "Lorient": 220,
  "Vannes": 280,
  "La Baule": 350,
  "Saint-Nazaire": 360,
  "Nantes": 400,
  "La Rochelle": 550,
  "Royan": 620,
  "Bordeaux": 750,
  "Arcachon": 780,
  "Biscarrosse": 850,
  "Dax": 950,
  "Biarritz": 1100,
  "Saint-Jean-de-Luz": 1150,
  "Hendaye": 1200
};

// Fonction de tri des points relais selon l'itinéraire Vélodyssée
export function sortByVelodysseeOrder(relayPoints: { name: string }[], reverse = false) {
  return relayPoints.sort((a, b) => {
    // Recherche du km pour chaque point relais
    const getKmForRelay = (relayName: string): number => {
      // Recherche exacte
      if (VELODYSSEE_KM_INDEX[relayName] !== undefined) {
        return VELODYSSEE_KM_INDEX[relayName];
      }
      
      // Recherche partielle par mots-clés de ville
      for (const [indexedName, km] of Object.entries(VELODYSSEE_KM_INDEX)) {
        if (relayName.toLowerCase().includes(indexedName.toLowerCase()) ||
            indexedName.toLowerCase().includes(relayName.toLowerCase())) {
          return km;
        }
      }
      
      // Si non trouvé, placer à la fin
      return 9999;
    };
    
    const kmA = getKmForRelay(a.name);
    const kmB = getKmForRelay(b.name);
    
    return reverse ? kmB - kmA : kmA - kmB;
  });
}

// TODO: Script de génération automatique de l'index complet
export async function generateVelodysseeIndex(relayNames: string[]): Promise<Record<string, number>> {
  // 1. Télécharger le GPX de La Vélodyssée depuis lavelodyssee.com
  // 2. Géocoder chaque point relais pour obtenir ses coordonnées
  // 3. Projeter chaque point sur l'itinéraire GPX
  // 4. Calculer la distance cumulée depuis Roscoff
  // 5. Retourner l'index complet
  
  console.log('🚴‍♂️ Génération de l\'index Vélodyssée pour', relayNames.length, 'points relais');
  console.log('📍 Cette fonctionnalité nécessite l\'implémentation du géocodage et du parsing GPX');
  
  return VELODYSSEE_KM_INDEX;
}