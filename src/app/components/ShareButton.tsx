"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Send, Check, Copy } from "lucide-react";

export default function ShareButton() {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    try {
      // Copier l'URL actuelle dans le presse-papiers
      await navigator.clipboard.writeText(window.location.href);
      
      // Afficher le feedback
      setShowCopied(true);
      
      // Masquer le feedback après 2 secondes
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la copie de l'URL:", error);
      // Fallback en cas d'erreur
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="px-3 py-2 text-sm rounded-md transition-colors border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 font-medium flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        Partager
      </button>
      
      {/* Popup animée de confirmation */}
      {showCopied && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Lien copié !
          </div>
          {/* Triangle pointer */}
          <div className="absolute -top-1 right-4 w-2 h-2 bg-emerald-600 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}