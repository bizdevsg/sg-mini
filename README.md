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

Variabel yang dipakai project ini untuk development lokal ada di `.env`:

```env
ENV_FILE=.env
APP_ENV=dev
INTERNAL_API_TOKEN=
CLIENT_AREA_SESSION_SECRET=

LIVE_QUOTE_SOCKET_URL=
NEXT_PUBLIC_LIVE_QUOTE_SOCKET_URL=

NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL=

NEWS_API_URL=
NEWS_API_URL_ID=
NEWS_API_TOKEN=
NEWS_PORTAL_BASE_URL=
NEWS_IMAGE_BASE_URL=
EBOOK_CATEGORY_API_URL=
PRODUCT_API_URL=
PRODUCT_PORTAL_BASE_URL=
SG_ADMIN_API_KEY=
SG_ADMIN_REQUEST_ORIGIN=
CLIENT_AREA_CONFIG_API_URL=
CLIENT_AREA_CONFIG_API_TOKEN=
BANNER_API_URL=
BANNER_DETAIL_API_URL=
BANNER_IMAGE_BASE_URL=
PENGHARGAAN_API_URL=
PENGHARGAAN_IMAGE_BASE_URL=
PENGUMUMAN_API_URL=
CONTACT_MESSAGE_API_URL=
COMPANY_PROFILE_API_URL=
LEGALITAS_API_URL=
PRIVACY_POLICY_API_URL=
TERMS_CONDITIONS_API_URL=

HISTORICAL_DATA_API_URL=
HISTORICAL_DATA_API_TOKEN=

ECONOMIC_CALENDAR_API_BASE_URL=
ECONOMIC_CALENDAR_API_TOKEN=
TRADINGVIEW_SYMBOL_API_URL=
MARKET_SIGNAL_API_URL=
MARKET_SIGNAL_IMAGE_BASE_URL=
MARKET_ACADEMY_API_URL=
FRANKFURTER_API_URL=

NEXT_PUBLIC_PLACEHODER_BASE_URL=
NEXT_PUBLIC_LOGIN_URL=
NEXT_PUBLIC_REGISTER_URL=
NEXT_PUBLIC_ENABLE_CLIENT_AREA=false
NEXT_PUBLIC_ENABLE_TAWK_CHAT=false
NEXT_PUBLIC_HERO_CTA_URL=
NEXT_PUBLIC_SPREAD_CTA_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SOLID_GOLD_PLAY_STORE_URL=
NEXT_PUBLIC_SOLID_GOLD_APP_STORE_URL=
NEXT_PUBLIC_SOLID_GOLD_IMAGE_BASE_URL=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

NEXT_ALLOWED_ORIGINS=
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=
DEPLOYMENT_VERSION=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

APP_PORT=3000
```

Template production Docker ada di `.env.prod.example` dan file aktifnya disarankan bernama `.env.prod`.

Kalau tidak diisi, project akan memakai default value yang sudah didefinisikan di [src/lib/env.ts](src/lib/env.ts).

Konfigurasi Firebase client ada di:

- [src/lib/firebase/config.ts](src/lib/firebase/config.ts)
- [src/lib/firebase/client.ts](src/lib/firebase/client.ts)
- [src/components/providers/FirebaseBootstrap.tsx](src/components/providers/FirebaseBootstrap.tsx)

Nilai `APP_ENV` yang dipakai project:

- `dev` atau `prod`
- websocket `LIVE_QUOTE_SOCKET_URL` tetap tidak diubah oleh environment ini

Proteksi route `src/app/api`:

- saat `APP_ENV=dev`, proteksi API dilonggarkan untuk memudahkan local debugging
- saat `APP_ENV` bukan `dev`, endpoint internal hanya bisa diakses dengan header `x-internal-api-token` yang cocok dengan `INTERNAL_API_TOKEN`
- endpoint browser seperti SSE, economic calendar, dan image proxy hanya menerima request browser same-origin

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

## Docker Production

Repo ini sudah disiapkan untuk build image production `Next.js standalone` lewat [Dockerfile](Dockerfile) dan [compose.yml](compose.yml).

Alur pakainya:

1. isi `.env` dari [.env.example](.env.example) untuk development lokal
2. isi `.env.prod` dari [.env.prod.example](.env.prod.example) untuk Docker production
3. pastikan file `.env.prod` memakai `APP_ENV=prod`
4. isi `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` dengan key base64 yang stabil untuk semua instance production
5. ganti `DEPLOYMENT_VERSION` setiap release agar proteksi version skew Next.js aktif
6. build dan jalankan container dengan:

```bash
docker compose --env-file .env.prod up --build -d
```

Port host untuk development lokal mengikuti `.env` dan default ke `3000`.
Port host untuk Docker production mengikuti `.env.prod` dan default ke `2809`.

Catatan production:

- image build memakai output `standalone`, jadi container runtime hanya membawa artefak Next yang dibutuhkan
- secret runtime tetap dibaca dari `env_file`, dan tidak lagi disimpan sebagai `ENV` permanen di stage build
- cache Next disimpan di volume `next_cache` agar cache runtime tidak hilang saat container restart biasa
- untuk environment publik internet, taruh container ini di belakang reverse proxy seperti `nginx` atau `caddy`

## Catatan Implementasi

- remote image domain dikonfigurasi di [next.config.ts](next.config.ts)
- route loading overlay ada di [src/components/molecules/RouteLoadingBar.tsx](src/components/molecules/RouteLoadingBar.tsx)
- halaman news detail memakai fallback konten statis lokal untuk slug yang diprerender
- data news API besar ditangani di level helper agar tidak membebani data cache Next.js

## Catatan Repo

Di repo ini ada aturan internal bahwa command seperti `npm`, `next`, `pnpm`, `yarn`, dan command serupa sebaiknya dijalankan setelah ada konfirmasi user saat bekerja lewat agent.
