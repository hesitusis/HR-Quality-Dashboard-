export interface AssessmentCriterion {
  no: number;
  paramKey: 'presisiLokasi' | 'identifikasiHazard' | 'identifikasiRisiko';
  title: string;
  weight: number;
  maxScore: number;
  description: string;
  guidelines: string[];
}

export const ASSESSMENT_CRITERIA: AssessmentCriterion[] = [
  {
    no: 1,
    paramKey: 'presisiLokasi',
    title: 'Presisi Lokasi Bahaya',
    weight: 40,
    maxScore: 40,
    description:
      'Menjelaskan lokasi kejadian/bahaya secara spesifik, jelas, dan dapat ditemukan kembali oleh orang lain tanpa harus bertanya ulang. Lokasi ideal mencantumkan area, titik/landmark, nomor unit, fasilitas, jalur, atau posisi spesifik lainnya. Semakin spesifik lokasi yang diberikan dan semakin mudah diverifikasi, semakin tinggi nilainya.',
    guidelines: [
      'Cantumkan nama ruangan, nomor bay, nama unit/alat, nomor pilar, atau kilometer jalur.',
      'Hindari hanya menulis nama area umum (misal: hanya "Workshop", "Mess", atau "Office").',
      'Status spesifisitas dievaluasi langsung dari hasil analisa AI di Kolom AH.',
    ],
  },
  {
    no: 2,
    paramKey: 'identifikasiHazard',
    title: 'Objek Identifikasi Hazard',
    weight: 30,
    maxScore: 30,
    description:
      'Menjelaskan objek, kondisi, aktivitas, peralatan, material, atau tindakan yang menjadi sumber bahaya secara jelas dan spesifik. Laporan tidak hanya menyebutkan kategori umum seperti “alat rusak” atau “kondisi tidak aman”, tetapi menjelaskan apa yang menjadi sumber hazard dan bagian mana yang bermasalah.',
    guidelines: [
      'Sebutkan nama komponen, material, atau tindakan spesifik yang tidak aman.',
      'Hindari frasa generik seperti "alat rusak", "kondisi tidak aman", atau "kotor".',
      'Dapat diverifikasi secara visual dan fisik di lapangan.',
    ],
  },
  {
    no: 3,
    paramKey: 'identifikasiRisiko',
    title: 'Ukuran & Identifikasi Risiko',
    weight: 30,
    maxScore: 30,
    description:
      'Menjelaskan potensi risiko secara tepat berdasarkan kondisi hazard yang ditemukan, termasuk siapa/apa yang dapat terdampak, bagaimana mekanisme kejadiannya, dan konsekuensi yang mungkin terjadi. Pemilihan dari 18 Risiko Utama harus sesuai dengan bahaya yang ditemukan, bukan sekadar memilih risiko dengan tingkat keparahan tertinggi.',
    guidelines: [
      'Wajib memilih klasifikasi yang sesuai dari 18 Risiko Utama K3.',
      'Jelaskan pihak atau unit yang berpotensi terdampak serta mekanismenya.',
      'Kuantifikasi dimensi atau volume bahaya secara objektif tanpa opini subjektif.',
    ],
  },
];

export interface MainRiskDefinition {
  id: number;
  nama: string;
  deskripsiSingkat: string;
}

