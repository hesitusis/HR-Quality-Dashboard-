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

export interface ReportDeductionContext {
  lokasi?: string;
  area?: string;
  subArea?: string;
  statusLokasi?: string;
  analisisLokasiAI?: string;
  temuan?: string;
  risikoUtama?: string;
  kategoriTemuan?: string;
  kategoriBahaya?: string;
  levelRisiko?: string;
  aiFindings?: string[];
}

/**
 * Menghasilkan rujukan presisi lokasi yang 100% relevan dengan data laporan aktual
 */
export function generateRelevantLocationReference(
  reportContext?: ReportDeductionContext,
  deduction: number = 0
): {
  langkahMenuju100: string;
  contohRujukan: string;
  alasanKekurangan: string;
} {
  const loc = (reportContext?.lokasi || reportContext?.area || 'Lokasi operasional').trim();
  const area = (reportContext?.area || '').trim();
  const subArea = (reportContext?.subArea || '').trim();
  const temuan = (reportContext?.temuan || '').toLowerCase();
  const locLower = loc.toLowerCase();

  if (deduction === 0) {
    return {
      alasanKekurangan:
        'Nilai sempurna (40/40). Titik lokasi telah mencantumkan informasi area dan patokan fisik spesifik yang langsung dapat diverifikasi di lapangan tanpa bertanya ulang.',
      langkahMenuju100:
        'Pertahankan format pelaporan lokasi berjenjang 3 lapis ini untuk laporan-laporan berikutnya.',
      contohRujukan: `Rujukan Revisi 100% (Khusus Laporan Ini): "${area && !loc.toLowerCase().includes(area.toLowerCase()) ? `${area} > ` : ''}${loc}"`,
    };
  }

  let alasanKekurangan = '';
  if (reportContext?.statusLokasi === 'TIDAK SPESIFIK') {
    alasanKekurangan = `Poin berkurang -${deduction} karena lokasi hanya menyebutkan area luas ("${loc}") tanpa rujukan fisik gedung, ruangan, jalur, nomor bay, atau nomor unit yang jelas.`;
  } else if (reportContext?.statusLokasi === 'KURANG SPESIFIK') {
    alasanKekurangan = `Poin berkurang -${deduction} karena lokasi ("${loc}") sudah menyebut area/gedung, tetapi belum dilengkapi patokan tetap terdekat (misal: nomor bay, nomor pilar, nomor unit alat berat, atau kilometer jalur hauling).`;
  } else {
    alasanKekurangan = `Poin berkurang -${deduction} karena deskripsi titik fisik ("${loc}") masih dapat diperjelas agar pengawas/PIC tidak perlu mencari atau mengonfirmasi ulang posisinya.`;
  }

  // Tentukan patokan fisik yang paling realistis sesuai konteks temuan nyata
  let physicalLandmark = 'Sisi pilar struktur bay dekat rak perkakas mekanik / meja kerja';
  if (
    temuan.includes('oli') ||
    temuan.includes('ceceran') ||
    temuan.includes('tumpahan') ||
    temuan.includes('lantai') ||
    temuan.includes('licin') ||
    temuan.includes('air')
  ) {
    physicalLandmark = 'Lantai kerja sisi barat di antara pilar bay dan meja kerja mekanik';
  } else if (
    temuan.includes('kabel') ||
    temuan.includes('colokan') ||
    temuan.includes('panel') ||
    temuan.includes('listrik') ||
    temuan.includes('lampu')
  ) {
    physicalLandmark = 'Dinding sisi barat dekat panel distribusi listrik & jalur stop kontak';
  } else if (
    temuan.includes('tangga') ||
    temuan.includes('scaffolding') ||
    temuan.includes('ketinggian') ||
    temuan.includes('jatuh') ||
    temuan.includes('railing')
  ) {
    physicalLandmark = 'Sisi platform tangga perawatan tepat di samping unit yang sedang servis';
  } else if (
    temuan.includes('alat') ||
    temuan.includes('gerinda') ||
    temuan.includes('las') ||
    temuan.includes('tabung') ||
    temuan.includes('perkakas')
  ) {
    physicalLandmark = 'Meja fabrikasi kerja sisi timur dekat rak perkakas mekanik';
  } else if (
    temuan.includes('unit') ||
    temuan.includes('hd') ||
    temuan.includes('dt') ||
    temuan.includes('sarana') ||
    temuan.includes('truck')
  ) {
    physicalLandmark = 'Tepat di bawah engine compartment unit yang sedang parkir servis';
  } else if (
    temuan.includes('jalan') ||
    temuan.includes('tanggul') ||
    temuan.includes('bundwall') ||
    temuan.includes('rambu')
  ) {
    physicalLandmark = 'Bahu jalan sisi kiri, ±25 meter sebelum persimpangan rambu 30 km/jam';
  } else if (
    temuan.includes('sampah') ||
    temuan.includes('berantakan') ||
    temuan.includes('pallet') ||
    temuan.includes('housekeeping')
  ) {
    physicalLandmark = 'Jalur pejalan kaki (walkway) selebar 1 meter di depan pintu workshop';
  }

  let formattedRevision = '';

  // 1. Deteksi konteks workshop / bay (misal: "Workshop 2 MIA 4, Bays 8, area kerja PT Indotruck Utama")
  if (locLower.includes('bay') || locLower.includes('workshop') || locLower.includes('ws')) {
    const bayMatch = loc.match(/bay[s]?\s*(\d+|[a-zA-Z0-9]+)/i);
    const bayStr = bayMatch
      ? `Bay ${bayMatch[1]}`
      : subArea && subArea !== '-' && !subArea.toLowerCase().includes('semua')
      ? subArea
      : 'Bay Kerja';

    let cleanArea = area && area !== '-' && !area.toLowerCase().includes('semua') ? area : 'Workshop';
    if (locLower.includes('workshop 2 mia 4') || locLower.includes('mia 4')) {
      cleanArea = 'Workshop 2 MIA 4';
    } else if (locLower.includes('workshop 1')) {
      cleanArea = 'Workshop 1';
    } else if (locLower.includes('workshop 2')) {
      cleanArea = 'Workshop 2';
    }

    const companyNote = locLower.includes('indotruck') ? ' (Area PT Indotruck Utama)' : '';
    formattedRevision = `${cleanArea} > ${bayStr}${companyNote} > ${physicalLandmark}`;
  }
  // 2. Hauling Road / Jalur Tambang
  else if (locLower.includes('hauling') || locLower.includes('km') || locLower.includes('jalan')) {
    const kmMatch = loc.match(/km\s*(\d+[+\d]*)/i);
    const kmStr = kmMatch ? `KM ${kmMatch[1]}` : 'KM 14+200 arah Port';
    formattedRevision = `Jalur Hauling > ${kmStr} > Bahu jalan sisi kiri, ±20 meter sebelum tikungan rambu 30 km/jam`;
  }
  // 3. Pit / Tambang / Disposal / Sump
  else if (
    locLower.includes('pit') ||
    locLower.includes('tambang') ||
    locLower.includes('disposal') ||
    locLower.includes('sump') ||
    locLower.includes('front')
  ) {
    formattedRevision = `Pit Tambang > Pit 1 North RL 45 > Sisi barat loading point dekat unit Digger EX-301`;
  }
  // 4. Warehouse / Gudang
  else if (locLower.includes('gudang') || locLower.includes('warehouse') || locLower.includes('rak')) {
    formattedRevision = `Gudang Logistik (Warehouse) > Blok B Rak Komponen > Baris rak 03 sisi selatan dekat pintu loading dock`;
  }
  // 5. Mess / Camp / Kantin / Klinik
  else if (
    locLower.includes('mess') ||
    locLower.includes('camp') ||
    locLower.includes('kantin') ||
    locLower.includes('klinik')
  ) {
    formattedRevision = `Area Mess Karyawan > Gedung B Lantai 1 > Koridor depan kamar B-04 dekat pintu keluar darurat`;
  }
  // 6. Office / Kantor
  else if (locLower.includes('office') || locLower.includes('kantor')) {
    formattedRevision = `Office Utama > Lantai 1 Ruang Administrasi > Sisi utara dekat pintu masuk server / meja print`;
  }
  // 7. Fuel Station / Tangki
  else if (locLower.includes('fuel') || locLower.includes('solar') || locLower.includes('tangki')) {
    formattedRevision = `Fuel Station > Dispenser Solar 02 > Area lantai beton dekat tiang grounding reel`;
  }
  // 8. Washpad / Pencucian
  else if (locLower.includes('washpad') || locLower.includes('cuci') || locLower.includes('pencucian')) {
    formattedRevision = `Washpad Pencucian Unit > Bay Cuci 01 > Ujung parit pembuangan air sisi selatan`;
  }
  // 9. Fallback universal dengan tetap menjaga data asli pelapor
  else {
    const mainA = area && area !== '-' && !area.toLowerCase().includes('semua') ? area : 'Area Kerja';
    const subA = subArea && subArea !== '-' && !subArea.toLowerCase().includes('semua') ? subArea : loc;
    formattedRevision = `${mainA} > ${subA} > ${physicalLandmark}`;
  }

  const langkahMenuju100 = `Agar mencapai nilai 100% (40 Poin Penuh): Lokasi Anda sudah memuat informasi ("${loc}"). Cukup tambahkan 1 patokan fisik tetap yang tidak berpindah tempat dengan format hierarki 3 lapis: [Area Utama] > [Sub Area/Bay/Fasilitas] > [Titik Patokan Fisik Nyata].`;

  const contohRujukan = `Rujukan Revisi 100% (Khusus Laporan Ini): "${formattedRevision}"`;

  return {
    alasanKekurangan,
    langkahMenuju100,
    contohRujukan,
  };
}

