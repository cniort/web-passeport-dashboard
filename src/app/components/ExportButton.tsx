"use client";

import React, { useState } from "react";
import { Download, FileText, Image, Table } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { RawRow } from "@/app/lib/typeform";
import type { EnhancedKpis } from "@/app/lib/enhanced-kpis";

interface ExportButtonProps {
  data: RawRow[];
  kpis: EnhancedKpis;
  fileName?: string;
}

type ExportFormat = "csv" | "pdf" | "png";

export default function ExportButton({ data, kpis, fileName = "dashboard-export" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const exportToCSV = async () => {
    const headers = ["Date", "Passeports", "Pays", "Point relais", "Newsletter"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.orderDate || "",
        row.passports || "",
        row.country || "",
        row.relay || "",
        row.newsletter ? "Oui" : "Non"
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF();
    
    // Titre
    pdf.setFontSize(20);
    pdf.text("Dashboard - Opération Passeport", 20, 30);
    
    // Date d'export
    pdf.setFontSize(10);
    pdf.text(`Exporté le ${new Date().toLocaleDateString("fr-FR")}`, 20, 40);
    
    // KPIs principaux
    pdf.setFontSize(14);
    pdf.text("Indicateurs clés", 20, 60);
    
    pdf.setFontSize(10);
    let yPos = 75;
    
    const kpiTexts = [
      `Commandes totales : ${kpis.current.orders.toLocaleString("fr-FR")}`,
      `Passeports commandés : ${kpis.current.totalPassports.toLocaleString("fr-FR")}`,
      `Moyenne passeports/commande : ${kpis.current.avgPassportsPerOrder.toFixed(2)}`,
      `Points relais actifs : ${kpis.current.pointsRelaisCount}`,
      `Part France : ${kpis.current.frSharePct.toFixed(1)}%`,
      `Conversion newsletter : ${kpis.current.newsletterConvPct.toFixed(1)}%`,
    ];
    
    kpiTexts.forEach(text => {
      pdf.text(text, 20, yPos);
      yPos += 8;
    });
    
    // Top pays
    if (kpis.topCountries.length > 0) {
      yPos += 10;
      pdf.setFontSize(14);
      pdf.text("Top 5 pays", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      kpis.topCountries.slice(0, 5).forEach((country, index) => {
        pdf.text(`${index + 1}. ${country.name} : ${country.count} (${country.percentage.toFixed(1)}%)`, 25, yPos);
        yPos += 6;
      });
    }
    
    // Top points relais
    if (kpis.topRelays.length > 0) {
      yPos += 10;
      pdf.setFontSize(14);
      pdf.text("Top 5 points relais", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      kpis.topRelays.slice(0, 5).forEach((relay, index) => {
        pdf.text(`${index + 1}. ${relay.name} : ${relay.count} (${relay.percentage.toFixed(1)}%)`, 25, yPos);
        yPos += 6;
      });
    }
    
    pdf.save(`${fileName}.pdf`);
  };

  const exportToPNG = async () => {
    const dashboardElement = document.getElementById("dashboard-content");
    if (!dashboardElement) {
      alert("Impossible de capturer le dashboard");
      return;
    }

    const canvas = await html2canvas(dashboardElement, {
      scale: 2,
      backgroundColor: "#f8fafc",
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setShowDropdown(false);
    
    try {
      switch (format) {
        case "csv":
          await exportToCSV();
          break;
        case "pdf":
          await exportToPDF();
          break;
        case "png":
          await exportToPNG();
          break;
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert("Erreur lors de l'export. Veuillez réessayer.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    { format: "csv" as ExportFormat, label: "Exporter CSV", icon: Table, description: "Données brutes" },
    { format: "pdf" as ExportFormat, label: "Exporter PDF", icon: FileText, description: "Rapport résumé" },
    { format: "png" as ExportFormat, label: "Exporter PNG", icon: Image, description: "Capture d'écran" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          isExporting
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
        }`}
      >
        <Download size={16} />
        {isExporting ? "Export en cours..." : "Exporter"}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
          <div className="py-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Icon size={16} className="text-slate-500" />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}