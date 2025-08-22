import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Globe, ChevronDown, Download } from 'lucide-react';
import { formatDecimal } from '@/app/lib/format';

interface Country {
  name: string;
  code: string;
  orders: number;
  percentage: number;
  flag: string;
  passports: number;
}

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  totalOrders: number;
}

type SortOption = 'name-asc' | 'name-desc' | 'orders-asc' | 'orders-desc' | 'percentage-asc' | 'percentage-desc' | 'passports-asc' | 'passports-desc';
type ExportFormat = 'csv' | 'excel' | 'json';
type ContinentFilter = 'all' | 'europe' | 'america' | 'africa' | 'asia' | 'oceania';

export function CountryModal({ 
  isOpen, 
  onClose, 
  countries,
  totalOrders
}: CountryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('orders-desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [continentFilter, setContinentFilter] = useState<ContinentFilter>('all');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Gérer la fermeture par clic en dehors
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const sortOptions = [
    { value: 'name-asc' as SortOption, label: 'Nom par ordre alphabétique' },
    { value: 'name-desc' as SortOption, label: 'Nom par ordre alphabétique inverse' },
    { value: 'orders-desc' as SortOption, label: 'Commandes par ordre décroissant' },
    { value: 'orders-asc' as SortOption, label: 'Commandes par ordre croissant' },
    { value: 'passports-desc' as SortOption, label: 'Passeports par ordre décroissant' },
    { value: 'passports-asc' as SortOption, label: 'Passeports par ordre croissant' }
  ];

  const exportOptions = [
    { value: 'csv' as ExportFormat, label: 'CSV', description: 'Fichier texte séparé par virgules' },
    { value: 'excel' as ExportFormat, label: 'Excel', description: 'Classeur Microsoft Excel' },
    { value: 'json' as ExportFormat, label: 'JSON', description: 'Format de données structurées' }
  ];

  const continentOptions = [
    { value: 'all' as ContinentFilter, label: 'Tous les continents', emoji: '🌍' },
    { value: 'europe' as ContinentFilter, label: 'Europe', emoji: '🇪🇺' },
    { value: 'america' as ContinentFilter, label: 'Amériques', emoji: null },
    { value: 'africa' as ContinentFilter, label: 'Afrique', emoji: null },
    { value: 'asia' as ContinentFilter, label: 'Asie', emoji: null },
    { value: 'oceania' as ContinentFilter, label: 'Océanie', emoji: null }
  ];

  // Mapping des pays vers leurs continents
  const countryToContinent: Record<string, ContinentFilter> = {
    'Espagne': 'europe',
    'Allemagne': 'europe',
    'Royaume-Uni': 'europe',
    'Belgique': 'europe',
    'Italie': 'europe',
    'Pays-Bas': 'europe',
    'Suisse': 'europe',
    'Portugal': 'europe',
    'Irlande': 'europe',
    'Pologne': 'europe',
    'République tchèque': 'europe',
    'Autriche': 'europe',
    'Danemark': 'europe',
    'Suède': 'europe',
    'Norvège': 'europe',
    'Finlande': 'europe',
    'Russie': 'europe',
    'Ukraine': 'europe',
    'Roumanie': 'europe',
    'Hongrie': 'europe',
    'Bulgarie': 'europe',
    'Croatie': 'europe',
    'Slovénie': 'europe',
    'Grèce': 'europe',
    'États-Unis': 'america',
    'Canada': 'america',
    'Mexique': 'america',
    'Brésil': 'america',
    'Argentine': 'america',
    'Chili': 'america',
    'Pérou': 'america',
    'Colombie': 'america',
    'Venezuela': 'america',
    'Uruguay': 'america',
    'Équateur': 'america',
    'Bolivie': 'america',
    'Paraguay': 'america',
    'Costa Rica': 'america',
    'Guatemala': 'america',
    'Panama': 'america',
    'Nicaragua': 'america',
    'Honduras': 'america',
    'El Salvador': 'america',
    'Belize': 'america',
    'République dominicaine': 'america',
    'Haïti': 'america',
    'Jamaïque': 'america',
    'Cuba': 'america',
    'Chine': 'asia',
    'Japon': 'asia',
    'Corée du Sud': 'asia',
    'Inde': 'asia',
    'Thaïlande': 'asia',
    'Vietnam': 'asia',
    'Indonésie': 'asia',
    'Philippines': 'asia',
    'Malaisie': 'asia',
    'Singapour': 'asia',
    'Taiwan': 'asia',
    'Hong Kong': 'asia',
    'Israël': 'asia',
    'Turquie': 'asia',
    'Iran': 'asia',
    'Arabie saoudite': 'asia',
    'Émirats arabes unis': 'asia',
    'Qatar': 'asia',
    'Koweït': 'asia',
    'Liban': 'asia',
    'Jordanie': 'asia',
    'Syrie': 'asia',
    'Irak': 'asia',
    'Afghanistan': 'asia',
    'Pakistan': 'asia',
    'Bangladesh': 'asia',
    'Sri Lanka': 'asia',
    'Myanmar': 'asia',
    'Cambodge': 'asia',
    'Laos': 'asia',
    'Mongolie': 'asia',
    'Kazakhstan': 'asia',
    'Ouzbékistan': 'asia',
    'Kirghizistan': 'asia',
    'Tadjikistan': 'asia',
    'Turkménistan': 'asia',
    'Maroc': 'africa',
    'Algérie': 'africa',
    'Tunisie': 'africa',
    'Égypte': 'africa',
    'Libye': 'africa',
    'Soudan': 'africa',
    'Éthiopie': 'africa',
    'Kenya': 'africa',
    'Tanzanie': 'africa',
    'Ouganda': 'africa',
    'Rwanda': 'africa',
    'Burundi': 'africa',
    'République démocratique du Congo': 'africa',
    'République du Congo': 'africa',
    'Cameroun': 'africa',
    'Nigeria': 'africa',
    'Niger': 'africa',
    'Tchad': 'africa',
    'République centrafricaine': 'africa',
    'Gabon': 'africa',
    'Guinée équatoriale': 'africa',
    'São Tomé-et-Principe': 'africa',
    'Angola': 'africa',
    'Zambie': 'africa',
    'Zimbabwe': 'africa',
    'Botswana': 'africa',
    'Namibie': 'africa',
    'Afrique du Sud': 'africa',
    'Lesotho': 'africa',
    'Swaziland': 'africa',
    'Madagascar': 'africa',
    'Maurice': 'africa',
    'Seychelles': 'africa',
    'Comores': 'africa',
    'Djibouti': 'africa',
    'Érythrée': 'africa',
    'Somalie': 'africa',
    'Mali': 'africa',
    'Burkina Faso': 'africa',
    'Côte d\'Ivoire': 'africa',
    'Ghana': 'africa',
    'Togo': 'africa',
    'Bénin': 'africa',
    'Liberia': 'africa',
    'Sierra Leone': 'africa',
    'Guinée': 'africa',
    'Guinée-Bissau': 'africa',
    'Gambie': 'africa',
    'Sénégal': 'africa',
    'Mauritanie': 'africa',
    'Cap-Vert': 'africa',
    'Australie': 'oceania',
    'Nouvelle-Zélande': 'oceania',
    'Fidji': 'oceania',
    'Vanuatu': 'oceania',
    'Samoa': 'oceania',
    'Tonga': 'oceania',
    'Kiribati': 'oceania',
    'Tuvalu': 'oceania',
    'Nauru': 'oceania',
    'Palau': 'oceania',
    'Micronésie': 'oceania',
    'Îles Marshall': 'oceania',
    'Papouasie-Nouvelle-Guinée': 'oceania',
    'Îles Salomon': 'oceania'
  };

  // Filtrer et trier les pays
  const filteredAndSortedCountries = useMemo(() => {
    let filtered = countries;

    // Filtrer par continent
    if (continentFilter !== 'all') {
      filtered = filtered.filter(country => {
        const continent = countryToContinent[country.name];
        return continent === continentFilter;
      });
    }

    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(country => 
        country.name.toLowerCase().includes(term)
      );
    }

    // Trier selon l'option sélectionnée
    const sorted = [...filtered];
    
    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name, 'fr', { sensitivity: 'base' }));
        break;
      case 'orders-desc':
        sorted.sort((a, b) => b.orders - a.orders);
        break;
      case 'orders-asc':
        sorted.sort((a, b) => a.orders - b.orders);
        break;
      case 'passports-desc':
        sorted.sort((a, b) => b.passports - a.passports);
        break;
      case 'passports-asc':
        sorted.sort((a, b) => a.passports - b.passports);
        break;
      case 'percentage-desc':
        sorted.sort((a, b) => b.percentage - a.percentage);
        break;
      case 'percentage-asc':
        sorted.sort((a, b) => a.percentage - b.percentage);
        break;
    }

    return sorted;
  }, [countries, searchTerm, sortBy, continentFilter]);

  // Fonction d'export multi-format
  const exportDataWithFormat = (format: ExportFormat) => {
    const baseFileName = `pays-clientele-${currentSortLabel.toLowerCase().replace(/\s+/g, '-')}`;
    const headers = ['Rang', 'Pays', 'Pourcentage', 'Commandes', 'Passeports'];
    
    const data = filteredAndSortedCountries.map((country, index) => ({
      rang: index + 1,
      pays: country.name,
      pourcentage: formatDecimal(country.percentage) + '%',
      commandes: country.orders,
      passeports: country.passports
    }));

    let blob: Blob;
    let fileName: string;

    switch (format) {
      case 'csv':
        const csvData = [
          headers.join(','),
          ...data.map(row => [
            row.rang,
            `"${row.pays}"`,
            row.pourcentage,
            row.commandes,
            row.passeports
          ].join(','))
        ].join('\n');
        blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        fileName = `${baseFileName}.csv`;
        break;

      case 'excel':
        const excelData = '\uFEFF' + [
          headers.join('\t'),
          ...data.map(row => [
            row.rang,
            row.pays,
            row.pourcentage,
            row.commandes,
            row.passeports
          ].join('\t'))
        ].join('\n');
        blob = new Blob([excelData], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        fileName = `${baseFileName}.xls`;
        break;

      case 'json':
        const jsonData = JSON.stringify({
          metadata: {
            titre: 'Pays de la clientèle - Opération Passeport',
            tri: currentSortLabel,
            date_export: new Date().toISOString(),
            total_pays: filteredAndSortedCountries.length
          },
          colonnes: headers,
          donnees: data
        }, null, 2);
        blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
        fileName = `${baseFileName}.json`;
        break;

      default:
        return;
    }

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Commandes par ordre décroissant';

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Tous les pays
              </h2>
              <p className="text-sm text-gray-600">
                {countries.length} pays au total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>


        {/* Filtres et recherche */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un pays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Menu de tri */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[280px]"
              >
                <span className="text-sm font-medium text-gray-700">{currentSortLabel}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showSortMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[300px]">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        sortBy === option.value ? 'bg-green-50 text-green-900 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton d'export avec menu format */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                title="Exporter la liste filtrée"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exporter</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[220px]">
                  {exportOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setShowExportMenu(false);
                        exportDataWithFormat(option.value);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtres par continent */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filtrer par continent</h4>
          <div className="flex flex-wrap gap-2">
            {continentOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setContinentFilter(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  continentFilter === option.value
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {option.emoji && <span>{option.emoji}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Tableau des pays */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAndSortedCountries.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm.trim() ? 'Aucun pays trouvé pour cette recherche' : 'Aucun pays disponible'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-700 w-16">#</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Pays</th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-gray-700 w-24">Pourcentage</th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-gray-700 w-32">Commandes</th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-gray-700 w-32">Passeports</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedCountries.map((country, index) => (
                    <tr 
                      key={country.code} 
                      className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-bold text-green-900">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className="font-bold text-green-600">
                          {formatDecimal(country.percentage)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">
                        {country.orders.toLocaleString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">
                        {country.passports.toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}