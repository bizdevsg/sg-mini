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
  mobile: { ...devices["iPhone 13"] },
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
`;

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
    const res = await page.goto(url, { waitUntil: "load", timeout: 60_000 });
    await page.addStyleTag({ content: CLEAN_CSS });
    // Kasih waktu hidrasi/data awal & AOS init settle sebelum mulai scroll
    await page.waitForTimeout(2000);
    await autoScroll(page);
    // Kasih waktu websocket live quote / data market masuk
    await page.waitForTimeout(4000);
    await page.screenshot({ path: file, fullPage: true });

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
