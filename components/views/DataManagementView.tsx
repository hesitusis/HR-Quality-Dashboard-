'use client';

import React, { useState } from 'react';
import {
  Database,
  PlusCircle,
  Download,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Sparkles,
  ClipboardPaste,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { HazardReport } from '@/types/hazard';
import { calculateQualityScore } from '@/lib/sample-data';
import { parseCSVorTSV, processRawSpreadsheetRows } from '@/lib/csv-importer';

interface DataManagementViewProps {
  reports: HazardReport[];
  onAddReport: (newReport: HazardReport) => void;
  onImportReports: (importedReports: HazardReport[], mode: 'replace' | 'append') => void;
  onResetData: () => void;
  onExportCSV: () => void;
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  reports,
  onAddReport,
  onImportReports,
  onResetData,
  onExportCSV,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(true);
  const [addSuccess, setAddSuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [parsedPreviewCount, setParsedPreviewCount] = useState<number | null>(null);

  // Automated Google Sheets Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSheetId, setSyncSheetId] = useState('112FPFljq8cJVrYZlcSNvS9BBnWt-Pg-puHRcgtvPod8');
  const [syncSheetName, setSyncSheetName] = useState('Tarikan HR');
  const [syncNeedsSharing, setSyncNeedsSharing] = useState(false);
  const [sharingInstructions, setSharingInstructions] = useState<string[]>([]);

  // New report form state
  const [formData, setFormData] = useState({
    noHazardReport: `HR-ITU-2026-${String(reports.length + 101).padStart(4, '0')}`,
    noPICA: `PICA-ITU-2026-${String(reports.length + 101).padStart(4, '0')}`,
    tanggal: '15/07/2026 14:30',
    pelapor: '',
    nrpPelapor: '',
    perusahaanPelapor: 'PT Indotruck Utama',
    perusahaanTerlapor: 'PT Indotruck Utama',
    area: 'Workshop',
    subArea: 'Bay 3',
    lokasi: 'Di samping rak oli Bay 3',
    kategoriTemuan: 'Kondisi Tidak Aman',
    kategoriBahaya: 'Bahaya Fisik',
    risikoUtama: 'Terpeleset / Tersandung',
    temuan: '',
    levelRisiko: 'MEDIUM',
    pic: 'Foreman Workshop',
    akarMasalah: 'Kurangnya kesadaran housekeeping',
    tindakanPerbaikan: 'Melakukan pembersihan ceceran oli dengan sawdust dan menutup drum oli.',
    statusReport: 'Open',
    statusPICA: 'Open',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pelapor || !formData.temuan) return;

    // Run AI quality evaluation
    const aiResult = calculateQualityScore({
      ...formData,
      levelRisiko: formData.levelRisiko as any,
    });

    const newReport: HazardReport = {
      id: `rep-custom-${Date.now()}`,
      noHazardReport: formData.noHazardReport,
      noPICA: formData.noPICA,
      tanggal: formData.tanggal,
      tanggalTemuan: formData.tanggal,
      tanggalPembuatanLaporan: formData.tanggal,
      tanggalInputClosing: '-',
      tanggalInputClosingPerbaikan: '-',
      nrpPelapor: formData.nrpPelapor || '12345678',
      pelapor: formData.pelapor,
      perusahaanPelapor: formData.perusahaanPelapor,
      diubahOleh: formData.pelapor,
      perusahaanTerlapor: formData.perusahaanTerlapor,
      area: formData.area,
      subArea: formData.subArea,
      lokasi: formData.lokasi,
      kategoriTemuan: formData.kategoriTemuan,
      kategoriBahaya: formData.kategoriBahaya,
      risikoUtama: formData.risikoUtama,
      temuan: formData.temuan,
      jenisTemuan: formData.kategoriTemuan,
      levelRisiko: formData.levelRisiko as any,
      keteranganRisiko: `Potensi bahaya ${formData.risikoUtama}`,
      statusReport: formData.statusReport,
      nrpPIC: '87654321',
      pic: formData.pic,
      batasWaktu: '20/07/2026',
      nrpApprover: '11223344',
      approver: 'HSE Coordinator',
      tanggalApproval: '16/07/2026',
      komentar: 'Laporan diterima dan diteruskan ke PIC terkait.',
      akarMasalah: formData.akarMasalah,
      tindakanPerbaikan: formData.tindakanPerbaikan,
      statusPICA: formData.statusPICA,
      penilaian: aiResult.penilaian,
      hasil: aiResult.hasil,
      statusLokasi: aiResult.statusLokasi,
      analisisLokasiAI: aiResult.analisisLokasiAI,
      qualityScore: aiResult.qualityScore,
      qualityCategory: aiResult.qualityCategory,
      scoreBreakdown: aiResult.scoreBreakdown,
      aiFindings: aiResult.aiFindings,
      aiRecommendation: aiResult.aiRecommendation,
      topQualityIssue: aiResult.topQualityIssue,
      month: 'Juli 2026',
      aiAssessed: true,
      hseVerified: false,
    };

    onAddReport(newReport);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  const handleProcessImport = (textToProcess: string, mode: 'replace' | 'append' = 'replace') => {
    setImportError(null);
    setImportStatus(null);
    if (!textToProcess.trim()) {
      setImportError('Silakan tempel teks spreadsheet atau unggah berkas CSV terlebih dahulu.');
      return;
    }

    try {
      const parsedRows = parseCSVorTSV(textToProcess);
      if (parsedRows.length < 2) {
        setImportError('Format data tidak dikenali. Pastikan baris pertama adalah judul kolom (Header).');
        return;
      }

      const generatedReports = processRawSpreadsheetRows(parsedRows);
      if (generatedReports.length === 0) {
        setImportError('Tidak ada baris data yang valid ditemukan untuk diproses.');
        return;
      }

      onImportReports(generatedReports, mode);
      setImportStatus(`Berhasil memuat ${generatedReports.length} baris data Hazard Report & Evaluasi Mutu AI!`);
      setParsedPreviewCount(generatedReports.length);
      setImportText('');
    } catch (err: any) {
      console.error(err);
      setImportError(`Gagal memproses data: ${err.message || 'Format tidak valid'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        handleProcessImport(content, 'replace');
      }
    };
    reader.onerror = () => {
      setImportError('Gagal membaca berkas. Pastikan format berkas adalah teks atau CSV.');
    };
    reader.readAsText(file);
  };

  const handleSyncGoogleSheets = async () => {
    setIsSyncing(true);
    setImportError(null);
    setImportStatus(null);
    setSyncNeedsSharing(false);

    try {
      const res = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId: syncSheetId.trim(),
          sheetName: syncSheetName.trim(),
          gid: '0',
        }),
      });

      const data = await res.json();

      if (data.success && data.csv) {
        const parsedRows = parseCSVorTSV(data.csv);
        const generatedReports = processRawSpreadsheetRows(parsedRows);

        if (generatedReports.length > 0) {
          onImportReports(generatedReports, 'replace');
          setImportStatus(`Sinkronisasi Berhasil! ${generatedReports.length} baris data Hazard Report dari Google Sheets telah dimuat & dievaluasi AI.`);
          setParsedPreviewCount(generatedReports.length);
        } else {
          setImportError('Data CSV berhasil diunduh dari Google Sheets, namun tidak ditemukan baris data yang cocok.');
        }
      } else if (data.needsSharing) {
        setSyncNeedsSharing(true);
        setSharingInstructions(data.sharingInstructions || []);
        setImportError(data.message || 'Google Sheets memerlukan izin akses.');
      } else {
        setImportError(data.message || 'Gagal menyinkronkan dengan Google Sheets.');
      }
    } catch (err: any) {
      setImportError(`Koneksi gagal: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              DATA MANAGEMENT &amp; SPREADSHEET INTEGRATION
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Kelola dataset Hazard Report kolom A hingga Ai. Sinkronkan seluruh 497 data dari Google Sheets / Excel untuk evaluasi AI otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-open-import"
            onClick={() => setShowImportPanel(!showImportPanel)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import 497 Data (Sheets / CSV)</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download CSV (A-Ai)</span>
          </button>

          <button
            id="btn-open-add-report"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Input Manual</span>
          </button>
        </div>
      </div>

      {/* IMPORT PANEL: Google Sheets / CSV Import */}
      {showImportPanel && (
        <div className="bg-white rounded-xl p-6 border-2 border-emerald-500 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Sinkronisasi Dataset Google Sheets (Semua Baris Data)
                </h3>
                <p className="text-xs text-slate-500">
                  Muat seluruh 497 baris data dari Google Spreadsheet Anda secara instan ke dashboard.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowImportPanel(false)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded"
            >
              ✕ Tutup
            </button>
          </div>

          {/* Quick Step Guide */}
          <div className="space-y-4">
            {/* OPSI UTAMA: SINKRONISASI OTOMATIS 1-KLIK */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-500 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
                    <RotateCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>Sinkronisasi Otomatis Google Sheets (Tinggal 1-Klik)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Rekomendasi
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600">
                      Tarik data 497 laporan dari Google Sheets &amp; jalankan evaluasi AI langsung tanpa perlu download/upload file.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-auto-sync-sheets"
                  onClick={handleSyncGoogleSheets}
                  disabled={isSyncing}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
                >
                  <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Menghubungi Google Sheets...' : '🔄 Sinkronkan Sekarang'}</span>
                </button>
              </div>

              {/* Target Sheet Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white/80 p-3 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="font-semibold text-slate-500">ID Dokumen:</span>
                  <span className="font-mono text-emerald-950 font-medium truncate max-w-[200px]" title={syncSheetId}>
                    {syncSheetId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="font-semibold text-slate-500">Nama Sheet:</span>
                  <span className="font-mono text-emerald-950 font-medium">{syncSheetName}</span>
                  <span className="text-slate-400 text-[11px]">(gid: 0)</span>
                </div>
              </div>

              {/* Jika Perlu Membuka Izin Akses (Sharing Required Notice) */}
              {syncNeedsSharing && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-amber-950">
                        Perlu 1 Langkah Pengaturan Izin di Google Sheets:
                      </h5>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Dokumen Google Sheets Anda saat ini berstatus <strong>&quot;Dibatasi (Hanya Anda)&quot;</strong> sehingga server belum diizinkan membaca datanya.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/90 p-3 rounded-lg border border-amber-200 text-xs text-slate-700 space-y-2">
                    <div className="font-semibold text-slate-900">
                      Cara mengaktifkan sinkronisasi otomatis (hanya 10 detik):
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-700">
                      <li>
                        Buka dokumen:{' '}
                        <a
                          href={`https://docs.google.com/spreadsheets/d/${syncSheetId}/edit`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-emerald-700 underline inline-flex items-center gap-1 hover:text-emerald-800"
                        >
                          Buka Google Spreadsheet Tarikan HR <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li>
                        Klik tombol biru <strong>&quot;Bagikan&quot; (Share)</strong> di pojok kanan atas spreadsheet.
                      </li>
                      <li>
                        Di bagian <em>Akses umum (General access)</em>, ubah dari <strong>Dibatasi</strong> menjadi <strong>&quot;Siapa saja yang memiliki tautan&quot; (Anyone with the link)</strong> dengan peran <em>Pelihat (Viewer)</em>.
                      </li>
                      <li>
                        Klik <strong>Selesai</strong> di Google Sheets, lalu klik tombol hijau di bawah ini:
                      </li>
                    </ol>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSyncGoogleSheets}
                        disabled={isSyncing}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-xs flex items-center gap-1.5"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>Coba Sinkronkan Ulang Sekarang</span>
                      </button>
                      <span className="text-[11px] text-slate-500">
                        *Langkah ini hanya perlu dilakukan 1 kali saja.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* OPSI ALTERNATIF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cara 2: Copy-Paste Langsung */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-900">
                  <ClipboardPaste className="w-4 h-4 text-emerald-600" />
                  <span>Metode Alternatif A: Salin-Tempel (Copy-Paste)</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Jika tidak ingin mengubah status bagikan Google Sheets, tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono">Ctrl+A</kbd> lalu <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono">Ctrl+C</kbd> di Google Sheets, lalu tempel di kotak bawah.
                </p>
              </div>

              {/* Cara 3: Upload File CSV */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-900">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Metode Alternatif B: Unggah Berkas CSV</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Unduh dari menu <em>File &rarr; Download &rarr; Comma Separated Values (.csv)</em>, lalu pilih file:
                </p>
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-xs transition-colors">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Pilih File CSV (.csv)</span>
                  <input
                    type="file"
                    accept=".csv,.tsv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Paste Textarea Area */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Tempel (Paste) Seluruh Isi Tabel / CSV di Sini:
            </label>
            <textarea
              rows={5}
              placeholder="Tempel data di sini (No Hazard Report, No PICA, Tanggal, Pelapor, Temuan, Penilaian, Hasil...)"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Feedback messages */}
          {importStatus && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {importError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              Sistem akan otomatis mengenali kolom A hingga Ai serta mengevaluasi skor mutu K3 seluruh baris data.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImportText('')}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Bersihkan
              </button>

              <button
                type="button"
                onClick={() => handleProcessImport(importText, 'replace')}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proses &amp; Muat ke Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Report Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 border-2 border-emerald-500 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Input Form Hazard Report Baru (Real-Time AI Quality Check)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕ Tutup Form
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No Hazard Report:</label>
              <input
                type="text"
                required
                value={formData.noHazardReport}
                onChange={(e) => setFormData({ ...formData, noHazardReport: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Pelapor:</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={formData.pelapor}
                onChange={(e) => setFormData({ ...formData, pelapor: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NRP Pelapor:</label>
              <input
                type="text"
                placeholder="8 digit NRP"
                value={formData.nrpPelapor}
                onChange={(e) => setFormData({ ...formData, nrpPelapor: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area Kerja:</label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Workshop">Workshop</option>
                <option value="Tambang / Pit">Tambang / Pit</option>
                <option value="Hauling Road">Hauling Road</option>
                <option value="Fuel Station">Fuel Station</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Office & Mess">Office & Mess</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sub Area:</label>
              <input
                type="text"
                value={formData.subArea}
                onChange={(e) => setFormData({ ...formData, subArea: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi Spesifik:</label>
              <input
                type="text"
                required
                placeholder="Misal: Bay 3 samping kompresor"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori Bahaya:</label>
              <select
                value={formData.kategoriBahaya}
                onChange={(e) => setFormData({ ...formData, kategoriBahaya: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Bahaya Fisik">Bahaya Fisik</option>
                <option value="Bahaya Mekanikal">Bahaya Mekanikal</option>
                <option value="Bahaya Kimia">Bahaya Kimia</option>
                <option value="Bahaya Elektrik">Bahaya Elektrik</option>
                <option value="Bahaya Ergonomi">Bahaya Ergonomi</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Level Risiko:</label>
              <select
                value={formData.levelRisiko}
                onChange={(e) => setFormData({ ...formData, levelRisiko: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">PIC Perbaikan:</label>
              <input
                type="text"
                value={formData.pic}
                onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Deskripsi Temuan Bahaya (Sertakan objek spesifik &amp; dimensi/kondisi):
              </label>
              <textarea
                rows={2}
                required
                placeholder="Contoh: Ditemukan selang hidrolik unit HD785 retak dan bocor halus di area sambungan fitting, tetesan oli membasahi lantai kerja seluas 30x30 cm."
                value={formData.temuan}
                onChange={(e) => setFormData({ ...formData, temuan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Akar Masalah:</label>
                <input
                  type="text"
                  value={formData.akarMasalah}
                  onChange={(e) => setFormData({ ...formData, akarMasalah: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tindakan Perbaikan:</label>
                <input
                  type="text"
                  value={formData.tindakanPerbaikan}
                  onChange={(e) => setFormData({ ...formData, tindakanPerbaikan: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {addSuccess ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Laporan Berhasil Disimpan &amp; Dinilai oleh AI!</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                Sistem AI akan otomatis menghitung Quality Score (0-100) dan menentukan status SESUAI.
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simpan &amp; Evaluasi AI</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Dataset Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Kolom Terpetakan</div>
          <div className="text-xl font-bold text-slate-900 mt-1">35 Kolom (A &rarr; Ai)</div>
          <div className="text-[11px] text-emerald-700 mt-1">✓ Sesuai Header Spreadsheet Resmi</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Data Hazard Report</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{reports.length} Baris Data</div>
          <div className="text-[11px] text-slate-500 mt-1">Periode: Mei, Juni, Juli 2026</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Reset Database</div>
            <div className="text-xs font-bold text-slate-800 mt-1">Kembalikan data default</div>
          </div>
          <button
            onClick={onResetData}
            className="p-2 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 transition-colors"
            title="Reset ke data awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
