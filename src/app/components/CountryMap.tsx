"use client";

import React from "react";
import { Globe } from "lucide-react";
import type { TopItem } from "@/app/lib/enhanced-kpis";

interface CountryMapProps {
  countries: TopItem[];
  title: string;
}

// Codes ISO des pays les plus fréquents
const COUNTRY_INFO: Record<string, { name: string; flag: string; code: string }> = {
  FR: { name: "France", flag: "🇫🇷", code: "FR" },
  BE: { name: "Belgique", flag: "🇧🇪", code: "BE" },
  CH: { name: "Suisse", flag: "🇨🇭", code: "CH" },
  DE: { name: "Allemagne", flag: "🇩🇪", code: "DE" },
  ES: { name: "Espagne", flag: "🇪🇸", code: "ES" },
  IT: { name: "Italie", flag: "🇮🇹", code: "IT" },
  GB: { name: "Royaume-Uni", flag: "🇬🇧", code: "GB" },
  US: { name: "États-Unis", flag: "🇺🇸", code: "US" },
  CA: { name: "Canada", flag: "🇨🇦", code: "CA" },
  NL: { name: "Pays-Bas", flag: "🇳🇱", code: "NL" },
  PT: { name: "Portugal", flag: "🇵🇹", code: "PT" },
  IE: { name: "Irlande", flag: "🇮🇪", code: "IE" },
  LU: { name: "Luxembourg", flag: "🇱🇺", code: "LU" },
  AT: { name: "Autriche", flag: "🇦🇹", code: "AT" },
  SE: { name: "Suède", flag: "🇸🇪", code: "SE" },
  NO: { name: "Norvège", flag: "🇳🇴", code: "NO" },
  DK: { name: "Danemark", flag: "🇩🇰", code: "DK" },
  FI: { name: "Finlande", flag: "🇫🇮", code: "FI" },
};

export default function CountryMap({ countries, title }: CountryMapProps) {
  const getCountryInfo = (countryCode: string) => {
    const upperCode = countryCode.toUpperCase();
    return COUNTRY_INFO[upperCode] || { 
      name: countryCode, 
      flag: "🌍", 
      code: upperCode 
    };
  };

  const maxCount = Math.max(...countries.map(c => c.count));

  const getIntensityColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return "bg-blue-600";
    if (intensity > 0.6) return "bg-blue-500";
    if (intensity > 0.4) return "bg-blue-400";
    if (intensity > 0.2) return "bg-blue-300";
    return "bg-blue-200";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Globe size={20} className="text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>

      {countries.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-slate-500">
          Aucune donnée géographique disponible
        </div>
      ) : (
        <div className="space-y-4">
          {/* Légende */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Intensité :</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-200"></div>
              <span className="text-xs">Faible</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-400"></div>
              <span className="text-xs">Moyenne</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-600"></div>
              <span className="text-xs">Élevée</span>
            </div>
          </div>

          {/* Liste des pays */}
          <div className="grid grid-cols-1 gap-3">
            {countries.map((country) => {
              const info = getCountryInfo(country.name);
              return (
                <div
                  key={country.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${getIntensityColor(country.count)}`}></div>
                    <span className="text-2xl">{info.flag}</span>
                    <div>
                      <div className="font-medium text-slate-900">{info.name}</div>
                      <div className="text-xs text-slate-500">
                        {country.percentage.toFixed(1)}% du total
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">{country.count}</div>
                    <div className="text-xs text-slate-500">commandes</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistiques résumées */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">{countries.length}</div>
                <div className="text-xs text-slate-500">Pays</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {countries.reduce((sum, c) => sum + c.count, 0)}
                </div>
                <div className="text-xs text-slate-500">Total commandes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {countries[0]?.percentage.toFixed(1) || 0}%
                </div>
                <div className="text-xs text-slate-500">Top pays</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}