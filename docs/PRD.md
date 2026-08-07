# PRD — SGB Website (get-sgb)

- **Status**: Living document (mencerminkan produk yang sudah berjalan, bukan proposal fitur baru)
- **Owner**: TBD
- **Branch context**: `no-client-area` (lihat [Status & Roadmap Client Area](#status--roadmap-client-area))
- **Terhubung dengan**: [`CLAUDE.md`](../CLAUDE.md) → [`AGENTS.md`](../AGENTS.md)

> **Catatan konvensi teknis (dari AGENTS.md)**: Project ini memakai Next.js 16 dengan breaking changes dari versi yang mungkin ada di training data model manapun. Setiap implementasi yang mengacu ke PRD ini **wajib** membaca `node_modules/next/dist/docs/` dan memperhatikan deprecation notice sebelum menulis kode. Aturan ini mengikat semua fase implementasi yang diturunkan dari dokumen ini.

---

## 1. Ringkasan Produk

`get-sgb` adalah website marketing dan resource portal untuk **PT Solid Gold Berjangka**, dibangun dengan Next.js 16 (App Router), React 19, TypeScript, dan Tailwind CSS v4. Website ini bilingual (`id` default, `en`) dan menjadi kanal utama untuk edukasi produk trading, informasi pasar real-time, dan akuisisi nasabah baru.

## 2. Tujuan Bisnis

Diurutkan berdasarkan prioritas yang dikonfirmasi:

1. **Akuisisi nasabah baru** — mengarahkan calon nasabah ke pendaftaran/registrasi.
2. **Edukasi** — materi trading, syarat & ketentuan, index symbols, getting started, dsb.
3. **Dukungan nasabah** — akses informasi (live quote, historical data, economic calendar, FAQ) untuk nasabah existing maupun calon nasabah.
4. **Brand awareness** — kehadiran informasi perusahaan (about, legalitas, penghargaan, company profile).

> Keempat tujuan ini dianggap setara prioritas kerja sehari-hari; belum ada urutan bobot kuantitatif — **TBD**.

## 3. Target Pengguna

- **Calon nasabah retail** (belum register) — datang dari campaign/organic, butuh edukasi + kepercayaan (fraud alert, legalitas, regulator) sebelum daftar.
- **Nasabah existing** — butuh akses cepat ke live quote, news, historical data, economic calendar, dan (saat tersedia) client area.

Kedua segmen ini dilayani oleh website yang sama; tidak ada pemisahan sub-domain/produk per segmen saat ini.

Belum ada pemisahan lebih detail (mis. pemula vs trader berpengalaman) yang terdokumentasi — **TBD**.

## 4. Cakupan Fungsional Saat Ini

Berdasarkan `README.md` dan struktur `src/app/[locales]`:

| Area | Route | Catatan |
|---|---|---|
| Landing/homepage | `/{locale}` | |
| About | `/{locale}/about` | |
| Ebook | `/{locale}/ebook` | |
| Live quote | `/{locale}/live-quote` | data via websocket feed |
| Economic calendar | `/{locale}/economic-calendar` | |
| Historical data | `/{locale}/historical-data` | |
| News | `/{locale}/news`, `/{locale}/news/[slug]` | fallback konten statis lokal untuk slug yang diprerender |
| Produk | `/{locale}/produk` | |
| Promo | `/{locale}/promo` | |
| Education | `/{locale}/education` | |
| FAQ | `/{locale}/faq` | |
| Fraud alert | `/{locale}/fraud-alert` | |
| Privacy policy | `/{locale}/privacy-policy` | |
| Syarat & ketentuan | `/{locale}/syarat-dan-ketentuan` | |
| Aplikasi Solid Gold | `/{locale}/aplikasi-solid-gold` | |
| Trade Pilot | Link navbar eksternal ke `https://tradepilot.id/` (buka tab baru) | Bukan route internal — sebelumnya webview iframe, sekarang cukup redirect keluar |
| Banner | `/{locale}/banner` | |
| Contact us | `/{locale}/contact-us` | |
| Client area | `/{locale}/client-area/*` | login, account (profile, deposit, withdrawal, kode referal), market, market/[symbol], news, ebook, transaction — lihat §5 |

### Integrasi data (server-side & realtime)

- Live quote — websocket (`LIVE_QUOTE_SOCKET_URL`)
- News API (portal + detail)
- Historical Data API
- Economic Calendar API
- Product API
- Banner API, Pengumuman API, Company Profile API, Legalitas, Penghargaan
- Firebase (client bootstrap) — `src/lib/firebase`
- Proteksi endpoint internal: header `x-internal-api-token` (non-`dev` env); endpoint browser-facing (SSE, economic calendar, image proxy) dibatasi same-origin

## 5. Status & Roadmap Client Area

Nama branch aktif (`no-client-area`) berasal dari eksplorasi pemisahan **client area** (login, account, transaction, market, ebook, news khusus nasabah login) menjadi produk/sistem terpisah dari website marketing ini.

**Keputusan saat ini (dikonfirmasi)**: client area **tetap digabung** dalam satu codebase/produk `get-sgb` untuk saat ini. Pemisahan menjadi project terpisah adalah **arah jangka panjang**, bukan scope aktif.

- Kode client area masih ada penuh di `src/app/[locales]/client-area/*` (login, account/profile, account/deposit, account/withdrawal, account/kode-referal, market, market/[symbol], news, news/[slug], ebook, ebook/[slug], transaction).
- Implikasi: dokumen ini memasukkan client area sebagai bagian dari scope produk yang berjalan, bukan out-of-scope.
- **Open question**: pemicu, timeline, dan kriteria pemisahan client area ke project lain — **TBD**, perlu keputusan stakeholder sebelum dijadikan item roadmap resmi.

## 6. Non-Goals (Out of Scope Saat Ini)

- Memisahkan client area menjadi service/produk mandiri (ditunda, lihat §5).
- Menentukan target metrik kuantitatif tanpa data existing (lihat §7).

## 7. Success Metrics

Belum ada metrik dan target resmi yang dikonfirmasi tim — **TBD**. Kandidat metrik yang relevan dengan tujuan bisnis di §2 (perlu divalidasi/diberi target oleh stakeholder):

| Tujuan Bisnis | Kandidat Metrik | Target | Status |
|---|---|---|---|
| Akuisisi nasabah baru | Klik ke `NEXT_PUBLIC_REGISTER_URL` / conversion rate | TBD | TBD |
| Edukasi | Engagement halaman education/getting-started/ebook | TBD | TBD |
| Dukungan nasabah | Penggunaan live-quote, historical-data, economic-calendar | TBD | TBD |
| Brand awareness | Traffic organik, waktu di halaman about/legalitas | TBD | TBD |

## 8. Roadmap Terdekat

Tidak ada item roadmap terkonfirmasi setelah penyelesaian pekerjaan `no-client-area` saat ini — **TBD**. Perlu diisi setelah keputusan §5 (pemisahan client area) dan §7 (metrik) diambil.

## 9. Batasan & Ketergantungan Teknis

- **Next.js 16 breaking changes** — wajib rujuk `node_modules/next/dist/docs/` sebelum implementasi apa pun turunan PRD ini (AGENTS.md).
- `APP_ENV`: `dev`/`prod` pakai API asli; `dev-deploy` pakai dummy data server-side; websocket live quote tidak terpengaruh switch ini.
- Command seperti `npm`, `next`, `pnpm`, `yarn` perlu konfirmasi user saat dijalankan lewat agent (catatan repo di `README.md`).
- Locale: `id` (default), `en` — konfigurasi di `src/locales/config.ts`.

## 10. Open Questions

- [ ] Prioritas kuantitatif antar 4 tujuan bisnis (§2) — apakah akuisisi > edukasi > dukungan > brand, atau setara?
- [ ] Segmentasi user lebih detail (pemula vs trader berpengalaman) — perlu?
- [ ] Timeline & trigger pemisahan client area ke project terpisah (§5)
- [ ] Metrik & target sukses resmi (§7)
- [ ] Item roadmap pasca `no-client-area` (§8)

---

*Dibuat: 2026-08-03. Dokumen ini merefleksikan state produk yang sudah berjalan (bukan hipotesis fitur baru) — bagian yang ditandai TBD memerlukan keputusan/input stakeholder, bukan asumsi yang dikarang.*
