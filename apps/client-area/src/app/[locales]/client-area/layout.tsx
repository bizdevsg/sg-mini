import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { PageTemplate } from "@/components/layouts/PageTemplate";
import { ClientAreaAccountModeProvider } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaSessionTimeout } from "@/components/providers/ClientAreaSessionTimeout";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  resolveClientAreaAccountMode,
} from "@/lib/client-area-account-mode";
import { getClientAreaSessionState } from "@/lib/client-area-auth";
import { isClientAreaEnabled } from "@/lib/client-area-config";
import { getMessages, isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaLayoutProps = {
  children: ReactNode;
  params: Promise<{ locales: string }>;
};

export const dynamic = "force-dynamic";

export default async function ClientAreaLayout({
  children,
  params,
}: ClientAreaLayoutProps) {
  if (!(await isClientAreaEnabled())) {
    notFound();
  }

  const { locales } = await params;

  const cookieStore = await cookies();
  const initialAccountMode = resolveClientAreaAccountMode(
    cookieStore.get(CLIENT_AREA_ACCOUNT_MODE_COOKIE)?.value,
  );
  const session = await getClientAreaSessionState();

  if (!isSupportedLocale(locales)) {
    return (
      <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
        {children}
      </ClientAreaAccountModeProvider>
    );
  }

  const locale: AppLocale = locales;
  const { viewOnlyDisclaimer } = getMessages(locale).clientArea;

  const disclaimer = (
    <aside
      aria-label={viewOnlyDisclaimer.label}
      className="shrink-0 border-t border-amber-500/20 bg-zinc-950 py-5 text-white/60"
    >
      <SectionContainer>
        <p className="text-center text-xs leading-relaxed sm:text-sm">
          <span className="font-semibold text-amber-500">
            {viewOnlyDisclaimer.label}
          </span>{" "}
          {viewOnlyDisclaimer.body}
        </p>
      </SectionContainer>
    </aside>
  );

  if (!session.isAuthenticated || !session.profile) {
    return (
      <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
        <div className="flex min-h-dvh flex-col bg-black">
          <div className="flex min-h-0 flex-1">{children}</div>
          {disclaimer}
        </div>
      </ClientAreaAccountModeProvider>
    );
  }

  return (
    <PageTemplate locale={locale} profile={session.profile}>
      <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
        <ClientAreaSessionTimeout locale={locale} />
        {children}
        {disclaimer}
      </ClientAreaAccountModeProvider>
    </PageTemplate>
  );
}
