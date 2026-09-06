'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { HazardReport } from '@/types/hazard';

interface HazardReportTableProps {
  reports: HazardReport[];
  onSelectReport: (report: HazardReport) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

type SortField = 'tanggal' | 'pelapor' | 'qualityScore' | 'levelRisiko' | 'noHazardReport';
type SortOrder = 'asc' | 'desc';

export const HazardReportTable: React.FC<HazardReportTableProps> = ({
  reports,
  onSelectReport,
  searchQuery,
  setSearchQuery,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<SortField>('qualityScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all | SESUAI | TIDAK SESUAI

  // Handle sort toggles
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...reports];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.hasil === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.noHazardReport.toLowerCase().includes(q) ||
          r.pelapor.toLowerCase().includes(q) ||
          r.temuan.toLowerCase().includes(q) ||
          r.lokasi.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.penilaian.toLowerCase().includes(q) ||
          r.noPICA.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'qualityScore') {
        valA = a.qualityScore;
        valB = b.qualityScore;
      } else if (sortField === 'levelRisiko') {
        const order: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        valA = order[a.levelRisiko] || 0;
        valB = order[b.levelRisiko] || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [reports, searchQuery, statusFilter, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSorted.length / pageSize) || 1;
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  // Risk level badge
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">MEDIUM</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">LOW</span>;
    }
  };

  return (
    <div
      id="hazard-report-table-card"
      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-6"
    >
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              DATASET HAZARD REPORT &amp; QUALITY SCORING
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredAndSorted.length} laporan hazard terfilter
            </p>
          </div>

          {/* Fast Status Tab Switcher */}
          <div className="hidden lg:flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg text-xs">
            <button
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({reports.length})
            </button>
            <button
              onClick={() => { setStatusFilter('SESUAI'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'SESUAI' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sesuai ({reports.filter((r) => r.hasil === 'SESUAI').length})
            </button>
            <button
              onClick={() => { setStatusFilter('TIDAK SESUAI'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'TIDAK SESUAI' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tidak Sesuai ({reports.filter((r) => r.hasil === 'TIDAK SESUAI').length})
            </button>
          </div>
        </div>

        {/* Search & Page Size */}
        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tabel..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value={10}>10 baris</option>
            <option value={15}>15 baris</option>
            <option value={25}>25 baris</option>
            <option value={50}>50 baris</option>
          </select>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead className="bg-slate-100/80 sticky top-0 z-10 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap text-center">Aksi</th>
              <th
                onClick={() => handleSort('qualityScore')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Quality Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">Status AI</th>
              <th
                onClick={() => handleSort('noHazardReport')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>No Hazard Report</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">No PICA</th>
              <th
                onClick={() => handleSort('tanggal')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Tanggal</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pelapor')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Pelapor</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">Perusahaan</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Area / Sub Area</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Lokasi</th>
              <th className="py-2.5 px-3 whitespace-nowrap min-w-[220px]">Temuan Bahaya</th>
              <th
                onClick={() => handleSort('levelRisiko')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Level Risiko</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">Status Report</th>
              <th className="py-2.5 px-3 whitespace-nowrap">PIC</th>
              <th className="py-2.5 px-3 whitespace-nowrap min-w-[200px]">Tindakan Perbaikan</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Status PICA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {paginatedReports.map((report) => {
              const isSesuai = report.hasil === 'SESUAI';

              return (
                <tr
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="hover:bg-slate-50/90 cursor-pointer transition-colors"
                >
                  {/* Action */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`btn-open-detail-${report.id}`}
                      onClick={() => onSelectReport(report)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="Lihat Evaluasi AI Detail"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  {/* Quality Score */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-sm text-slate-900">
                        {report.qualityScore}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          report.qualityCategory === 'Excellent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : report.qualityCategory === 'Good'
                            ? 'bg-blue-100 text-blue-800'
                            : report.qualityCategory === 'Need Improvement'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {report.qualityCategory}
                      </span>
                    </div>
                  </td>

                  {/* Status AI */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isSesuai
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {isSesuai ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                      )}
                      <span>{report.hasil}</span>
                    </span>
                  </td>

                  {/* No Hazard Report */}
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-slate-900">
                    {report.noHazardReport}
                  </td>

                  {/* No PICA */}
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-500">
                    {report.noPICA !== '-' ? report.noPICA : '—'}
                  </td>

                  {/* Tanggal */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                    {report.tanggal}
                  </td>

                  {/* Pelapor */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{report.pelapor}</div>
                    <div className="text-[10px] text-slate-400 font-mono">NRP {report.nrpPelapor}</div>
                  </td>

                  {/* Perusahaan */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                    <div>{report.perusahaanPelapor}</div>
                    <div className="text-[10px] text-slate-400">Terlapor: {report.perusahaanTerlapor}</div>
                  </td>

                  {/* Area */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                    <div>{report.area}</div>
                    {report.subArea !== '-' && (
                      <div className="text-[10px] text-slate-400">{report.subArea}</div>
                    )}
                  </td>

                  {/* Lokasi & Status Presisi */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 min-w-[150px] max-w-[200px]">
                    <div className="font-medium truncate text-xs text-slate-900" title={report.lokasi}>
                      {report.lokasi}
                    </div>
                    {report.statusLokasi && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 border ${
                          report.statusLokasi === 'SPESIFIK'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : report.statusLokasi === 'KURANG SPESIFIK'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {report.statusLokasi === 'SPESIFIK'
                          ? '✓ Lokasi Spesifik'
                          : report.statusLokasi === 'KURANG SPESIFIK'
                          ? '⚠ Kurang Spesifik'
                          : '✕ Tidak Spesifik'}
                      </span>
                    )}
                  </td>

                  {/* Temuan */}
                  <td className="py-2.5 px-3 text-slate-900 font-medium max-w-[240px]" title={report.temuan}>
                    <p className="line-clamp-2 leading-relaxed text-xs">
                      {report.temuan}
                    </p>
                  </td>

                  {/* Level Risiko */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {getRiskBadge(report.levelRisiko)}
                  </td>

                  {/* Status Report */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {report.statusReport}
                    </span>
                  </td>

                  {/* PIC */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                    {report.pic !== '-' ? report.pic : '—'}
                  </td>

                  {/* Tindakan Perbaikan */}
                  <td className="py-2.5 px-3 text-slate-600 max-w-[200px]" title={report.tindakanPerbaikan}>
                    <p className="line-clamp-2 text-[11px]">
                      {report.tindakanPerbaikan !== '-' ? report.tindakanPerbaikan : '—'}
                    </p>
                  </td>

                  {/* Status PICA */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        report.statusPICA === 'Closed'
                          ? 'bg-slate-100 text-slate-700'
                          : report.statusPICA === 'Open'
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {report.statusPICA}
                    </span>
                  </td>
                </tr>
              );
            })}

            {paginatedReports.length === 0 && (
              <tr>
                <td colSpan={16} className="py-12 text-center text-slate-400">
                  Tidak ditemukan laporan yang sesuai kriteria pencarian / filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
        <div>
          Menampilkan {(currentPage - 1) * pageSize + 1} &ndash;{' '}
          {Math.min(currentPage * pageSize, filteredAndSorted.length)} dari{' '}
          {filteredAndSorted.length} laporan
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            id="table-prev-page"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          <span className="px-3 py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg">
            {currentPage} / {totalPages}
          </span>

          <button
            id="table-next-page"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
