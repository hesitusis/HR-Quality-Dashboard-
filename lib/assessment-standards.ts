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
