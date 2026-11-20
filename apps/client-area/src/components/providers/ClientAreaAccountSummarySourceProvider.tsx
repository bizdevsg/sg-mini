"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AccountSummarySource } from "@/lib/account-summary-source";

const ClientAreaAccountSummarySourceContext =
  createContext<AccountSummarySource | null>(null);

type ClientAreaAccountSummarySourceProviderProps = {
  children: ReactNode;
  source: AccountSummarySource;
};

/** Hands the server-side ACCOUNT_SUMMARY_SOURCE setting to client hooks. */
export function ClientAreaAccountSummarySourceProvider({
  children,
  source,
}: ClientAreaAccountSummarySourceProviderProps) {
  return (
    <ClientAreaAccountSummarySourceContext.Provider value={source}>
      {children}
    </ClientAreaAccountSummarySourceContext.Provider>
  );
}

export function useAccountSummarySource() {
  const source = useContext(ClientAreaAccountSummarySourceContext);

  if (source === null) {
    throw new Error(
      "useAccountSummarySource must be used within ClientAreaAccountSummarySourceProvider",
    );
  }

  return source;
}
