import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import { getMessages, type AppLocale } from "@/locales";

type NewsDetailBreadcrumbProps = {
  locale: AppLocale;
  newsLabel: string;
  newsHref?: string;
  title: string;
};

export function NewsDetailBreadcrumb({
  locale,
  newsLabel,
  newsHref,
  title,
}: NewsDetailBreadcrumbProps) {
  const homeLabel = getMessages(locale).app.homeLabel;

  return (
    <BreadcrumbTrail
      locale={locale}
      homeLabel={homeLabel}
      wrap={false}
      items={[
        {
          label: newsLabel,
          href: newsHref ?? `/${locale}/news`,
          tone: "accent",
        },
        {
          label: title,
          tone: "current",
          className: "line-clamp-1",
        },
      ]}
    />
  );
}