/**
 * Menghasilkan rujukan objek hazard yang 100% relevan dengan data temuan aktual
 */
export function generateRelevantHazardReference(
  reportContext?: ReportDeductionContext,
  deduction: number = 0
): {
  langkahMenuju100: string;
  contohRujukan: string;
  alasanKekurangan: string;
} {
  const temuan = (reportContext?.temuan || '').trim();
  const tLower = temuan.toLowerCase();

  if (deduction === 0) {
    return {
      alasanKekurangan:
        'Nilai sempurna (30/30). Objek sumber bahaya, bagian komponen yang bermasalah, dan kondisi anomali fisik dipaparkan secara detail, objektif, dan faktual.',
      langkahMenuju100:
        'Pertahankan deskripsi temuan yang spesifik dengan menyertakan nama alat/objek dan jenis kondisi tidak amannya.',
      contohRujukan: `Rujukan Revisi 100% (Khusus Laporan Ini): "${temuan}"`,
    };
  }

  const alasanKekurangan = `Poin berkurang -${deduction} karena uraian temuan ("${temuan.slice(0, 80)}${temuan.length > 80 ? '...' : ''}") masih dapat diperjelas dengan merinci nama komponen spesifik objek yang bermasalah dan wujud kondisi fisik tidak amannya secara terukur (hindari frasa umum).`;

  let formattedRevision = '';

  if (
    tLower.includes('oli') ||
    tLower.includes('pelumas') ||
    tLower.includes('ceceran') ||
    tLower.includes('tumpahan') ||
    tLower.includes('bocor') ||
    tLower.includes('hidrolik')
  ) {
    formattedRevision = `[Objek: Ceceran oli pelumas / kebocoran selang hidrolik] + [Kondisi Terukur: Terdapat genangan oli seluas ±1 x 1.5 meter di lantai kerja beton tanpa wadah penampung (drip tray) dan belum ditaburi absorbent/pasir, berpotensi memicu lantai licin]`;
  } else if (
    tLower.includes('kabel') ||
    tLower.includes('listrik') ||
    tLower.includes('colokan') ||
    tLower.includes('stop kontak') ||
    tLower.includes('panel') ||
    tLower.includes('lampu')
  ) {
    formattedRevision = `[Objek: Kabel power roll listrik 220V] + [Kondisi Terukur: Lapisan isolator pelindung kabel terkelupas sepanjang ±4 cm hingga kawat tembaga terbuka, melintang di lantai jalur pejalan kaki tanpa pelindung kabel (cable bridge)]`;
  } else if (
    tLower.includes('tangga') ||
    tLower.includes('scaffolding') ||
    tLower.includes('perancah') ||
    tLower.includes('railing') ||
    tLower.includes('handrail') ||
    tLower.includes('bordes')
  ) {
    formattedRevision = `[Objek: Tangga akses servis portabel unit] + [Kondisi Terukur: Karet antiselip pada kaki bawah tangga hilang dan anak tangga nomor 2 bengkok, digunakan pekerja tanpa kartu inspeksi hijau (fit to use)]`;
  } else if (
    tLower.includes('alat') ||
    tLower.includes('gerinda') ||
    tLower.includes('las') ||
    tLower.includes('tabung') ||
    tLower.includes('perkakas') ||
    tLower.includes('kunci') ||
    tLower.includes('dongkrak')
  ) {
    formattedRevision = `[Objek: Perkakas kerja mekanik / tabung gas bertekanan] + [Kondisi Terukur: Tabung gas oksigen berdiri tegak di samping dinding tanpa rantai pengikat pengaman (safety chain) dan tanpa tutup pelindung katup (safety cap)]`;
  } else if (
    tLower.includes('unit') ||
    tLower.includes('hd') ||
    tLower.includes('dt') ||
    tLower.includes('sarana') ||
    tLower.includes('truck') ||
    tLower.includes('excavator') ||
    tLower.includes('loader') ||
    tLower.includes('forklift')
  ) {
    formattedRevision = `[Objek: Unit kendaraan sarana LV / DT operasional] + [Kondisi Terukur: Lampu kerja mundur (reverse lamp) mati dan alarm mundur tidak berbunyi saat tuas transmisi mundur diaktifkan, tetap dioperasikan di area aktif]`;
  } else if (
    tLower.includes('apd') ||
    tLower.includes('kacamata') ||
    tLower.includes('helm') ||
    tLower.includes('sepatu') ||
    tLower.includes('masker') ||
    tLower.includes('sarung tangan')
  ) {
    formattedRevision = `[Tindakan/Pekerja: Mekanik saat melakukan perbaikan gerinda/pengelasan] + [Kondisi Terukur: Bekerja tanpa memakai APD wajib (kacamata safety & face shield) pada jarak percikan serpihan logam panas < 1 meter]`;
  } else if (
    tLower.includes('sampah') ||
    tLower.includes('berantakan') ||
    tLower.includes('pallet') ||
    tLower.includes('housekeeping') ||
    tLower.includes('5s') ||
    tLower.includes('barang')
  ) {
    formattedRevision = `[Objek: Tumpukan suku cadang bekas, selang hidrolik, dan pallet kayu] + [Kondisi Terukur: Berserakan setinggi ±1 meter di jalur lintasan pejalan kaki (walkway) selebar 80 cm hingga menghalangi akses jalan evakuasi darurat]`;
  } else if (
    tLower.includes('apar') ||
    tLower.includes('pemadam') ||
    tLower.includes('racun api') ||
    tLower.includes('fire')
  ) {
    formattedRevision = `[Objek: Tabung APAR 6 Kg jenis Dry Chemical Powder] + [Kondisi Terukur: Jarum manometer tekanan berada di zona merah (tekanan drop) dan pin pengaman terlepas, belum tercatat pada kartu inspeksi bulanan]`;
  } else if (
    tLower.includes('jalan') ||
    tLower.includes('tanggul') ||
    tLower.includes('bundwall') ||
    tLower.includes('parit') ||
    tLower.includes('drainase') ||
    tLower.includes('rambu')
  ) {
    formattedRevision = `[Objek: Tanggul pengaman jalan (bundwall) / permukaan jalan hauling] + [Kondisi Terukur: Ketinggian tanggul hanya mencapai ±60 cm (di bawah standar minimal 3/4 diameter roda unit terbesar) sepanjang 15 meter pada tikungan jalan]`;
  } else {
    const cleanSubject = temuan.replace(/^(ditemukan|terdapat|ada|melihat|kondisi)\s+/i, '').trim();
    formattedRevision = `[Objek: ${cleanSubject.slice(0, 45)}] + [Kondisi Terukur: Rinci bagian komponen spesifik yang rusak/tidak standar, sebutkan dimensi/ukuran nyata, dan wujud kondisinya di lapangan]`;
  }

  const langkahMenuju100 = `Agar mencapai nilai 100% (30 Poin Penuh): Sempurnakan temuan Anda dengan rumus 3 elemen terukur: [Nama Alat / Objek Spesifik] + [Komponen yang Bermasalah] + [Bentuk Kondisi Fisik / Tindakan Tidak Aman secara Terukur].`;

  const contohRujukan = `Rujukan Revisi 100% (Khusus Laporan Ini): "${formattedRevision}"`;

  return {
    alasanKekurangan,
    langkahMenuju100,
    contohRujukan,
  };
}

