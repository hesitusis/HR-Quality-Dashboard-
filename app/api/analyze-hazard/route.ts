import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const report = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback if API key is not configured in local environment
      return NextResponse.json({
        fallback: true,
        message: "Gemini API Key belum terkonfigurasi di Secrets. Menggunakan evaluasi rubric internal.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Anda adalah Ahli HSE Senior & Auditor Kualitas Hazard Report PT Indotruck Utama (ITU) & SISADMO.
Tugas Anda adalah menilai kualitas dokumen Hazard Report berikut dengan standar K3 pertambangan yang ketat:

DATA LAPORAN HAZARD:
- No Hazard Report: ${report.noHazardReport || '-'}
- Pelapor: ${report.pelapor || '-'} (${report.nrpPelapor || '-'})
- Perusahaan Pelapor: ${report.perusahaanPelapor || '-'}
- Perusahaan Terlapor: ${report.perusahaanTerlapor || '-'}
- Area: ${report.area || '-'}
- Sub Area: ${report.subArea || '-'}
- Lokasi: ${report.lokasi || '-'}
- Kategori Temuan: ${report.kategoriTemuan || '-'}
- Kategori Bahaya: ${report.kategoriBahaya || '-'}
- Risiko Utama: ${report.risikoUtama || '-'}
- Temuan: ${report.temuan || '-'}
- Jenis Temuan: ${report.jenisTemuan || '-'}
- Level Risiko: ${report.levelRisiko || '-'}
- Keterangan Risiko: ${report.keteranganRisiko || '-'}
- Komentar: ${report.komentar || '-'}
- Akar Masalah: ${report.akarMasalah || '-'}
- Tindakan Perbaikan: ${report.tindakanPerbaikan || '-'}
- Status PICA: ${report.statusPICA || '-'}

RUBRIK PENILAIAN MUTU LAPORAN HAZARD REPORT (HANYA 3 PARAMETER - TOTAL 100 POIN):
1. Presisi Lokasi Bahaya (Bobot 40% - Max 40 Poin):
Menjelaskan lokasi kejadian/bahaya secara spesifik, jelas, dan dapat ditemukan kembali oleh orang lain tanpa harus bertanya ulang. Lokasi ideal mencantumkan area, titik/landmark, nomor unit, fasilitas, jalur, atau posisi spesifik lainnya. Semakin spesifik lokasi yang diberikan dan semakin mudah diverifikasi, semakin tinggi nilainya.

2. Objek Identifikasi Hazard (Bobot 30% - Max 30 Poin):
Menjelaskan objek, kondisi, aktivitas, peralatan, material, atau tindakan yang menjadi sumber bahaya secara jelas dan spesifik. Laporan tidak hanya menyebutkan kategori umum seperti "alat rusak" atau "kondisi tidak aman", tetapi menjelaskan apa yang menjadi sumber hazard dan bagian mana yang bermasalah.

3. Ukuran & Identifikasi Risiko (Bobot 30% - Max 30 Poin):
Menjelaskan potensi risiko secara tepat berdasarkan kondisi hazard yang ditemukan, termasuk siapa/apa yang dapat terdampak, bagaimana mekanisme kejadiannya, dan konsekuensi yang mungkin terjadi. Pemilihan dari 18 Risiko Utama harus sesuai dengan bahaya yang ditemukan, bukan sekadar memilih risiko dengan tingkat keparahan tertinggi.

DAFTAR 18 RISIKO UTAMA K3 RUJUKAN:
- Risiko pekerja atau tamu terkena sengatan listrik
- Risiko pekerja atau tamu terpeleset, tersandung, atau jatuh dari ketinggian
- Risiko pekerja atau tamu/unit mengalami tenggelam
- Risiko pekerja atau tamu tertabrak, tersenggol, terlindas unit bergerak, terjepit atau terjebak di dalam kabin, terlempar keluar dari unit, terpukul, tersangkut, terjepit atau terlilit
- Risiko pekerja atau unit tertimpa atau kejatuhan benda, material, struktur sarana prasarana, atau pohon yang ambruk
- Risiko pekerja atau unit/kendaraan tambang mengalami hilang kendali, tergelincir, terperosok, atau hanyut
- Risiko pekerja dan/atau unit operasional/support tertimbun material longsoran
- Risiko pekerja mengalami keracunan makanan atau minuman
- Risiko pekerja terkena serangan atau tersengat binatang liar/berbisa
- Risiko pekerja terpapar bahan kimia berbahaya dan beracun
- Risiko pekerja terpapar gas beracun/ kekurangan oksigen
- Risiko pekerja terpukul atau terjepit atau terpotong atau tersayat peralatan/material
- TIDAK TERMASUK RISIKO UTAMA

ATURAN KHUSUS DEFISIENSI & REKOMENDASI:
- FOKUS PENILAIAN HANYA SAAT MEREKA MELAPORKAN HAZARD REPORT.
- TINDAKAN PERBAIKAN TIDAK MASUK DALAM KATEGORI PENILAIAN. JANGAN PERNAH membuat temuan/defisiensi atau pengurangan nilai terkait tindakan perbaikan.
- Evaluasi hanya difokuskan pada: (1) Kepastian titik lokasi, (2) Spesifisitas objek temuan bahaya, dan (3) Kesesuaian pemilihan 18 Risiko Utama & kuantifikasi dampak risiko.

KATEGORI SKOR:
- 85 - 100: Excellent
- 70 - 84: Good
- 50 - 69: Need Improvement
- < 50: Poor

STATUS KESESUAIAN:
- SESUAI (skor >= 75 dan lokasi/objek/risiko memenuhi kriteria)
- PERLU PERBAIKAN (skor 50 - 74)
- TIDAK SESUAI (skor < 50 atau titik lokasi tidak spesifik / objek terlalu umum)

Berikan hasil evaluasi terstruktur dalam format JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            qualityScore: {
              type: Type.INTEGER,
              description: "Total quality score from 0 to 100",
            },
            qualityCategory: {
              type: Type.STRING,
              description: "Excellent, Good, Need Improvement, or Poor",
            },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                presisiLokasi: { type: Type.INTEGER, description: "Max 40" },
                identifikasiHazard: { type: Type.INTEGER, description: "Max 30" },
                identifikasiRisiko: { type: Type.INTEGER, description: "Max 30" },
              },
              required: [
                "presisiLokasi",
                "identifikasiHazard",
                "identifikasiRisiko",
              ],
            },
            status: {
              type: Type.STRING,
              description: "SESUAI, PERLU PERBAIKAN, or TIDAK SESUAI",
            },
            aiFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of critical findings or deficiencies identified",
            },
            aiFeedback: {
              type: Type.STRING,
              description: "Short reason explaining why this score was awarded",
            },
            aiRecommendation: {
              type: Type.STRING,
              description: "Specific recommendation to improve this hazard report",
            },
            topQualityIssue: {
              type: Type.STRING,
              description: "Main issue e.g. Lokasi tidak spesifik, Risiko belum jelas, etc.",
            },
          },
          required: [
            "qualityScore",
            "qualityCategory",
            "scoreBreakdown",
            "status",
            "aiFindings",
            "aiFeedback",
            "aiRecommendation",
            "topQualityIssue",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return NextResponse.json({
      success: true,
      assessment: parsed,
    });
  } catch (error: any) {
    console.error("Gemini API Assessment Error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal melakukan analisa AI" },
      { status: 500 }
    );
  }
}
