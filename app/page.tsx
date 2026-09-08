'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { KPICards } from '@/components/dashboard/KPICards';
import { QualityTrendChart } from '@/components/dashboard/QualityTrendChart';
import { QualityDistribution } from '@/components/dashboard/QualityDistribution';
import { TopReporter } from '@/components/dashboard/TopReporter';
import { QualityIssues } from '@/components/dashboard/QualityIssues';
import { MonthlyReward } from '@/components/dashboard/MonthlyReward';
import { HazardReportTable } from '@/components/reports/HazardReportTable';
import { AIAssessmentDetail } from '@/components/reports/AIAssessmentDetail';
import { AIAssessmentAuditView } from '@/components/views/AIAssessmentAuditView';
import { QualityAnalysisDeepView } from '@/components/views/QualityAnalysisDeepView';
import { TopReporterFullView } from '@/components/views/TopReporterFullView';
import { getInitialHazardReports, calculateQualityScore } from '@/lib/sample-data';
import { HazardReport, FilterOptions, ReporterStats } from '@/types/hazard';
import { parseCSVorTSV, processRawSpreadsheetRows } from '@/lib/csv-importer';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [reports, setReports] = useState<HazardReport[]>(() => getInitialHazardReports());
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);

  // Safely restore cached reports on client mount to prevent SSR hydration mismatches
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('itu_hazard_reports_dec2026');
        if (saved) {
          const parsed = JSON.parse(saved);
          const hasNumericPelaporBug =
            Array.isArray(parsed) &&
            parsed.slice(0, 10).some((r: any) => typeof r.pelapor === 'string' && /^\d+$/.test(r.pelapor.trim()));
          const hasMissingLocationStatus = Array.isArray(parsed) && parsed.length > 0 && !parsed[0].statusLokasi;
          const hasOld5ParamRubrik =
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            parsed[0].scoreBreakdown?.tindakanPengendalian !== undefined;
          if (
            Array.isArray(parsed) &&
            parsed.length >= 1000 &&
            !hasNumericPelaporBug &&
            !hasMissingLocationStatus &&
            !hasOld5ParamRubrik
          ) {
            setReports(parsed);
          }
        }
      } catch (err) {
        console.error('Failed reading saved reports:', err);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Global Filter State
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'Mei – Desember 2026',
    month: 'Semua Bulan',
    area: 'Semua Area',
    subArea: 'Semua Sub Area',
    perusahaanPelapor: 'Semua Perusahaan',
    perusahaanTerlapor: 'Semua Terlapor',
    kategoriTemuan: 'Semua Kategori Temuan',
    kategoriBahaya: 'Semua Kategori Bahaya',
    risikoUtama: 'Semua Risiko Utama',
    levelRisiko: 'Semua Level Risiko',
    statusReport: 'Semua Status Report',
    searchQuery: '',
    aiStatus: 'Semua Status AI',
  });

  // Extract unique filter dropdown options from raw data
  const filterOptions = useMemo(() => {
    return {
      areas: Array.from(new Set(reports.map((r) => r.area))).filter(Boolean).sort(),
      subAreas: Array.from(new Set(reports.map((r) => r.subArea))).filter(
        (x) => x && x !== '-'
      ).sort(),
      perusahaanPelapor: Array.from(new Set(reports.map((r) => r.perusahaanPelapor))).filter(Boolean).sort(),
      perusahaanTerlapor: Array.from(new Set(reports.map((r) => r.perusahaanTerlapor))).filter(Boolean).sort(),
      kategoriTemuan: Array.from(new Set(reports.map((r) => r.kategoriTemuan))).filter(Boolean).sort(),
      kategoriBahaya: Array.from(new Set(reports.map((r) => r.kategoriBahaya))).filter(Boolean).sort(),
      levelRisiko: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      statusReport: Array.from(new Set(reports.map((r) => r.statusReport))).filter(Boolean).sort(),
      aiStatus: ['SESUAI', 'TIDAK SESUAI'],
    };
  }, [reports]);

  // Counts for Month switcher pills
  const monthCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {
      all: reports.length,
      'Mei 2026': 0,
      'Juni 2026': 0,
      'Juli 2026': 0,
      'Agustus 2026': 0,
      'September 2026': 0,
      'Oktober 2026': 0,
      'November 2026': 0,
      'Desember 2026': 0,
    };
    reports.forEach((r) => {
      if (r.month) {
        counts[r.month] = (counts[r.month] || 0) + 1;
      }
    });
    return counts;
  }, [reports]);

  // Apply filters dynamically
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Month
      if (filters.month !== 'Semua Bulan' && r.month !== filters.month) return false;

      // Area
      if (filters.area !== 'Semua Area' && r.area !== filters.area) return false;

      // Sub Area
      if (filters.subArea !== 'Semua Sub Area' && r.subArea !== filters.subArea) return false;

      // Perusahaan Pelapor
      if (
        filters.perusahaanPelapor !== 'Semua Perusahaan' &&
        r.perusahaanPelapor !== filters.perusahaanPelapor
      )
        return false;

      // Perusahaan Terlapor
      if (
        filters.perusahaanTerlapor !== 'Semua Terlapor' &&
        r.perusahaanTerlapor !== filters.perusahaanTerlapor
      )
        return false;

      // Kategori Temuan
      if (
        filters.kategoriTemuan !== 'Semua Kategori Temuan' &&
        r.kategoriTemuan !== filters.kategoriTemuan
      )
        return false;

      // Kategori Bahaya
      if (
        filters.kategoriBahaya !== 'Semua Kategori Bahaya' &&
        r.kategoriBahaya !== filters.kategoriBahaya
      )
        return false;

      // Level Risiko
      if (filters.levelRisiko !== 'Semua Level Risiko' && r.levelRisiko !== filters.levelRisiko)
        return false;

      // Status Report
      if (
        filters.statusReport !== 'Semua Status Report' &&
        r.statusReport !== filters.statusReport
      )
        return false;

      // AI Status
      if (filters.aiStatus !== 'Semua Status AI' && r.hasil !== filters.aiStatus) return false;

      // Global Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          r.noHazardReport.toLowerCase().includes(q) ||
          r.pelapor.toLowerCase().includes(q) ||
          r.temuan.toLowerCase().includes(q) ||
          r.lokasi.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.penilaian.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [reports, filters]);

  // Reporters aggregation for Ranking
  const reporterStats: ReporterStats[] = useMemo(() => {
    const map: Record<
      string,
      {
        pelapor: string;
        nrp: string;
        perusahaan: string;
        scores: number[];
        sesuaiCount: number;
      }
    > = {};

    filteredReports.forEach((r) => {
      const key = r.pelapor;
      if (!map[key]) {
        map[key] = {
          pelapor: r.pelapor,
          nrp: r.nrpPelapor,
          perusahaan: r.perusahaanPelapor,
          scores: [],
          sesuaiCount: 0,
        };
      }
      map[key].scores.push(r.qualityScore);
      if (r.hasil === 'SESUAI') map[key].sesuaiCount += 1;
    });

    return Object.values(map)
      .map((item) => {
        const total = item.scores.length;
        const avg = item.scores.reduce((a, b) => a + b, 0) / (total || 1);
        return {
          pelapor: item.pelapor,
          nrp: item.nrp,
          perusahaan: item.perusahaan,
          totalReports: total,
          averageScore: Number(avg.toFixed(1)),
          sesuaiReports: item.sesuaiCount,
        };
      })
      .sort((a, b) => {
        // Prioritize higher score, then total reports
        if (b.averageScore !== a.averageScore) {
          return b.averageScore - a.averageScore;
        }
        return b.totalReports - a.totalReports;
      });
  }, [filteredReports]);

  // Overall KPI metrics
  const totalReportsCount = filteredReports.length;
  const aiAssessedCount = filteredReports.filter((r) => r.aiAssessed).length;
  const totalScoreSum = filteredReports.reduce((acc, r) => acc + r.qualityScore, 0);
  const averageQualityScore = totalReportsCount > 0 ? totalScoreSum / totalReportsCount : 0;
  const sesuaiCount = filteredReports.filter((r) => r.hasil === 'SESUAI').length;
  const activeReportersCount = reporterStats.length;

  const bestReporter = reporterStats[0]
    ? {
        name: reporterStats[0].pelapor,
        score: reporterStats[0].averageScore,
        count: reporterStats[0].totalReports,
      }
    : { name: '-', score: 0, count: 0 };

  // Trend line chart data calculation
  const monthlyTrendData = useMemo(() => {
    const months = [
      'Mei 2026',
      'Juni 2026',
      'Juli 2026',
      'Agustus 2026',
      'September 2026',
      'Oktober 2026',
      'November 2026',
      'Desember 2026',
    ];
    return months.map((m) => {
      const monthReps = reports.filter((r) => r.month === m);
      const total = monthReps.length || 1;
      const sum = monthReps.reduce((acc, r) => acc + r.qualityScore, 0);
      const sesuai = monthReps.filter((r) => r.hasil === 'SESUAI').length;
      const tidakSesuai = monthReps.filter((r) => r.hasil === 'TIDAK SESUAI').length;

      return {
        month: m,
        avgScore: Number((sum / total).toFixed(1)),
        sesuaiPct: Math.round((sesuai / total) * 100),
        tidakSesuaiPct: Math.round((tidakSesuai / total) * 100),
        totalReports: monthReps.length,
      };
    });
  }, [reports]);

  // Quality distribution counts
  const qualityDistributionStats = useMemo(() => {
    let excellent = 0;
    let good = 0;
    let needImprovement = 0;
    let poor = 0;

    filteredReports.forEach((r) => {
      if (r.qualityCategory === 'Excellent') excellent += 1;
      else if (r.qualityCategory === 'Good') good += 1;
      else if (r.qualityCategory === 'Need Improvement') needImprovement += 1;
      else poor += 1;
    });

    return {
      excellent,
      good,
      needImprovement,
      poor,
      total: filteredReports.length,
    };
  }, [filteredReports]);

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters({
      period: 'Mei – Desember 2026',
      month: 'Semua Bulan',
      area: 'Semua Area',
      subArea: 'Semua Sub Area',
      perusahaanPelapor: 'Semua Perusahaan',
      perusahaanTerlapor: 'Semua Terlapor',
      kategoriTemuan: 'Semua Kategori Temuan',
      kategoriBahaya: 'Semua Kategori Bahaya',
      risikoUtama: 'Semua Risiko Utama',
      levelRisiko: 'Semua Level Risiko',
      statusReport: 'Semua Status Report',
      searchQuery: '',
      aiStatus: 'Semua Status AI',
    });
  };

  // Export CSV handler (Columns A to Ai)
  const handleExportCSV = () => {
    const headers = [
      'No Hazard Report',
      'No PICA',
      'Tanggal',
      'Tanggal Temuan',
      'Tanggal Pembuatan Laporan',
      'Tanggal Input Closing Perbaikan',
      'NRP Pelapor',
      'Pelapor',
      'Perusahaan Pelapor',
      'Diubah Oleh',
      'Perusahaan Terlapor',
      'Area',
      'Sub Area',
      'lokasi',
      'Kategori Temuan',
      'Kategori Bahaya',
      'Risiko Utama',
      'temuan',
      'Jenis Temuan',
      'Level Risiko',
      'Keterangan Risiko',
      'Status Report',
      'NRP PIC',
      'PIC',
      'Batas Waktu',
      'NRP Approver',
      'Approver',
      'Tanggal Approval',
      'Komentar',
      'Akar Masalah',
      'Tindakan Perbaikan',
      'Status PICA',
      'Penilaian AI',
      'Hasil AI',
      'Quality Score',
    ];

    const rows = filteredReports.map((r) => [
      `"${r.noHazardReport}"`,
      `"${r.noPICA}"`,
      `"${r.tanggal}"`,
      `"${r.tanggalTemuan}"`,
      `"${r.tanggalPembuatanLaporan}"`,
      `"${r.tanggalInputClosingPerbaikan}"`,
      `"${r.nrpPelapor}"`,
      `"${r.pelapor}"`,
      `"${r.perusahaanPelapor}"`,
      `"${r.diubahOleh}"`,
      `"${r.perusahaanTerlapor}"`,
      `"${r.area}"`,
      `"${r.subArea}"`,
      `"${r.lokasi.replace(/"/g, '""')}"`,
      `"${r.kategoriTemuan}"`,
      `"${r.kategoriBahaya}"`,
      `"${r.risikoUtama}"`,
      `"${r.temuan.replace(/"/g, '""')}"`,
      `"${r.jenisTemuan}"`,
      `"${r.levelRisiko}"`,
      `"${r.keteranganRisiko.replace(/"/g, '""')}"`,
      `"${r.statusReport}"`,
      `"${r.nrpPIC}"`,
      `"${r.pic}"`,
      `"${r.batasWaktu}"`,
      `"${r.nrpApprover}"`,
      `"${r.approver}"`,
      `"${r.tanggalApproval}"`,
      `"${r.komentar.replace(/"/g, '""')}"`,
      `"${r.akarMasalah.replace(/"/g, '""')}"`,
      `"${r.tindakanPerbaikan.replace(/"/g, '""')}"`,
      `"${r.statusPICA}"`,
      `"${r.penilaian.replace(/"/g, '""')}"`,
      `"${r.hasil}"`,
      r.qualityScore,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Hazard_Report_Quality_ITU_SISADMO_${filters.month.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // HSE Verify & Winner handlers
  const handleVerifyReport = (reportId: string, verifiedBy: string, notes: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, hseVerified: true } : r))
    );
  };

  const handleSetWinner = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, hseVerified: true } : r))
    );
  };

  const handleUpdateReport = (updated: HazardReport) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedReport(updated);
  };

  const handleImportReports = (imported: HazardReport[], mode: 'replace' | 'append') => {
    setReports((prev) => {
      const updated = mode === 'replace' ? imported : [...imported, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('itu_hazard_reports_dec2026', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [liveSyncMessage, setLiveSyncMessage] = useState<string | null>(null);

  const handleQuickSync = async () => {
    setIsLiveSyncing(true);
    setLiveSyncMessage(null);
    try {
      const res = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success && data.csv) {
        const rows = parseCSVorTSV(data.csv);
        const imported = processRawSpreadsheetRows(rows);
        if (imported.length > 0) {
          handleImportReports(imported, 'replace');
          setLiveSyncMessage(`Berhasil memperbarui ${imported.length} data terbaru.`);
          setTimeout(() => setLiveSyncMessage(null), 4000);
        }
      } else {
        setLiveSyncMessage(data.message || 'Gagal menyinkronkan data.');
        setTimeout(() => setLiveSyncMessage(null), 4000);
      }
    } catch (_err: any) {
      setLiveSyncMessage('Gagal menyinkronkan data.');
      setTimeout(() => setLiveSyncMessage(null), 4000);
    } finally {
      setIsLiveSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalReports={reports.length}
        aiAssessedCount={reports.filter((r) => r.aiAssessed).length}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Sticky Header */}
        <DashboardHeader
          activePeriod={filters.period}
          totalFiltered={filteredReports.length}
          totalAll={reports.length}
          onResetFilters={handleResetFilters}
          onExportData={handleExportCSV}
          searchQuery={filters.searchQuery}
          setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
          onRefresh={handleQuickSync}
          isRefreshing={isLiveSyncing}
          refreshMessage={liveSyncMessage}
        />

        {/* Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Dynamic Filter Panel */}
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                monthCounts={monthCounts}
                options={filterOptions}
              />

              {/* 6 Core KPI Cards */}
              <KPICards
                totalReports={totalReportsCount}
                aiAssessedCount={aiAssessedCount}
                averageScore={averageQualityScore}
                sesuaiCount={sesuaiCount}
                activeReportersCount={activeReportersCount}
                bestReporter={bestReporter}
              />

              {/* Section 9: Best Hazard Report of the Month */}
              <MonthlyReward
                reports={reports}
                onOpenReportDetail={(r) => setSelectedReport(r)}
                onVerifyReport={handleVerifyReport}
                onSetWinner={handleSetWinner}
              />

              {/* Charts Row: Trend Analysis & Quality Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <QualityTrendChart data={monthlyTrendData} />
                </div>
                <div className="lg:col-span-5">
                  <QualityDistribution stats={qualityDistributionStats} />
                </div>
              </div>

              {/* Analytics Row: Top Quality Reporter & Top Quality Issues */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <TopReporter
                    reporters={reporterStats}
                    onSelectReporter={(name) => {
                      if (name) {
                        setFilters((prev) => ({ ...prev, searchQuery: name }));
                      } else {
                        setActiveTab('top-reporter');
                      }
                    }}
                  />
                </div>
                <div className="lg:col-span-5">
                  <QualityIssues reports={filteredReports} />
                </div>
              </div>

              {/* Interactive Hazard Report Dataset Table */}
              <HazardReportTable
                reports={filteredReports}
                onSelectReport={(r) => setSelectedReport(r)}
                searchQuery={filters.searchQuery}
                setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
              />
            </div>
          )}

          {/* TAB 2: HAZARD REPORT FOCUSED VIEW */}
          {activeTab === 'hazard-report' && (
            <div className="space-y-6">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                monthCounts={monthCounts}
                options={filterOptions}
              />
              <HazardReportTable
                reports={filteredReports}
                onSelectReport={(r) => setSelectedReport(r)}
                searchQuery={filters.searchQuery}
                setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
              />
            </div>
          )}

          {/* TAB 3: AI ASSESSMENT AUDIT VIEW */}
          {activeTab === 'ai-assessment' && (
            <AIAssessmentAuditView
              reports={filteredReports}
              onSelectReport={(r) => setSelectedReport(r)}
              onBatchAnalyze={() => {
                // Re-evaluate reports using internal calculation
                setReports((prev) =>
                  prev.map((r) => {
                    const ai = calculateQualityScore(r);
                    return {
                      ...r,
                      qualityScore: ai.qualityScore,
                      qualityCategory: ai.qualityCategory,
                      hasil: ai.hasil,
                      penilaian: ai.penilaian,
                      aiFindings: ai.aiFindings,
                      aiRecommendation: ai.aiRecommendation,
                      scoreBreakdown: ai.scoreBreakdown,
                      aiAssessed: true,
                    };
                  })
                );
              }}
            />
          )}

          {/* TAB 4: QUALITY ANALYSIS DEEP CHARTS */}
          {activeTab === 'quality-analysis' && (
            <QualityAnalysisDeepView reports={filteredReports} />
          )}

          {/* TAB 5: TOP REPORTER FULL LEADERBOARD */}
          {activeTab === 'top-reporter' && (
            <TopReporterFullView
              reporters={reporterStats}
              reports={filteredReports}
              onSelectReport={(r) => setSelectedReport(r)}
            />
          )}

          {/* TAB 6: MONTHLY REWARD SHOWCASE */}
          {activeTab === 'monthly-reward' && (
            <div className="space-y-6">
              <MonthlyReward
                reports={reports}
                onOpenReportDetail={(r) => setSelectedReport(r)}
                onVerifyReport={handleVerifyReport}
                onSetWinner={handleSetWinner}
              />
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Pedoman Kriteria Penilaian HSE Quality Reward
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">1. Kejelasan Objek Bahaya (25%)</div>
                    <p>Temuan harus memaparkan bahaya dengan dimensi nyata, nomor unit, dan dampak fisik langsung tanpa kata kiasan.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">2. Ketepatan Tindakan Kontrol (20%)</div>
                    <p>Tindakan perbaikan harus langsung mengeliminasi atau memitigasi risiko di lapangan (bukan sekadar himbauan lisan).</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">3. Verifikasi Lapangan (HSE Sign-off)</div>
                    <p>Pengawas HSE wajib mengecek fisik kondisi temuan dan bukti penutupan PICA sebelum pengumuman reward bulanan.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Detail AI Assessment Modal */}
      {selectedReport && (
        <AIAssessmentDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdateReport={handleUpdateReport}
        />
      )}
    </div>
  );
}