/**
 * Menghasilkan rujukan ukuran risiko yang 100% relevan dengan klasifikasi 18 Risiko Utama laporan
 */
export function generateRelevantRiskReference(
  reportContext?: ReportDeductionContext,
  deduction: number = 0
): {
  langkahMenuju100: string;
  contohRujukan: string;
  alasanKekurangan: string;
} {
  const risikoUtama = (reportContext?.risikoUtama || '').trim();
  const rLower = risikoUtama.toLowerCase();
  const tLower = (reportContext?.temuan || '').toLowerCase();

  if (deduction === 0) {
    return {
      alasanKekurangan:
        'Nilai sempurna (30/30). Skenario dampak bahaya, pihak yang berpotensi celaka/rusak, serta pemilihan dari 18 Risiko Utama K3 dipetakan dengan tepat dan objektif.',
      langkahMenuju100:
        'Pertahankan analisis konsekuensi dan pemilihan kategori risiko yang relevan dengan kondisi lapangan.',
      contohRujukan: `Rujukan Revisi 100% (Khusus Laporan Ini): "Sesuai dengan klasifikasi: ${risikoUtama}"`,
    };
  }

  const alasanKekurangan = `Poin berkurang -${deduction} karena penjelasan potensi risiko belum merinci skenario nyata (siapa yang celaka / unit apa yang rusak) serta mekanismenya, atau belum sepenuhnya selaras dengan pilihan 18 Risiko Utama K3 ("${risikoUtama || 'Belum dipilih'}").`;

  let formattedRevision = '';

  if (
    rLower.includes('sengatan listrik') ||
    tLower.includes('listrik') ||
    tLower.includes('kabel') ||
    tLower.includes('panel')
  ) {
    formattedRevision = `[Pihak Terdampak: Teknisi/pekerja di sekitar objek] + [Mekanisme: Kontak langsung dengan bagian konduktor bertegangan saat tangan basah/lembab] + [Skenario Terburuk: Sengatan listrik (electrocution), luka bakar jaringan kulit derajat 2-3, atau henti jantung fatal]`;
  } else if (
    rLower.includes('terpeleset') ||
    rLower.includes('tersandung') ||
    rLower.includes('jatuh') ||
    tLower.includes('licin') ||
    tLower.includes('oli') ||
    tLower.includes('lantai')
  ) {
    formattedRevision = `[Pihak Terdampak: Mekanik/pejalan kaki yang melintas di area kerja] + [Mekanisme: Kaki kehilangan traksi di lantai berminyak/tersandung rintangan] + [Skenario Terburuk: Terjatuh dengan benturan keras pada lantai beton atau terbentur peralatan kerja tajam, berisiko fraktur tulang/cedera kepala]`;
  } else if (
    rLower.includes('tertabrak') ||
    rLower.includes('tersenggol') ||
    rLower.includes('terlindas') ||
    rLower.includes('terjepit') ||
    tLower.includes('unit') ||
    tLower.includes('truck')
  ) {
    formattedRevision = `[Pihak Terdampak: Mekanik di lantai kerja / pejalan kaki] + [Mekanisme: Berada di area blind spot unit bergerak atau tangan masuk ke pinch point saat unit bermanuver] + [Skenario Terburuk: Tertabrak atau terjepit struktur unit bergerak yang mengakibatkan cedera fatal atau crush injury remuk tulang]`;
  } else if (
    rLower.includes('tertimpa') ||
    rLower.includes('kejatuhan') ||
    tLower.includes('jatuh') ||
    tLower.includes('rak')
  ) {
    formattedRevision = `[Pihak Terdampak: Pekerja yang beraktivitas di bawah area kerja / lintasan] + [Mekanisme: Material/perkakas tergelincir dari platform atas setinggi >1.5 meter tanpa toeboard] + [Skenario Terburuk: Tertimpa benda jatuh dengan dampak trauma tumpul kepala atau patah tulang leher]`;
  } else if (
    rLower.includes('hilang kendali') ||
    rLower.includes('tergelincir') ||
    rLower.includes('terperosok')
  ) {
    formattedRevision = `[Pihak Terdampak: Operator unit dan sarana lain di jalur jalan] + [Mekanisme: Unit kehilangan traksi di jalan licin/berlumpur atau menabrak tanggul ambles] + [Skenario Terburuk: Unit terbalik (rollover) atau tabrakan beruntun di jalan tambang]`;
  } else if (
    rLower.includes('terpukul') ||
    rLower.includes('terpotong') ||
    rLower.includes('tersayat') ||
    tLower.includes('gerinda') ||
    tLower.includes('pisau')
  ) {
    formattedRevision = `[Pihak Terdampak: Mekanik yang mengoperasikan perkakas kerja] + [Mekanisme: Jari/tangan kontak dengan bagian tajam atau berputar tanpa safety guard] + [Skenario Terburuk: Luka sayat dalam (laceration), jari terpotong (amputasi), atau kerusakan tendon saraf]`;
  } else if (
    rLower.includes('bahan kimia') ||
    rLower.includes('b3') ||
    tLower.includes('kimia') ||
    tLower.includes('asam')
  ) {
    formattedRevision = `[Pihak Terdampak: Pekerja yang menangani bahan kimia / di sekitar tumpahan] + [Mekanisme: Percikan bahan kimia ke mata/kulit atau terhirup uap beracun tanpa APD respirator] + [Skenario Terburuk: Iritasi kornea mata permanen, luka bakar kimiawi, atau keracunan pernapasan akut]`;
  } else if (rLower.includes('tertimbun') || rLower.includes('longsoran')) {
    formattedRevision = `[Pihak Terdampak: Operator alat berat di loading/dumping point] + [Mekanisme: Runtuhan material lereng tambang yang labil menimpa kabin unit] + [Skenario Terburuk: Kabin remuk tertimbun batuan longsor menyebabkan operator terperangkap dan asfiksia]`;
  } else if (rLower.includes('tenggelam')) {
    formattedRevision = `[Pihak Terdampak: Pekerja di dekat kolam/sump/settling pond] + [Mekanisme: Terpeleset ke dalam kolam air dengan kedalaman >1.5 meter tanpa rompi pelampung] + [Skenario Terburuk: Tenggelam dan mengalami kegagalan pernapasan (drowning fatal)]`;
  } else if (rLower.includes('keracunan')) {
    formattedRevision = `[Pihak Terdampak: Karyawan yang mengonsumsi makanan/minuman kantin] + [Mekanisme: Mengonsumsi makanan yang terkontaminasi mikroorganisme atau kedaluwarsa] + [Skenario Terburuk: Keracunan makanan massal (gastroenteritis akut) dengan dehidrasi parah]`;
  } else if (rLower.includes('binatang')) {
    formattedRevision = `[Pihak Terdampak: Pekerja di area semak, gudang, atau kabin unit] + [Mekanisme: Kontak tidak sengaja dengan binatang berbisa (ular/tawon)] + [Skenario Terburuk: Gigitan berbisa yang memerlukan serum antibisa dan penanganan darurat]`;
  } else if (rLower.includes('gas beracun') || rLower.includes('oksigen')) {
    formattedRevision = `[Pihak Terdampak: Pekerja di ruang terbatas (confined space)] + [Mekanisme: Menghirup udara dengan konsentrasi oksigen <19.5% atau terpapar gas CO/H2S] + [Skenario Terburuk: Hilang kesadaran mendadak dalam hitungan detik dan henti napas]`;
  } else {
    formattedRevision = `[Pihak Terdampak: Pekerja yang beraktivitas di area tersebut] + [Mekanisme: Terpapar kondisi tidak aman secara langsung saat melakukan aktivitas kerja harian] + [Skenario Terburuk: Cedera kerja atau kerusakan sarana yang mengganggu kelancaran operasional]`;
  }

  const langkahMenuju100 = `Agar mencapai nilai 100% (30 Poin Penuh): Uraikan konsekuensi risiko dengan rumus: [Siapa Pihak Terdampak] + [Mekanisme Kontak/Kecelakaan] + [Skenario Dampak Terburuk Sesuai 18 Risiko Utama].`;

  const contohRujukan = `Rujukan Revisi 100% (Khusus Laporan Ini): "${formattedRevision}"`;

  return {
    alasanKekurangan,
    langkahMenuju100,
    contohRujukan,
  };
}

