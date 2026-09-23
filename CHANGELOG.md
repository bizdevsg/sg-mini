## [Unreleased]

### Added
- Disclaimer dwibahasa ditambahkan di bagian bawah seluruh halaman Client Area untuk menegaskan bahwa semua informasi, data, grafik, dan fitur bersifat hanya untuk dilihat (view only) dan tidak dapat digunakan untuk mengeksekusi transaksi.
- Konfigurasi root `vercel.json` ditambahkan dengan schema resmi Vercel dan framework preset Next.js agar konfigurasi deployment dapat divalidasi dan dikenali secara eksplisit.

### Changed
- Live quote kini membuka WebSocket upstream langsung dari browser melalui `NEXT_PUBLIC_LIVE_QUOTE_SOCKET_URL`, menggantikan relay SSE `/api/live-quotes`; broker WebSocket server dihapus agar koneksi realtime tidak mempertahankan Vercel Function dan mengonsumsi Provisioned Memory selama stream aktif.
- Folder `proposal-assets/` dan arsip `proposal-assets-sgb.zip` kini diabaikan oleh Git agar materi proposal lokal tidak ikut masuk repository.
- Login Client Area kini menggunakan reCAPTCHA v3 tak terlihat dengan action khusus `client_area_login`; verifikasi server juga memeriksa skor (default minimum `0.65`), action, dan hostname agar token tidak dapat digunakan lintas konteks.
- Fetching berita di `src/lib/news.ts` kini menggunakan API SG Admin (`/api/v1/berita`) beserta header `X-API-Key` dari `SG_ADMIN_API_KEY`, menggantikan API Newsmaker dan bearer token. Adapter berita juga mendukung respons list yang dipaginasi serta variasi field konten, kategori, dan gambar dari API baru.
- Halaman publik `/education/ebook` kini memakai layout library editorial dengan CTA yang menggulir ke koleksi kategori. Seluruh CTA login Client Area dan download aplikasi dihapus agar materi ebook dapat dijelajahi langsung.

### Fixed
- Bubble Live Chat tidak lagi dipaksa menjadi `76x76px` oleh `TawkChatWidget`; ukuran bubble, badge, dan posisi panel kini sepenuhnya mengikuti konfigurasi responsif dari `widget.js`.
- Gambar pada card berita dari SG Admin kini mengutamakan `image_url` dan selalu dimuat melalui proxy internal. Path lama `uploads/...` juga dinormalisasi menjadi URL storage yang benar, sehingga gambar tidak gagal saat diakses langsung oleh browser.
- Tombol pemulihan pada error boundary global, locale, dan Client Area kini memakai callback `retry` dari Next.js 16.3, sehingga tidak lagi memanggil prop `unstable_retry` yang tidak tersedia di production bundle.

### Changed
- Kontrol kategori dan rentang tanggal pada Historical Data Browser kini ditampilkan melalui tombol dan modal yang berada di tengah layar pada perangkat mobile. Modal dirender langsung ke halaman utama agar tidak terpengaruh animasi atau container konten.
- Output standalone Next.js kini hanya digunakan di luar Vercel, sehingga deployment Vercel tidak gagal saat proses packaging pada Next.js 16.3.

### Removed
- Seluruh integrasi deployment Cloudflare/OpenNext dihapus, termasuk konfigurasi Worker dan R2, skrip `cf:*`, dependensi terkait, dan origin tunnel `trycloudflare.com`; deployment Cloudflare tidak lagi didukung oleh repository ini.
- Integrasi Vercel Web Analytics di root layout dihapus; aplikasi tetap memakai Firebase Analytics melalui `FirebaseBootstrap`.