export const DAFTAR_18_RISIKO_UTAMA: MainRiskDefinition[] = [
  {
    id: 1,
    nama: 'Risiko pekerja atau tamu terkena sengatan listrik',
    deskripsiSingkat: 'Kontak langsung/tidak langsung dengan arus listrik, kabel terkelupas, panel terbuka.',
  },
  {
    id: 2,
    nama: 'Risiko pekerja atau tamu terpeleset, tersandung, atau jatuh dari ketinggian',
    deskripsiSingkat: 'Bekerja di ketinggian >1.8m, lantai licin, tangga tidak standar, platform kerja terbuka.',
  },
  {
    id: 3,
    nama: 'Risiko pekerja atau tamu/unit mengalami tenggelam',
    deskripsiSingkat: 'Bekerja dekat genangan air dalam, settling pond, kolam tambang, atau sump tanpa pelampung.',
  },
  {
    id: 4,
    nama: 'Risiko pekerja atau tamu tertabrak, tersenggol, terlindas unit bergerak, terjepit atau terjebak di dalam kabin, terlempar keluar dari unit, terpukul, tersangkut, terjepit atau terlilit',
    deskripsiSingkat: 'Interaksi manusia dan alat berat/kendaraan, blind spot, moving parts, atau pinch point.',
  },
  {
    id: 5,
    nama: 'Risiko pekerja atau unit tertimpa atau kejatuhan benda, material, struktur sarana prasarana, atau pohon yang ambruk',
    deskripsiSingkat: 'Benda jatuh dari ketinggian, struktur rusak/lapuk, pohon miring di jalur lintasan operasional.',
  },
  {
    id: 6,
    nama: 'Risiko pekerja atau unit/kendaraan tambang mengalami hilang kendali, tergelincir, terperosok, atau hanyut',
    deskripsiSingkat: 'Kondisi jalan licin, rem blong, fatigue pengemudi, tanggul/bund wall tidak standar.',
  },
  {
    id: 7,
    nama: 'Risiko pekerja dan/atau unit operasional/support tertimbun material longsoran',
    deskripsiSingkat: 'Ketidakstabilan lereng/highwall, runtuhan batuan, atau dumpingan labil.',
  },
  {
    id: 8,
    nama: 'Risiko pekerja mengalami keracunan makanan atau minuman',
    deskripsiSingkat: 'Kontaminasi makanan/minuman kantin, air minum tidak higienis, atau kedaluwarsa.',
  },
  {
    id: 9,
    nama: 'Risiko pekerja terkena serangan atau tersengat binatang liar/berbisa',
    deskripsiSingkat: 'Ular, tawon, kalajengking di area semak, gudang, atau kabin unit.',
  },
  {
    id: 10,
    nama: 'Risiko pekerja terpapar bahan kimia berbahaya dan beracun',
    deskripsiSingkat: 'B3, ceceran asam aki, pelarut kimia, tumpahan bahan bakar/oli tanpa MSDS & APD.',
  },
  {
    id: 11,
    nama: 'Risiko pekerja terpapar gas beracun/ kekurangan oksigen',
    deskripsiSingkat: 'Ruang terbatas (confined space), penumpukan gas CO, H2S, SO2, atau ventilasi minim.',
  },
  {
    id: 12,
    nama: 'Risiko pekerja terpukul atau terjepit atau terpotong atau tersayat peralatan/material',
    deskripsiSingkat: 'Penggunaan perkakas kerja, gerinda tanpa pelindung, material tajam, atau rotasi mesin.',
  },
  {
    id: 13,
    nama: 'TIDAK TERMASUK RISIKO UTAMA',
    deskripsiSingkat: 'Hazard berisiko rendah atau non-kritis yang tidak tergolong dalam risiko fatalitas utama di atas.',
  },
];

export interface ParameterDeductionDetail {
  paramKey: 'presisiLokasi' | 'identifikasiHazard' | 'identifikasiRisiko';
  title: string;
  maxScore: number;
  currentScore: number;
  deduction: number;
  isPerfect: boolean;
  alasanKekurangan: string;
  langkahMenuju100: string;
  contohRujukan: string;
}

