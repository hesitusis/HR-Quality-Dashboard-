'use client';

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
  Eye,
  Zap,
  Sliders,
  Check,
} from 'lucide-react';
import { HazardReport } from '@/types/hazard';

interface AIAssessmentAuditViewProps {
  reports: HazardReport[];
  onSelectReport: (report: HazardReport) => void;
  onBatchAnalyze: () => void;
}

export const AIAssessmentAuditView: React.FC<AIAssessmentAuditViewProps> = ({
  reports,
  onSelectReport,
  onBatchAnalyze,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'sesuai' | 'perlu-perbaikan'>('all');
  const [search, setSearch] = useState('');
  const [isSimulatingBatch, setIsSimulatingBatch] = useState(false);

  const filtered = reports.filter((r) => {
    if (filterType === 'sesuai' && r.hasil !== 'SESUAI') return false;
    if (filterType === 'perlu-perbaikan' && r.hasil === 'SESUAI') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.pelapor.toLowerCase().includes(q) ||
        r.temuan.toLowerCase().includes(q) ||
        r.noHazardReport.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBatch = () => {
    setIsSimulatingBatch(true);
    setTimeout(() => {
      onBatchAnalyze();
      setIsSimulatingBatch(false);
    }, 1200);
  };

  const totalAssessed = reports.length;
  const totalSesuai = reports.filter((r) => r.hasil === 'SESUAI').length;
  const totalTidakSesuai = reports.filter((r) => r.hasil === 'TIDAK SESUAI').length;
  const avgScore = (reports.reduce((acc, r) => acc + r.qualityScore, 0) / (totalAssessed || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 rounded-2xl p-6 text-white border border-purple-800/40 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Gemini 3.8 Flash HSE Quality Engine</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              AI Assessment Audit Hub &bull; ITU SISADMO
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Sistem mengevaluasi setiap laporan berdasarkan 3 parameter baku K3: presisi lokasi bahaya (bobot 40%), spesifisitas objek bahaya (bobot 30%), dan kuantifikasi serta objektivitas risiko (bobot 30%).
            </p>
          </div>

          <button
            id="btn-run-batch-ai"
            disabled={isSimulatingBatch}
            onClick={handleBatch}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all self-start md:self-auto shrink-0"
          >
            <RotateCw className={`w-4 h-4 ${isSimulatingBatch ? 'animate-spin' : ''}`} />
            <span>{isSimulatingBatch ? 'Menjalankan Audit AI...' : 'Jalankan Audit AI Massal'}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Total Dinilai AI</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalAssessed}</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Laporan SESUAI</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {totalSesuai}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({Math.round((totalSesuai / (totalAssessed || 1)) * 100)}%)
              </span>
            </div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Perlu Perbaikan</div>
            <div className="text-2xl font-black text-rose-400 mt-0.5">
              {totalTidakSesuai}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({Math.round((totalTidakSesuai / (totalAssessed || 1)) * 100)}%)
              </span>
            </div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Rata-rata Score</div>
            <div className="text-2xl font-black text-purple-300 mt-0.5">{avgScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Filter and List Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Laporan ({reports.length})
            </button>
            <button
              onClick={() => setFilterType('sesuai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'sesuai'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sesuai Standar ({totalSesuai})
            </button>
            <button
              onClick={() => setFilterType('perlu-perbaikan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'perlu-perbaikan'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Perlu Perbaikan ({totalTidakSesuai})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pelapor / temuan / area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Audit Cards Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const isSesuai = r.hasil === 'SESUAI';
            return (
              <div
                key={r.id}
                onClick={() => onSelectReport(r)}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {r.noHazardReport}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSesuai
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {r.hasil}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      <span className="text-xs font-black text-slate-900">{r.qualityScore}</span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 mb-1 line-clamp-2">
                    {r.temuan}
                  </div>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                    <span>Pelapor: <strong className="text-slate-800">{r.pelapor}</strong></span>
                    <span>&bull;</span>
                    <span>{r.area} ({r.lokasi})</span>
                    {r.statusLokasi && (
                      <span
                        className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          r.statusLokasi === 'SPESIFIK'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : r.statusLokasi === 'KURANG SPESIFIK'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {r.statusLokasi === 'SPESIFIK' ? '✓ Lokasi Jelas' : r.statusLokasi === 'KURANG SPESIFIK' ? '⚠ Lokasi Kurang Spesifik' : '✕ Lokasi Tidak Spesifik'}
                      </span>
                    )}
                    <span>&bull;</span>
                    <span className="font-mono text-slate-400">{r.tanggal}</span>
                  </div>

                  {/* AI Snippet Feedback */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed mb-2">
                    <div className="flex items-center gap-1 font-bold text-purple-900 mb-0.5">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Evaluasi AI:</span>
                    </div>
                    <p className="line-clamp-2">{r.penilaian}</p>
                  </div>

                  {/* Recommendation pill */}
                  {r.aiRecommendation && (
                    <div className="text-[10px] text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-200 line-clamp-1">
                      💡 <strong>Saran:</strong> {r.aiRecommendation}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Kategori: {r.kategoriTemuan} &bull; Risiko: {r.levelRisiko}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectReport(r);
                    }}
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
                  >
                    <span>Audit Detail</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
              Tidak ada laporan yang sesuai kriteria pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
