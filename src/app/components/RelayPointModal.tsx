import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, ChevronDown, Download } from 'lucide-react';
import { formatDecimal } from '@/app/lib/format';

interface RelayPoint {
  name: string;
  orders: number;
  percentage: number;
  passports: number;
}

interface RelayPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  relayCounts: Record<string, number>;
  relayPassportCounts: Record<string, number>;
  totalYearlyOrders: number;
}

type SortOption = 'geographic-ns' | 'geographic-sn' | 'orders-asc' | 'orders-desc' | 'passports-asc' | 'passports-desc';

export function RelayPointModal({ 
  isOpen, 
  onClose, 
  relayCounts, 
  relayPassportCounts, 
  totalYearlyOrders 
}: RelayPointModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('geographic-ns');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { value: 'geographic-ns' as SortOption, label: 'Nord au Sud' },
    { value: 'geographic-sn' as SortOption, label: 'Sud au Nord' },
    { value: 'orders-desc' as SortOption, label: 'Commandes par ordre décroissant' },
    { value: 'orders-asc' as SortOption, label: 'Commandes par ordre croissant' },
    { value: 'passports-desc' as SortOption, label: 'Passeports par ordre décroissant' },
    { value: 'passports-asc' as SortOption, label: 'Passeports par ordre croissant' }
  ];

  // Convertir les données en format utilisable
  const relayPoints: RelayPoint[] = useMemo(() => {
    return Object.entries(relayCounts).map(([name, orders]) => ({
      name,
      orders,
      percentage: totalYearlyOrders > 0 ? (orders / totalYearlyOrders) * 100 : 0,
      passports: relayPassportCounts[name] || 0
    }));
  }, [relayCounts, relayPassportCounts, totalYearlyOrders]);

  // Filtrer et trier les points relais
  const filteredAndSortedPoints = useMemo(() => {
    let filtered = relayPoints;

    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(point => 
        point.name.toLowerCase().includes(term)
      );
    }

    // Trier selon l'option sélectionnée
    const sorted = [...filtered];
    
    switch (sortBy) {
      case 'geographic-ns':
        // Tri géographique nord-sud (ordre alphabétique par défaut)
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
        break;
      case 'geographic-sn':
        // Tri géographique sud-nord (ordre alphabétique inversé)
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
    }

    return sorted;
  }, [relayPoints, searchTerm, sortBy]);

  // Fonction d'export
  const exportToCSV = () => {
    const headers = ['Rang', 'Nom du point relais', 'Pourcentage', 'Commandes', 'Passeports'];
    const csvData = [
      headers.join(','),
      ...filteredAndSortedPoints.map((point, index) => [
        index + 1,
        `"${point.name}"`,
        formatDecimal(point.percentage) + '%',
        point.orders,
        point.passports
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `points-relais-${currentSortLabel.toLowerCase().replace(/\s+/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Nord au Sud';

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Tous les points relais
              </h2>
              <p className="text-sm text-gray-600">
                {relayPoints.length} point{relayPoints.length <= 1 ? '' : 's'} relais au total
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
                  placeholder="Rechercher un point relais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-500"
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
                        sortBy === option.value ? 'bg-amber-50 text-amber-900 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton d'export */}
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-colors"
              title="Exporter la liste filtrée en CSV"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Exporter</span>
            </button>
          </div>

          {/* Résultats de recherche */}
          {searchTerm.trim() && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                {filteredAndSortedPoints.length} résultat{filteredAndSortedPoints.length <= 1 ? '' : 's'} 
                pour &ldquo;{searchTerm}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Liste des points relais */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAndSortedPoints.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm.trim() ? 'Aucun point relais trouvé pour cette recherche' : 'Aucun point relais disponible'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredAndSortedPoints.map((point, index) => (
                <div key={point.name} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-amber-900 w-8">#{index + 1}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{point.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      <span className="font-bold text-amber-600">{formatDecimal(point.percentage)}%</span>&nbsp;&nbsp;{point.orders.toLocaleString('fr-FR')} commandes ｜ {point.passports.toLocaleString('fr-FR')} passeports
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}