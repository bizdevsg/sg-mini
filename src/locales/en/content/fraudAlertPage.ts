import type { AppMessages } from "../../shared/messages";

export const enFraudAlertPage: AppMessages["fraudAlertPage"] = {
    title: "Fraud Alert",
    description:
      "A short guide to recognize fraud attempts using the Solid Gold Berjangka name and the safest verification steps to take.",
    breadcrumb: "Fraud Alert",
    hero: {
      eyebrow: "Client Safety",
      title: "Recognize fraud patterns before you respond.",
      description:
        "Use this page as a practical reminder to verify who is contacting you, which links are being shared, and whether any transaction instruction is actually legitimate.",
    },
    alertBoxTitle:
      "Do not immediately trust accounts, phone numbers, or links that have not been verified.",
    alertBoxBody:
      "Fraudsters often imitate company names, staff identities, and official-looking messages to push rushed decisions. Take time to inspect the details first.",
    redFlagsTitle: "Warning signs to watch for",
    redFlags: [
      "Requests to transfer funds to a personal bank account or to an account outside the official company name.",
      "Promises of guaranteed profit, instant bonuses, or risk-free trading results.",
      "Pressure to deposit immediately, share personal data, or click a link right away.",
      "Files, apps, or login links sent from unofficial domains or suspicious social media accounts.",
      "Staff identities that are inconsistent, hard to verify, or keep changing during the conversation.",
    ],
    verificationTitle: "Safe verification steps",
    verificationSteps: [
      "Recheck the website address, email domain, and social media account before following any instruction.",
      "Confirm phone numbers, account details, or promotional claims through official company channels you already know.",
      "Never share passwords, PINs, OTPs, verification codes, or device access with anyone else.",
      "Make sure payment instructions point only to official company accounts and never to personal accounts.",
      "If anything feels slightly unclear, stop the process and verify again first.",
    ],
    responseTitle: "If you have already been contacted or redirected",
    responseSteps: [
      "Stop the conversation and do not continue with transfers, logins, or additional document sharing.",
      "Save evidence such as chat screenshots, sender numbers, email addresses, links, and transfer receipts if any.",
      "Change relevant passwords immediately if you already shared login details or opened a suspicious link.",
      "Contact your bank or payment provider right away if any transaction has already happened.",
      "Report the incident through official support channels so it can be reviewed further.",
    ],
    reminderTitle: "Remember",
    reminderBody:
      "Official representatives should never ask for your password, PIN, OTP, or a transfer to a personal account.",
    primaryCta: "Back to Home",
    secondaryCta: "Learn About the Company",
  };
