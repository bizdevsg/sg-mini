import type { GettingStartedPageContent } from "../../shared/getting-started-page";

export const enGettingStartedPageContent: GettingStartedPageContent = {
  meta: {
    title: "Getting Started with Trading",
    description: "A short guide to getting started with trading.",
  },
  breadcrumb: {
    education: "Education",
    current: "Getting Started",
  },
  hero: {
    eyebrow: "Beginner Guide",
    title: "Getting Started With Trading",
    description: "Learn the basics, practice on demo, then move to live when ready.",
    primaryCta: "Open Account",
    secondaryCta: "View Education",
    badges: ["Basics", "Demo", "Live"],
  },
  sections: {
    stepsEyebrow: "4 Stages",
    stepsTitle: "How To Start",
    stepsSubtitle: "Follow this simple sequence.",
    checklistEyebrow: "Checklist",
    checklistTitle: "Before You Begin",
    checklistSubtitle: "Make sure the basics are ready.",
    supportEyebrow: "Focus",
    supportTitle: "What To Keep In Mind",
    supportSubtitle: "Keep it simple and consistent.",
    ctaEyebrow: "Ready To Start",
    ctaTitle: "Start with demo, then move to live.",
    ctaDescription: "Build the right foundation first.",
    ctaPrimary: "Register Account",
    ctaSecondary: "Contact Us",
  },
  steps: [
    {
      title: "Learn the basics",
      description: "Understand how trading works and where the risk is.",
      bullets: [
        "Study lot size, margin, spread, stop loss, and take profit.",
        "Use risk management from the start.",
      ],
    },
    {
      title: "Open a demo account",
      description: "Practice before using real funds.",
      bullets: [
        "Prepare your email, phone number, and identity details.",
        "Practice entries, exits, and stop loss discipline.",
      ],
    },
    {
      title: "Use supporting tools",
      description: "Use platform features and analysis as support.",
      bullets: [
        "Get used to charts and order placement.",
        "Use signals as support.",
      ],
    },
    {
      title: "Move to live trading",
      description: "Start only when your process feels more disciplined.",
      bullets: [
        "Start with small position size.",
        "Review your trading results regularly.",
      ],
    },
  ],
  checklist: [
    "You understand the basics of trading.",
    "Your registration data is ready.",
    "You have tried a demo account.",
    "You already have a risk limit.",
  ],
  supportCards: [
    {
      title: "Do not rush",
      description: "Stay in demo until your trading process feels more stable.",
    },
    {
      title: "Focus on process",
      description: "Prioritize discipline, not just following signals.",
    },
  ],
};
