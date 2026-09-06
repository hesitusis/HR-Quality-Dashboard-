'use client';

import React from 'react';
import { ShieldAlert, BarChart3, HelpCircle } from 'lucide-react';
import { QualityCategory } from '@/types/hazard';

interface DistributionStats {
  excellent: number;
  good: number;
  needImprovement: number;
  poor: number;
  total: number;
}

interface QualityDistributionProps {
  stats: DistributionStats;
}

export const QualityDistribution: React.FC<QualityDistributionProps> = ({ stats }) => {
  const total = stats.total || 1;

  const categories = [
    {
      category: 'Excellent' as QualityCategory,
      range: '85 – 100',
      count: stats.excellent,
      pct: Math.round((stats.excellent / total) * 100),
      color: 'bg-emerald-500',
      bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Sangat spesifik, risiko terukur, tindakan jelas & foto memadai',
    },
    {
      category: 'Good' as QualityCategory,
      range: '70 – 84',
      count: stats.good,
      pct: Math.round((stats.good / total) * 100),
      color: 'bg-blue-500',
      bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Memenuhi standar K3, lokasi jelas, butuh penyempurnaan kecil',
    },
    {
      category: 'Need Improvement' as QualityCategory,
      range: '50 – 69',
      count: stats.needImprovement,
      pct: Math.round((stats.needImprovement / total) * 100),
      color: 'bg-amber-500',
      bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Lokasi/ukuran masih umum, deskripsi subjektif atau 5S',
    },
    {
      category: 'Poor' as QualityCategory,
      range: '< 50',
      count: stats.poor,
      pct: Math.round((stats.poor / total) * 100),
      color: 'bg-rose-500',
      bgBadge: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: 'Sangat abstrak, lokasi tidak diketahui, tidak terukur',
    },
  ];

  return (
    <div
      id="quality-distribution-card"
      className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
    >
      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            DISTRIBUSI KUALITAS LAPORAN
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">
            Total: {stats.total} Laporan
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Pengelompokan mutu berdasarkan 5 parameter standar HSE
        </p>

        {/* Visual Progress Bar Representation */}
        <div className="space-y-3.5">
          {categories.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${item.bgBadge}`}>
                    {item.category}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    ({item.range})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.count}</span>
                  <span className="text-slate-400 font-medium text-[11px]">
                    ({item.pct}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-400 truncate">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parameter Weights Box */}
      <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
        <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>Bobot Rubrik Penilaian (100%):</span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
            5 Parameter K3
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] text-slate-600">
          <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900">25%</span> Identifikasi Hazard
          </div>
          <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900">20%</span> Identifikasi Risiko
          </div>
          <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900">20%</span> Tindakan Pengendalian
          </div>
          <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="font-bold text-slate-900">20%</span> Kelengkapan Info
          </div>
          <div className="bg-white p-1.5 rounded border border-slate-200 col-span-2 sm:col-span-1">
            <span className="font-bold text-slate-900">15%</span> Bukti Pendukung
          </div>
        </div>
      </div>
    </div>
  );
};
