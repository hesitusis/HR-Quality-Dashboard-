'use client';

import React, { useState } from 'react';
import { Award, Search, Eye, Filter, UserCheck, Trophy } from 'lucide-react';
import { ReporterStats, HazardReport } from '@/types/hazard';

interface TopReporterFullViewProps {
  reporters: ReporterStats[];
  reports: HazardReport[];
  onSelectReport: (report: HazardReport) => void;
}

export const TopReporterFullView: React.FC<TopReporterFullViewProps> = ({
  reporters,
  reports,
  onSelectReport,
}) => {
  const [search, setSearch] = useState('');
  const [selectedReporter, setSelectedReporter] = useState<ReporterStats | null>(null);

  const filtered = reporters.filter(
    (r) =>
      r.pelapor.toLowerCase().includes(search.toLowerCase()) ||
      r.nrp.toLowerCase().includes(search.toLowerCase()) ||
      r.perusahaan.toLowerCase().includes(search.toLowerCase())
  );

  const reporterReports = selectedReporter
    ? reports.filter((r) => r.nrpPelapor === selectedReporter.nrp)
    : [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              KLASEMEN LENGKAP TOP QUALITY REPORTER (SITE MIA 4)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Penghargaan diberikan kepada pelapor yang konsisten membuat Hazard Report berkualitas tinggi (objek bahaya jelas, risiko terukur, dan tindakan perbaikan aplikatif).
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pelapor / NRP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Grid: Leaderboard Table (8 cols) & Detail Drawer (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`${selectedReporter ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">Rank</th>
                  <th className="py-2.5 px-3">Nama Pelapor</th>
                  <th className="py-2.5 px-3">Perusahaan</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Laporan</th>
                  <th className="py-2.5 px-3 text-center">Laporan Sesuai</th>
                  <th className="py-2.5 px-3 text-right">Avg Quality Score</th>
                  <th className="py-2.5 px-3 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rep, idx) => {
                  const rank = idx + 1;
                  const isSelected = selectedReporter?.nrp === rep.nrp;

                  return (
                    <tr
                      key={rep.nrp}
                      onClick={() => setSelectedReporter(rep)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-bold">
                        {rank === 1 && '🥇'}
                        {rank === 2 && '🥈'}
                        {rank === 3 && '🥉'}
                        {rank > 3 && `#${rank}`}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{rep.pelapor}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NRP {rep.nrp}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{rep.perusahaan}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                        {rep.totalReports}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {rep.sesuaiReports} ({Math.round((rep.sesuaiReports / rep.totalReports) * 100)}%)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-black text-sm text-slate-900 font-mono">
                          {rep.averageScore.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400"> / 100</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          id={`btn-view-rep-${rep.nrp}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReporter(rep);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-amber-50 rounded-md border border-slate-200 hover:border-amber-300 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Reporter Detail Drawer (5 cols) */}
        {selectedReporter && (
          <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-amber-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Profil Pelapor Terpilih
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedReporter.pelapor}
                </h3>
                <div className="text-xs text-slate-500">
                  NRP: {selectedReporter.nrp} &bull; {selectedReporter.perusahaan}
                </div>
              </div>

              <button
                onClick={() => setSelectedReporter(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500">Avg Quality Score:</span>
                <div className="text-xl font-black text-emerald-700">
                  {selectedReporter.averageScore.toFixed(1)} / 100
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500">Tingkat Kesesuaian:</span>
                <div className="text-xl font-black text-slate-900">
                  {Math.round((selectedReporter.sesuaiReports / selectedReporter.totalReports) * 100)}%
                </div>
              </div>
            </div>

            {/* List of reports submitted by this reporter */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Daftar Laporan yang Dikirim ({reporterReports.length}):
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {reporterReports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => onSelectReport(rep)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 cursor-pointer text-xs space-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">
                        {rep.noHazardReport}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          rep.hasil === 'SESUAI'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        Score: {rep.qualityScore} ({rep.hasil})
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium line-clamp-1">{rep.temuan}</p>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{rep.area} &bull; {rep.lokasi}</span>
                      <span className="font-mono">{rep.tanggal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
