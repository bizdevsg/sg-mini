---
name: get-sgb-conventions
description: Konvensi project untuk website get-sgb (PT Solid Gold Berjangka) — struktur Next.js 16 App Router, locale routing, pola fetching data/fallback, dan proteksi internal API. Gunakan saat menambah atau mengubah routes, modul data di lib, atau komponen di repo ini.
---

# Konvensi Project get-sgb

## Ringkasan

`get-sgb` adalah website marketing/resource bilingual (`id`/`en`) berbasis Next.js 16 + React 19 +
TypeScript untuk PT Solid Gold Berjangka. Lihat `docs/PRD.md` untuk cakupan produk dan `AGENTS.md`
untuk kewajiban memeriksa breaking-change Next.js 16 (`node_modules/next/dist/docs/`) sebelum
menulis kode App Router apa pun.

**Kata kunci**: get-sgb, Solid Gold, locale routing, App Router, news feed, live quote, client area,
internal API token, fallback content, APP_ENV, dummy data.

## Locale routing (`src/app/[locales]/...`)

- Setiap halaman publik berada di bawah dynamic segment `[locales]`, bukan `[locale]`.
- `params` selalu bertipe `Promise<{ locales: string }>` — `await` dulu, lalu validasi dengan
  `isSupportedLocale` dari `@/locales` dan panggil `notFound()` (lewat helper type-guard
  `assertValidLocale`) jika tidak valid. Ikuti pola yang ada di `src/app/[locales]/news/page.tsx`,
  jangan membuat pola baru.
- Daftar locale yang didukung dan locale default berasal dari `src/locales/config.ts`
  (`SUPPORTED_LOCALES = ["id", "en"]`, default `"id"`). Jangan hardcode daftar locale di tempat lain.
- Static params untuk prerendering: `generateStaticParams()` yang mengembalikan
  `SUPPORTED_LOCALES.map((locale) => ({ locales: locale }))`.
- Teks terjemahan berasal dari `src/locales/*` (`getMessages(locale)` untuk string UI bersama,
  ditambah modul konten per-halaman seperti `news-page-content.ts`, `getting-started-page.ts`, dst,
  masing-masing meng-export fungsi `get<X>PageContent(locale)`). Tambahkan konten halaman baru
  sebagai modul baru di `src/locales/` (dan `src/locales/shared/` jika struktur id/en sama), jangan
  menaruh string langsung di dalam `.tsx`.

## Modul data (`src/lib/*.ts`)

- Data fetcher yang server-only diawali `import "server-only";` di baris paling atas (lihat
  `src/lib/news.ts`).
- Modul API eksternal mengikuti pola **fetch → fallback**: coba API asli dulu, dan jika token tidak
  ada / respons non-2xx / timeout / gagal parse, fallback ke konten statis lokal yang sudah
  dibundel di `src/locales/*`. Kembalikan hasil berbentuk `{ data, source: "api" | "fallback" }`
  (lihat `NewsFeedResult`, `getNewsFeed`, `getStaticNewsFeed` di `src/lib/news.ts`) supaya pemanggil
  tahu jalur mana yang dipakai.
- Simpan tipe/konstanta yang dipakai bersama server module dan client component di file
  `*.shared.ts` (mis. `news.shared.ts`, `ebook.shared.ts`, `economic-calendar.shared.ts`) — jangan
  import kode `server-only` dari client component.
- Hormati `APP_ENV` dari `src/lib/env.ts`: `"dev" | "prod"` memanggil API asli; `"dev-deploy"`
  memakai dummy data (`USE_DUMMY_API_DATA`). Websocket live-quote tidak terpengaruh switch ini.
  Jangan menambah pengecekan env ad-hoc baru — pakai ulang `APP_ENV` / `USE_DUMMY_API_DATA`.

## API routes (`src/app/api/*`)

- Route handler yang internal/browser-facing wajib memanggil `protectInternalApiRoute(request)`
  atau `protectSameOriginBrowserApiRoute(request)` dari `src/lib/api-protection.ts`, dan langsung
  `return` lebih awal jika guard tersebut mengembalikan response. Saat `APP_ENV` bukan `dev`,
  dibutuhkan header `x-internal-api-token` (server-to-server) atau request browser same-origin yang
  terverifikasi (SSE, economic calendar, image proxy). Jangan bypass ini dengan membaca
  `process.env.APP_ENV` langsung di route baru.

## Struktur komponen (`src/components/*`)

- Layering atomic: `atoms/` (komponen kecil berfungsi tunggal, mis. `ButtonLink.tsx`),
  `molecules/`, `organisms/` (bagian gabungan yang menampilkan data, mis. `NewsBrowser.tsx`),
  `layout(s)/`, `providers/`. Tempatkan komponen baru di layer yang sesuai dengan kompleksitasnya,
  jangan semua ditaruh di satu folder.
- Atom khusus client-area diberi prefix `ClientArea*` (mis. `ClientAreaAccountField.tsx`) — ikuti
  prefix ini untuk komponen baru yang khusus client-area supaya tetap mudah dicari dan berbeda dari
  komponen situs publik.

## Client area

- Masih sepenuhnya dalam scope dan menyatu di `src/app/[locales]/client-area/*` (login, account,
  market, market/[symbol], news, ebook, transaction). Berdasarkan `docs/PRD.md` §5, pemisahan
  menjadi produk terpisah hanya rencana jangka panjang — jangan perlakukan sebagai deprecated atau
  dipindahkan.

## Perintah (Commands)

- Dev server: `npm run dev` (webpack) atau `npm run dev:turbo` (Turbopack) — **selalu konfirmasi
  ke user dulu sebelum menjalankan `npm`/`next`/`pnpm`/`yarn`** sesuai konvensi repo ini.
- `npm run build`, `npm run lint` — berlaku aturan konfirmasi yang sama.
