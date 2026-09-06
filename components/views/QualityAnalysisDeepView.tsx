'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Building, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { HazardReport } from '@/types/hazard';

interface QualityAnalysisDeepViewProps {
  reports: HazardReport[];
}

export const QualityAnalysisDeepView: React.FC<QualityAnalysisDeepViewProps> = ({ reports }) => {
  // Aggregate Area quality
  const areaMap: Record<string, { total: number; scoreSum: number; sesuai: number }> = {};
  // Aggregate Hazard Category quality
  const catMap: Record<string, { total: number; scoreSum: number; sesuai: number }> = {};
  // Aggregate Company quality
  const compMap: Record<string, { total: number; scoreSum: number; sesuai: number }> = {};

  reports.forEach((r) => {
    // Area
    const area = r.area || 'Lainnya';
    if (!areaMap[area]) areaMap[area] = { total: 0, scoreSum: 0, sesuai: 0 };
    areaMap[area].total += 1;
    areaMap[area].scoreSum += r.qualityScore;
    if (r.hasil === 'SESUAI') areaMap[area].sesuai += 1;

    // Hazard category
    const cat = r.kategoriBahaya || 'Lainnya';
    if (!catMap[cat]) catMap[cat] = { total: 0, scoreSum: 0, sesuai: 0 };
    catMap[cat].total += 1;
    catMap[cat].scoreSum += r.qualityScore;
    if (r.hasil === 'SESUAI') catMap[cat].sesuai += 1;

    // Company
    const comp = r.perusahaanPelapor || 'Lainnya';
    if (!compMap[comp]) compMap[comp] = { total: 0, scoreSum: 0, sesuai: 0 };
    compMap[comp].total += 1;
    compMap[comp].scoreSum += r.qualityScore;
    if (r.hasil === 'SESUAI') compMap[comp].sesuai += 1;
  });

  const areaData = Object.entries(areaMap)
    .map(([name, data]) => ({
      name,
      avgScore: Number((data.scoreSum / data.total).toFixed(1)),
      total: data.total,
      sesuaiRate: Math.round((data.sesuai / data.total) * 100),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  const catData = Object.entries(catMap)
    .map(([name, data]) => ({
      name,
      avgScore: Number((data.scoreSum / data.total).toFixed(1)),
      total: data.total,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  const compData = Object.entries(compMap)
    .map(([name, data]) => ({
      name,
      avgScore: Number((data.scoreSum / data.total).toFixed(1)),
      total: data.total,
      sesuaiRate: Math.round((data.sesuai / data.total) * 100),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            DEEP QUALITY ANALYSIS &amp; CROSS-CORRELATION
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Analisis mendalam perbandingan mutu pelaporan hazard berdasarkan Area Kerja, Kategori Bahaya K3, dan Entitas Perusahaan Pelapor.
        </p>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Quality Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Rata-rata Skor Kualitas per Area Kerja
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Area mana yang memiliki deskripsi temuan &amp; tindakan paling spesifik
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      name === 'avgScore' ? `${val} / 100` : `${val}%`,
                      name === 'avgScore' ? 'Avg Quality Score' : 'Tingkat Sesuai (%)',
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="avgScore" name="Avg Quality Score" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sesuaiRate" name="Tingkat Sesuai (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hazard Category Quality */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Skor Mutu per Kategori Bahaya K3
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Perbandingan kualitas pelaporan pada kategori fisik, mekanikal, kimia, dll.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: any) => [`${val} / 100`, 'Avg Score']} />
                  <Bar dataKey="avgScore" name="Avg Score" fill="#d97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Company Benchmark Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              BENCHMARK KUALITAS ENTITAS PERUSAHAAN (ITU vs Mitra Kerja)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Standard Target: &ge; 70.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Perusahaan Pelapor</th>
                <th className="py-2.5 px-3 text-center">Total Hazard Laporan</th>
                <th className="py-2.5 px-3 text-center">Rasio SESUAI</th>
                <th className="py-2.5 px-3 text-right">Average Quality Score</th>
                <th className="py-2.5 px-3 text-center">Status Audit Mutu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {compData.map((c) => {
                const isPassed = c.avgScore >= 70;
                return (
                  <tr key={c.name} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-700">{c.total} laporan</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-800">
                      {c.sesuaiRate}%
                    </td>
                    <td className="py-3 px-3 text-right font-black text-sm text-slate-900">
                      {c.avgScore.toFixed(1)} / 100
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{isPassed ? 'MEMENUHI TARGET' : 'COACHING K3 DIBUTUHKAN'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
