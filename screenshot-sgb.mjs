/**
 * Screenshot otomatis + ekstraksi teks semua halaman website SGB
 * untuk bahan proposal pengajuan ke BAPPEBTI.
 *
 * Cara pakai:
 *   npm i -D playwright
 *   npx playwright install chromium
 *   node screenshot-sgb.mjs
 *
 * Opsional: BASE_URL=https://sg-berjangka.com node screenshot-sgb.mjs
 *
 * Hasil (folder ./proposal-assets):
 *   desktop/NN-nama.png   -> screenshot full page 1440px
 *   mobile/NN-nama.png    -> screenshot full page 390px (iPhone)
 *   konten-website.md     -> teks semua halaman (upload file ini juga ke Claude)
 *   laporan.json          -> status tiap halaman (sukses/gagal)
 */

import { chromium, devices } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = (process.env.BASE_URL || "https://sg-mini-one.vercel.app").replace(/\/$/, "");
const OUT_DIR = "./proposal-assets";

// Urutan = urutan bab di proposal. Tambah/hapus di sini kalau ada halaman lain.
const PAGES = [
  ["01-beranda", "/id"],
  // Produk
  ["02-produk-multilateral", "/id/produk/multilateral"],
  ["03-produk-bilateral", "/id/produk/bilateral"],
  ["04-produk-akun-reguler", "/id/produk/reguler"],
  ["05-produk-akun-prime", "/id/produk/prime"],
  ["06-aplikasi-solid-gold", "/id/aplikasi-solid-gold"],
  ["07-live-quote", "/id/live-quote"],
  // Berita
  ["08-berita-terkini", "/id/news"],
  ["09-kalender-ekonomi", "/id/economic-calendar"],
  ["10-historical-data", "/id/historical-data"],
  // Edukasi
  ["11-edukasi-cara-memulai", "/id/education/cara-memulai"],
  ["12-edukasi-ebook", "/id/education/ebook"],
  ["13-edukasi-market-academy", "/id/education/market-academy"],
  ["14-edukasi-trading-rules", "/id/education/trading-rules"],
  ["15-edukasi-istilah-transaksi", "/id/education/istilah-dalam-transaksi-online"],
  ["16-edukasi-loco-london-gold", "/id/education/loco-london-gold"],
  ["17-edukasi-simbol-index", "/id/education/simbol-index"],
  // Tentang
  ["18-tentang-kami", "/id/about"],
  ["19-tentang-informasi", "/id/about/informasi"],
  ["20-tentang-legalitas-bisnis", "/id/about/legalitas-bisnis"],
  ["21-hubungi-kami-pengaduan", "/id/contact-us"],
  // Tautan cepat / kepatuhan
  ["22-kebijakan-privasi", "/id/privacy-policy"],
  ["23-syarat-dan-ketentuan", "/id/syarat-dan-ketentuan"],
  ["24-promo", "/id/promo"],
  ["25-faq", "/id/faq"],
];

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  // deviceScaleFactor dipaksa 1 (bukan default iPhone 13 yang 3x): untuk
  // halaman setinggi ini, tinggi CSS x 3 bisa melebihi batas ukuran capture
  // fullPage Chromium, membuat sebagian besar konten blank di screenshot
  // walau kontennya sendiri render normal (sudah diverifikasi langsung).
  // Layout tetap sesuai breakpoint mobile karena width CSS-nya tidak berubah.
  mobile: { ...devices["iPhone 13"], deviceScaleFactor: 1 },
};

// Scroll pelan sampai bawah supaya gambar lazy-load & animasi on-scroll (AOS,
// lihat ScrollReveal.tsx) ikut ke-trigger. PENTING: jangan scrollTo(0,0) di
// akhir — komponen ScrollReveal defaultnya `once=false`, jadi AOS akan
// menyembunyikan lagi (opacity:0) section yang discroll keluar viewport.
// Screenshot fullPage tidak butuh posisi scroll di atas; Chromium menangkap
// seluruh tinggi dokumen apa pun posisi scroll saat ini.
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 150);
    });
  });
}

// Matikan animasi/transisi & sembunyikan widget mengambang (chat, dll) biar screenshot rapi
const CLEAN_CSS = `
  *, *::before, *::after { animation: none !important; transition: none !important; }
  html { scroll-behavior: auto !important; }
  #solidchat-widget-host, iframe[src*="solidchat"] { display: none !important; }
  /* Navbar aslinya position:fixed (Navbar.tsx). Untuk halaman setinggi ini
     Chromium men-tile proses capture fullPage-nya, dan elemen fixed ikut
     dirender ulang di tiap batas tile — jadi navbar "nempel" lagi di
     tengah halaman. Dipaksa absolute supaya cuma dirender sekali di posisi
     aslinya (tetap di atas karena dia elemen pertama di body). */
  nav.fixed { position: absolute !important; }
`;

