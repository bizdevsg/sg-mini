import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { ClientAreaAccountModeProvider } from "@/components/providers/ClientAreaAccountModeProvider";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  resolveClientAreaAccountMode,
} from "@/lib/client-area-account-mode";

type ClientAreaLayoutProps = {
  children: ReactNode;
};

export default async function ClientAreaLayout({
  children,
}: ClientAreaLayoutProps) {
  const cookieStore = await cookies();
  const initialAccountMode = resolveClientAreaAccountMode(
    cookieStore.get(CLIENT_AREA_ACCOUNT_MODE_COOKIE)?.value,
  );

  return (
    <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
      {children}
    </ClientAreaAccountModeProvider>
  );
}
