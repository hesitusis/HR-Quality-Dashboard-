'use client';

import React from 'react';
import { Award, Eye, UserCheck, ShieldCheck, ChevronRight } from 'lucide-react';
import { ReporterStats } from '@/types/hazard';

interface TopReporterProps {
  reporters: ReporterStats[];
  onSelectReporter: (reporterName: string) => void;
  onViewReporterDetail?: (reporter: ReporterStats) => void;
}

export const TopReporter: React.FC<TopReporterProps> = ({
  reporters,
  onSelectReporter,
  onViewReporterDetail,
}) => {
  const top5 = reporters.slice(0, 5);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 border border-amber-300 text-base shadow-xs" title="Juara 1">
            🥇
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-base shadow-xs" title="Juara 2">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 border border-amber-200 text-base shadow-xs" title="Juara 3">
            🥉
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div
      id="top-reporters-card"
      className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            TOP QUALITY REPORTER (TOP 5)
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Kualitas &gt; Kuantitas
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Ranking pelapor dengan rata-rata Quality Score tertinggi pada periode terpilih
        </p>

        {/* List / Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2 px-2 text-center w-12">Rank</th>
                <th className="py-2 px-3">Pelapor</th>
                <th className="py-2 px-3 text-center">Jumlah Report</th>
                <th className="py-2 px-3 text-right">Avg Quality Score</th>
                <th className="py-2 px-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {top5.map((rep, idx) => {
                const rank = idx + 1;
                const isWinner = rank === 1;

                return (
                  <tr
                    key={rep.pelapor}
                    className={`hover:bg-slate-50 transition-colors ${
                      isWinner ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-2.5 px-2 text-center">
                      {getRankBadge(rank)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="truncate">{rep.pelapor}</span>
                        {isWinner && (
                          <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                            Leader
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>NRP: {rep.nrp}</span>
                        <span>•</span>
                        <span className="truncate max-w-[140px]">{rep.perusahaan}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">
                        {rep.totalReports} lap.
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="font-black text-sm text-slate-900">
                        {rep.averageScore.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium">
                        {rep.sesuaiReports} Sesuai ({Math.round((rep.sesuaiReports / rep.totalReports) * 100)}%)
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        id={`btn-view-reporter-${rep.nrp}`}
                        onClick={() => {
                          if (onViewReporterDetail) onViewReporterDetail(rep);
                          else onSelectReporter(rep.pelapor);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 rounded-md border border-slate-200 hover:border-emerald-300 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>View Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {top5.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada pelapor yang cocok dengan filter aktif.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Evaluasi: Skor dihitung dari rata-rata 5 parameter K3 per laporan.</span>
        <button
          onClick={() => onSelectReporter('')}
          className="text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
        >
          Lihat Semua Pelapor &rarr;
        </button>
      </div>
    </div>
  );
};
