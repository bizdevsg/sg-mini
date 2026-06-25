# SGB Website

Website marketing dan resource portal untuk `PT Solid Gold Berjangka`, dibangun dengan `Next.js 16`, `React 19`, `TypeScript`, dan `Tailwind CSS v4`.

Project ini sudah mendukung:

- landing page bilingual: Indonesia (`id`) dan English (`en`)
- live quote dengan websocket feed
- halaman berita dan detail berita
- economic calendar
- historical data
- halaman about
- halaman ebook

## Tech Stack

- `next@16.2.7`
- `react@19.2.4`
- `typescript`
- `tailwindcss@4`
- `@fortawesome/react-fontawesome`

## Locale

Locale aktif:

- `id`
- `en`

Default locale:

- `id`

Konfigurasi locale ada di [src/locales/config.ts](src/locales/config.ts).

Struktur message locale:

- [src/locales/id/messages.ts](src/locales/id/messages.ts)
- [src/locales/en/messages.ts](src/locales/en/messages.ts)
- [src/locales/shared/messages.ts](src/locales/shared/messages.ts)

## Routes

Route utama yang tersedia:

- `/{locale}`: homepage
- `/{locale}/about`
- `/{locale}/ebook`
- `/{locale}/live-quote`
- `/{locale}/economic-calendar`
- `/{locale}/historical-data`
- `/{locale}/news`
- `/{locale}/news/[slug]`

Contoh:

- `/id`
- `/en/about`
- `/id/news/rupiah-open-mixed`

## Struktur Folder

Folder inti project:

- `src/app`
  berisi app router dan semua route
- `src/components`
  berisi atoms, molecules, organisms, layouts, providers, dan content
- `src/lib`
  berisi helper env, fetcher API, formatter data, dan integrasi websocket
- `src/locales`
  berisi config locale, formatter locale, dan message per bahasa

## Integrasi Data

Project ini memakai beberapa sumber data:

- Live quote websocket
- Portal news API
- Historical data API
- Economic calendar API

Helper env dan URL default ada di [src/lib/env.ts](src/lib/env.ts).

## Environment Variables

Variabel yang dipakai project ini:

```env
APP_ENV=dev

LIVE_QUOTE_SOCKET_URL=
NEXT_PUBLIC_LIVE_QUOTE_SOCKET_URL=

NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL=

NEWS_API_URL=
NEWS_API_TOKEN=
NEWS_PORTAL_BASE_URL=
PRODUCT_API_URL=
PRODUCT_PORTAL_BASE_URL=
BANNER_API_URL=
BANNER_IMAGE_BASE_URL=
PENGUMUMAN_API_URL=
CONTACT_MESSAGE_API_URL=
COMPANY_PROFILE_API_URL=

HISTORICAL_DATA_API_URL=
HISTORICAL_DATA_API_TOKEN=

ECONOMIC_CALENDAR_API_BASE_URL=

NEXT_PUBLIC_PLACEHODER_BASE_URL=
NEXT_PUBLIC_LOGIN_URL=
NEXT_PUBLIC_REGISTER_URL=
NEXT_PUBLIC_HERO_CTA_URL=
NEXT_PUBLIC_SPREAD_CTA_URL=
```

Kalau tidak diisi, project akan memakai default value yang sudah didefinisikan di [src/lib/env.ts](src/lib/env.ts).

Nilai `APP_ENV` yang dipakai untuk switch data:

- `dev` atau `prod`: pakai API asli
- `dev-deploy`: pakai dummy data untuk seluruh API server-side
- websocket `LIVE_QUOTE_SOCKET_URL` tetap tidak diubah oleh switch ini

## Development

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Jalankan production server:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

## Catatan Implementasi

- remote image domain dikonfigurasi di [next.config.ts](next.config.ts)
- route loading overlay ada di [src/components/molecules/RouteLoadingBar.tsx](src/components/molecules/RouteLoadingBar.tsx)
- halaman news detail memakai fallback konten statis lokal untuk slug yang diprerender
- data news API besar ditangani di level helper agar tidak membebani data cache Next.js

## Catatan Repo

Di repo ini ada aturan internal bahwa command seperti `npm`, `next`, `pnpm`, `yarn`, dan command serupa sebaiknya dijalankan setelah ada konfirmasi user saat bekerja lewat agent.
