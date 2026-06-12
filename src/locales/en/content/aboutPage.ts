import type { AppMessages } from "../../shared/messages";

export const enAboutPage: AppMessages["aboutPage"] = {
    hero: {
      eyebrow: "About Solid Gold Berjangka",
      title:
        "A futures brokerage firm with a clear legal foundation and a long operating track record in Indonesia.",
      description:
        "This profile summarizes who we are, the company's direction, key achievements, and the legal foundation behind PT. Solid Gold Berjangka's operations.",
      facts: {
        foundedLabel: "Founded",
        foundedValue: "2002",
        focusLabel: "Primary Focus",
        focusValue: "Futures Trading",
        operationsLabel: "Operations",
        operationsValue: "Jakarta, Semarang, Makassar",
      },
    },
    companyProfile: {
      eyebrow: "Company Profile",
      logoAlt: "PT. Solid Gold Berjangka",
      title: "PT. Solid Gold Berjangka",
      paragraphs: [
        "Established in 2002, PT Solid Gold Berjangka (SGB) is a futures brokerage company registered with and supervised by BAPPEBTI. With more than two decades of experience, SGB has become one of the key players in Indonesia's commodity futures trading industry.",
        "SGB is a member of the Jakarta Futures Exchange (JFX) and Kliring Berjangka Indonesia (Persero), while continuing to expand its services through operational offices in Jakarta, Semarang, and Makassar.",
      ],
    },
    visiMisi: {
      eyebrow: "Company Direction",
      missionTitle: "Company Mission",
      visionTitle: "Company Vision",
      missionItems: [
        "To become a futures brokerage company with an international scale",
        "To become a market leader, both regionally and internationally",
      ],
      visionItems: [
        "To develop and advance futures trading in Indonesia so it can contribute positively to the national economy from both micro and macro perspectives",
        "To empower futures trading in Indonesia and help all parties who need it to use it as a hedging instrument",
      ],
      summary:
        "Through this vision and mission, PT. Solid Gold Berjangka strives to help advance futures trading in Indonesia and create a positive impact on the national economy from both macro and micro perspectives.",
    },
    awards: {
      eyebrow: "Achievements",
      title: "Awards",
      description:
        "A selection of recognitions that reflect the company's consistency in trading activity and contribution to the industry.",
      items: [
        {
          title: "KBI Award 2014",
          subtitle: "2nd Best Clearing Member",
          imageSrc:
            "https://cdn.pandalingua.my.id/sgb/assets/a4690a59-8cb5-40d0-a2bf-8ce723f1f926.avif",
          imageAlt: "2nd Best Clearing Member Award 2014",
        },
        {
          title: "JFX Award 2011",
          subtitle: "Highest Bilateral Transaction Volume",
          imageSrc:
            "https://cdn.pandalingua.my.id/sgb/assets/bbe0962d-abab-4ba7-90fc-2ee7434d1fdf.avif",
          imageAlt:
            "Award for the 2nd Highest Bilateral Transaction Volume in 2011",
        },
      ],
    },
    regulation: {
      eyebrow: "Legality",
      title: "Registered, supervised, and connected with",
      highlightedTitle: "official Indonesian institutions",
      description:
        "PT. Solid Gold Berjangka operates on the basis of official licenses and memberships with relevant regulators, exchanges, and clearing institutions.",
    },
  };
