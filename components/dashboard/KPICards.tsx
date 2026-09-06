'use client';

import React from 'react';
import {
  FileText,
  Brain,
  Gauge,
  CheckCircle2,
  Users,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';

interface KPICardsProps {
  totalReports: number;
  aiAssessedCount: number;
  averageScore: number;
  sesuaiCount: number;
  activeReportersCount: number;
  bestReporter: {
    name: string;
    score: number;
    count: number;
  };
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalReports,
  aiAssessedCount,
  averageScore,
  sesuaiCount,
  activeReportersCount,
  bestReporter,
}) => {
  const aiAssessedPct = totalReports > 0 ? Math.round((aiAssessedCount / totalReports) * 100) : 0;
  const sesuaiPct = totalReports > 0 ? Math.round((sesuaiCount / totalReports) * 100) : 0;

  // Score category label & color
  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 70) return { label: 'Good', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 50) return { label: 'Need Improvement', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Poor', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const scoreBadge = getScoreBadge(averageScore);

  return (
    <div id="kpi-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {/* 1. Total Hazard Report */}
      <div
        id="kpi-total-report"
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Hazard Report
          </span>
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black tracking-tight text-slate-900">
            {totalReports.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span>Volume laporan terfilter</span>
          </div>
        </div>
      </div>

      {/* 2. AI Assessed */}
      <div
        id="kpi-ai-assessed"
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            AI Assessed
          </span>
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
            <Brain className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black tracking-tight text-slate-900">
              {aiAssessedCount.toLocaleString()}
            </div>
            <span className="text-xs font-bold text-purple-800 bg-purple-100/70 px-1.5 py-0.5 rounded">
              {aiAssessedPct}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium truncate">
            Terverifikasi Model AI
          </div>
        </div>
      </div>

      {/* 3. Average Quality Score */}
      <div
        id="kpi-avg-score"
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Avg Quality Score
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <div className="text-2xl font-black tracking-tight text-slate-900">
              {averageScore.toFixed(1)}
            </div>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${scoreBadge.color}`}
            >
              {scoreBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Report Sesuai */}
      <div
        id="kpi-report-sesuai"
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Report Sesuai
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black tracking-tight text-slate-900">
              {sesuaiCount.toLocaleString()}
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              {sesuaiPct}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium truncate">
            Standar HSE Terpenuhi
          </div>
        </div>
      </div>

      {/* 5. Pelapor Aktif */}
      <div
        id="kpi-pelapor-aktif"
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pelapor Aktif
          </span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black tracking-tight text-slate-900">
            {activeReportersCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium truncate">
            Karyawan &amp; Mitra Terlibat
          </div>
        </div>
      </div>

      {/* 6. Best Reporter */}
      <div
        id="kpi-best-reporter"
        className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-4 border border-amber-300 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-amber-800 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Best Reporter
          </span>
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 truncate" title={bestReporter.name}>
            {bestReporter.name || 'Belum Ada Data'}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-amber-900 font-medium">
            <span>Score: <strong className="text-amber-800">{bestReporter.score.toFixed(1)}</strong></span>
            <span>{bestReporter.count} lap.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
