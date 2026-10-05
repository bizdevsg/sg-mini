# reCAPTCHA v3: Konsep dan Implementasi

Ringkasan umum cara kerja dan cara memasang Google reCAPTCHA v3.

## 1. Apa itu reCAPTCHA v3

reCAPTCHA v3 membedakan manusia dan bot **tanpa meminta pengguna melakukan apa pun**. Tidak ada kotak "I'm not a robot" dan tidak ada puzzle gambar. Skrip Google berjalan di latar belakang, mengamati perilaku pengunjung di halaman, lalu memberi **skor risiko**.

- Skor berkisar **0.0 sampai 1.0**.
- Mendekati **1.0**: kemungkinan besar manusia.
- Mendekati **0.0**: kemungkinan besar bot.
- Google **hanya memberi skor**. Keputusan akhir (lolos, tolak, atau minta verifikasi tambahan) ada di server pemilik situs.

### Perbedaan dengan v2

| | v2 (checkbox) | v3 |
|---|---|---|
| Interaksi pengguna | Klik kotak, kadang puzzle gambar | Tidak ada |
| Hasil | Lolos atau gagal | Skor 0.0 – 1.0 |
| Keputusan | Google | Pemilik situs |
| Cocok untuk | Form yang butuh tantangan tegas | Pengalaman mulus, deteksi bot di berbagai aksi |

Key v2 dan v3 **tidak bisa dipertukarkan**. Key harus dibuat sesuai jenisnya.

## 2. Komponen

| Komponen | Letak | Keterangan |
|---|---|---|
| **Site key** | Browser (publik) | Dipakai untuk memuat skrip dan meminta token |
| **Secret key** | Server (rahasia) | Dipakai untuk memverifikasi token ke Google. Tidak boleh ada di sisi browser atau repo |
| **Action** | Browser dan server | Nama konteks aksi, misalnya `login` atau `contact_submit`. Harus sama di kedua sisi |
| **Ambang skor** | Server | Batas minimal skor yang dianggap manusia, umumnya mulai dari 0.5 |
| **Token** | Dari browser ke server | Bukti sekali pakai dari Google bahwa aksi tersebut dinilai |

Key dibuat di <https://www.google.com/recaptcha/admin>. Pilih tipe **v3** dan daftarkan domain yang akan memakainya.

## 3. Alur kerja

```
Browser                          Server situs                    Google
  │ 1. muat skrip reCAPTCHA (site key)                             │
  │ 2. pengguna submit form → minta token (dengan action) ────────▶│
  │ ◀────────────────── token (berlaku ±2 menit, sekali pakai) ────│
  │ 3. kirim form + token ──▶│                                     │
  │                          │ 4. kirim secret + token ───────────▶│
  │                          │ ◀── success, score, action,         │
  │                          │     hostname ───────────────────────│
  │                          │ 5. putuskan: lolos / tolak / tantang│
  │ ◀──────── hasil ─────────│                                     │
```

Tiga aturan utama:

1. **Token dibuat saat aksi terjadi** (misalnya saat tombol submit ditekan), bukan saat halaman dibuka. Token kedaluwarsa dalam sekitar 2 menit.
2. **Token hanya bisa diverifikasi satu kali.** Tidak boleh disimpan atau dipakai ulang.
3. **Verifikasi selalu di server.** Pemeriksaan di browser bisa dimanipulasi.

## 4. Sisi browser (contoh)

```html
<script src="https://www.google.com/recaptcha/api.js?render=SITE_KEY"></script>
<script>
  async function submitForm() {
    const token = await grecaptcha.execute("SITE_KEY", { action: "contact_submit" });
    // kirim token bersama data form ke server
  }
</script>
```

Parameter `render=SITE_KEY` pada URL skrip yang menandakan mode v3. Panggil `execute` setiap kali form dikirim, jangan memakai token lama.

## 5. Sisi server (contoh)

