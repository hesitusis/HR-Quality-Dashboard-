'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
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
  Check,
  X,
} from 'lucide-react';
import { HazardReport, MonthName } from '@/types/hazard';

const REWARD_MONTHS: MonthName[] = [
  'Mei 2026',
  'Juni 2026',
  'Juli 2026',
  'Agustus 2026',
  'September 2026',
  'Oktober 2026',
  'November 2026',
  'Desember 2026',
];

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
  // Only display months that have actual reports
  const availableMonths = useMemo(() => {
    const monthsSet = new Set(reports.map((r) => r.month));
    const active = REWARD_MONTHS.filter((m) => monthsSet.has(m));
    return active.length > 0 ? active : (['Agustus 2026'] as MonthName[]);
  }, [reports]);

  const latestMonth = availableMonths[availableMonths.length - 1] || 'Agustus 2026';
  const [selectedMonthState, setSelectedMonth] = useState<MonthName | null>(null);
  const selectedMonth: MonthName =
    selectedMonthState && availableMonths.includes(selectedMonthState)
      ? selectedMonthState
      : latestMonth;

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
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 rounded-xl overflow-x-auto max-w-full pb-1 self-start md:self-auto">
          {availableMonths.map((m) => (
            <button
              key={m}
              id={`reward-month-${m.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setSelectedMonth(m);
                setCustomWinnerId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs certificate-modal-overlay">
          <div className="relative max-w-4xl w-full my-auto flex flex-col items-center">
            {/* Certificate Card (Screen Preview & Printable Sheet) */}
            <div
              id="printable-certificate"
              className="certificate-print-sheet w-full bg-white rounded-2xl sm:rounded-3xl border-[2.5px] border-[#002855] p-2 sm:p-2.5 shadow-2xl relative overflow-hidden"
            >
              {/* Corner Geometric Decorations matching Image 2 */}
              {/* Top-Left Geometric Decor */}
              <svg
                className="absolute top-0 left-0 w-36 h-36 sm:w-52 sm:h-52 pointer-events-none z-10"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="0,0 200,0 0,200" fill="#e0f2fe" opacity="0.75" />
                <polygon points="0,0 160,0 0,160" fill="#bae6fd" opacity="0.65" />
                <polygon points="0,140 140,0 170,0 0,170" fill="#002855" />
                <polygon points="0,105 105,0 132,0 0,132" fill="#f59e0b" />
                <polygon points="0,0 90,0 0,90" fill="#002855" />
                <polygon points="0,0 60,0 0,60" fill="#001838" />
              </svg>

              {/* Bottom-Right Geometric Decor (Mirrored) */}
              <svg
                className="absolute bottom-0 right-0 w-36 h-36 sm:w-52 sm:h-52 pointer-events-none z-10 rotate-180"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="0,0 200,0 0,200" fill="#e0f2fe" opacity="0.75" />
                <polygon points="0,0 160,0 0,160" fill="#bae6fd" opacity="0.65" />
                <polygon points="0,140 140,0 170,0 0,170" fill="#002855" />
                <polygon points="0,105 105,0 132,0 0,132" fill="#f59e0b" />
                <polygon points="0,0 90,0 0,90" fill="#002855" />
                <polygon points="0,0 60,0 0,60" fill="#001838" />
              </svg>

              {/* Top-Right Soft Accent */}
              <svg
                className="absolute top-0 right-0 w-28 h-28 sm:w-40 sm:h-40 pointer-events-none z-10"
                viewBox="0 0 140 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="140,0 0,0 140,140" fill="#f0f9ff" opacity="0.6" />
                <polygon points="140,0 50,0 140,90" fill="#e0f2fe" opacity="0.55" />
                <polygon points="140,0 90,0 140,50" fill="#bae6fd" opacity="0.5" />
              </svg>

              {/* Bottom-Left Soft Accent */}
              <svg
                className="absolute bottom-0 left-0 w-28 h-28 sm:w-40 sm:h-40 pointer-events-none z-10 rotate-180"
                viewBox="0 0 140 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="140,0 0,0 140,140" fill="#f0f9ff" opacity="0.6" />
                <polygon points="140,0 50,0 140,90" fill="#e0f2fe" opacity="0.55" />
                <polygon points="140,0 90,0 140,50" fill="#bae6fd" opacity="0.5" />
              </svg>

              {/* Inner Fine Border Frame */}
              <div className="relative z-20 rounded-xl sm:rounded-2xl border border-[#002855]/70 p-6 sm:p-8 md:p-9 bg-white/95 overflow-hidden">
                {/* Header: Company Logo & Golden Trophy with Laurel Wreath */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
                  {/* PT Indotruck Utama Logo */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                    <Image
                      src="/logo.png"
                      alt="PT Indotruck Utama Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  </div>

                  {/* Gold Vertical Divider */}
                  <div className="h-10 sm:h-12 w-[2px] bg-amber-400 shrink-0" />

                  {/* Golden Trophy with Laurel Wreath SVG */}
                  <svg
                    viewBox="0 0 100 80"
                    className="w-16 h-13 sm:w-20 sm:h-16 shrink-0"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Left Laurel Wreath */}
                    <g>
                      <path
                        d="M 30 62 C 16 52 14 30 26 14"
                        stroke="#d97706"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <ellipse cx="18" cy="52" rx="5" ry="3" transform="rotate(-30 18 52)" fill="#f59e0b" />
                      <ellipse cx="14" cy="40" rx="5.5" ry="3" transform="rotate(-15 14 40)" fill="#f59e0b" />
                      <ellipse cx="16" cy="28" rx="5.5" ry="3" transform="rotate(10 16 28)" fill="#f59e0b" />
                      <ellipse cx="25" cy="18" rx="5" ry="2.8" transform="rotate(35 25 18)" fill="#fbbf24" />
                      <ellipse cx="28" cy="57" rx="4.5" ry="2.5" transform="rotate(-40 28 57)" fill="#d97706" />
                      <ellipse cx="24" cy="45" rx="4.8" ry="2.5" transform="rotate(-20 24 45)" fill="#d97706" />
                      <ellipse cx="24" cy="33" rx="4.8" ry="2.5" transform="rotate(0 24 33)" fill="#d97706" />
                    </g>

                    {/* Right Laurel Wreath */}
                    <g>
                      <path
                        d="M 70 62 C 84 52 86 30 74 14"
                        stroke="#d97706"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <ellipse cx="82" cy="52" rx="5" ry="3" transform="rotate(30 82 52)" fill="#f59e0b" />
                      <ellipse cx="86" cy="40" rx="5.5" ry="3" transform="rotate(15 86 40)" fill="#f59e0b" />
                      <ellipse cx="84" cy="28" rx="5.5" ry="3" transform="rotate(-10 84 28)" fill="#f59e0b" />
                      <ellipse cx="75" cy="18" rx="5" ry="2.8" transform="rotate(-35 75 18)" fill="#fbbf24" />
                      <ellipse cx="72" cy="57" rx="4.5" ry="2.5" transform="rotate(40 72 57)" fill="#d97706" />
                      <ellipse cx="76" cy="45" rx="4.8" ry="2.5" transform="rotate(20 76 45)" fill="#d97706" />
                      <ellipse cx="76" cy="33" rx="4.8" ry="2.5" transform="rotate(0 76 33)" fill="#d97706" />
                    </g>

                    {/* Trophy Cup */}
                    <rect x="42" y="66" width="16" height="5" rx="1.5" fill="#b45309" />
                    <path d="M 40 71 L 60 71 L 58 76 L 42 76 Z" fill="#d97706" />
                    <rect x="37" y="76" width="26" height="4" rx="1.5" fill="#92400e" />
                    <path d="M 47 52 L 53 52 L 52 66 L 48 66 Z" fill="#f59e0b" />
                    <path d="M 35 22 L 65 22 L 62 46 C 62 54 56 58 50 58 C 44 58 38 54 38 46 Z" fill="#f59e0b" />
                    <ellipse cx="50" cy="22" rx="15" ry="3" fill="#fbbf24" />
                    <path d="M 41 27 L 46 27 C 46 41 47 48 50 53 C 45 52 41 46 41 36 Z" fill="#fef08a" opacity="0.65" />
                    <path d="M 36 26 C 26 26 26 42 37 43 C 34 39 33 30 38 28 Z" fill="#d97706" />
                    <path d="M 64 26 C 74 26 74 42 63 43 C 66 39 67 30 62 28 Z" fill="#d97706" />
                    <polygon points="50,32 52,36 56.5,37 53,40 54,44.5 50,42 46,44.5 47,40 43.5,37 48,36" fill="#fef08a" />
                  </svg>
                </div>

                {/* Subtitle */}
                <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#002855] text-center mb-1">
                  PT INDOTRUCK UTAMA &bull; SITE SISADMO
                </div>

                {/* Main Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#002855] tracking-tight text-center mb-2">
                  SERTIFIKAT PENGHARGAAN K3
                </h3>

                {/* Sub-narrative */}
                <p className="text-xs sm:text-sm text-slate-600 text-center max-w-xl mx-auto leading-relaxed mb-3">
                  Diberikan sebagai pengakuan atas dedikasi dan kualitas pelaporan bahaya keselamatan kerja terbaik:
                </p>

                {/* Subtle Gold Accent Diamond */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
                </div>

                {/* Recipient Name */}
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#002855] uppercase tracking-wide text-center">
                  {currentWinner.pelapor}
                </div>

                {/* NRP & Company */}
                <div className="text-xs sm:text-sm font-semibold text-slate-700 text-center mt-1 mb-2">
                  NRP: {currentWinner.nrpPelapor} &bull; {currentWinner.perusahaanPelapor}
                </div>

                {/* Gold Horizontal Rule */}
                <div className="w-full border-b border-amber-400 mb-4" />

                {/* Report Detail Box with Gold Border & Aligned Colons */}
                <div className="rounded-xl border border-amber-400/90 bg-white/95 p-3.5 sm:p-4 text-xs sm:text-sm space-y-1.5 mb-5 shadow-2xs">
                  <div className="grid grid-cols-[100px_16px_1fr] sm:grid-cols-[125px_16px_1fr] items-start">
                    <span className="font-bold text-[#002855]">Laporan</span>
                    <span className="font-bold text-[#002855]">:</span>
                    <span className="text-slate-800 font-mono">#{currentWinner.noHazardReport}</span>
                  </div>
                  <div className="grid grid-cols-[100px_16px_1fr] sm:grid-cols-[125px_16px_1fr] items-start">
                    <span className="font-bold text-[#002855]">Temuan</span>
                    <span className="font-bold text-[#002855]">:</span>
                    <span className="text-slate-800 leading-snug">{currentWinner.temuan}</span>
                  </div>
                  <div className="grid grid-cols-[100px_16px_1fr] sm:grid-cols-[125px_16px_1fr] items-start">
                    <span className="font-bold text-[#002855]">Lokasi</span>
                    <span className="font-bold text-[#002855]">:</span>
                    <span className="text-slate-800">{currentWinner.lokasi} ({currentWinner.area})</span>
                  </div>
                  <div className="grid grid-cols-[100px_16px_1fr] sm:grid-cols-[125px_16px_1fr] items-start">
                    <span className="font-bold text-[#002855]">Quality Score</span>
                    <span className="font-bold text-[#002855]">:</span>
                    <span className="text-slate-800 font-semibold">{currentWinner.qualityScore} / 100 (Status: SESUAI)</span>
                  </div>
                  <div className="grid grid-cols-[100px_16px_1fr] sm:grid-cols-[125px_16px_1fr] items-start">
                    <span className="font-bold text-[#002855]">Periode</span>
                    <span className="font-bold text-[#002855]">:</span>
                    <span className="text-slate-800">{selectedMonth}</span>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="flex items-end justify-between text-xs sm:text-sm pt-2">
                  <div className="text-left">
                    <div className="font-bold text-[#002855] text-sm sm:text-base">Verifikator HSE</div>
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold text-xs sm:text-sm mt-0.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Terverifikasi Lapangan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions (Hidden during print) */}
            <div className="no-print mt-4 w-full flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors shadow-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
