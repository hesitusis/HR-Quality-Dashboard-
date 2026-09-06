import { HazardReport, AIResultStatus, RiskLevel } from '@/types/hazard';
import { calculateQualityScore, parseMonth } from '@/lib/sample-data';

/**
 * Robust CSV/TSV parser supporting quoted fields, multi-line values, and custom delimiters
 */
export function parseCSVorTSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  // Determine delimiter: if first line has tabs, delimiter is '\t', otherwise ','
  const firstLine = text.slice(0, 1000).split('\n')[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') && !firstLine.includes(',')) ? ';' : ',';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length > 1 || currentRow[0] !== '') {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Convert parsed rows into typed HazardReport array
 */
export function processRawSpreadsheetRows(rows: string[][]): HazardReport[] {
  if (rows.length < 2) return [];

  // Clean headers (normalize lowercase without symbols)
  const headerRow = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const findCol = (exactKeys: string[], fallbackKeys: string[] = []): number => {
    // 1. Priority 1: Exact match (prevents substring collision, e.g. "nrppelapor" matching "pelapor")
    const exact = headerRow.findIndex((h) => exactKeys.includes(h));
    if (exact !== -1) return exact;

    // 2. Priority 2: Fallback partial matches
    if (fallbackKeys.length > 0) {
      return headerRow.findIndex((h) => fallbackKeys.some((k) => h.includes(k)));
    }
    return -1;
  };

  const colNoHR = findCol(['nohazardreport', 'hazardreport', 'nohr'], ['nohazard']);
  const colPICA = findCol(['nopica', 'pica'], []);
  const colTanggal = findCol(['tanggal', 'date'], []);
  const colTanggalTemuan = findCol(['tanggaltemuan'], []);
  const colTanggalLaporan = findCol(['tanggalpembuatanlaporan', 'tanggalpembuatan', 'tanggallaporan'], []);
  const colTanggalClosing = findCol(['tanggalinputclosingperbaikan', 'tanggalinputclosing', 'closingperbaikan'], []);
  const colNRP = findCol(['nrppelapor', 'nrp'], ['nrppelapor']);
  
  // Kolom H (Index 7) adalah Nama Pelapor (bukan NRP Pelapor di Kolom G)
  const pelaporFound = findCol(['pelapor', 'namapelapor', 'reporter'], []);
  const colPelapor = pelaporFound !== -1 ? pelaporFound : (headerRow.length > 7 ? 7 : -1);

  const colPerusahaanPelapor = findCol(['perusahaanpelapor'], []);
  const colDiubahOleh = findCol(['diubaholeh'], []);
  const colPerusahaanTerlapor = findCol(['perusahaanterlapor'], []);
  const colArea = findCol(['area'], []);
  const colSubArea = findCol(['subarea'], []);
  const colLokasi = findCol(['lokasi', 'location'], []);
  const colKategoriTemuan = findCol(['kategoritemuan'], []);
  const colKategoriBahaya = findCol(['kategoribahaya'], []);
  const colRisikoUtama = findCol(['risikoutama'], []);
  const colTemuan = findCol(['temuan', 'deskripsitemuan'], ['temuan']);
  const colJenisTemuan = findCol(['jenistemuan'], []);
  const colLevelRisiko = findCol(['levelrisiko'], ['risiko']);
  const colKeteranganRisiko = findCol(['keteranganrisiko'], []);
  const colStatusReport = findCol(['statusreport'], []);
  const colNRPPIC = findCol(['nrppic'], []);
  const colPIC = findCol(['pic', 'namapic'], []);
  const colBatasWaktu = findCol(['bataswaktu', 'duedate'], []);
  const colLevelRisikoReview = findCol(['levelrisikoreview'], []);
  const colNRPApprover = findCol(['nrpapprover'], []);
  const colApprover = findCol(['approver', 'namaapprover'], []);
  const colTanggalApproval = findCol(['tanggalapproval'], []);
  const colKomentar = findCol(['komentar'], []);
  const colAkarMasalah = findCol(['akarmasalah'], []);
  const colTindakanPerbaikan = findCol(['tindakanperbaikan'], []);
  const colStatusPICA = findCol(['statuspica'], []);
  const colPenilaian = findCol(['penilaian'], []);
  const colHasil = findCol(['hasil'], []);

  const results: HazardReport[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || row.every((c) => !c)) continue;

    const getVal = (idx: number, fallback = '-') => (idx >= 0 && row[idx] ? row[idx] : fallback);

    const noHazardReport = getVal(colNoHR, `ITU/HR/${String(200000 + i)}`);
    const noPICA = getVal(colPICA, '-');
    const tanggal = getVal(colTanggal, '7/31/2026');
    const temuan = getVal(colTemuan, '');
    if (!temuan && !getVal(colPelapor, '')) continue; // Skip completely empty rows

    const pelapor = getVal(colPelapor, 'Pelapor Indotruck');
    const area = getVal(colArea, 'Workshop Tambang');
    const lokasi = getVal(colLokasi, area);
    const rawHasil = getVal(colHasil, '').toUpperCase();
    const rawPenilaian = getVal(colPenilaian, '');
    const tindakanPerbaikan = getVal(colTindakanPerbaikan, '-');
    const komentar = getVal(colKomentar, '-');

    // Risk level normalization
    let levelRisiko: RiskLevel = 'MEDIUM';
    const rawRisk = getVal(colLevelRisiko, '').toUpperCase();
    if (rawRisk.includes('CRITICAL')) levelRisiko = 'CRITICAL';
    else if (rawRisk.includes('HIGH')) levelRisiko = 'HIGH';
    else if (rawRisk.includes('LOW')) levelRisiko = 'LOW';

    // AI Status normalization
    let hasil: AIResultStatus = 'SESUAI';
    if (rawHasil.includes('TIDAK') || rawPenilaian.toUpperCase().includes('TIDAK SESUAI')) {
      hasil = 'TIDAK SESUAI';
    } else if (rawHasil.includes('SESUAI') || rawPenilaian.toUpperCase().includes('SESUAI')) {
      hasil = 'SESUAI';
    }

    const month = parseMonth(tanggal);
    const assessment = calculateQualityScore(
      hasil,
      rawPenilaian,
      temuan,
      lokasi,
      tindakanPerbaikan,
      komentar,
      levelRisiko,
      i
    );

    const report: HazardReport = {
      id: `HR-${i}-${Date.now()}`,
      noHazardReport,
      noPICA,
      tanggal,
      month,
      tanggalTemuan: getVal(colTanggalTemuan, tanggal),
      tanggalPembuatanLaporan: getVal(colTanggalLaporan, tanggal),
      tanggalInputClosing: getVal(colTanggalClosing, '-'),
      tanggalInputClosingPerbaikan: getVal(colTanggalClosing, '-'),
      nrpPelapor: getVal(colNRP, '12345'),
      pelapor,
      perusahaanPelapor: getVal(colPerusahaanPelapor, 'PT Indotruck Utama'),
      diubahOleh: getVal(colDiubahOleh, pelapor),
      perusahaanTerlapor: getVal(colPerusahaanTerlapor, 'ITU'),
      area,
      subArea: getVal(colSubArea, '-'),
      lokasi,
      kategoriTemuan: getVal(colKategoriTemuan, 'Kondisi Tidak Aman'),
      kategoriBahaya: getVal(colKategoriBahaya, 'Keselamatan Kerja'),
      risikoUtama: getVal(colRisikoUtama, '- TIDAK TERMASUK RISIKO UTAMA'),
      temuan,
      jenisTemuan: getVal(colJenisTemuan, '- Kelaikan Peralatan/Unit Tidak Memadai'),
      levelRisiko,
      keteranganRisiko: getVal(colKeteranganRisiko, '-'),
      statusReport: getVal(colStatusReport, 'Proses PICA'),
      nrpPIC: getVal(colNRPPIC, '9937'),
      pic: getVal(colPIC, pelapor),
      batasWaktu: getVal(colBatasWaktu, '-'),
      levelRisikoReview: levelRisiko,
      nrpApprover: getVal(colNRPApprover, '9020'),
      approver: getVal(colApprover, 'MUHAMMAD ALI'),
      tanggalApproval: getVal(colTanggalApproval, tanggal),
      komentar,
      akarMasalah: getVal(colAkarMasalah, '-'),
      tindakanPerbaikan,
      statusPICA: getVal(colStatusPICA, 'Open'),
      penilaian: assessment.penilaian || rawPenilaian,
      hasil,
      statusLokasi: assessment.statusLokasi,
      analisisLokasiAI: assessment.analisisLokasiAI,
      qualityScore: assessment.qualityScore,
      qualityCategory: assessment.qualityCategory,
      scoreBreakdown: assessment.scoreBreakdown,
      aiFindings: assessment.aiFindings,
      aiRecommendation: assessment.aiRecommendation,
      topQualityIssue: assessment.topQualityIssue,
      aiAssessed: true,
      hseVerified: assessment.qualityScore >= 88,
      hseVerifiedBy: assessment.qualityScore >= 88 ? 'HSE Lead Officer' : undefined,
    };

    results.push(report);
  }

  return results;
}
