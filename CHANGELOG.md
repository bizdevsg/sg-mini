## [Unreleased]

### Fixed
- Tombol pemulihan pada error boundary global, locale, dan Client Area kini memakai callback `retry` dari Next.js 16.3, sehingga tidak lagi memanggil prop `unstable_retry` yang tidak tersedia di production bundle.

### Changed
- Kontrol kategori dan rentang tanggal pada Historical Data Browser kini ditampilkan melalui tombol dan modal yang berada di tengah layar pada perangkat mobile. Modal dirender langsung ke halaman utama agar tidak terpengaruh animasi atau container konten.
- Output standalone Next.js kini hanya digunakan di luar Vercel, sehingga deployment Vercel tidak gagal saat proses packaging pada Next.js 16.3.

### Removed
- Seluruh integrasi deployment Cloudflare/OpenNext dihapus, termasuk konfigurasi Worker dan R2, skrip `cf:*`, dependensi terkait, dan origin tunnel `trycloudflare.com`; deployment Cloudflare tidak lagi didukung oleh repository ini.
- Integrasi Vercel Web Analytics di root layout dihapus; aplikasi tetap memakai Firebase Analytics melalui `FirebaseBootstrap`.
