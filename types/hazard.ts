export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus = 'Proses PICA' | 'Closed' | 'Proses Verifikasi' | 'Ditolak' | 'Direvisi' | string;

export type PICAStatus = 'Open' | 'Closed' | '-' | string;

export type QualityCategory = 'Excellent' | 'Good' | 'Need Improvement' | 'Poor';

export type AIResultStatus = 'SESUAI' | 'PERLU PERBAIKAN' | 'TIDAK SESUAI';

export type LocationClarityStatus = 'SPESIFIK' | 'KURANG SPESIFIK' | 'TIDAK SPESIFIK';

export interface QualityScoreBreakdown {
  presisiLokasi: number;           // Bobot 40% (max 40) - Tingkat spesifisitas & kepastian titik lokasi bahaya
  identifikasiHazard: number;      // Bobot 30% (max 30) - Spesifisitas objek & temuan bahaya
  identifikasiRisiko: number;      // Bobot 30% (max 30) - Kuantifikasi & objektivitas risiko
  tindakanPengendalian?: number;    // deprecated / optional
  kelengkapanInformasi?: number;    // deprecated / optional
  buktiPendukung?: number;         // deprecated / optional
}

export interface HazardReport {
  id: string;
  noHazardReport: string;
  noPICA: string;
  tanggal: string;                 // e.g. "7/31/2026" or "31-Jul-2026"
  month: 'Mei 2026' | 'Juni 2026' | 'Juli 2026';
  tanggalTemuan: string;
  tanggalPembuatanLaporan: string;
  tanggalInputClosing: string;
  tanggalInputClosingPerbaikan?: string;
  nrpPelapor: string;
  pelapor: string;
  perusahaanPelapor: string;
  diubahOleh: string;
  perusahaanTerlapor: string;
  area: string;
  subArea: string;
  lokasi: string;
  kategoriTemuan: string;
  kategoriBahaya: string;
  risikoUtama: string;
  temuan: string;
  jenisTemuan: string;
  levelRisiko: RiskLevel;
  keteranganRisiko: string;
  statusReport: ReportStatus;
  nrpPIC: string;
  pic: string;
  batasWaktu: string;
  levelRisikoReview?: RiskLevel;
  nrpApprover: string;
  approver: string;
  tanggalApproval: string;
  komentar: string;
  akarMasalah: string;
  tindakanPerbaikan: string;
  statusPICA: PICAStatus;
  penilaian: string;               // Original evaluator note directly from Apps Script AI
  hasil: AIResultStatus;           // SESUAI / TIDAK SESUAI
  // Location Assessment from Apps Script AI & Location Verification
  statusLokasi: LocationClarityStatus; // SPESIFIK | KURANG SPESIFIK | TIDAK SPESIFIK
  analisisLokasiAI: string;            // Penjelasan status lokasi bahaya dari AI Apps Script
  // AI Enhanced Assessment fields
  qualityScore: number;            // 0 - 100
  qualityCategory: QualityCategory;
  scoreBreakdown: QualityScoreBreakdown;
  aiFindings: string[];
  aiRecommendation: string;
  topQualityIssue?: string;
  aiAssessed?: boolean;
  hseVerified?: boolean;
  hseVerifiedBy?: string;
  hseNotes?: string;
}

export interface FilterOptions {
  period: string; // 'All' | 'Mei 2026' | 'Juni 2026' | 'Juli 2026'
  month: string;  // 'Semua Bulan' | 'Mei 2026' | 'Juni 2026' | 'Juli 2026'
  area: string;
  subArea: string;
  perusahaanPelapor: string;
  perusahaanTerlapor: string;
  kategoriTemuan: string;
  kategoriBahaya: string;
  risikoUtama: string;
  levelRisiko: string;
  statusReport: string;
  searchQuery: string;
  aiStatus: string;
  statusLokasi?: string;
}

export interface ReporterStats {
  pelapor: string;
  nrp: string;
  perusahaan: string;
  totalReports: number;
  averageScore: number;
  sesuaiReports: number;
  tidakSesuaiReports?: number;
  perluPerbaikanReports?: number;
  excellentCount?: number;
  goodCount?: number;
  needImprovementCount?: number;
  poorCount?: number;
}
