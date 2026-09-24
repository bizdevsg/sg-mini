# SGB Platform Monorepo

Website publik dan Client Area PT Solid Gold Berjangka berada dalam dua aplikasi Next.js yang dapat dijalankan dan di-deploy secara independen.

## Struktur

```text
apps/
├── website/       # Website publik, port lokal 3000
└── client-area/   # Login dan dashboard nasabah, port lokal 3009
```

- `website` menangani landing page, produk, edukasi, berita, legalitas, dan contact.
- `client-area` menangani login, akun, transaksi, market, berita nasabah, ebook, dan dokumen.
- URL lama `/{locale}/client-area/*` pada website dialihkan ke deployment Client Area.
- Cookie dan proses autentikasi Client Area tidak dibaca oleh website publik.

## Development

Install dependency workspace dari root:

```bash
npm install
```

Jalankan salah satu aplikasi:

```bash
npm run dev:website
npm run dev:client-area
```

Build dan lint:

```bash
npm run build:website
npm run build:client-area
npm run lint
```

## Environment variables

Template lengkap tersedia di `.env.example`. Karena setiap aplikasi adalah root Next.js sendiri, buat file lokal berikut sesuai kebutuhan:

```text
apps/website/.env.local
apps/client-area/.env.local
```

Website membutuhkan alamat deployment Client Area:

```env
NEXT_PUBLIC_CLIENT_SITE_URL=http://localhost:3009
```

Secret berikut hanya boleh dipasang pada aplikasi Client Area:

```env
CLIENT_AREA_SESSION_SECRET=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
RECAPTCHA_MIN_SCORE=0.65
```

Konfigurasi API konten yang digunakan kedua aplikasi perlu ditambahkan pada masing-masing environment deployment sesuai kebutuhannya.

## Deployment Vercel

Buat dua project Vercel dari repository dan branch yang sama:

| Project | Root Directory | Domain contoh |
| --- | --- | --- |
| Website | `apps/website` | `sg-berjangka.com` |
| Client Area | `apps/client-area` | `client.sg-berjangka.com` |

Konfigurasi Website:

```env
NEXT_PUBLIC_CLIENT_SITE_URL=https://client.sg-berjangka.com
NEXT_PUBLIC_SITE_URL=https://sg-berjangka.com
```

Konfigurasi Client Area:

```env
NEXT_PUBLIC_SITE_URL=https://client.sg-berjangka.com
NEXT_PUBLIC_ENABLE_CLIENT_AREA=true
```

Tambahkan hostname deployment yang diperlukan ke `NEXT_ALLOWED_ORIGINS` bila Server Action diakses melalui proxy atau domain tambahan.

## Docker

Satu `Dockerfile` menerima build argument `APP_NAME` (`website` atau `client-area`). `compose.yml` membangun kedua service secara terpisah dan secara default mengekspos website pada port `6969` (`APP_SITE_PORT`) serta Client Area pada port `6970` (`APP_CLIENT_SITE_PORT`).

## Kompatibilitas route

Client Area sementara mempertahankan route `/{locale}/client-area/*` agar bookmark, redirect login, dan link internal lama tetap bekerja. Prefix tersebut dapat disederhanakan setelah deployment baru stabil.

## Pemisahan keamanan

- Website publik hanya mengetahui URL Client Area dan feature flag untuk menampilkan tombol.
- Password, session cookie, reCAPTCHA secret, dan Server Action autentikasi hanya berada di aplikasi Client Area.
- Setiap aplikasi memiliki `src`, `public`, konfigurasi Next.js, TypeScript, ESLint, dan Vercel sendiri.
