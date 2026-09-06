'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface MonthlyTrendPoint {
  month: string;
  avgScore: number;
  sesuaiPct: number;
  tidakSesuaiPct: number;
  totalReports: number;
}

interface QualityTrendChartProps {
  data: MonthlyTrendPoint[];
}

export const QualityTrendChart: React.FC<QualityTrendChartProps> = ({ data }) => {
  // Calculate trend between earliest and latest available month
  let trendType: 'meningkat' | 'stabil' | 'menurun' = 'stabil';
  let diff = 0;

  if (data.length >= 2) {
    const firstScore = data[0].avgScore;
    const lastScore = data[data.length - 1].avgScore;
    diff = Number((lastScore - firstScore).toFixed(1));

    if (diff > 1.5) trendType = 'meningkat';
    else if (diff < -1.5) trendType = 'menurun';
    else trendType = 'stabil';
  }

  const getTrendBadge = () => {
    if (trendType === 'meningkat') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          Tren Meningkat (+{diff} Poin)
        </span>
      );
    }
    if (trendType === 'menurun') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
          Tren Menurun ({diff} Poin)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
        <Minus className="w-3.5 h-3.5 text-blue-600" />
        Tren Stabil ({diff >= 0 ? `+${diff}` : diff} Poin)
      </span>
    );
  };

  return (
    <div
      id="quality-trend-chart-card"
      className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              TREND QUALITY SCORE (Mei → Juni → Juli 2026)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Perkembangan Average Quality Score, rasio Sesuai vs Tidak Sesuai per bulan
          </p>
        </div>

        <div>{getTrendBadge()}</div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: any, name: any) => {
                if (name === 'Average Quality Score') return [`${Number(value).toFixed(1)} / 100`, name];
                return [`${value}%`, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              name="Average Quality Score"
              stroke="#059669"
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ r: 4, fill: '#059669' }}
            />
            <Line
              type="monotone"
              dataKey="sesuaiPct"
              name="% Report Sesuai"
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#2563eb' }}
            />
            <Line
              type="monotone"
              dataKey="tidakSesuaiPct"
              name="% Report Tidak Sesuai"
              stroke="#e11d48"
              strokeWidth={2}
              strokeDasharray="2 2"
              dot={{ r: 3, fill: '#e11d48' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Analisa AI: Verifikasi spesifisitas lokasi dan mitigasi meningkat tajam pada Juli 2026.</span>
        </div>
        <span className="font-semibold text-slate-600 shrink-0">Evaluasi Periode Q2-Q3</span>
      </div>
    </div>
  );
};
