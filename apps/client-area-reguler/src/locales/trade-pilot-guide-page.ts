import type { AppLocale } from "./config";

export type TradePilotGuideCategoryId =
  | "getting-started"
  | "analysis-manual"
  | "glossary"
  | "data-privacy"
  | "psychology";

export type TradePilotGuideArticle = {
  categoryId: TradePilotGuideCategoryId;
  content: string[];
  id: string;
  readingTime: string;
  summary: string;
  title: string;
};

export type TradePilotGuidePageContent = {
  allCategoriesLabel: string;
  articleCountLabel: string;
  articles: TradePilotGuideArticle[];
  backLabel: string;
  categoryCountLabel: string;
  categories: Array<{
    description: string;
    id: TradePilotGuideCategoryId;
    label: string;
  }>;
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  clearSearchLabel: string;
  eyebrow: string;
  featuredDescription: string;
  featuredLabel: string;
  learningNote: string;
  learningTitle: string;
  quickStartArticleIds: string[];
  readLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  title: string;
};

const idContent: TradePilotGuidePageContent = {
  allCategoriesLabel: "Semua",
  articleCountLabel: "materi panduan",
  backLabel: "Kembali ke pusat panduan",
  categoryCountLabel: "kategori",
  categories: [
    {
      id: "getting-started",
      label: "Mulai & Fitur",
      description: "Kenali alur utama dan fungsi setiap bagian Trade Pilot.",
    },
    {
      id: "analysis-manual",
      label: "Membaca Analisis",
      description: "Pahami bias, level harga, risiko, dan konteks pasar.",
    },
    {
      id: "glossary",
      label: "Glosarium",
      description: "Istilah trading yang sering muncul dalam hasil analisis.",
    },
    {
      id: "data-privacy",
      label: "Data & Privasi",
      description: "Cara data pasar dan informasi akun digunakan.",
    },
    {
      id: "psychology",
      label: "Psikologi & Disiplin",
      description: "Bangun proses pengambilan keputusan yang lebih sehat.",
    },
  ],
  description:
    "Pelajari fitur, cara membaca hasil analisis, dan prinsip manajemen risiko dalam satu pusat pengetahuan.",
  emptyDescription: "Coba kata kunci lain atau pilih kategori yang berbeda.",
  emptyTitle: "Panduan tidak ditemukan",
  clearSearchLabel: "Hapus pencarian",
  eyebrow: "PUSAT PENGETAHUAN TRADE PILOT",
  featuredDescription:
    "Mulai dari tiga materi inti untuk memahami alur Trade Pilot dengan cepat.",
  featuredLabel: "Mulai Cepat",
  learningNote:
    "Trade Pilot adalah alat bantu pengambilan keputusan, bukan instruksi transaksi atau jaminan hasil. Keputusan dan risiko tetap berada pada pengguna.",
  learningTitle: "Belajar membaca konteks, bukan sekadar mengikuti sinyal",
  quickStartArticleIds: [
    "alur-analisis",
    "membaca-output",
    "trading-plan-adaptif",
  ],
  readLabel: "Baca panduan",
  searchLabel: "Cari panduan",
  searchPlaceholder: "Cari fitur, istilah, atau topik...",
  title: "Panduan Trade Pilot",
  articles: [
    {
      id: "cara-kerja-analisis",
      categoryId: "getting-started",
      title: "Cara Kerja Analisis Trade Pilot",
      summary:
        "Memahami bagaimana indikator teknikal, harga, dan konteks fundamental dirangkum.",
      readingTime: "3 menit",
      content: [
        "Trade Pilot membaca beberapa kelompok indikator teknikal dan menggabungkannya dengan kondisi harga serta konteks fundamental yang tersedia.",
        "Hasilnya disusun menjadi bias arah, tingkat keyakinan, skenario level, dan catatan risiko. Gunakan hasil ini sebagai bahan pertimbangan, bukan keputusan otomatis.",
      ],
    },
    {
      id: "fitur-trade-pilot",
      categoryId: "getting-started",
      title: "Mengenal Setiap Fitur",
      summary:
        "Ringkasan fungsi Analisis, Riwayat Performa, dan Panduan.",
      readingTime: "2 menit",
      content: [
        "Halaman Analisis membantu membaca kondisi instrumen dan timeframe pilihan. Riwayat Performa menampilkan hasil setup sebelumnya secara terukur.",
        "Panduan menjelaskan istilah dan cara penggunaan agar setiap angka memiliki konteks yang jelas.",
      ],
    },
    {
      id: "riwayat-performa",
      categoryId: "getting-started",
      title: "Menggunakan Riwayat Performa",
      summary:
        "Pelajari cara membaca sampel, win rate, completion, SL, dan TP.",
      readingTime: "4 menit",
      content: [
        "Riwayat Performa membantu mengevaluasi setup berdasarkan instrumen dan timeframe, bukan menilai satu hasil secara terpisah.",
        "Perhatikan jumlah sampel sebelum menarik kesimpulan. Persentase dari sampel kecil belum cukup untuk menggambarkan konsistensi.",
      ],
    },
    {
      id: "membaca-output",
      categoryId: "getting-started",
      title: "Membaca Hasil Analisis",
      summary:
        "Urutan praktis membaca bias, harga, keyakinan, risiko, dan skenario.",
      readingTime: "4 menit",
      content: [
        "Mulai dari instrumen dan timeframe, lalu baca bias arah serta tingkat keyakinannya. Setelah itu, periksa alasan teknikal dan konteks fundamental.",
        "Terakhir, bandingkan level entry, stop loss, take profit, serta rasio risiko sebelum mempertimbangkan sebuah skenario.",
      ],
    },
    {
      id: "validitas-analisis",
      categoryId: "getting-started",
      title: "Keyakinan, Validitas, dan Invalidasi",
      summary:
        "Bedakan tingkat keyakinan analisis dengan masa berlaku sebuah setup.",
      readingTime: "3 menit",
      content: [
        "Keyakinan menunjukkan seberapa kuat faktor pendukung yang terbaca saat analisis dibuat. Nilai tinggi tidak menghilangkan risiko.",
        "Validitas menunjukkan apakah kondisi awal setup masih berlaku. Setup dapat menjadi invalid ketika harga atau waktu melewati batas yang ditentukan.",
      ],
    },
    {
      id: "alur-analisis",
      categoryId: "analysis-manual",
      title: "Dari Pemilihan Instrumen hingga Analisis",
      summary:
        "Alur lengkap memilih instrumen, timeframe, dan menjalankan analisis.",
      readingTime: "5 menit",
      content: [
        "Pilih instrumen yang ingin dipantau, tentukan timeframe sesuai horizon keputusan, lalu pastikan harga live telah diperbarui.",
        "Jalankan analisis dan baca hasil secara berurutan. Hindari mengganti timeframe hanya untuk mencari hasil yang sesuai harapan.",
      ],
    },
    {
      id: "bias-dan-keyakinan",
      categoryId: "analysis-manual",
      title: "Bias Arah dan Tingkat Keyakinan",
      summary:
        "Makna bullish, bearish, netral, dan kekuatan konfluensi indikator.",
      readingTime: "4 menit",
      content: [
        "Bias arah menggambarkan kecenderungan kondisi pasar pada timeframe yang dianalisis. Netral berarti bukti belum cukup dominan ke satu sisi.",
        "Tingkat keyakinan berasal dari keselarasan faktor pendukung, bukan peluang pasti bahwa harga akan bergerak sesuai bias.",
      ],
    },
    {
      id: "level-dan-chart",
      categoryId: "analysis-manual",
      title: "Entry, Stop Loss, Take Profit, dan Chart",
      summary:
        "Cara menempatkan level skenario dalam konteks struktur harga.",
      readingTime: "5 menit",
      content: [
        "Entry adalah area aktivasi skenario, sedangkan stop loss menunjukkan batas ketika asumsi awal tidak lagi layak dipertahankan.",
        "Take profit adalah target bertahap. Selalu cek posisi level pada chart dan jangan memindahkan stop hanya untuk menghindari kerugian yang sudah direncanakan.",
      ],
    },
    {
      id: "bandingkan-risiko",
      categoryId: "analysis-manual",
      title: "Membandingkan Risiko Antar-Timeframe",
      summary:
        "Gunakan timeframe pembanding tanpa mencampur horizon keputusan.",
      readingTime: "3 menit",
      content: [
        "Timeframe yang lebih besar memberi konteks tren, sedangkan timeframe lebih kecil membantu melihat detail pergerakan.",
        "Perbandingan berguna untuk mengidentifikasi konflik arah, tetapi rencana utama tetap harus berangkat dari satu timeframe yang jelas.",
      ],
    },
    {
      id: "teknikal-fundamental",
      categoryId: "analysis-manual",
      title: "Konteks Teknikal dan Fundamental",
      summary:
        "Menggabungkan struktur chart dengan berita dan kalender ekonomi.",
      readingTime: "4 menit",
      content: [
        "Indikator teknikal membaca perilaku harga, sementara berita dan kalender membantu menjelaskan risiko perubahan volatilitas.",
        "Ketika keduanya bertentangan atau ada agenda berdampak tinggi, kurangi keyakinan dan prioritaskan pengelolaan risiko.",
      ],
    },
    {
      id: "trading-plan-adaptif",
      categoryId: "analysis-manual",
      title: "Menggunakan Trading Plan Adaptif",
      summary:
        "Sesuaikan modal, batas rugi, tipe akun, dan profil risiko.",
      readingTime: "5 menit",
      content: [
        "Trading Plan Adaptif mensimulasikan kelayakan ukuran posisi terhadap modal dan batas rugi yang kamu masukkan.",
        "Jika ukuran minimum sudah melampaui batas risiko, hasil yang benar adalah menunggu. Jangan menaikkan batas rugi hanya agar sebuah posisi terlihat layak.",
      ],
    },
    {
      id: "istilah-trading",
      categoryId: "glossary",
      title: "Istilah Trading yang Sering Digunakan",
      summary:
        "Definisi ringkas bias, breakout, support, resistance, SL, TP, dan R:R.",
      readingTime: "6 menit",
      content: [
        "Support adalah area yang sebelumnya menahan penurunan, sedangkan resistance adalah area yang menahan kenaikan. Breakout atau breakdown menunjukkan harga melewati area tersebut.",
        "Risk-to-reward membandingkan potensi kerugian terhadap target keuntungan. Rasio yang baik tetap membutuhkan setup valid dan disiplin eksekusi.",
      ],
    },
    {
      id: "penggunaan-data",
      categoryId: "data-privacy",
      title: "Cara Data Digunakan",
      summary:
        "Pahami peran data harga, preferensi tampilan, dan informasi akun.",
      readingTime: "3 menit",
      content: [
        "Data harga digunakan untuk menampilkan kondisi pasar dan menyusun analisis. Preferensi antarmuka dapat digunakan untuk menjaga pengalaman yang konsisten.",
        "Jangan membagikan password, OTP, atau informasi keamanan akun kepada pihak lain. Tinjau kebijakan privasi resmi untuk penjelasan lengkap.",
      ],
    },
    {
      id: "fomo",
      categoryId: "psychology",
      title: "FOMO — Terlambat Mengejar Pergerakan",
      summary:
        "Mengenali dorongan masuk setelah harga bergerak jauh dari rencana.",
      readingTime: "3 menit",
      content: [
        "FOMO sering muncul ketika perhatian hanya tertuju pada potensi keuntungan dan mengabaikan jarak stop serta kualitas entry.",
        "Jika harga telah meninggalkan area rencana, melewatkan transaksi adalah keputusan yang valid.",
      ],
    },
    {
      id: "revenge-trading",
      categoryId: "psychology",
      title: "Revenge Trading — Memaksa Balik Modal",
      summary:
        "Menghentikan siklus keputusan impulsif setelah mengalami kerugian.",
      readingTime: "3 menit",
      content: [
        "Revenge trading membuat ukuran posisi atau frekuensi transaksi meningkat tanpa dasar analisis yang lebih baik.",
        "Gunakan jeda, batas rugi harian, dan jurnal keputusan sebelum kembali menilai pasar secara objektif.",
      ],
    },
    {
      id: "risk-first",
      categoryId: "psychology",
      title: "Risk First — Mulai dari Batas Kerugian",
      summary:
        "Menentukan risiko sebelum menghitung potensi keuntungan.",
      readingTime: "4 menit",
      content: [
        "Mulailah dari jumlah kerugian yang benar-benar dapat diterima, kemudian hitung ukuran posisi berdasarkan jarak stop.",
        "Tidak mengambil posisi adalah bagian dari manajemen risiko ketika parameter minimum tidak dapat dipenuhi.",
      ],
    },
    {
      id: "jurnal-dan-sabar",
      categoryId: "psychology",
      title: "Jurnal, Kesabaran, dan Konsistensi",
      summary:
        "Membangun umpan balik dari proses, bukan hanya hasil profit atau rugi.",
      readingTime: "4 menit",
      content: [
        "Catat alasan masuk, kondisi emosi, risiko, dan kepatuhan terhadap rencana. Jurnal yang konsisten menunjukkan pola yang sulit terlihat dari ingatan.",
        "Kesabaran bukan pasif. Menunggu setup yang sesuai adalah keputusan aktif untuk melindungi modal.",
      ],
    },
  ],
};