Server meneruskan token ke Google:

```
POST https://www.google.com/recaptcha/api/siteverify
Content-Type: application/x-www-form-urlencoded

secret=SECRET_KEY&response=TOKEN_DARI_BROWSER
```

Contoh respons:

```json
{
  "success": true,
  "score": 0.9,
  "action": "contact_submit",
  "hostname": "contoh.com",
  "challenge_ts": "2026-10-02T10:00:00Z"
}
```

Server lalu memeriksa semuanya:

| Pemeriksaan | Tujuan |
|---|---|
| `success` bernilai `true` | Token sah, belum kedaluwarsa, belum dipakai |
| `action` sama dengan yang diharapkan | Token dari form lain tidak bisa dipakai di sini |
| `hostname` sesuai domain situs | Token dari situs lain ditolak |
| `score` ≥ ambang batas | Menyaring bot |

Bila salah satu gagal, permintaan ditolak. Bila secret key tidak ada atau Google tidak bisa dihubungi, sebaiknya **gagal tertutup** (permintaan ditolak), bukan dilewatkan.

## 6. Menentukan ambang skor

| Skor | Saran tindakan |
|---|---|
| 0.7 – 1.0 | Lolos |
| 0.5 – 0.7 | Lolos, tetapi dipantau atau dibatasi lajunya |
| Di bawah 0.5 | Tolak, atau minta verifikasi tambahan (OTP, email, atau fallback reCAPTCHA v2) |

Mulai dari **0.5**, lalu sesuaikan berdasarkan data nyata di konsol reCAPTCHA. Jangan menaikkan ambang terlalu agresif karena pengguna asli yang memakai VPN atau browser privat bisa mendapat skor rendah.

## 7. Kelebihan dan batasan

**Kelebihan**
- Tidak mengganggu pengguna, jadi konversi form lebih baik.
- Bisa dipasang di banyak aksi sekaligus (login, daftar, checkout) dengan action berbeda, sehingga ada gambaran traffic per aksi.
- Skor memberi fleksibilitas: tidak harus hitam-putih.

**Batasan**
- Bukan perlindungan tunggal. Bot yang canggih tetap bisa lolos, jadi tetap perlu rate limit, validasi input, dan monitoring.
- Skor bisa salah menilai pengguna asli (VPN, browser privat, perangkat baru).
- Mengirim data perilaku pengunjung ke Google, jadi perlu disebutkan di kebijakan privasi. Badge reCAPTCHA harus tetap tampil, atau beri teks atribusi Google di dekat form bila badge disembunyikan.
- Bergantung pada layanan Google. Sediakan fallback bila skrip gagal dimuat.

## 8. Kesalahan yang sering terjadi

| Gejala | Penyebab | Solusi |
|---|---|---|
| `Invalid key type` | Memakai key v2 untuk v3 atau sebaliknya | Buat key sesuai versinya |
| `Invalid domain for site key` | Domain belum didaftarkan | Tambahkan domain di konsol reCAPTCHA |
| `timeout-or-duplicate` | Token kedaluwarsa atau dipakai dua kali | Buat token baru setiap submit |
| Action tidak cocok | Nama action di browser dan server berbeda | Samakan |
| Skor rendah terus | VPN, browser privat, traffic lokal | Longgarkan ambang atau beri fallback |

## 9. Checklist

- [ ] Buat key tipe v3 dan daftarkan domain
- [ ] Simpan secret key hanya di server
- [ ] Minta token saat aksi terjadi, bukan saat halaman dibuka
- [ ] Verifikasi di server: `success`, `action`, `hostname`, `score`
- [ ] Tentukan ambang skor dan tindakan untuk skor rendah
- [ ] Gagal tertutup bila verifikasi tidak bisa dilakukan
- [ ] Tambahkan rate limit sebagai lapisan lain
- [ ] Cantumkan di kebijakan privasi dan tampilkan atribusi Google
