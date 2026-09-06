'use client';

import React from 'react';
import {
  ShieldAlert,
  Calendar,
  Sparkles,
  Download,
  RotateCw,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface DashboardHeaderProps {
  activePeriod: string;
  totalFiltered: number;
  totalAll: number;
  onResetFilters: () => void;
  onExportData: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activePeriod,
  totalFiltered,
  totalAll,
  onResetFilters,
  onExportData,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header
      id="dashboard-header"
      className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs sticky top-0 z-20"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Titles */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI HAZARD REPORT QUALITY DASHBOARD
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              AI Verified
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600">
            <span>Monitoring &amp; Penilaian Kualitas Hazard Report Berbasis AI</span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-100">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activePeriod}</span>
            </div>
            {totalFiltered !== totalAll && (
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                Filter aktif: {totalFiltered} dari {totalAll} laporan
              </span>
            )}
          </div>
        </div>

        {/* Right Search & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Cari temuan, pelapor, no HR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <button
            id="reset-filter-btn"
            onClick={onResetFilters}
            title="Reset Filter"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            id="export-data-btn"
            onClick={onExportData}
            title="Export CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
