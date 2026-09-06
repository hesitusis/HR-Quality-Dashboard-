'use client';

import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X, SlidersHorizontal, CalendarDays } from 'lucide-react';
import { FilterOptions } from '@/types/hazard';

interface FilterPanelProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  monthCounts: {
    all: number;
    mei: number;
    juni: number;
    juli: number;
  };
  options: {
    areas: string[];
    subAreas: string[];
    perusahaanPelapor: string[];
    perusahaanTerlapor: string[];
    kategoriTemuan: string[];
    kategoriBahaya: string[];
    levelRisiko: string[];
    statusReport: string[];
    aiStatus: string[];
  };
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  monthCounts,
  options,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = [
    filters.month !== 'Semua Bulan' ? 1 : 0,
    filters.area !== 'Semua Area' ? 1 : 0,
    filters.subArea !== 'Semua Sub Area' ? 1 : 0,
    filters.perusahaanPelapor !== 'Semua Perusahaan' ? 1 : 0,
    filters.perusahaanTerlapor !== 'Semua Terlapor' ? 1 : 0,
    filters.kategoriTemuan !== 'Semua Kategori Temuan' ? 1 : 0,
    filters.kategoriBahaya !== 'Semua Kategori Bahaya' ? 1 : 0,
    filters.levelRisiko !== 'Semua Level Risiko' ? 1 : 0,
    filters.statusReport !== 'Semua Status Report' ? 1 : 0,
    filters.aiStatus !== 'Semua Status AI' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const months = [
    { label: 'Semua Bulan', value: 'Semua Bulan', count: monthCounts.all },
    { label: 'Mei 2026', value: 'Mei 2026', count: monthCounts.mei },
    { label: 'Juni 2026', value: 'Juni 2026', count: monthCounts.juni },
    { label: 'Juli 2026', value: 'Juli 2026', count: monthCounts.juli },
  ];

  const handleMonthChange = (monthValue: string) => {
    setFilters((prev) => ({
      ...prev,
      month: monthValue,
      period: monthValue === 'Semua Bulan' ? 'Mei – Juli 2026' : monthValue,
    }));
  };

  const handleReset = () => {
    setFilters({
      period: 'Mei – Juli 2026',
      month: 'Semua Bulan',
      area: 'Semua Area',
      subArea: 'Semua Sub Area',
      perusahaanPelapor: 'Semua Perusahaan',
      perusahaanTerlapor: 'Semua Terlapor',
      kategoriTemuan: 'Semua Kategori Temuan',
      kategoriBahaya: 'Semua Kategori Bahaya',
      risikoUtama: 'Semua Risiko Utama',
      levelRisiko: 'Semua Level Risiko',
      statusReport: 'Semua Status Report',
      searchQuery: '',
      aiStatus: 'Semua Status AI',
    });
  };

  return (
    <div
      id="filter-panel"
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs mb-6 overflow-hidden"
    >
      {/* Primary Bar: Month Switcher & Quick Controls */}
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
        {/* Month Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-2 shrink-0">
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            <span>Bulan Analisa:</span>
          </div>

          <div className="inline-flex p-1 bg-slate-200/70 rounded-lg shrink-0 gap-1">
            {months.map((m) => {
              const isSelected = filters.month === m.value;
              return (
                <button
                  key={m.value}
                  id={`filter-month-${m.value.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleMonthChange(m.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white text-emerald-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <span>{m.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'bg-slate-300/60 text-slate-600'
                    }`}
                  >
                    {m.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bersihkan ({activeFilterCount})</span>
            </button>
          )}

          <button
            id="toggle-advanced-filters"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isExpanded || activeFilterCount > 0
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Lanjutan</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Multi-dimension Filters */}
      {isExpanded && (
        <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 border-t border-slate-100 text-xs">
          {/* Area */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Area Kerja
            </label>
            <select
              id="filter-select-area"
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Area">Semua Area</option>
              {options.areas.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Area */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sub Area
            </label>
            <select
              id="filter-select-subarea"
              value={filters.subArea}
              onChange={(e) => setFilters({ ...filters, subArea: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Sub Area">Semua Sub Area</option>
              {options.subAreas.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Perusahaan Pelapor */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Perusahaan Pelapor
            </label>
            <select
              id="filter-select-perusahaan-pelapor"
              value={filters.perusahaanPelapor}
              onChange={(e) => setFilters({ ...filters, perusahaanPelapor: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Perusahaan">Semua Perusahaan Pelapor</option>
              {options.perusahaanPelapor.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Perusahaan Terlapor */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Perusahaan Terlapor
            </label>
            <select
              id="filter-select-perusahaan-terlapor"
              value={filters.perusahaanTerlapor}
              onChange={(e) => setFilters({ ...filters, perusahaanTerlapor: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Terlapor">Semua Terlapor (ITU/SIS/ADARO)</option>
              {options.perusahaanTerlapor.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori Temuan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kategori Temuan
            </label>
            <select
              id="filter-select-kategori-temuan"
              value={filters.kategoriTemuan}
              onChange={(e) => setFilters({ ...filters, kategoriTemuan: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Kategori Temuan">Semua Kategori Temuan</option>
              {options.kategoriTemuan.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori Bahaya */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kategori Bahaya
            </label>
            <select
              id="filter-select-kategori-bahaya"
              value={filters.kategoriBahaya}
              onChange={(e) => setFilters({ ...filters, kategoriBahaya: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Kategori Bahaya">Semua Kategori Bahaya</option>
              {options.kategoriBahaya.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Level Risiko */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Level Risiko
            </label>
            <select
              id="filter-select-level-risiko"
              value={filters.levelRisiko}
              onChange={(e) => setFilters({ ...filters, levelRisiko: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Level Risiko">Semua Level Risiko</option>
              {options.levelRisiko.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Status AI Assessment */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Status Kualitas AI
            </label>
            <select
              id="filter-select-ai-status"
              value={filters.aiStatus}
              onChange={(e) => setFilters({ ...filters, aiStatus: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            >
              <option value="Semua Status AI">Semua Status AI</option>
              <option value="SESUAI">SESUAI (Memenuhi Standar)</option>
              <option value="TIDAK SESUAI">TIDAK SESUAI (Perlu Perbaikan)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