const enContent: TradePilotGuidePageContent = {
  ...idContent,
  allCategoriesLabel: "All",
  articleCountLabel: "guide articles",
  backLabel: "Back to guide center",
  categoryCountLabel: "categories",
  description:
    "Learn the features, how to read analysis results, and risk-management principles in one knowledge center.",
  emptyDescription: "Try another keyword or select a different category.",
  emptyTitle: "No guide found",
  clearSearchLabel: "Clear search",
  eyebrow: "TRADE PILOT KNOWLEDGE CENTER",
  featuredDescription:
    "Start with three essential guides to understand the Trade Pilot workflow quickly.",
  featuredLabel: "Quick Start",
  learningNote:
    "Trade Pilot is a decision-support tool, not a trade instruction or a guarantee of results. Decisions and risks remain with the user.",
  learningTitle: "Learn to read context, not simply follow signals",
  readLabel: "Read guide",
  searchLabel: "Search guides",
  searchPlaceholder: "Search features, terms, or topics...",
  title: "Trade Pilot Guide",
  categories: [
    {
      id: "getting-started",
      label: "Getting Started & Features",
      description: "Learn the main workflow and purpose of each Trade Pilot area.",
    },
    {
      id: "analysis-manual",
      label: "Reading the Analysis",
      description: "Understand bias, price levels, risk, and market context.",
    },
    {
      id: "glossary",
      label: "Glossary",
      description: "Trading terms commonly shown in analysis results.",
    },
    {
      id: "data-privacy",
      label: "Data & Privacy",
      description: "How market data and account information are used.",
    },
    {
      id: "psychology",
      label: "Psychology & Discipline",
      description: "Build a healthier decision-making process.",
    },
  ],
  articles: [
    {
      id: "cara-kerja-analisis",
      categoryId: "getting-started",
      title: "How Trade Pilot Analysis Works",
      summary:
        "Understand how technical indicators, prices, and fundamental context are summarized.",
      readingTime: "3 min read",
      content: [
        "Trade Pilot reads several groups of technical indicators and combines them with current price conditions and available fundamental context.",
        "The result is organized into directional bias, confidence, level scenarios, and risk notes. Use it as decision support, not as an automatic decision.",
      ],
    },
    {
      id: "fitur-trade-pilot",
      categoryId: "getting-started",
      title: "Understanding Every Feature",
      summary: "An overview of Analysis, Performance History, and Guide.",
      readingTime: "2 min read",
      content: [
        "Analysis helps you read the selected instrument and timeframe. Performance History presents previous setup outcomes in a measurable format.",
        "Guide explains the terms and workflows so every number has clear context.",
      ],
    },
    {
      id: "riwayat-performa",
      categoryId: "getting-started",
      title: "Using Performance History",
      summary: "Learn to read samples, win rate, completion, SL, and TP.",
      readingTime: "4 min read",
      content: [
        "Performance History helps evaluate setups by instrument and timeframe instead of judging one outcome in isolation.",
        "Always consider sample size before drawing conclusions. A percentage from a small sample does not yet show consistency.",
      ],
    },
    {
      id: "membaca-output",
      categoryId: "getting-started",
      title: "Reading an Analysis Result",
      summary:
        "A practical order for reading bias, price, confidence, risk, and scenarios.",
      readingTime: "4 min read",
      content: [
        "Start with the instrument and timeframe, then read the directional bias and confidence level. Continue with the technical rationale and fundamental context.",
        "Finally, compare entry, stop-loss, take-profit levels, and the risk ratio before considering a scenario.",
      ],
    },
    {
      id: "validitas-analisis",
      categoryId: "getting-started",
      title: "Confidence, Validity, and Invalidation",
      summary: "Separate analysis confidence from the lifetime of a setup.",
      readingTime: "3 min read",
      content: [
        "Confidence describes the strength of supporting factors when the analysis was created. High confidence never removes risk.",
        "Validity shows whether the initial setup conditions still hold. A setup may become invalid after price or time crosses its defined limit.",
      ],
    },
    {
      id: "alur-analisis",
      categoryId: "analysis-manual",
      title: "From Instrument Selection to Analysis",
      summary:
        "The complete workflow for selecting an instrument, timeframe, and running analysis.",
      readingTime: "5 min read",
      content: [
        "Choose the instrument you want to monitor, select a timeframe that matches your decision horizon, and make sure the live price has updated.",
        "Run the analysis and read it in order. Avoid switching timeframes only to find an answer that matches your expectations.",
      ],
    },
    {
      id: "bias-dan-keyakinan",
      categoryId: "analysis-manual",
      title: "Directional Bias and Confidence",
      summary:
        "What bullish, bearish, neutral, and indicator confluence mean.",
      readingTime: "4 min read",
      content: [
        "Directional bias describes the market tendency on the analyzed timeframe. Neutral means the evidence is not dominant enough on either side.",
        "Confidence comes from aligned supporting factors, not a certainty that price will move with the bias.",
      ],
    },
    {
      id: "level-dan-chart",
      categoryId: "analysis-manual",
      title: "Entry, Stop Loss, Take Profit, and Chart",
      summary: "Place scenario levels in the context of price structure.",
      readingTime: "5 min read",
      content: [
        "Entry is the scenario activation area, while stop loss marks where the original assumption is no longer worth holding.",
        "Take profits are staged targets. Check every level on the chart and do not move a stop simply to avoid a planned loss.",
      ],
    },
    {
      id: "bandingkan-risiko",
      categoryId: "analysis-manual",
      title: "Comparing Risk Across Timeframes",
      summary: "Use a comparison timeframe without mixing decision horizons.",
      readingTime: "3 min read",
      content: [
        "Larger timeframes provide trend context, while smaller timeframes reveal movement details.",
        "Comparison can expose directional conflict, but the primary plan should still be based on one clearly defined timeframe.",
      ],
    },
    {
      id: "teknikal-fundamental",
      categoryId: "analysis-manual",
      title: "Technical and Fundamental Context",
      summary: "Combine chart structure with news and the economic calendar.",
      readingTime: "4 min read",
      content: [
        "Technical indicators read price behavior, while news and the calendar help explain changing volatility risk.",
        "When they conflict or a high-impact event is near, reduce confidence and prioritize risk management.",
      ],
    },
    {
      id: "trading-plan-adaptif",
      categoryId: "analysis-manual",
      title: "Using the Adaptive Trading Plan",
      summary: "Adjust capital, loss limit, account type, and risk profile.",
      readingTime: "5 min read",
      content: [
        "The Adaptive Trading Plan simulates whether a position size fits the capital and loss limit you provide.",
        "If the minimum size already exceeds your risk limit, waiting is the correct result. Do not raise the limit only to make a position appear viable.",
      ],
    },
    {
      id: "istilah-trading",
      categoryId: "glossary",
      title: "Common Trading Terms",
      summary:
        "Short definitions for bias, breakout, support, resistance, SL, TP, and R:R.",
      readingTime: "6 min read",
      content: [
        "Support is an area that previously held a decline, while resistance held an advance. A breakout or breakdown means price moved through that area.",
        "Risk-to-reward compares potential loss with the profit target. A favorable ratio still requires a valid setup and disciplined execution.",
      ],
    },
    {
      id: "penggunaan-data",
      categoryId: "data-privacy",
      title: "How Data Is Used",
      summary:
        "Understand the role of price data, display preferences, and account information.",
      readingTime: "3 min read",
      content: [
        "Price data is used to display market conditions and create analysis. Interface preferences may be retained for a consistent experience.",
        "Never share passwords, OTPs, or account security details. Review the official privacy policy for the complete explanation.",
      ],
    },
    {
      id: "fomo",
      categoryId: "psychology",
      title: "FOMO — Chasing a Move Too Late",
      summary: "Recognize the urge to enter after price has moved far from the plan.",
      readingTime: "3 min read",
      content: [
        "FOMO often appears when attention is fixed on potential gains while stop distance and entry quality are ignored.",
        "If price has already left the planned area, skipping the trade is a valid decision.",
      ],
    },
    {
      id: "revenge-trading",
      categoryId: "psychology",
      title: "Revenge Trading — Trying to Win It Back",
      summary: "Stop the cycle of impulsive decisions after a loss.",
      readingTime: "3 min read",
      content: [
        "Revenge trading increases position size or trade frequency without improving the underlying analysis.",
        "Use a pause, a daily loss limit, and a decision journal before assessing the market objectively again.",
      ],
    },
    {
      id: "risk-first",
      categoryId: "psychology",
      title: "Risk First — Start with the Loss Limit",
      summary: "Define risk before calculating potential profit.",
      readingTime: "4 min read",
      content: [
        "Start with the loss you can genuinely accept, then calculate position size from the stop distance.",
        "Taking no position is part of risk management when the minimum parameters cannot be met.",
      ],
    },
    {
      id: "jurnal-dan-sabar",
      categoryId: "psychology",
      title: "Journaling, Patience, and Consistency",
      summary: "Build feedback from the process, not only profit or loss.",
      readingTime: "4 min read",
      content: [
        "Record the entry rationale, emotional state, risk, and adherence to the plan. A consistent journal reveals patterns that memory misses.",
        "Patience is not passive. Waiting for a suitable setup is an active decision to protect capital.",
      ],
    },
  ],
};

export function getTradePilotGuidePageContent(
  locale: AppLocale,
): TradePilotGuidePageContent {
  return locale === "en" ? enContent : idContent;
}
