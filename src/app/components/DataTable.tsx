"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import type { RawRow } from "@/app/lib/typeform";
import { formatNumber } from "@/app/lib/format";

interface DataTableProps {
  data: RawRow[];
  title: string;
  maxRows?: number;
}

type SortField = keyof RawRow;
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function DataTable({ data, title, maxRows = 100 }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const columns = [
    { key: "orderDate" as SortField, label: "Date", type: "date" },
    { key: "passports" as SortField, label: "Passeports", type: "number" },
    { key: "country" as SortField, label: "Pays", type: "text" },
    { key: "relay" as SortField, label: "Point relais", type: "text" },
    { key: "newsletter" as SortField, label: "Newsletter", type: "boolean" },
  ];

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((row) => {
      // Recherche textuelle
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.values(row).some((value) =>
          String(value || "").toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Filtres par colonne
      for (const [field, filterValue] of Object.entries(filters)) {
        if (filterValue) {
          const rowValue = String(row[field as keyof RawRow] || "").toLowerCase();
          if (!rowValue.includes(filterValue.toLowerCase())) {
            return false;
          }
        }
      }

      return true;
    });

    // Tri
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];

        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;

        return sortConfig.direction === "desc" ? comparison * -1 : comparison;
      });
    }

    return filtered.slice(0, maxRows);
  }, [data, sortConfig, searchTerm, filters, maxRows]);

  const handleSort = (field: SortField) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        return {
          field,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCellValue = (value: unknown, type: string) => {
    if (value === null || value === undefined) return "—";

    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString("fr-FR");
      case "number":
        return formatNumber(Number(value), 0);
      case "boolean":
        return value ? "Oui" : "Non";
      default:
        return String(value);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig?.field !== field) {
      return <ChevronDown size={14} className="text-slate-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} className="text-slate-600" />
    ) : (
      <ChevronDown size={14} className="text-slate-600" />
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1 text-sm transition-colors ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter size={14} />
              Filtres
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {columns.map((column) => (
              <div key={column.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {column.label}
                </label>
                <input
                  type="text"
                  placeholder={`Filtrer ${column.label.toLowerCase()}...`}
                  value={filters[column.key] || ""}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hover:bg-slate-100"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredAndSortedData.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {formatCellValue(row[column.key], column.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          Aucune donnée ne correspond aux critères de recherche
        </div>
      )}

      {data.length > maxRows && (
        <div className="border-t border-slate-200 px-6 py-3 text-center text-sm text-slate-500">
          Affichage de {Math.min(filteredAndSortedData.length, maxRows)} sur {data.length} entrées
        </div>
      )}
    </div>
  );
}