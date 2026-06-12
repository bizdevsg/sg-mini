import type { AppMessages } from "../../shared/messages";

export const idFraudAlertPage: AppMessages["fraudAlertPage"] = {
    title: "Waspada Penipuan",
    description:
      "Panduan singkat untuk mengenali modus penipuan yang mengatasnamakan Solid Gold Berjangka dan langkah verifikasi yang aman.",
    breadcrumb: "Waspada Penipuan",
    hero: {
      eyebrow: "Keamanan Nasabah",
      title: "Kenali modus penipuan sebelum Anda merespons.",
      description:
        "Gunakan halaman ini sebagai pengingat singkat untuk memeriksa identitas pihak yang menghubungi Anda, tautan yang dibagikan, dan instruksi transaksi yang diberikan.",
    },
    alertBoxTitle:
      "Jangan langsung percaya pada akun, nomor, atau tautan yang belum terverifikasi.",
    alertBoxBody:
      "Pelaku penipuan biasanya meniru nama perusahaan, staf, atau tampilan komunikasi resmi untuk mendorong keputusan yang terburu-buru. Luangkan waktu untuk memeriksa detailnya terlebih dahulu.",
    redFlagsTitle: "Tanda-tanda yang perlu dicurigai",
    redFlags: [
      "Meminta transfer dana ke rekening pribadi atau rekening di luar nama perusahaan resmi.",
      "Menjanjikan profit pasti, bonus instan, atau hasil trading tanpa risiko.",
      "Menekan Anda untuk segera deposit, membagikan data pribadi, atau mengklik tautan tertentu saat itu juga.",
      "Mengirim file, aplikasi, atau link login dari domain dan akun media sosial yang tidak resmi.",
      "Menggunakan identitas staf yang tidak konsisten, sulit diverifikasi, atau berubah-ubah selama percakapan.",
    ],
    verificationTitle: "Langkah verifikasi yang aman",
    verificationSteps: [
      "Periksa kembali alamat website, domain email, dan akun media sosial sebelum mengikuti instruksi apa pun.",
      "Konfirmasi nomor telepon, akun, atau informasi promo melalui kanal resmi perusahaan yang sudah Anda kenal.",
      "Jangan pernah membagikan password, PIN, OTP, kode verifikasi, atau akses perangkat kepada pihak lain.",
      "Pastikan instruksi pembayaran hanya mengarah ke rekening resmi perusahaan dan bukan rekening pribadi.",
      "Jika ada keraguan kecil sekalipun, hentikan proses dan verifikasi ulang terlebih dahulu.",
    ],
    responseTitle: "Jika Anda terlanjur dihubungi atau diarahkan",
    responseSteps: [
      "Hentikan komunikasi dan jangan lanjutkan transfer, login, atau pengiriman dokumen tambahan.",
      "Simpan bukti seperti screenshot chat, nomor pengirim, email, tautan, dan bukti transfer bila ada.",
      "Segera ubah password akun terkait jika Anda sempat membagikan data login atau mengakses tautan mencurigakan.",
      "Hubungi bank atau penyedia pembayaran Anda bila sudah terjadi transaksi untuk meminta langkah penanganan secepatnya.",
      "Laporkan kejadian tersebut ke kanal dukungan resmi agar bisa ditinjau lebih lanjut.",
    ],
    reminderTitle: "Ingat",
    reminderBody:
      "Pihak resmi tidak akan meminta password, PIN, OTP, atau transfer dana ke rekening pribadi atas nama staf mana pun.",
    primaryCta: "Kembali ke Beranda",
    secondaryCta: "Pelajari Perusahaan",
  };
