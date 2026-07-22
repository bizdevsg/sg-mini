import type { AppMessages } from "../../shared/messages";

export const idContactPage: AppMessages["contactPage"] = {
    title: "Hubungi Kami",
    description:
      "Halaman kontak PT. Solid Gold Berjangka dengan form pesan, peta kantor pusat, dan informasi customer support resmi.",
    breadcrumb: "Hubungi Kami",
    breadcrumbs: {
      supportCenter: "Pusat Dukungan",
    },
    complaintLinks: {
      onlineComplaint: "Pengaduan Online",
      emailComplaint: "Penyampaian Keluhan Online",
    },
    hero: {
      eyebrow: "Kontak Resmi",
      title: "HUBUNGI KAMI",
      description:
        "PT. Solid Gold Berjangka hadir di Jakarta dan beberapa kota operasional lain di Indonesia.",
    },
    overview: {
      eyebrow: "Kontak Utama",
      title: "Informasi Kontak Resmi",
      description:
        "Gunakan detail berikut untuk menghubungi kantor pusat, membuka peta lokasi, atau menyampaikan pengaduan melalui kanal resmi.",
      companyLabel: "Perusahaan",
      addressLabel: "Alamat",
      updatedLabel: "Terakhir diperbarui",
    },
    form: {
      title: "Kirimkan Pesan Anda",
      description:
        "Isi data singkat Anda. Pesan akan langsung dikirim ke sistem kontak resmi PT. Solid Gold Berjangka.",
      nameLabel: "Nama",
      namePlaceholder: "Nama lengkap Anda",
      emailLabel: "Email",
      emailPlaceholder: "nama@email.com",
      phoneLabel: "No. Handphone",
      phonePlaceholder: "08xxxxxxxxxx",
      subjectLabel: "Subjek",
      subjectPlaceholder: "Contoh: Pertanyaan pembukaan akun",
      messageLabel: "Pesan",
      messagePlaceholder:
        "Tuliskan kebutuhan, pertanyaan, atau kendala Anda secara singkat.",
      captchaLabel: "CAPTCHA",
      captchaAction: "Refresh",
      submit: "Kirim Pesan",
      submitting: "Mengirim...",
      helper:
        "Untuk respons lebih cepat, Anda juga bisa langsung menghubungi customer support di samping.",
      success: "Pesan Anda berhasil dikirim.",
      successReportLabel: "ID Laporan",
      error: "Pesan gagal dikirim. Silakan coba lagi.",
    },
    headOffice: {
      title: "Kantor Pusat SGB",
      address:
        "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
      email: "berjangka@solidgold.co.id",
      phone: "021-29675088",
      phoneHref: "tel:02129675088",
      fax: "021-29675089",
      complaintPhone: "021-29675088 ext. 116",
      complaintPhoneHref: "tel:02129675088",
    },
    map: {
      title: "Peta Kantor Pusat",
      description:
        "Lokasi kantor pusat PT. Solid Gold Berjangka di Jakarta dapat langsung dibuka melalui peta berikut.",
      iframeTitle: "Peta kantor pusat PT. Solid Gold Berjangka",
      directionsCta: "Buka Petunjuk Arah",
      directionsUrl:
        "https://www.google.com/maps/search/?api=1&query=TCC%20Batavia%20Tower%20One%20Lt.%2010%20Jl.%20K.H.%20Mas%20Mansyur%20Kav.%20126%20Jakarta%20Pusat%2010220",
    },
    support: {
      title: "Customer Support",
      description:
        "Pilih kanal kontak resmi sesuai kebutuhan Anda, mulai dari pertanyaan umum sampai unit pengaduan.",
      callTitle: "Telepon",
      callDescription: "Jalur telepon utama kantor pusat.",
      emailTitle: "Email",
      emailDescription: "Alamat email resmi untuk pertanyaan umum.",
      complaintTitle: "Unit Pengaduan",
      complaintDescription: "Gunakan ext. 116 untuk kebutuhan pengaduan.",
      complaintValue: "Pengaduan Resmi",
      faxTitle: "Fax",
      faxDescription: "Kanal fax resmi perusahaan.",
    },
    offices: {
      title: "Kantor Cabang SGB",
      description:
        "Lokasi operasional PT. Solid Gold Berjangka yang ditampilkan mengikuti informasi kontak publik resmi perusahaan.",
      phoneLabel: "Telepon",
      emailLabel: "Email",
      faxLabel: "Fax",
      items: [
        {
          name: "Kantor Pusat Jakarta",
          address:
            "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
          phone: "021-29675088",
          phoneHref: "tel:02129675088",
          email: "berjangka@solidgold.co.id",
          fax: "021-29675089",
        },
        {
          name: "Kantor Semarang",
          address:
            "Gedung Menara SUARA MERDEKA Lt. 3, Jl. Pandanaran No. 30 Semarang 50134",
          phone: "024-3583979, 024-3583980",
          phoneHref: "tel:0243583979",
        },
        {
          name: "Kantor Makassar",
          address:
            "Pettarani Business Center, Jl. AP. Pettarani Kav. E9, Kel. Tidung, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222",
        },
      ],
    },
  };
