"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onCancel: () => void;
  onApply: () => void;
  compareStartDate?: string;
  compareEndDate?: string;
  onCompareRangeChange?: (startDate: string | undefined, endDate: string | undefined) => void;
}

const monthNames = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

const weekDays = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  onCancel,
  onApply,
  compareStartDate,
  compareEndDate,
  onCompareRangeChange
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Gérer la fermeture par clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);
  
  // Fonction pour recentrer le calendrier sur aujourd'hui
  const centerCalendarOnToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };
  const [tempStartDate, setTempStartDate] = useState(startDate || "");
  const [tempEndDate, setTempEndDate] = useState(endDate || "");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [enableComparison, setEnableComparison] = useState(!!(compareStartDate && compareEndDate));
  const [tempCompareStartDate, setTempCompareStartDate] = useState(compareStartDate || "");
  const [tempCompareEndDate, setTempCompareEndDate] = useState(compareEndDate || "");

  const presets = [
    { id: "today", label: "Aujourd'hui" },
    { id: "thisWeek", label: "Cette semaine" },
    { id: "thisMonth", label: "Ce mois" },
    { id: "thisYear", label: "Cette année" }
  ];

  const applyPreset = (presetId: string) => {
    const now = new Date();
    let start: Date, end: Date;

    switch (presetId) {
      case "today":
        start = end = new Date(now);
        break;
      case "thisWeek":
        start = new Date(now);
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si dimanche (0), aller 6 jours en arrière pour lundi
        start.setDate(now.getDate() + mondayOffset);
        end = new Date(now);
        break;
      case "thisMonth":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Dernier jour du mois
        break;
      case "thisYear":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31); // 31 décembre
        break;
      default:
        return;
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    
    setTempStartDate(startStr);
    setTempEndDate(endStr);
    setSelectedPreset(presetId);
    
    // Recentrer le calendrier sur la date actuelle pour les raccourcis
    if (['today', 'thisWeek', 'thisMonth', 'thisYear'].includes(presetId)) {
      centerCalendarOnToday();
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
  };

  const renderCalendar = (monthOffset: number = 0) => {
    const displayMonth = currentMonth + monthOffset;
    const displayYear = currentYear + Math.floor(displayMonth / 12);
    const normalizedMonth = ((displayMonth % 12) + 12) % 12;

    const daysInMonth = getDaysInMonth(normalizedMonth, displayYear);
    const firstDay = getFirstDayOfMonth(normalizedMonth, displayYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${displayYear}-${String(normalizedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isStart = dateStr === tempStartDate;
      const isEnd = dateStr === tempEndDate;
      const isInRange = tempStartDate && tempEndDate && dateStr >= tempStartDate && dateStr <= tempEndDate;
      
      // Vérifier si c'est aujourd'hui
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      
      days.push(
        <button
          key={day}
          onClick={() => {
            if (!tempStartDate || (tempStartDate && tempEndDate)) {
              setTempStartDate(dateStr);
              setTempEndDate("");
              setSelectedPreset("custom");
            } else {
              if (dateStr < tempStartDate) {
                setTempStartDate(dateStr);
                setTempEndDate(tempStartDate);
              } else {
                setTempEndDate(dateStr);
              }
            }
          }}
          className={`h-8 w-8 text-sm rounded-md transition-colors font-medium ${
            isToday
              ? "bg-orange-200 text-orange-900 font-bold"
              : isStart || isEnd
              ? "bg-blue-600 text-white"
              : isInRange
              ? "bg-blue-100 text-blue-900"
              : "hover:bg-gray-100 text-gray-800"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          
          <h3 className="font-semibold text-center flex-1 text-gray-900">
            {monthNames[normalizedMonth]} {displayYear}
          </h3>
          
          {monthOffset === 1 && (
            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateRangeChange(tempStartDate, tempEndDate);
      if (onCompareRangeChange) {
        onCompareRangeChange(
          enableComparison && tempCompareStartDate ? tempCompareStartDate : undefined,
          enableComparison && tempCompareEndDate ? tempCompareEndDate : undefined
        );
      }
      onApply();
    }
  };

  return (
    <div ref={pickerRef} className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-4xl overflow-hidden">
      <div className="flex gap-6 p-6">
        {/* Sidebar with presets */}
        <div className="w-48 flex-shrink-0">
          <div className="space-y-1 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedPreset === preset.id
                    ? "bg-blue-100 text-blue-900"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={() => {
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                setTempStartDate(todayStr);
                setTempEndDate(todayStr);
                setSelectedPreset("custom");
                centerCalendarOnToday();
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors font-medium ${
                selectedPreset === "custom"
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-gray-100 text-gray-900"
              }`}
            >
              Date libre
            </button>
          </div>
        </div>

        {/* Calendar section */}
        <div className="flex-1">
          <div className="flex gap-8">
            {renderCalendar(0)}
            {renderCalendar(1)}
          </div>
          
          {/* Date inputs */}
          <div className="space-y-4 mt-6 pt-4">
            <div className="absolute left-0 right-0 h-px bg-gray-200"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900">Du :</label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => {
                    setTempStartDate(e.target.value);
                    setSelectedPreset("custom");
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900">Au :</label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => {
                    setTempEndDate(e.target.value);
                    setSelectedPreset("custom");
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
            
            {/* Comparaison */}
            {onCompareRangeChange && (
              <div className="pt-3 relative">
                <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="enable-comparison"
                    checked={enableComparison}
                    onChange={(e) => setEnableComparison(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-comparison" className="text-sm font-medium text-gray-900">
                    Comparer avec une période précédente
                  </label>
                </div>
                {enableComparison && (
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Du :</label>
                        <input
                          type="date"
                          value={tempCompareStartDate}
                          onChange={(e) => setTempCompareStartDate(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Au :</label>
                        <input
                          type="date"
                          value={tempCompareEndDate}
                          onChange={(e) => setTempCompareEndDate(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 px-6">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm rounded-md transition-colors border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 font-medium"
        >
          Annuler
        </button>
        <button
          onClick={handleApply}
          disabled={!tempStartDate || !tempEndDate}
          className="px-3 py-2 text-sm rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Appliquer
        </button>
        </div>
      </div>
    </div>
  );
}