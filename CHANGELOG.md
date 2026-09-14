## [Unreleased]

### Fixed
- Konfigurasi deployment Cloudflare/OpenNext kini disimpan di repository dan mengarahkan binding `WORKER_SELF_REFERENCE` ke Worker `sg-mini`, sehingga proses deploy tidak lagi merujuk ke Worker lama `get-sgb` yang tidak tersedia. Variabel runtime yang dikelola di Cloudflare Dashboard juga dipertahankan saat deploy.

### Changed
- Kontrol kategori dan rentang tanggal pada Historical Data Browser kini ditampilkan melalui tombol dan modal yang berada di tengah layar pada perangkat mobile. Modal dirender langsung ke halaman utama agar tidak terpengaruh animasi atau container konten.
- Output standalone Next.js kini hanya digunakan di luar Vercel, sehingga deployment Vercel tidak gagal saat proses packaging pada Next.js 16.3.
