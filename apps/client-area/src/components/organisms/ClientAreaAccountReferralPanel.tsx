"use client";

import { ClientAreaBackLink } from "@/components/molecules/ClientAreaBackLink";
import { ClientAreaReferralCtaCard } from "@/components/molecules/ClientAreaReferralCtaCard";
import { ClientAreaReferralHeroCard } from "@/components/molecules/ClientAreaReferralHeroCard";
import { ClientAreaReferralStepsCard } from "@/components/molecules/ClientAreaReferralStepsCard";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountReferralPanelProps = {
  locale: AppLocale;
};

export function ClientAreaAccountReferralPanel({
  locale,
}: ClientAreaAccountReferralPanelProps) {
  const { clientArea } = getMessages(locale);
  const accountHref = resolveLocalizedHref(locale, "/client-area/account");
  const registerHref = resolveLocalizedHref(locale, "/aplikasi-solid-gold");
  const referralPage = clientArea.referralPage;

  return (
    <div className="space-y-5">
      <ClientAreaBackLink
        href={accountHref}
        label={clientArea.accountPage.backLabel}
      />

      <ClientAreaReferralHeroCard
        eyebrow={referralPage.hero.eyebrow}
        title={referralPage.hero.title}
        description={referralPage.hero.description}
        brandAlt={referralPage.hero.brandAlt}
        visualAlt={referralPage.hero.visualAlt}
      />

      <ClientAreaReferralStepsCard
        title={referralPage.stepsTitle}
        steps={referralPage.steps}
      />

      <ClientAreaReferralCtaCard
        ctaHref={registerHref}
        ctaLabel={referralPage.hero.cta}
        description={referralPage.closing}
      />
    </div>
  );
}
