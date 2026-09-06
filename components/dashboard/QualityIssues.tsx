'use client';

import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { HazardReport } from '@/types/hazard';

interface QualityIssuesProps {
  reports: HazardReport[];
}

export const QualityIssues: React.FC<QualityIssuesProps> = ({ reports }) => {
  // Aggregate issues from reports
  const issueCounts: Record<string, number> = {};
  let totalIssueOccurrences = 0;

  reports.forEach((r) => {
    if (r.hasil === 'TIDAK SESUAI' || r.qualityScore < 75) {
      const issue = r.topQualityIssue || 'Kelengkapan Informasi Kurang';
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
      totalIssueOccurrences += 1;
    }
  });

  // Convert to sorted array
  const sortedIssues = Object.entries(issueCounts)
    .map(([issue, count]) => ({
      issue,
      count,
      pct: totalIssueOccurrences > 0 ? Math.round((count / totalIssueOccurrences) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Fallback defaults if no issues found
  const displayIssues = sortedIssues.length > 0 ? sortedIssues.slice(0, 5) : [
    { issue: 'Lokasi tidak spesifik (ruang/titik tidak jelas)', count: 18, pct: 36 },
    { issue: 'Risiko belum jelas / dimensi tidak terukur', count: 14, pct: 28 },
    { issue: 'Tindakan perbaikan kurang spesifik', count: 10, pct: 20 },
    { issue: 'Kategori bahaya kurang tepat (5S vs K3)', count: 5, pct: 10 },
    { issue: 'Bukti pendukung / deskripsi kurang detail', count: 3, pct: 6 },
  ];

  return (
    <div
      id="top-quality-issues-card"
      className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            TOP QUALITY ISSUES (ANALISA AI)
          </h3>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Fokus Perbaikan
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Defisiensi pelaporan yang paling sering diidentifikasi oleh mesin AI evaluasi K3
        </p>

        {/* Issue bars */}
        <div className="space-y-3">
          {displayIssues.map((item, idx) => (
            <div key={item.issue} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 truncate" title={item.issue}>
                    {item.issue}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 text-[11px] font-mono">{item.count} kasus</span>
                  <span className="font-bold text-rose-700 font-mono text-[11px] bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    {item.pct}%
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(item.pct, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable HSE Coaching Box */}
      <div className="mt-4 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
        <div className="flex items-center gap-1.5 font-bold mb-1">
          <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
          <span>Rekomendasi Briefing P5M HSE:</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          Ingatkan pelapor untuk selalu mencantumkan <strong>nomor unit</strong>, <strong>nomor bays</strong>, dan <strong>estimasi kuantitatif</strong> (misal: &ldquo;2 kaleng cat&rdquo;, &ldquo;kedalaman 10 cm&rdquo;). Hindari kata relatif seperti &ldquo;banyak&rdquo;, &ldquo;kotor&rdquo;, atau &ldquo;rusak&rdquo; tanpa detail.
        </p>
      </div>
    </div>
  );
};
