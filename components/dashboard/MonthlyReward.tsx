'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  Printer,
  FileCheck,
} from 'lucide-react';
import { HazardReport } from '@/types/hazard';

interface MonthlyRewardProps {
  reports: HazardReport[];
  onOpenReportDetail: (report: HazardReport) => void;
  onVerifyReport: (reportId: string, verifiedBy: string, notes: string) => void;
  onSetWinner: (reportId: string) => void;
}

export const MonthlyReward: React.FC<MonthlyRewardProps> = ({
  reports,
  onOpenReportDetail,
  onVerifyReport,
  onSetWinner,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<'Mei 2026' | 'Juni 2026' | 'Juli 2026'>('Juli 2026');
  const [showCertificate, setShowCertificate] = useState(false);
  const [verifyingReport, setVerifyingReport] = useState<HazardReport | null>(null);
  const [verifierName, setVerifierName] = useState('HSE Supervisor Site MIA 4');
  const [verifierNotes, setVerifierNotes] = useState('Temuan sangat spesifik, terukur, dan mitigasi bahaya langsung terverifikasi di lapangan.');

  // Filter reports by selected month and sort by qualityScore descending
  const monthReports = reports
    .filter((r) => r.month === selectedMonth)
    .sort((a, b) => b.qualityScore - a.qualityScore);

  const top5Candidates = monthReports.slice(0, 5);

  // Determine current winner (prefer verified top report, or top 1)
  const [customWinnerId, setCustomWinnerId] = useState<string | null>(null);
  const currentWinner = (customWinnerId && monthReports.find((r) => r.id === customWinnerId))
    || top5Candidates.find((r) => r.hseVerified)
    || top5Candidates[0]
    || null;

  const handleSelectWinner = (report: HazardReport) => {
    setCustomWinnerId(report.id);
    onSetWinner(report.id);
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleConfirmVerification = () => {
    if (verifyingReport) {
      onVerifyReport(verifyingReport.id, verifierName, verifierNotes);
      setVerifyingReport(null);
    }
  };

  return (
    <div
      id="monthly-reward-section"
      className="bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 rounded-2xl p-6 border-2 border-amber-300 shadow-sm mb-6 relative overflow-hidden"
    >
      {/* Background Accent Badge */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header & Month Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-amber-200/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/30">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                🏆 BEST HAZARD REPORT OF THE MONTH
              </h2>
              <p className="text-xs text-slate-600">
                Apresiasi Kualitas Laporan Terbaik: <strong>AI Score &rarr; Top 5 &rarr; Verifikasi HSE &rarr; Winner &rarr; Reward</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Month Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 rounded-xl self-start md:self-auto">
          {(['Mei 2026', 'Juni 2026', 'Juli 2026'] as const).map((m) => (
            <button
              key={m}
              id={`reward-month-${m.toLowerCase().replace(' ', '-')}`}
              onClick={() => {
                setSelectedMonth(m);
                setCustomWinnerId(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMonth === m
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {currentWinner ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Winner Showcase Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-amber-300 shadow-xs relative">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                Pemenang Kualitas Terbaik - {selectedMonth}
              </span>
              <div className="flex items-center gap-2">
                {currentWinner.hseVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Terverifikasi HSE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Menunggu Verifikasi HSE
                  </span>
                )}
                <button
                  id="btn-print-certificate"
                  onClick={() => setShowCertificate(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sertifikat</span>
                </button>
              </div>
            </div>

            {/* Reporter Meta */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
              <div>
                <div className="text-xl font-black text-slate-900">
                  {currentWinner.pelapor}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">NRP: {currentWinner.nrpPelapor}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" /> {currentWinner.perusahaanPelapor}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {currentWinner.tanggal}
                  </span>
                </div>
              </div>

              {/* Quality Score Big Pill */}
              <div className="flex items-baseline gap-1 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
                <span className="text-xs font-bold text-emerald-800">Quality Score:</span>
                <span className="text-2xl font-black text-emerald-700">{currentWinner.qualityScore}</span>
                <span className="text-xs text-emerald-600 font-medium">/ 100</span>
              </div>
            </div>

            {/* Findings & Context */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Deskripsi Temuan Lapangan
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  &ldquo;{currentWinner.temuan}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Area: <strong>{currentWinner.area}</strong></span>
                  <span>•</span>
                  <span>Lokasi: <strong>{currentWinner.lokasi}</strong></span>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Alasan Penilaian AI &amp; Keunggulan Laporan:</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {currentWinner.penilaian}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onOpenReportDetail(currentWinner)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Lihat Detail Laporan Penuh #{currentWinner.noHazardReport}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {!currentWinner.hseVerified && (
                <button
                  onClick={() => setVerifyingReport(currentWinner)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verifikasi Laporan Ini</span>
                </button>
              )}
            </div>
          </div>

          {/* Top 5 Nominees List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  TOP 5 KANDIDAT REWARD ({selectedMonth})
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Ranking AI</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Pilih salah satu kandidat di bawah untuk ditinjau dan ditetapkan sebagai pemenang resmi.
              </p>

              <div className="space-y-2">
                {top5Candidates.map((cand, idx) => {
                  const isSelected = currentWinner.id === cand.id;
                  return (
                    <div
                      key={cand.id}
                      className={`p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate">
                            #{idx + 1} {cand.pelapor}
                          </span>
                          {cand.hseVerified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0" title="Terverifikasi HSE">
                              <ShieldCheck className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate" title={cand.temuan}>
                          {cand.temuan}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-black text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {cand.qualityScore}
                        </span>

                        {isSelected ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            Pemenang
                          </span>
                        ) : (
                          <button
                            id={`btn-set-winner-${cand.id}`}
                            onClick={() => handleSelectWinner(cand)}
                            className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 hover:underline"
                          >
                            Pilih Juara
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
              Alur HSE: Setiap kandidat wajib dicek kesesuaian fisik lapangan sebelum serah terima reward.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-xl text-slate-500 text-xs">
          Belum ada data Hazard Report pada bulan {selectedMonth}.
        </div>
      )}

      {/* HSE Verification Modal */}
      {verifyingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verifikasi Pengawas HSE Lapangan</span>
            </div>

            <p className="text-xs text-slate-600">
              Verifikasi keabsahan laporan <strong>#{verifyingReport.noHazardReport}</strong> oleh <strong>{verifyingReport.pelapor}</strong> untuk kelayakan penghargaan bulanan.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Petugas Verifikator HSE:
                </label>
                <input
                  type="text"
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Catatan Verifikasi &amp; Dampak K3:
                </label>
                <textarea
                  rows={3}
                  value={verifierNotes}
                  onChange={(e) => setVerifierNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setVerifyingReport(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmVerification}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Setujui Verifikasi HSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal Preview */}
      {showCertificate && currentWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 border-4 border-amber-300 shadow-2xl relative">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-600 mb-1">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-amber-800">
                PT INDOTRUCK UTAMA &bull; SITE SISADMO
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                SERTIFIKAT PENGHARGAAN K3
              </h3>
              <p className="text-xs text-slate-500">
                Diberikan sebagai pengakuan atas dedikasi dan kualitas pelaporan bahaya keselamatan kerja terbaik:
              </p>

              <div className="py-3 border-y border-amber-200">
                <div className="text-2xl font-black text-emerald-800">
                  {currentWinner.pelapor}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  NRP: {currentWinner.nrpPelapor} &bull; {currentWinner.perusahaanPelapor}
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-100 text-left">
                <div><strong>Laporan:</strong> #{currentWinner.noHazardReport}</div>
                <div><strong>Temuan:</strong> {currentWinner.temuan}</div>
                <div><strong>Lokasi:</strong> {currentWinner.lokasi} ({currentWinner.area})</div>
                <div><strong>Quality Score:</strong> {currentWinner.qualityScore} / 100 (Status: SESUAI)</div>
                <div><strong>Periode:</strong> {selectedMonth}</div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="text-left">
                  <div className="font-bold text-slate-800">Verifikator HSE</div>
                  <div className="text-[11px] text-emerald-700 font-medium">✓ Terverifikasi Lapangan</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">Manajemen Site MIA 4</div>
                  <div className="text-[11px] text-slate-400">Safety First</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
