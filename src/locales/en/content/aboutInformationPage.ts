import type { AppMessages } from "../../shared/messages";

export const enAboutInformationPage: AppMessages["aboutInformationPage"] = {
  breadcrumb: "Information",
  parentLabel: "About Us",
  hero: {
    eyebrow: "Company Information",
    title: "Information & Announcements",
    description:
      "This page brings together the company's core information and official announcement updates from PT. Solid Gold Berjangka in one place.",
    stats: [
      {
        label: "Founded",
        value: "2002",
      },
      {
        label: "Service Focus",
        value: "Futures Trading",
      },
      {
        label: "Office Coverage",
        value: "Jakarta, Semarang, Makassar",
      },
    ],
  },
  overview: {
    eyebrow: "Overview",
    title: "The key information to understand before exploring the company in more depth",
    description:
      "This page helps prospective clients, partners, and general visitors understand the company's profile quickly before moving on to more detailed pages.",
    cards: [
      {
        title: "Company Status",
        body: "PT. Solid Gold Berjangka is a futures brokerage company operating under legal standing and supervision from relevant regulators in Indonesia.",
      },
      {
        title: "Service Scope",
        body: "Its services focus on futures trading activities, basic market education, and access to information that supports client decision-making.",
      },
      {
        title: "Operational Approach",
        body: "The company emphasizes structured communication, responsive support teams, and consistent service information across official channels.",
      },
    ],
  },
  operations: {
    title: "Operational points that shape the service experience",
    items: [
      "Company information, educational material, and market updates are published through official channels managed by the company.",
      "Client assistance is centered on process clarity, product understanding, and measured service communication.",
      "Operational coverage continues to support client needs across major cities through offices and supporting teams.",
    ],
  },
  serviceInfo: {
    title: "Quick details",
    items: [
      {
        label: "Service type",
        value: "Futures brokerage and market information support",
      },
      {
        label: "Communication channels",
        value: "Official website, support team, and operational offices",
      },
      {
        label: "Service direction",
        value: "A structured, informative, and compliance-oriented approach",
      },
    ],
  },
  commitments: {
    title: "Commitments the company maintains",
    items: [
      "Keep company information clear, consistent, and easy to understand.",
      "Promote professional and responsible service interactions across every communication touchpoint.",
      "Support prospects and clients with relevant, official, and verifiable information.",
    ],
  },
};
