"use client";

import React from "react";
import { Mail, Users, TrendingUp } from "lucide-react";
import type { ComprehensiveKpis } from "@/app/lib/comprehensive-kpis";

interface NewsletterCardProps {
  kpis: ComprehensiveKpis;
  selectedYear?: number;
}

export function NewsletterCard({ kpis, selectedYear }: NewsletterCardProps) {
  
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  // Calcul du delta si comparaison disponible
  const deltaPercentage = kpis.comparison 
    ? kpis.newsletterPercentage - kpis.comparison.newsletterPercentage
    : 0;

  const deltaSubscriptions = kpis.comparison 
    ? kpis.newsletterSubscriptions - kpis.comparison.newsletterSubscriptions
    : 0;

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return "text-green-600";
    if (delta < 0) return "text-red-600";
    return "text-gray-500";
  };

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return "↗";
    if (delta < 0) return "↘";
    return "→";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Mail className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Newsletter - Abonnements
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre d'abonnements */}
        <div className="text-center p-4 rounded-lg bg-purple-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Abonnements</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 mb-1">
            {formatNumber(kpis.newsletterSubscriptions)}
          </div>
          {kpis.comparison && (
            <div className={`text-sm font-medium ${getDeltaColor(deltaSubscriptions)}`}>
              {getDeltaIcon(deltaSubscriptions)} {Math.abs(deltaSubscriptions)} vs {selectedYear ? selectedYear - 1 : 'précédent'}
            </div>
          )}
        </div>

        {/* Pourcentage */}
        <div className="text-center p-4 rounded-lg bg-green-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Taux d'abonnement</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mb-1">
            {formatPercentage(kpis.newsletterPercentage)}
          </div>
          {kpis.comparison && (
            <div className={`text-sm font-medium ${getDeltaColor(deltaPercentage)}`}>
              {getDeltaIcon(deltaPercentage)} {Math.abs(deltaPercentage).toFixed(1)}% vs {selectedYear ? selectedYear - 1 : 'précédent'}
            </div>
          )}
        </div>
      </div>

      {/* Détails supplémentaires */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-gray-900">
              {formatNumber(kpis.totalOrders)}
            </div>
            <div className="text-gray-600">Commandes totales</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {formatNumber(kpis.totalOrders - kpis.newsletterSubscriptions)}
            </div>
            <div className="text-gray-600">Non-abonnés</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {formatPercentage(100 - kpis.newsletterPercentage)}
            </div>
            <div className="text-gray-600">Taux de refus</div>
          </div>
        </div>
      </div>
    </div>
  );
}