export function getParameterDeductionDetail(
  paramKey: 'presisiLokasi' | 'identifikasiHazard' | 'identifikasiRisiko',
  currentScore: number,
  reportContext?: ReportDeductionContext
): ParameterDeductionDetail {
  if (paramKey === 'presisiLokasi') {
    const maxScore = 40;
    const score = Math.max(0, Math.min(maxScore, currentScore));
    const deduction = maxScore - score;
    const isPerfect = deduction === 0;

    const res = generateRelevantLocationReference(reportContext, deduction);
    return {
      paramKey,
      title: '1. Presisi Lokasi Bahaya',
      maxScore,
      currentScore: score,
      deduction,
      isPerfect,
      alasanKekurangan: res.alasanKekurangan,
      langkahMenuju100: res.langkahMenuju100,
      contohRujukan: res.contohRujukan,
    };
  }

  if (paramKey === 'identifikasiHazard') {
    const maxScore = 30;
    const score = Math.max(0, Math.min(maxScore, currentScore));
    const deduction = maxScore - score;
    const isPerfect = deduction === 0;

    const res = generateRelevantHazardReference(reportContext, deduction);
    return {
      paramKey,
      title: '2. Objek Identifikasi Hazard',
      maxScore,
      currentScore: score,
      deduction,
      isPerfect,
      alasanKekurangan: res.alasanKekurangan,
      langkahMenuju100: res.langkahMenuju100,
      contohRujukan: res.contohRujukan,
    };
  }

  // identifikasiRisiko
  const maxScore = 30;
  const score = Math.max(0, Math.min(maxScore, currentScore));
  const deduction = maxScore - score;
  const isPerfect = deduction === 0;

  const res = generateRelevantRiskReference(reportContext, deduction);
  return {
    paramKey,
    title: '3. Ukuran & Identifikasi Risiko',
    maxScore,
    currentScore: score,
    deduction,
    isPerfect,
    alasanKekurangan: res.alasanKekurangan,
    langkahMenuju100: res.langkahMenuju100,
    contohRujukan: res.contohRujukan,
  };
}

