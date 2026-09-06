import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sheetId = body.sheetId || "112FPFljq8cJVrYZlcSNvS9BBnWt-Pg-puHRcgtvPod8";
    const gid = body.gid || "0";
    const sheetName = body.sheetName || "Tarikan HR";

    // URLs to attempt fetching live CSV from Google Sheets
    const candidateUrls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv`,
    ];

    let csvContent = "";
    let lastError = "";

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/csv, text/plain, */*",
          },
          redirect: "follow",
          cache: "no-store",
        });

        if (response.ok) {
          const text = await response.text();
          // Verify if it's actual CSV data or Google login/HTML page
          if (
            !text.includes("<!DOCTYPE html") &&
            !text.includes("<html") &&
            (text.includes("No Hazard Report") || text.includes("Hazard") || text.includes(","))
          ) {
            csvContent = text;
            break;
          } else {
            lastError = "Google Sheets memerlukan izin akses publik/tautan (Status dokumen masih 'Dibatasi').";
          }
        } else {
          lastError = `Status HTTP Google Sheets: ${response.status} ${response.statusText}`;
        }
      } catch (err: any) {
        lastError = err.message || "Gagal menghubungi server Google Sheets";
      }
    }

    if (!csvContent) {
      return NextResponse.json(
        {
          success: false,
          needsSharing: true,
          sheetId,
          message:
            lastError ||
            "Dokumen Google Sheets Anda saat ini disetel 'Dibatasi' (Private).",
          sharingInstructions: [
            "Buka spreadsheet Anda di tab sebelah",
            "Klik tombol 'Bagikan' (Share) di pojok kanan atas",
            "Pada 'Akses umum' (General access), ubah dari 'Dibatasi' menjadi 'Siapa saja yang memiliki tautan' (Anyone with the link) dengan hak 'Pelihat' (Viewer)",
            "Klik 'Selesai', lalu klik tombol 'Sinkronkan Sekarang' di sini lagi",
          ],
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      csv: csvContent,
      message: "Berhasil mengunduh data live dari Google Sheets!",
    });
  } catch (error: any) {
    console.error("Sync Sheets error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
