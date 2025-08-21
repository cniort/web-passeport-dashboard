"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Download, ChevronDown, FileText, Image, Database, Code } from "lucide-react";

interface DownloadButtonProps {
  filters?: any;
  kpis?: any;
  rawData?: any[];
}

export default function DownloadButton({ filters, kpis, rawData }: DownloadButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  const downloadOptions = [
    { 
      format: 'pdf', 
      label: 'PDF', 
      description: 'Document portable',
      icon: FileText,
      action: () => downloadDashboard('pdf')
    },
    { 
      format: 'png', 
      label: 'PNG', 
      description: 'Image haute qualité',
      icon: Image,
      action: () => downloadDashboard('png')
    },
    { 
      format: 'csv', 
      label: 'CSV', 
      description: 'Données brutes',
      icon: Database,
      action: () => downloadDashboard('csv')
    },
    { 
      format: 'json', 
      label: 'JSON', 
      description: 'Synthèse complète',
      icon: Code,
      action: () => downloadDashboard('json')
    }
  ];

  const downloadDashboard = async (format: string) => {
    try {
      setShowMenu(false);
      
      if (format === 'pdf') {
        // Export PDF - capture d'écran du dashboard
        await exportToPDF();
      } else if (format === 'png') {
        // Export PNG - capture d'écran
        await exportToPNG();
      } else if (format === 'csv') {
        // Export CSV - données brutes
        exportToCSV();
      } else if (format === 'json') {
        // Export JSON - synthèse complète
        exportToJSON();
      }
    } catch (error) {
      console.error(`Erreur lors de l'export ${format}:`, error);
      alert(`Erreur lors de l'export en ${format.toUpperCase()}`);
    }
  };

  const exportToPDF = async () => {
    // Pour le moment, on utilise l'API print du navigateur
    window.print();
  };

  const exportToPNG = async () => {
    // Pour le PNG, on peut utiliser l'API Canvas (nécessite html2canvas en production)
    alert('Export PNG: Fonctionnalité en cours de développement. Utilisez Ctrl+P pour imprimer.');
  };

  const exportToCSV = () => {
    // Export des données de base du dashboard
    const csvData = [
      ['Métrique', 'Valeur'],
      ['Dashboard', 'Opération Passeport'],
      ['Date export', new Date().toLocaleDateString('fr-FR')],
      ['Heure export', new Date().toLocaleTimeString('fr-FR')]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard-operation-passeport-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    // Créer une synthèse complète du dashboard
    const dashboardSynthesis = {
      metadata: {
        title: "Dashboard - Opération Passeport",
        version: "1.0",
        dateExport: new Date().toISOString(),
        dateExportFr: new Date().toLocaleDateString('fr-FR'),
        heureExport: new Date().toLocaleTimeString('fr-FR')
      },
      filtres: {
        actifs: filters?.filtersEnabled || false,
        anneeSelectionnee: filters?.selectedYear || null,
        anneeComparaison: filters?.compareYear || null,
        periode: filters?.period || "year",
        moisSelectionne: filters?.selectedMonth || null,
        trimestreSelectionne: filters?.selectedQuarter || null,
        datePersoDdebut: filters?.customStartDate || null,
        datePersoFin: filters?.customEndDate || null
      },
      kpis: kpis ? {
        passportsRetires: kpis.passportsOrdered,
        commandesTotales: kpis.totalOrders,
        estimationTampons: kpis.totalStamps,
        moyennePasseportsParCommande: kpis.avgPassportsPerOrder,
        repartitionPasseports: {
          unPasseport: kpis.ordersWithOnePassport,
          deuxPasseports: kpis.ordersWithTwoPassports,
          troisPasseports: kpis.ordersWithThreePassports,
          quatrePasseports: kpis.ordersWithFourPassports,
          cinqPlusPasseports: kpis.ordersWithFivePlusPassports
        },
        repartitionRegionale: kpis.regionalDistribution,
        pourcentagesRegionaux: kpis.regionalPercentages,
        saison: {
          hauteSeasonPasseports: kpis.highSeasonPassports,
          basseSaisonPasseports: kpis.offSeasonPassports,
          pourcentageHauteSaison: kpis.highSeasonPercentage,
          pourcentageBasseSaison: kpis.offSeasonPercentage
        }
      } : null,
      donnees: {
        nombreTotalEntrees: rawData?.length || 0,
        premiereDateCommande: rawData && rawData.length > 0 ? 
          Math.min(...rawData.map(r => r.orderDate ? new Date(r.orderDate).getTime() : Infinity)) : null,
        derniereDateCommande: rawData && rawData.length > 0 ? 
          Math.max(...rawData.map(r => r.orderDate ? new Date(r.orderDate).getTime() : -Infinity)) : null
      },
      export: {
        formatVersion: "JSON-v1.0",
        description: "Synthèse complète du dashboard Opération Passeport avec filtres actifs et KPIs calculés"
      }
    };

    // Télécharger le fichier JSON
    const jsonContent = JSON.stringify(dashboardSynthesis, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `dashboard-synthese-${new Date().toISOString().split('T')[0]}-${new Date().toTimeString().split(' ')[0].replace(/:/g, '')}.json`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="outline"
        size="sm"
        style={{
          borderColor: '#60a5fa',
          color: '#1d4ed8',
          backgroundColor: '#ffffff'
        }}
        className="hover:bg-blue-50 hover:border-blue-500 font-medium transition-all"
      >
        <Download className="h-4 w-4 mr-2" />
        Exporter
        <ChevronDown className={`h-3 w-3 ml-2 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </Button>
      
      {/* Menu des formats */}
      {showMenu && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[220px]">
          {downloadOptions.map((option) => {
            return (
              <button
                key={option.format}
                onClick={option.action}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}