// page.screenshot({ fullPage: true }) TIDAK dipakai untuk halaman setinggi
// ini: Chromium me-render fullPage dengan memperlebar "viewport" ke seluruh
// tinggi dokumen dan menangkapnya sekali jalan, tapi untuk halaman yang jauh
// lebih tinggi dari viewport aslinya, ini terbukti tidak reliabel — kadang
// hanya bagian yang pernah benar-benar di-render (awal & akhir scroll) yang
// ke-capture, bagian tengah blank, walau kontennya sendiri render normal
// (diverifikasi langsung: screenshot viewport biasa di posisi yang sama
// selalu lengkap). Solusinya: screenshot per-layar SAAT benar-benar discroll
// ke posisi itu (bukan minta Chromium membayangkan satu viewport raksasa),
// lalu digabung manual lewat <canvas> di halaman kosong milik Chromium
// sendiri — tanpa nambah dependency gambar baru.
async function captureFullPageStitched(browser, page, filePath) {
  const viewportSize = page.viewportSize();

  if (!viewportSize) {
    await page.screenshot({ path: filePath, fullPage: true });
    return;
  }

  const { width, height: viewportHeight } = viewportSize;
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  if (totalHeight <= viewportHeight) {
    await page.screenshot({ path: filePath });
    return;
  }

  const slices = [];
  let y = 0;

  while (true) {
    const scrollY = Math.min(y, totalHeight - viewportHeight);
    await page.evaluate((sy) => window.scrollTo(0, sy), scrollY);
    // beri waktu compositor benar-benar mengecat frame di posisi ini
    await page.waitForTimeout(120);
    const buffer = await page.screenshot();
    slices.push({ base64: buffer.toString("base64"), top: scrollY });

    if (scrollY + viewportHeight >= totalHeight) {
      break;
    }

    y += viewportHeight;
  }

  const stitchPage = await browser.newPage();

  try {
    await stitchPage.goto("about:blank");
    const dataUrl = await stitchPage.evaluate(
      async ({ slices, width, height }) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        for (const slice of slices) {
          const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = `data:image/png;base64,${slice.base64}`;
          });
          ctx.drawImage(image, 0, slice.top);
        }

        return canvas.toDataURL("image/png");
      },
      { slices, width, height: totalHeight },
    );

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    await fs.writeFile(filePath, Buffer.from(base64Data, "base64"));
  } finally {
    await stitchPage.close();
  }
}

// Website mengunci scroll & menutup full page dengan overlay gelap selagi
// banner cookie consent tampil (lihat HomeCookieConsentBanner.tsx). Server
// hanya menampilkan banner itu kalau cookie `sgb_cookie_consent` belum ada,
// jadi kita "terima" cookie-nya duluan sebelum navigasi supaya banner tidak
// pernah dirender sama sekali.
async function acceptCookieConsent(context) {
  const { hostname, protocol } = new URL(BASE_URL);

  await context.addCookies([
    {
      name: "sgb_cookie_consent",
      value: "accepted",
      domain: hostname,
      path: "/",
      secure: protocol === "https:",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

async function capture(browser, mode, name, url, report) {
  const context = await browser.newContext({ ...VIEWPORTS[mode], locale: "id-ID" });
  await acceptCookieConsent(context);
  const page = await context.newPage();
  const file = path.join(OUT_DIR, mode, `${name}.png`);
  let text = null;

  try {
    // "networkidle" TIDAK dipakai: live quote membuka koneksi EventSource
    // (/api/live-quotes) yang sengaja tidak pernah ditutup, jadi kondisi
    // "tidak ada koneksi aktif" nyaris tidak pernah tercapai dan goto() bisa
    // macet sampai timeout 60 detik (screenshot gagal total untuk halaman itu).
    // "load" JUGA TIDAK dipakai: khusus di emulasi mobile, Firebase SDK
    // memuat script pihak ketiga (apis.google.com/js/api.js) yang di
    // environment ini kadang macet tak kunjung selesai/gagal — "load"
    // menunggu SEMUA resource beres jadi ikut macet 60 detik. Kita pakai
    // "domcontentloaded" (jauh lebih cepat & tidak tergantung resource
    // pihak ketiga) lalu andalkan waitForTimeout di bawah untuk kasih
    // waktu hidrasi/gambar/AOS settle sebelum discroll & discreenshot.
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.addStyleTag({ content: CLEAN_CSS });
    // Kasih waktu hidrasi/data awal & AOS init settle sebelum mulai scroll
    await page.waitForTimeout(2000);
    await autoScroll(page);
    // Kasih waktu websocket live quote / data market masuk
    await page.waitForTimeout(4000);
    await captureFullPageStitched(browser, page, file);

    if (mode === "desktop") {
      text = await page.evaluate(() => {
        const main = document.querySelector("main") || document.body;
        return main.innerText.replace(/\n{3,}/g, "\n\n").trim();
      });
    }
    report.push({ name, mode, url, status: res?.status() ?? "?", ok: true });
    console.log(`✓ [${mode}] ${name}`);
  } catch (err) {
    report.push({ name, mode, url, ok: false, error: String(err.message).slice(0, 200) });
    console.log(`✗ [${mode}] ${name} — ${err.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
  return text;
}

async function main() {
  await fs.mkdir(path.join(OUT_DIR, "desktop"), { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, "mobile"), { recursive: true });

  const browser = await chromium.launch();
  const report = [];
  let markdown = `# Konten Website SGB\n\nSumber: ${BASE_URL}\nDiambil: ${new Date().toISOString()}\n`;

  for (const [name, route] of PAGES) {
    const url = BASE_URL + route;
    const text = await capture(browser, "desktop", name, url, report);
    await capture(browser, "mobile", name, url, report);
    markdown += `\n\n---\n\n## ${name}\nURL: ${url}\n\n${text ?? "(gagal diambil)"}\n`;
  }

  await browser.close();
  await fs.writeFile(path.join(OUT_DIR, "konten-website.md"), markdown, "utf8");
  await fs.writeFile(path.join(OUT_DIR, "laporan.json"), JSON.stringify(report, null, 2), "utf8");

  const failed = report.filter((r) => !r.ok);
  console.log(`\nSelesai. ${report.length - failed.length}/${report.length} screenshot berhasil.`);
  if (failed.length) console.log("Gagal:", failed.map((f) => `${f.mode}/${f.name}`).join(", "));
  console.log(`Hasil ada di folder ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
