import React, { useMemo, useState } from 'react';
import { Users, Flag, Home, Globe, ChevronDown, ChevronRight } from 'lucide-react';
import type { ComprehensiveKpis } from '@/app/lib/comprehensive-kpis';
import type { RawRow } from "@/app/lib/supabase-data";
import { formatDecimal } from '@/app/lib/format';

interface ClienteleCardProps {
  kpis: ComprehensiveKpis;
  rawData?: RawRow[];
  selectedYear?: number;
}

interface CountryData {
  name: string;
  code: string;
  count: number;
  percentage: number;
  flag: string;
}

export function ClienteleCard({ kpis, rawData, selectedYear = 2025 }: ClienteleCardProps) {
  const [showAllCountries, setShowAllCountries] = useState(false);

  // Mapping complet pour normaliser tous les pays
  const countryNormalization: Record<string, string> = {
    // Allemagne
    'allemagne': 'Allemagne',
    'Allemagne': 'Allemagne', 
    'Allmagne': 'Allemagne',
    'Germany': 'Allemagne',
    'Deutschland': 'Allemagne',
    
    // Espagne  
    'Espagne': 'Espagne',
    'ESPAGNE': 'Espagne',
    'españa': 'Espagne',
    'España': 'Espagne',
    'ESPAÑA': 'Espagne',
    'Espanya': 'Espagne',
    'spain': 'Espagne',
    'Spain': 'Espagne',
    'SPAIN': 'Espagne',
    'l\'Espagne': 'Espagne',
    'Barcelona (España)': 'Espagne',
    'Catalunya': 'Espagne',
    'Navarra': 'Espagne',
    'Sant Vicenç de Torello': 'Espagne',
    'Spain, Basque Country': 'Espagne',
    'Basque country': 'Espagne',
    'Galiza': 'Espagne',
    
    // Royaume-Uni
    'Royaume Uni': 'Royaume-Uni',
    'Royaume-Uni': 'Royaume-Uni',
    'Anglaterre': 'Royaume-Uni',
    'Angleterre': 'Royaume-Uni', 
    'England': 'Royaume-Uni',
    'grande bretagne': 'Royaume-Uni',
    'U.K.': 'Royaume-Uni',
    'Uk': 'Royaume-Uni',
    'UK': 'Royaume-Uni',
    'United Kingdom': 'Royaume-Uni',
    'scotland': 'Royaume-Uni',
    'Cornwall': 'Royaume-Uni',
    'Pays de Galles': 'Royaume-Uni',
    
    // Belgique
    'belgique': 'Belgique',
    'Belgique': 'Belgique',
    'BELGIQUE': 'Belgique',
    'belgium': 'Belgique',
    'Belgium': 'Belgique', 
    'BELGIUM': 'Belgique',
    'belgië': 'Belgique',
    'La Belgique': 'Belgique',
    
    // Pays-Bas
    'Holland': 'Pays-Bas',
    'Nederland': 'Pays-Bas',
    'Netherlands': 'Pays-Bas',
    'Les Pays Bas': 'Pays-Bas',
    'Pays Bas': 'Pays-Bas',
    'Pays-Bas': 'Pays-Bas',
    
    // Italie
    'italia': 'Italie',
    'Italia': 'Italie',
    'ITALIA': 'Italie',
    'italie': 'Italie',
    'Italie': 'Italie',
    'italy': 'Italie',
    'Italy': 'Italie',
    
    // Suisse
    'suisse': 'Suisse',
    'Suisse': 'Suisse',
    'Suissz': 'Suisse',
    'Swiss': 'Suisse',
    'Switzerland': 'Suisse',
    'Schweiz': 'Suisse',
    
    // États-Unis
    'Etats-units': 'États-Unis',
    'Les États-Unis': 'États-Unis',
    'USA': 'États-Unis',
    
    // Canada
    'Canada': 'Canada',
    'CANADA': 'Canada',
    'Québec (Canada)': 'Canada',
    'Québec Canada': 'Canada',
    'Québec, Canada': 'Canada',
    
    // Autres pays normalisés
    'Argentina': 'Argentine',
    'Australia': 'Australie',
    'Autriche': 'Autriche',
    'Colombia': 'Colombie',
    'Corée du Sud': 'Corée du Sud',
    'France': 'France',
    'Guadeloupe': 'France (Outre-mer)',
    'Nouvelle Calédonie': 'France (Outre-mer)',
    'Polynésie français e': 'France (Outre-mer)',
    'Ireland': 'Irlande',
    'Irlandais': 'Irlande',
    'Luxembourg': 'Luxembourg',
    'New Zealand': 'Nouvelle-Zélande',
    'Nouvelle Zelande': 'Nouvelle-Zélande',
    'Norvége': 'Norvège',
    'Peroù': 'Pérou',
    'Portugal': 'Portugal',
    'Romania': 'Roumanie',
    'Slovenia': 'Slovénie',
    'Tchéquie': 'République tchèque',
    'Ukraine': 'Ukraine',
    'Venezuela': 'Venezuela',
    'Körle': 'Corée du Sud',
    'Julliet': 'Inconnu'
    // Note: 'We are excited to ride from Roscoff to Hendaye in April and May' supprimé (erreur de saisie)
  };

  // Calculer les données détaillées par pays
  const countriesData = useMemo(() => {
    if (!rawData) return [];

    // Filtrer les données pour l'année sélectionnée  
    const currentYearData = rawData.filter(row => {
      const orderDate = row.orderDate ? new Date(row.orderDate) : null;
      return orderDate && orderDate.getFullYear() === selectedYear;
    });

    const totalYearlyOrders = kpis.totalOrders;

    // Calculer les données par pays normalisés
    const normalizedCountryCounts: Record<string, number> = {};
    
    currentYearData.forEach(row => {
      const rawCountry = row.country || 'Inconnu';
      // Normaliser le nom du pays
      const normalizedCountry = countryNormalization[rawCountry] || rawCountry;
      
      // Exclure la France et les territoires français du calcul étranger
      if (normalizedCountry !== 'France' && normalizedCountry !== 'France (Outre-mer)') {
        normalizedCountryCounts[normalizedCountry] = (normalizedCountryCounts[normalizedCountry] || 0) + 1;
      }
    });

    // Mapping étendu des pays avec leurs drapeaux
    const countryMapping: Record<string, { name: string; flag: string }> = {
      'Espagne': { name: 'Espagne', flag: '🇪🇸' },
      'Allemagne': { name: 'Allemagne', flag: '🇩🇪' },
      'Royaume-Uni': { name: 'Royaume-Uni', flag: '🇬🇧' },
      'Belgique': { name: 'Belgique', flag: '🇧🇪' },
      'Pays-Bas': { name: 'Pays-Bas', flag: '🇳🇱' },
      'Italie': { name: 'Italie', flag: '🇮🇹' },
      'Suisse': { name: 'Suisse', flag: '🇨🇭' },
      'États-Unis': { name: 'États-Unis', flag: '🇺🇸' },
      'Canada': { name: 'Canada', flag: '🇨🇦' },
      'Argentine': { name: 'Argentine', flag: '🇦🇷' },
      'Australie': { name: 'Australie', flag: '🇦🇺' },
      'Autriche': { name: 'Autriche', flag: '🇦🇹' },
      'Colombie': { name: 'Colombie', flag: '🇨🇴' },
      'Corée du Sud': { name: 'Corée du Sud', flag: '🇰🇷' },
      'Irlande': { name: 'Irlande', flag: '🇮🇪' },
      'Luxembourg': { name: 'Luxembourg', flag: '🇱🇺' },
      'Nouvelle-Zélande': { name: 'Nouvelle-Zélande', flag: '🇳🇿' },
      'Norvège': { name: 'Norvège', flag: '🇳🇴' },
      'Pérou': { name: 'Pérou', flag: '🇵🇪' },
      'Portugal': { name: 'Portugal', flag: '🇵🇹' },
      'Roumanie': { name: 'Roumanie', flag: '🇷🇴' },
      'Slovénie': { name: 'Slovénie', flag: '🇸🇮' },
      'République tchèque': { name: 'République tchèque', flag: '🇨🇿' },
      'Ukraine': { name: 'Ukraine', flag: '🇺🇦' },
      'Venezuela': { name: 'Venezuela', flag: '🇻🇪' },
    };

    // Construire la liste des pays avec leurs données  
    const countries: CountryData[] = [];
    
    Object.entries(normalizedCountryCounts).forEach(([country, count]) => {
      if (country !== 'Inconnu') {
        const percentage = totalYearlyOrders > 0 ? (count / totalYearlyOrders) * 100 : 0;
        const countryInfo = countryMapping[country];
        
        countries.push({
          name: countryInfo?.name || country,
          code: country,
          count,
          percentage,
          flag: countryInfo?.flag || '🏴'
        });
      }
    });

    // Trier par nombre de commandes décroissant
    return countries.sort((a, b) => b.count - a.count);
  }, [rawData, selectedYear, kpis.totalOrders, countryNormalization]);

  const frenchPercentage = kpis.frenchClientele;
  const foreignPercentage = kpis.foreignClientele.totalPercentage;
  
  // Séparer les 5 premiers pays du reste
  const topCountries = countriesData.slice(0, 5);
  const remainingCountries = countriesData.slice(5);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Clientèles
        </h3>
      </div>

      {/* KPIs Français/Étrangers */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Clientèle française</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-1">
            {formatDecimal(frenchPercentage)}%
          </div>
          <div className="text-xs text-blue-700">
            {(() => {
              const count = Math.round((frenchPercentage / 100) * kpis.totalOrders);
              return `${count.toLocaleString('fr-FR')} commande${count > 1 ? 's' : ''}`;
            })()}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Clientèle étrangère</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mb-1">
            {formatDecimal(foreignPercentage)}%
          </div>
          <div className="text-xs text-green-700">
            {(() => {
              const count = Math.round((foreignPercentage / 100) * kpis.totalOrders);
              return `${count.toLocaleString('fr-FR')} commande${count > 1 ? 's' : ''}`;
            })()}
          </div>
        </div>
      </div>

      {/* Détail par pays */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Répartition par pays</h4>
        
        {/* Top 5 pays toujours visibles */}
        {topCountries.map((country) => (
          <div key={country.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm text-gray-600">{country.name}</span>
            </div>
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-blue-600 font-semibold">{formatDecimal(country.percentage)}%</span>
              <span>{country.count.toLocaleString('fr-FR')} commande{country.count > 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
        
        {/* Bouton pour afficher/masquer les autres pays */}
        {remainingCountries.length > 0 && (
          <>
            <div 
              onClick={() => setShowAllCountries(!showAllCountries)}
              className="flex items-center justify-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors group"
            >
              <div className="flex items-center gap-2">
                {showAllCountries ? (
                  <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {showAllCountries ? 'Masquer' : 'Voir'} les autres pays ({remainingCountries.length})
                </span>
              </div>
            </div>
            
            {/* Pays supplémentaires (dépliables) */}
            {showAllCountries && (
              <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-2">
                {remainingCountries.map((country) => (
                  <div key={country.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm text-gray-600">{country.name}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="text-blue-600 font-semibold">{formatDecimal(country.percentage)}%</span>
                      <span>{country.count.toLocaleString('fr-FR')} commande{country.count > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}