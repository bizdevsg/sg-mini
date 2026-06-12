import { getCdnAssetUrl } from "@/lib/env";

import type { AppMessages } from "../../shared/messages";

export const enSecurity: AppMessages["security"] = {
    title: "Security and Legality",
    subtitle:
      "Trade more safely with segregated client funds, regulatory oversight, and internationally standardized security systems.",
    cards: [
      {
        title: "Trusted and Recognized",
        body: "A BAPPEBTI-regulated platform that has earned multiple industry awards.",
        variant: "featured",
        image: {
          src: getCdnAssetUrl("aed38b4d-ca53-447c-8250-59a03a7ea4eb.avif"),
          alt: "Illustration of awards and regulator oversight",
          width: 900,
          height: 640,
        },
      },
      {
        title: "Segregated Accounts and Fast Withdrawals",
        body: "Fast and easy deposits and withdrawals, with client funds stored in segregated accounts.",
        variant: "wallet",
        image: {
          src: getCdnAssetUrl("6b4283d4-5ae9-43be-94dc-25c845136019.png"),
          alt: "Wallet illustration for client fund storage",
          width: 1000,
          height: 1000,
        },
      },
      {
        title: "International Standard Security System",
        body: "Trade more securely on a platform certified with ISO 27001.",
        variant: "lock",
        image: {
          src: getCdnAssetUrl("0be6b5d6-eeda-4236-92c9-a1e119e30523.png"),
          alt: "Padlock illustration for security system",
          width: 1000,
          height: 1000,
        },
      },
    ],
  };
