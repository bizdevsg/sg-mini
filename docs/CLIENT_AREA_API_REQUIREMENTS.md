# Client Area — Kebutuhan API yang Belum Tersedia

- **Status**: Living document — hasil audit kode per 2026-08-03
- **Terkait**: [`PRD.md`](./PRD.md) §5 Status & Roadmap Client Area
- **Scope**: `src/app/[locales]/client-area/**`

Dokumen ini mendaftar bagian Client Area yang **saat ini masih pakai data hardcode/statis/dummy** (bukan API sungguhan), berdasarkan audit langsung ke kode — bukan asumsi.

## Sudah pakai API real (di luar scope dokumen ini)

| Fitur | Sumber Data |
|---|---|
| Market | `useLiveQuoteStream()` — websocket live quote |
| News & Ebook di client area | `getClientAreaBreakingNews` / `getNewsFeed` — News API asli |

## Belum pakai API — perlu dibuatkan

Semua endpoint yang butuh data milik akun tertentu memakai `[account-id]` di path (bukan query param), supaya:

1. Response tetap RESTful dan cache-friendly per akun.
2. Server **wajib** memvalidasi bahwa `[account-id]` di path **sama** dengan account-id yang terikat ke token/session hasil login — bukan sekadar dipercaya dari input client. Tanpa validasi ini, endpoint rentan **IDOR** (user A bisa lihat data user B cuma dengan ganti ID di URL).

| # | Fitur | Lokasi | Kondisi Sekarang | API yang Dibutuhkan |
|---|---|---|---|---|
| 1 | **Login / Auth** | `src/lib/client-area-auth.ts`, `src/app/actions/clientAreaLogin.ts` | Kredensial di-hardcode (`bbh10158`, `user.sgb@demo-trading.com` + password `demo12345`) di source code | `POST /auth/login` (account + password → token/session **+ account-id**), `POST /auth/logout` (ganti cookie-clear manual saat ini) |
| 2 | **Account Snapshot** (saldo, jenis akun, account ID) | `src/components/organisms/client-area.shared.ts` → `getClientAreaAccountModeData` | Diambil dari `copy.demoAccount` / `copy.realAccount` — teks statis di file locale | `GET /account/summary/[account-id]` (balance, equity, margin, account type) — validasi `account-id` == pemilik token |
| 3 | **Profile** | `src/components/organisms/ClientAreaAccountProfilePanel.tsx` | Semua field `defaultValue` hardcoded (nama "Franky Reagan Law", email, alamat, dst); form `onSubmit` cuma `preventDefault()`, tidak mengirim apa pun | `GET /account/profile/[account-id]` (personal, purpose/experience, emergency contact, job, wealth — 5 section sesuai accordion), `PUT/PATCH /account/profile/[account-id]` per section — validasi kepemilikan |
| 4 | **Referral** | `src/components/organisms/ClientAreaAccountReferralPanel.tsx` | Konten hero/steps/CTA statis, tidak ada kode referral atau statistik nyata | `GET /account/referral/[account-id]` (kode referral milik user, jumlah downline, reward/komisi) — validasi kepemilikan |
| 5 | **Open Position & Trade History** | `client-area.shared.ts` → `getClientAreaAccountModeData` | `positions` & `transactionHistory` diambil dari `copy.demoPositions/realPositions` — array statis di locale file | `GET /account/positions/[account-id]`, `GET /account/trade-history/[account-id]` — validasi kepemilikan |
| 6 | **Deposit / Withdrawal** | `ClientAreaAccountDepositHistoryView`, `ClientAreaAccountWithdrawalHistoryView` | Sengaja ditampilkan sebagai modal **"Unavailable"** (`ClientAreaFundTransferUnavailableModal`) | **Tidak perlu API** — deposit/withdrawal memang **permanen tidak bisa dilakukan lewat website** (bukan menunggu integrasi payment gateway). UI "Unavailable" saat ini sudah sesuai dan final, out of scope selamanya. |
| 7 | **Document Approval** & **Daily Statement** | Menu item di `ClientAreaAccountPanel.tsx` | Item menu ada label-nya saja — **tanpa** `href` maupun `onClick` (belum ada halaman, apalagi API) | Perlu halaman dulu + `GET /account/documents/pending/[account-id]`, `GET /account/statement/daily/[account-id]` — validasi kepemilikan |

### Aturan validasi kepemilikan (wajib di semua endpoint bertanda "validasi kepemilikan")

- Token/session dari `POST /auth/login` harus membawa `account-id` yang sah (bukan sekadar cookie flag seperti implementasi demo saat ini di `client-area-session.ts`).
- Setiap request ke endpoint ber-`[account-id]` wajib dicek di server: `account-id` pada path **harus sama** dengan `account-id` yang terikat ke token — kalau tidak cocok, return `403 Forbidden`, bukan data akun lain.
- Jangan andalkan validasi di sisi client (Next.js route/page) saja — validasi utama harus di layer API/backend.

## Catatan Risiko

Item #1–5 dan #7 memakai data statis/dummy secara diam-diam — dari sisi UI terlihat "berfungsi", padahal setiap user yang login akan melihat data yang sama persis. Ini jadi prioritas yang perlu dituntaskan sebelum `isClientAreaEnabled()` (lihat `src/lib/client-area-config.ts`) dinyalakan untuk publik.

## Open Questions

- [ ] Siapa pemilik/tim backend untuk endpoint-endpoint di atas?
- [ ] Kontrak API (request/response shape) untuk masing-masing endpoint — **TBD**, belum ada spesifikasi resmi.

## Resolved

- ~~Apakah deposit/withdrawal memang permanen di-nonaktifkan, atau menunggu integrasi payment gateway?~~ → **Dikonfirmasi**: deposit/withdrawal memang tidak bisa dilakukan lewat website, permanen (lihat item #6).

---

*Dibuat: 2026-08-03, berdasarkan audit langsung kode `src/app/[locales]/client-area` dan `src/components/organisms/ClientArea*`.*