export function getParameterDeductionDetail(
  paramKey: 'presisiLokasi' | 'identifikasiHazard' | 'identifikasiRisiko',
  currentScore: number,
  reportContext?: {
    lokasi?: string;
    area?: string;
    subArea?: string;
    statusLokasi?: string;
    analisisLokasiAI?: string;
    temuan?: string;
    risikoUtama?: string;
    kategoriTemuan?: string;
    aiFindings?: string[];
  }
): ParameterDeductionDetail {
  if (paramKey === 'presisiLokasi') {
    const maxScore = 40;
    const score = Math.max(0, Math.min(maxScore, currentScore));
    const deduction = maxScore - score;
    const isPerfect = deduction === 0;

    let alasanKekurangan = '';
    let langkahMenuju100 = '';
    let contohRujukan = '';

    if (isPerfect) {
      alasanKekurangan = 'Nilai sempurna (40/40). Titik lokasi telah mencantumkan informasi area dan patokan fisik spesifik yang langsung dapat diverifikasi di lapangan tanpa bertanya ulang.';
      langkahMenuju100 = 'Pertahankan format pelaporan lokasi berjenjang ini untuk laporan berikutnya.';
      contohRujukan = `${reportContext?.area || 'Workshop'} - ${reportContext?.lokasi || 'Bay 3 sisi timur dekat rak perkakas'}`;
    } else {
      const loc = reportContext?.lokasi || reportContext?.area || 'Lokasi umum';
      if (reportContext?.statusLokasi === 'TIDAK SPESIFIK') {
        alasanKekurangan = `Poin berkurang -${deduction} karena lokasi hanya menyebutkan area luas ("${loc}") tanpa rujukan fisik gedung, ruangan, jalur, nomor bay, atau nomor unit yang jelas.`;
      } else if (reportContext?.statusLokasi === 'KURANG SPESIFIK') {
        alasanKekurangan = `Poin berkurang -${deduction} karena lokasi ("${loc}") sudah menyebut area/gedung, tetapi belum dilengkapi patokan tetap terdekat (misal: nomor bay, nomor pilar, nomor unit alat berat, atau kilometer jalur hauling).`;
      } else {
        alasanKekurangan = `Poin berkurang -${deduction} karena deskripsi titik fisik ("${loc}") masih dapat diperjelas agar pengawas/PIC tidak perlu mencari atau mengonfirmasi ulang posisinya.`;
      }

      langkahMenuju100 = 'Agar mencapai nilai 100% (40 Poin Penuh): Tuliskan lokasi secara hierarkis 3 lapis: [Area Utama] > [Sub Area/Gedung/Fasilitas] > [Titik/Patokan Fisik Nyata].';
      contohRujukan = `Contoh format 100%: "${reportContext?.area || 'Area Workshop'} - ${reportContext?.subArea && reportContext.subArea !== '-' ? reportContext.subArea : 'Bay Service 4'}, sisi selatan dekat panel pompa hidrolik"`;
    }

    return {
      paramKey,
      title: '1. Presisi Lokasi Bahaya',
      maxScore,
      currentScore: score,
      deduction,
      isPerfect,
      alasanKekurangan,
      langkahMenuju100,
      contohRujukan,
    };
  }

  if (paramKey === 'identifikasiHazard') {
    const maxScore = 30;
    const score = Math.max(0, Math.min(maxScore, currentScore));
    const deduction = maxScore - score;
    const isPerfect = deduction === 0;

    let alasanKekurangan = '';
    let langkahMenuju100 = '';
    let contohRujukan = '';

    if (isPerfect) {
      alasanKekurangan = 'Nilai sempurna (30/30). Objek sumber bahaya, bagian komponen yang bermasalah, dan kondisi anomali fisik dipaparkan secara detail, objektif, dan faktual.';
      langkahMenuju100 = 'Pertahankan deskripsi temuan yang spesifik dengan menyertakan nama alat dan jenis kerusakannya.';
      contohRujukan = 'Sebutkan nama unit, nama bagian/komponen, dan wujud kerusakan teramati.';
    } else {
      alasanKekurangan = `Poin berkurang -${deduction} karena uraian temuan belum sepenuhnya merinci komponen spesifik mana dari objek/peralatan yang bermasalah, atau masih menggunakan frasa umum (seperti sekadar "alat rusak", "licin", atau "tidak rapi").`;
      langkahMenuju100 = 'Agar mencapai nilai 100% (30 Poin Penuh): Jelaskan objek bahaya dengan 3 elemen: [Nama Alat/Aktivitas] + [Komponen Spesifik yang Bermasalah] + [Bentuk Kondisi/Tindakan Tidak Aman secara Terukur].';
      contohRujukan = 'Contoh format 100%: "Kabel power pada mesin gerinda potong di meja kerja terkelupas isolator pelindungnya sepanjang ±4 cm hingga kawat tembaga terlihat terbuka."';
    }

    return {
      paramKey,
      title: '2. Objek Identifikasi Hazard',
      maxScore,
      currentScore: score,
      deduction,
      isPerfect,
      alasanKekurangan,
      langkahMenuju100,
      contohRujukan,
    };
  }

  // identifikasiRisiko
  const maxScore = 30;
  const score = Math.max(0, Math.min(maxScore, currentScore));
  const deduction = maxScore - score;
  const isPerfect = deduction === 0;

  let alasanKekurangan = '';
  let langkahMenuju100 = '';
  let contohRujukan = '';

  if (isPerfect) {
    alasanKekurangan = 'Nilai sempurna (30/30). Skenario dampak bahaya, pihak yang berpotensi celaka/rusak, serta pemilihan dari 18 Risiko Utama K3 dipetakan dengan tepat dan objektif.';
    langkahMenuju100 = 'Pertahankan analisis konsekuensi dan pemilihan kategori risiko yang relevan dengan kondisi lapangan.';
    contohRujukan = 'Penyebutan potensi dampak langsung pada mekanik/operator secara realistis.';
  } else {
    alasanKekurangan = `Poin berkurang -${deduction} karena penjelasan potensi risiko belum memaparkan secara gamblang skenario dampak (siapa yang celaka / unit apa yang rusak) serta mekanismenya, atau belum sepenuhnya selaras dengan pilihan 18 Risiko Utama.`;
    langkahMenuju100 = 'Agar mencapai nilai 100% (30 Poin Penuh): Jelaskan konsekuensi nyata jika hazard tidak dicegah: Siapa yang berisiko terpapar, mekanisme kejadiannya (misal: terjepit, tersengat, tertabrak), dan pastikan opsi 18 Risiko Utama tepat.';
    contohRujukan = `Contoh format 100%: "Mekanik yang sedang melakukan inspeksi berisiko mengalami luka sayat/terpotong pada tangan akibat kontak dengan putaran mata pisau yang tidak terpasang cover pelindung."`;
  }

  return {
    paramKey,
    title: '3. Ukuran & Identifikasi Risiko',
    maxScore,
    currentScore: score,
    deduction,
    isPerfect,
    alasanKekurangan,
    langkahMenuju100,
    contohRujukan,
  };
}

