import { getMessages, type AppLocale, type AppMessages } from "@/locales";
import { PageHeroBanner } from "./PageHeroBanner";

type ContactPageHeroProps = {
  locale: AppLocale;
  copy: AppMessages["contactPage"];
};

export function ContactPageHero({ locale, copy }: ContactPageHeroProps) {
  const homeLabel = getMessages(locale).app.homeLabel;

  return (
    <PageHeroBanner
      locale={locale}
      homeLabel={homeLabel}
      eyebrow={copy.hero.eyebrow}
      title={copy.hero.title}
      description={copy.hero.description}
      breadcrumbs={[
        {
          label: copy.breadcrumbs.supportCenter,
          tone: "default",
        },
        {
          label: copy.breadcrumb,
          tone: "current",
        },
      ]}
    />
  );
}
