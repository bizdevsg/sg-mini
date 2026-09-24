import type { AppMessages } from "../../shared/messages";

export const idSecurity: AppMessages["security"] = {
    title: "Keamanan dan Legalitas",
    subtitle:
      "Trading lebih aman dengan perlindungan dana nasabah, pengawasan regulator, dan sistem keamanan berstandar internasional.",
    cards: [
      {
        title: "Terpercaya & Diakui",
        body: "Platform teregulasi BAPPEBTI yang berhasil meraih berbagai penghargaan.",
        variant: "featured",
        image: {
          src: "/assets/aed38b4d-ca53-447c-8250-59a03a7ea4eb.png",
          alt: "Ilustrasi penghargaan dan pengawasan regulator",
          width: 900,
          height: 640,
        },
      },
      {
        title: "Rekening Terpisah & Penarikan Dana Cepat",
        body: "Deposit dan penarikan dana cepat dan mudah, dengan dana yang disimpan di rekening terpisah.",
        variant: "wallet",
        image: {
          src: "/assets/6b4283d4-5ae9-43be-94dc-25c845136019.png",
          alt: "Ilustrasi dompet untuk penyimpanan dana nasabah",
          width: 1000,
          height: 1000,
        },
      },
      {
        title: "Sistem Keamanan Berstandar Internasional",
        body: "Trading lebih aman di platform yang telah bersertifikasi ISO 27001.",
        variant: "lock",
        image: {
          src: "/assets/0be6b5d6-eeda-4236-92c9-a1e119e30523.png",
          alt: "Ilustrasi gembok untuk sistem keamanan",
          width: 1000,
          height: 1000,
        },
      },
    ],
  };
