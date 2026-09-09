'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Copy,
  Printer,
  Calendar,
  User,
  Building,
  MapPin,
  ShieldCheck,
  Check,
  FileText,
  Lightbulb,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { HazardReport } from '@/types/hazard';
import {
  ASSESSMENT_CRITERIA,
  DAFTAR_18_RISIKO_UTAMA,
  getParameterDeductionDetail,
} from '@/lib/assessment-standards';

interface AIAssessmentDetailProps {
  report: HazardReport | null;
  onClose: () => void;
  onUpdateReport?: (updated: HazardReport) => void;
}

export const AIAssessmentDetail: React.FC<AIAssessmentDetailProps> = ({
  report,
  onClose,
  onUpdateReport,
}) => {
  const [isReassessing, setIsReassessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedGuide, setCopiedGuide] = useState(false);
  const [showStandardsGuide, setShowStandardsGuide] = useState(false);
  const [currentReport, setCurrentReport] = useState<HazardReport | null>(report);

  if (!currentReport) return null;

  const isSesuai = currentReport.hasil === 'SESUAI';

  // Filter out any findings regarding 'tindakan perbaikan' per user explicit rule
  const filteredFindings = (currentReport.aiFindings || []).filter((finding) => {
    const lower = finding.toLowerCase();
    return (
      !lower.includes('tindakan perbaikan') &&
      !lower.includes('perbaikan belum') &&
      !lower.includes('tindakan belum') &&
      !lower.includes('tindakan kontrol')
    );
  });

  // Handle re-assess with AI
  const handleReAssess = async () => {
    try {
      setIsReassessing(true);
      const res = await fetch('/api/analyze-hazard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentReport),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.assessment) {
          const updated: HazardReport = {
            ...currentReport,
            qualityScore: data.assessment.qualityScore,
            qualityCategory: data.assessment.qualityCategory,
            hasil: data.assessment.status === 'SESUAI' ? 'SESUAI' : 'TIDAK SESUAI',
            penilaian: data.assessment.aiFeedback,
            aiFindings: (data.assessment.deficiencies || []).filter((d: string) => {
              const l = d.toLowerCase();
              return !l.includes('tindakan perbaikan') && !l.includes('perbaikan belum') && !l.includes('tindakan belum');
            }),
            aiRecommendation: data.assessment.recommendations?.join(' ') || currentReport.aiRecommendation,
            scoreBreakdown: {
              presisiLokasi: data.assessment.scoreBreakdown?.presisiLokasi ?? currentReport.scoreBreakdown?.presisiLokasi ?? 35,
              identifikasiHazard: data.assessment.scoreBreakdown?.identifikasiHazard ?? currentReport.scoreBreakdown?.identifikasiHazard ?? 25,
              identifikasiRisiko: data.assessment.scoreBreakdown?.identifikasiRisiko ?? currentReport.scoreBreakdown?.identifikasiRisiko ?? 25,
            },
            aiAssessed: true,
          };
          setCurrentReport(updated);
          if (onUpdateReport) onUpdateReport(updated);
        }
      }
    } catch (err) {
      console.error('Re-assess failed:', err);
    } finally {
      setIsReassessing(false);
    }
  };

  // Copy Feedback text
  const handleCopyFeedback = () => {
    const text = `LAPORAN: #${currentReport.noHazardReport} - ${currentReport.pelapor}
Quality Score: ${currentReport.qualityScore} / 100 (${currentReport.hasil})
Temuan Bahaya: ${currentReport.temuan}
Evaluasi AI: ${currentReport.penilaian}
Rekomendasi Perbaikan: ${currentReport.aiRecommendation}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Print assessment
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="ai-assessment-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>AUDIT KUALITAS AI: #{currentReport.noHazardReport}</span>
                {currentReport.noPICA && currentReport.noPICA !== '-' && (
                  <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    PICA: {currentReport.noPICA}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Sistem Evaluasi Mutu K3 PT Indotruck Utama &bull; Site SISADMO
              </p>
            </div>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Top Score Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isSesuai
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-xs ${
                  isSesuai
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {currentReport.qualityScore}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black uppercase tracking-wider">
                    {currentReport.qualityCategory} Quality
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      isSesuai
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                  >
                    {isSesuai ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                    )}
                    <span>Status: {currentReport.hasil}</span>
                  </span>
                </div>
                <p className="text-xs mt-0.5 text-slate-600">
                  Total skor evaluasi mutu berbasis 5 parameter rubrik K3
                </p>
              </div>
            </div>

            {/* Re-assess indicator */}
            <button
              id="btn-reassess-modal"
              disabled={isReassessing}
              onClick={handleReAssess}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReassessing ? 'animate-spin' : ''}`} />
              <span>{isReassessing ? 'Mengevaluasi AI...' : 'Re-Assess with AI'}</span>
            </button>
          </div>

          {/* Breakdown Score (Hanya 3 Parameter: Lokasi Bahaya, Objek Hazard, Ukuran Risiko) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>STANDAR RUBRIK PENILAIAN MUTU K3 (3 PARAMETER)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fokus penilaian murni saat pekerja melaporkan hazard report (Tindakan perbaikan tidak dinilai).
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] font-mono text-slate-500">Bobot: 100%</span>
                <button
                  onClick={() => setShowStandardsGuide(!showStandardsGuide)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{showStandardsGuide ? 'Tutup Panduan Standar' : 'Lihat Standar & 18 Risiko'}</span>
                  {showStandardsGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Expandable Standards & 18 Risiko Utama Reference Guide */}
            {showStandardsGuide && (
              <div className="p-3.5 rounded-lg bg-white border border-purple-200 shadow-xs space-y-3 text-xs">
                <div>
                  <div className="font-bold text-purple-950 flex items-center gap-1.5 mb-2">
                    <Info className="w-4 h-4 text-purple-700" />
                    <span>Kriteria Penilaian Hazard Report (Standar Resmi)</span>
                  </div>
                  <div className="space-y-2">
                    {ASSESSMENT_CRITERIA.map((crit) => (
                      <div key={crit.no} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                          <span>{crit.no}. {crit.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                            Bobot {crit.weight}% (Max {crit.maxScore} Poin)
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {crit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 18 Risiko Utama Reference */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Daftar 18 Risiko Utama K3 Rujukan:</span>
                    <span className="text-[10px] text-slate-500 font-normal">Pilih sesuai kondisi bahaya nyata</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto pr-1 space-y-1 text-[11px]">
                    {DAFTAR_18_RISIKO_UTAMA.map((r) => {
                      const isCurrentSelected = currentReport.risikoUtama && currentReport.risikoUtama.toLowerCase().includes(r.nama.toLowerCase().slice(0, 25));
                      return (
                        <div
                          key={r.id}
                          className={`p-1.5 rounded flex items-start gap-1.5 ${
                            isCurrentSelected
                              ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                              : 'bg-slate-50/70 text-slate-700'
                          }`}
                        >
                          <span className="font-mono text-slate-400 shrink-0">{r.id}.</span>
                          <span className="flex-1">{r.nama}</span>
                          {isCurrentSelected && (
                            <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded shrink-0">
                              Laporan Ini
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Parameter Deduction Calculations & Guidance */}
            {(() => {
              const deductionContext = {
                lokasi: currentReport.lokasi,
                area: currentReport.area,
                subArea: currentReport.subArea,
                statusLokasi: currentReport.statusLokasi,
                analisisLokasiAI: currentReport.analisisLokasiAI,
                temuan: currentReport.temuan,
                risikoUtama: currentReport.risikoUtama,
                kategoriTemuan: currentReport.kategoriTemuan,
                kategoriBahaya: currentReport.kategoriBahaya,
                levelRisiko: currentReport.levelRisiko,
                aiFindings: currentReport.aiFindings,
              };

              const lokasiDetail = getParameterDeductionDetail(
                'presisiLokasi',
                currentReport.scoreBreakdown?.presisiLokasi ?? 35,
                deductionContext
              );
              const hazardDetail = getParameterDeductionDetail(
                'identifikasiHazard',
                currentReport.scoreBreakdown?.identifikasiHazard ?? 25,
                deductionContext
              );
              const risikoDetail = getParameterDeductionDetail(
                'identifikasiRisiko',
                currentReport.scoreBreakdown?.identifikasiRisiko ?? 25,
                deductionContext
              );

              const totalDeduction = lokasiDetail.deduction + hazardDetail.deduction + risikoDetail.deduction;
              const currentTotalRubricScore = lokasiDetail.currentScore + hazardDetail.currentScore + risikoDetail.currentScore;

              const handleCopyGuide = () => {
                const guideText = `PANDUAN LAPORAN HAZARD STANDAR MUTU K3 (MENUJU SKOR 100%):
1. LOKASI PRESISI (Maks 40 Poin):
   Format: [Area Utama] > [Sub Area / Fasilitas] > [Patokan Fisik Tetap / No. Bay / No. Unit / KM]
   ${lokasiDetail.contohRujukan}

2. OBJEK HAZARD (Maks 30 Poin):
   Format: [Nama Alat / Aktivitas] + [Komponen Spesifik yang Rusak] + [Wujud Kondisi Tidak Aman]
   ${hazardDetail.contohRujukan}

3. UKURAN RISIKO (Maks 30 Poin):
   Format: [Pihak / Unit Terdampak] + [Mekanisme Celaka] + [Skenario Terburuk Sesuai 18 Risiko Utama]
   ${risikoDetail.contohRujukan}`;

                navigator.clipboard.writeText(guideText).then(() => {
                  setCopiedGuide(true);
                  setTimeout(() => setCopiedGuide(false), 2500);
                });
              };

              return (
                <div className="space-y-4">
                  {/* 3 Parameter Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 text-xs">
                    {/* 1. Presisi Lokasi Bahaya */}
                    <div
                      className={`bg-white p-4 rounded-xl border-2 flex flex-col justify-between transition-all ${
                        lokasiDetail.isPerfect
                          ? 'border-emerald-300 shadow-xs'
                          : 'border-amber-300/80 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Header & Status Pill */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>1. Presisi Lokasi</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                              Bobot 40% (Maksimal 40 Poin)
                            </div>
                          </div>
                          {lokasiDetail.isPerfect ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              100% Penuh
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Kurang -{lokasiDetail.deduction} Poin
                            </span>
                          )}
                        </div>

                        {/* Score Numbers */}
                        <div className="mt-3 flex items-baseline justify-between pb-2 border-b border-slate-100">
                          <span
                            className={`text-2xl font-black ${
                              lokasiDetail.isPerfect ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {lokasiDetail.currentScore}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">/ 40 Poin</span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                          Menjelaskan lokasi kejadian secara spesifik, jelas, dan dapat ditemukan kembali tanpa bertanya ulang.
                        </p>

                        {/* Breakdown Kekurangan & Cara 100% */}
                        <div className="mt-3 space-y-2 text-left">
                          {/* Alasan Kekurangan Poin */}
                          <div
                            className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
                              lokasiDetail.isPerfect
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-amber-50/80 border-amber-200 text-amber-950'
                            }`}
                          >
                            <div className="font-bold flex items-center gap-1 mb-1 text-[10px] uppercase tracking-wide">
                              {lokasiDetail.isPerfect ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                              )}
                              <span>
                                {lokasiDetail.isPerfect
                                  ? 'Evaluasi Standar Tercapai:'
                                  : 'Kekurangan Nilai Berdasarkan Apa:'}
                              </span>
                            </div>
                            <p className="text-[11px]">{lokasiDetail.alasanKekurangan}</p>
                          </div>

                          {/* Panduan Menuju 100% */}
                          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-[11px] leading-relaxed text-emerald-950 space-y-1.5">
                            <div className="font-bold flex items-center justify-between gap-1 text-[10px] uppercase tracking-wide text-emerald-800">
                              <div className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Agar Menjadi 100% (Refrensi Pelapor):</span>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans tracking-normal">
                                Relevan Laporan Ini
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium">
                              {lokasiDetail.langkahMenuju100}
                            </p>
                            <div className="text-[10px] bg-white p-2.5 rounded-md border border-emerald-200/90 font-mono text-emerald-950 break-words shadow-2xs">
                              {lokasiDetail.contohRujukan}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Objek Hazard */}
                    <div
                      className={`bg-white p-4 rounded-xl border-2 flex flex-col justify-between transition-all ${
                        hazardDetail.isPerfect
                          ? 'border-emerald-300 shadow-xs'
                          : 'border-amber-300/80 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Header & Status Pill */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>2. Objek Hazard</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                              Bobot 30% (Maksimal 30 Poin)
                            </div>
                          </div>
                          {hazardDetail.isPerfect ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              100% Penuh
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Kurang -{hazardDetail.deduction} Poin
                            </span>
                          )}
                        </div>

                        {/* Score Numbers */}
                        <div className="mt-3 flex items-baseline justify-between pb-2 border-b border-slate-100">
                          <span
                            className={`text-2xl font-black ${
                              hazardDetail.isPerfect ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {hazardDetail.currentScore}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">/ 30 Poin</span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                          Menjelaskan objek, kondisi, peralatan, atau tindakan sumber bahaya secara spesifik (bukan kategori umum).
                        </p>

                        {/* Breakdown Kekurangan & Cara 100% */}
                        <div className="mt-3 space-y-2 text-left">
                          {/* Alasan Kekurangan Poin */}
                          <div
                            className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
                              hazardDetail.isPerfect
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-amber-50/80 border-amber-200 text-amber-950'
                            }`}
                          >
                            <div className="font-bold flex items-center gap-1 mb-1 text-[10px] uppercase tracking-wide">
                              {hazardDetail.isPerfect ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                              )}
                              <span>
                                {hazardDetail.isPerfect
                                  ? 'Evaluasi Standar Tercapai:'
                                  : 'Kekurangan Nilai Berdasarkan Apa:'}
                              </span>
                            </div>
                            <p className="text-[11px]">{hazardDetail.alasanKekurangan}</p>
                          </div>

                          {/* Panduan Menuju 100% */}
                          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-[11px] leading-relaxed text-emerald-950 space-y-1.5">
                            <div className="font-bold flex items-center justify-between gap-1 text-[10px] uppercase tracking-wide text-emerald-800">
                              <div className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Agar Menjadi 100% (Refrensi Pelapor):</span>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans tracking-normal">
                                Relevan Laporan Ini
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium">
                              {hazardDetail.langkahMenuju100}
                            </p>
                            <div className="text-[10px] bg-white p-2.5 rounded-md border border-emerald-200/90 font-mono text-emerald-950 break-words shadow-2xs">
                              {hazardDetail.contohRujukan}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Identifikasi & Ukuran Risiko */}
                    <div
                      className={`bg-white p-4 rounded-xl border-2 flex flex-col justify-between transition-all ${
                        risikoDetail.isPerfect
                          ? 'border-emerald-300 shadow-xs'
                          : 'border-amber-300/80 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Header & Status Pill */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                              <span>3. Ukuran Risiko</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                              Bobot 30% (Maksimal 30 Poin)
                            </div>
                          </div>
                          {risikoDetail.isPerfect ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              100% Penuh
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Kurang -{risikoDetail.deduction} Poin
                            </span>
                          )}
                        </div>

                        {/* Score Numbers */}
                        <div className="mt-3 flex items-baseline justify-between pb-2 border-b border-slate-100">
                          <span
                            className={`text-2xl font-black ${
                              risikoDetail.isPerfect ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {risikoDetail.currentScore}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">/ 30 Poin</span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                          Menjelaskan potensi risiko, siapa terdampak, konsekuensi, dan kesesuaian dari 18 Risiko Utama.
                        </p>

                        {/* Breakdown Kekurangan & Cara 100% */}
                        <div className="mt-3 space-y-2 text-left">
                          {/* Alasan Kekurangan Poin */}
                          <div
                            className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
                              risikoDetail.isPerfect
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-amber-50/80 border-amber-200 text-amber-950'
                            }`}
                          >
                            <div className="font-bold flex items-center gap-1 mb-1 text-[10px] uppercase tracking-wide">
                              {risikoDetail.isPerfect ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                              )}
                              <span>
                                {risikoDetail.isPerfect
                                  ? 'Evaluasi Standar Tercapai:'
                                  : 'Kekurangan Nilai Berdasarkan Apa:'}
                              </span>
                            </div>
                            <p className="text-[11px]">{risikoDetail.alasanKekurangan}</p>
                          </div>

                          {/* Panduan Menuju 100% */}
                          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-[11px] leading-relaxed text-emerald-950 space-y-1.5">
                            <div className="font-bold flex items-center justify-between gap-1 text-[10px] uppercase tracking-wide text-emerald-800">
                              <div className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Agar Menjadi 100% (Refrensi Pelapor):</span>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans tracking-normal">
                                Relevan Laporan Ini
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium">
                              {risikoDetail.langkahMenuju100}
                            </p>
                            <div className="text-[10px] bg-white p-2.5 rounded-md border border-emerald-200/90 font-mono text-emerald-950 break-words shadow-2xs">
                              {risikoDetail.contohRujukan}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Summary Guidance Banner for Reporter Reference */}
                  <div className="p-4 rounded-xl bg-linear-to-r from-emerald-50/90 via-white to-purple-50/90 border border-emerald-200 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                            <span>Refrensi Pelapor: Panduan Mencapai Skor Mutu 100%</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Standar Mutu K3
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Gunakan catatan evaluasi ini sebagai acuan agar laporan berikutnya memperoleh poin maksimal (100/100).
                          </p>
                        </div>
                      </div>

                      {/* Deficit & Copy Button */}
                      <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-800">
                            Skor Total: {currentTotalRubricScore} / 100
                          </div>
                          <div className="text-[10px] font-semibold text-amber-700">
                            {totalDeduction > 0
                              ? `Defisit -${totalDeduction} Poin untuk 100% Sempurna`
                              : '✓ Skor Telah 100% Sempurna'}
                          </div>
                        </div>
                        <button
                          onClick={handleCopyGuide}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-lg transition-colors shadow-2xs shrink-0"
                        >
                          {copiedGuide ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedGuide ? 'Tersalin!' : 'Salin Panduan 100%'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Capaian Mutu Rubrik Saat Ini</span>
                        <span className="font-mono text-emerald-700 font-bold">{currentTotalRubricScore}% dari 100%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            currentTotalRubricScore >= 95
                              ? 'bg-emerald-500'
                              : currentTotalRubricScore >= 80
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${currentTotalRubricScore}%` }}
                        />
                      </div>
                    </div>

                    {/* 3 Step Action Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs pt-1">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center justify-between text-[11px] mb-1">
                            <span className="flex items-center gap-1 text-emerald-800">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Presisi Lokasi (40%)</span>
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                lokasiDetail.isPerfect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {lokasiDetail.isPerfect ? '100%' : `Kurang -${lokasiDetail.deduction}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                            Sebutkan titik acuan fisik permanen (nama ruangan, nomor bay, pilar, atau unit/KM) agar langsung dapat ditemukan tanpa perlu bertanya ulang.
                          </p>
                          <div className="text-[10px] bg-emerald-50/70 p-2 rounded border border-emerald-200 font-mono text-emerald-950 break-words">
                            <span className="font-bold text-emerald-800 font-sans block text-[9px] uppercase mb-0.5">Rujukan Laporan Ini:</span>
                            {lokasiDetail.contohRujukan.replace(/^Rujukan Revisi 100% \(Khusus Laporan Ini\):\s*/i, '')}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center justify-between text-[11px] mb-1">
                            <span className="flex items-center gap-1 text-amber-800">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Objek Hazard (30%)</span>
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                hazardDetail.isPerfect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {hazardDetail.isPerfect ? '100%' : `Kurang -${hazardDetail.deduction}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                            Rinci komponen fisik yang bermasalah dan jenis kondisi tidak amannya (contoh: kabel terkelupas 4cm), hindari hanya menulis frasa umum seperti &quot;rusak&quot;.
                          </p>
                          <div className="text-[10px] bg-amber-50/70 p-2 rounded border border-amber-200 font-mono text-amber-950 break-words">
                            <span className="font-bold text-amber-800 font-sans block text-[9px] uppercase mb-0.5">Rujukan Laporan Ini:</span>
                            {hazardDetail.contohRujukan.replace(/^Rujukan Revisi 100% \(Khusus Laporan Ini\):\s*/i, '')}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center justify-between text-[11px] mb-1">
                            <span className="flex items-center gap-1 text-purple-800">
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                              <span>Ukuran Risiko (30%)</span>
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                risikoDetail.isPerfect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {risikoDetail.isPerfect ? '100%' : `Kurang -${risikoDetail.deduction}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                            Jelaskan siapa pihak/unit yang berisiko terdampak serta mekanismenya, lalu selaraskan secara tepat dengan salah satu dari 18 Risiko Utama K3.
                          </p>
                          <div className="text-[10px] bg-purple-50/70 p-2 rounded border border-purple-200 font-mono text-purple-950 break-words">
                            <span className="font-bold text-purple-800 font-sans block text-[9px] uppercase mb-0.5">Rujukan Laporan Ini:</span>
                            {risikoDetail.contohRujukan.replace(/^Rujukan Revisi 100% \(Khusus Laporan Ini\):\s*/i, '')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* DEDICATED PARAMETER LOKASI BAHAYA (EVALUASI LANGSUNG DARI AI APPS SCRIPT) */}
          <div className="p-4 rounded-xl border border-emerald-200/90 bg-emerald-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                    PARAMETER PENILAIAN LOKASI BAHAYA (HASIL AI APPS SCRIPT)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Verifikasi kepastian titik fisik agar tim penanggung jawab (PIC) dapat segera menemukan bahaya.
                  </p>
                </div>
              </div>

              {/* Status Lokasi Badge */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Status Titik Lokasi:</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    currentReport.statusLokasi === 'SPESIFIK'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentReport.statusLokasi === 'KURANG SPESIFIK'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>
                    {currentReport.statusLokasi === 'SPESIFIK'
                      ? 'LOKASI SPESIFIK'
                      : currentReport.statusLokasi === 'KURANG SPESIFIK'
                      ? 'KURANG SPESIFIK'
                      : 'TIDAK SPESIFIK'}
                  </span>
                </span>
              </div>
            </div>

            {/* Location Data Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-medium">Area Utama Terlapor</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{currentReport.area || '-'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-medium">Sub Area Kerja</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">{currentReport.subArea || '-'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-medium">Titik Lokasi Dilaporkan</div>
                <div className="text-xs font-bold text-emerald-800 mt-0.5">{currentReport.lokasi || '-'}</div>
              </div>
            </div>

            {/* Direct AI AppScript Analysis for Location */}
            <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Analisis Status Lokasi dari AI:</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {currentReport.analisisLokasiAI || 'Evaluasi AI: Titik lokasi sedang dievaluasi terhadap standar spesifisitas K3.'}
              </p>
              {currentReport.statusLokasi !== 'SPESIFIK' && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-1">
                  💡 <strong>Panduan Perbaikan Lokasi:</strong> Tambahkan nama ruangan persis, nomor bay/unit, atau titik kilometer hauling (contoh: <em>&quot;Workshop 2 Bay 8 dekat rak tools&quot;</em> atau <em>&quot;KM 14 Hauling Road sisi timur&quot;</em>).
                </div>
              )}
            </div>
          </div>

          {/* Report Meta Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 border border-slate-200 rounded-xl p-3.5 bg-white">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Informasi Pelapor &amp; Tempat</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <span className="text-slate-500">Pelapor:</span>
                <span className="col-span-2 font-semibold text-slate-900">{currentReport.pelapor} (NRP: {currentReport.nrpPelapor})</span>

                <span className="text-slate-500">Perusahaan:</span>
                <span className="col-span-2 text-slate-700">{currentReport.perusahaanPelapor} &rarr; {currentReport.perusahaanTerlapor}</span>

                <span className="text-slate-500">Area:</span>
                <span className="col-span-2 text-slate-700">{currentReport.area} {currentReport.subArea !== '-' ? `(${currentReport.subArea})` : ''}</span>

                <span className="text-slate-500">Lokasi:</span>
                <span className="col-span-2 font-medium text-slate-900">{currentReport.lokasi}</span>

                <span className="text-slate-500">Tanggal:</span>
                <span className="col-span-2 font-mono text-slate-700">{currentReport.tanggal}</span>
              </div>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-xl p-3.5 bg-white">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>Klasifikasi Risiko &amp; PICA</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <span className="text-slate-500">Kategori Temuan:</span>
                <span className="col-span-2 font-semibold text-slate-900">{currentReport.kategoriTemuan}</span>

                <span className="text-slate-500">Kategori Bahaya:</span>
                <span className="col-span-2 text-slate-700">{currentReport.kategoriBahaya}</span>

                <span className="text-slate-500">Risiko Utama:</span>
                <span className="col-span-2 text-slate-700">{currentReport.risikoUtama}</span>

                <span className="text-slate-500">Level Risiko:</span>
                <span className="col-span-2 font-bold text-slate-900">{currentReport.levelRisiko}</span>

                <span className="text-slate-500">PIC / Status PICA:</span>
                <span className="col-span-2 font-medium text-slate-900">{currentReport.pic} ({currentReport.statusPICA})</span>
              </div>
            </div>
          </div>

          {/* Temuan & Tindakan Perbaikan Actual Text */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Deskripsi Temuan Lapangan
              </div>
              <p className="text-xs text-slate-900 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {currentReport.temuan}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Akar Masalah &amp; Tindakan Perbaikan
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Pencatatan Lapangan (Tidak Mempengaruhi Skor Mutu Pelaporan)
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-700">
                  <span className="font-semibold text-slate-900">Akar Masalah: </span>
                  {currentReport.akarMasalah || '—'}
                </div>
                <div className="text-slate-700">
                  <span className="font-semibold text-slate-900">Tindakan Perbaikan: </span>
                  {currentReport.tindakanPerbaikan || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* AI Critical Findings (Hanya fokus saat pelaporan: Lokasi, Objek Hazard, Ukuran & Risiko Utama) */}
          {filteredFindings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Defisiensi Temuan AI yang Perlu Diperhatikan:</span>
                </div>
                <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded font-medium">
                  Fokus Mutu Saat Pelaporan
                </span>
              </div>
              <ul className="list-disc list-inside text-xs text-amber-950 space-y-1 pl-1">
                {filteredFindings.map((finding, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alasan Penilaian AI */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Alasan Penilaian (AI Reasoning):</span>
            </div>
            <p className="text-xs text-blue-950 leading-relaxed">
              {currentReport.penilaian}
            </p>
          </div>

          {/* Rekomendasi Perbaikan K3 */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-700" />
              <span>Rekomendasi Perbaikan Pelaporan (HSE Guidance):</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              {currentReport.aiRecommendation}
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-feedback"
              onClick={handleCopyFeedback}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Feedback</span>
                </>
              )}
            </button>

            <button
              id="btn-print-modal"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak / Export PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
