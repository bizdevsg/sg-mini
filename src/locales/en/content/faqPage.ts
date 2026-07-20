import type { AppMessages } from "../../shared/messages";

export const enFaqPage: AppMessages["faqPage"] = {
  title: "FAQ",
  description:
    "Frequently asked questions about accounts, transactions, and services at PT. Solid Gold Berjangka.",
  breadcrumb: "FAQ",
  hero: {
    eyebrow: "Help Center",
    title: "Frequently Asked Questions",
    description:
      "This page summarizes common questions so visitors can find essential information faster and with less friction.",
  },
  sections: [
    {
      title: "Account & Registration",
      description:
        "Basic guidance for account opening and document verification.",
      items: [
        {
          question: "How do I open an account with PT. Solid Gold Berjangka?",
          answer:
            "You can start from the registration page on the website, then complete your identity details, contact information, and supporting documents required for verification.",
        },
        {
          question: "Does account opening require document verification?",
          answer:
            "Yes. Document verification is required to ensure client data matches internal procedures and applicable regulations.",
        },
        {
          question: "How long does account verification usually take?",
          answer:
            "Verification time depends on the completeness of the submitted documents. When all data is complete and valid, the process is typically faster.",
        },
      ],
    },
    {
      title: "Transactions & Funds",
      description:
        "Core answers about fund transfers, segregated accounts, and transaction processing.",
      items: [
        {
          question: "Where should transaction funds be transferred?",
          answer:
            "All transaction fund transfers must be made only to official Segregated Accounts under PT. Solid Gold Berjangka. Always verify official instructions before transferring funds.",
        },
        {
          question: "Can I submit deposit and withdrawal requests at any time?",
          answer:
            "Requests may be submitted through available channels, but processing still follows operational hours and the applicable verification procedures.",
        },
        {
          question: "How can I confirm that transfer instructions are valid?",
          answer:
            "Please verify through official company channels such as office phone numbers, official email addresses, or the support team listed on the website.",
        },
      ],
    },
    {
      title: "Service & Information",
      description:
        "Quick pointers for contacting support and finding additional company information.",
      items: [
        {
          question: "Where should I report a complaint?",
          answer:
            "You can use the official complaint channels listed on the Contact Us page, including the form, email, or complaint support number.",
        },
        {
          question: "Where can I find the latest company information?",
          answer:
            "The latest updates are available through the Information page, News page, and other official PT. Solid Gold Berjangka channels.",
        },
        {
          question: "Does this website provide trading recommendations?",
          answer:
            "The information on this website is provided for educational and reference purposes. Every trading decision remains the client's own responsibility.",
        },
      ],
    },
  ],
  helpCard: {
    title: "Need more help?",
    description:
      "If the answer you need is not listed here, continue to the contact page and reach our team through official channels.",
    primaryCta: "Contact Us",
    secondaryCta: "View Information",
  },
};
