"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  CLIENT_AREA_ACCOUNT_MODE_COOKIE_MAX_AGE,
} from "@/lib/client-area-account-mode";

type ClientAreaAccountModeContextValue = {
  accountMode: AccountMode;
  setAccountMode: (mode: AccountMode) => void;
};

const ClientAreaAccountModeContext =
  createContext<ClientAreaAccountModeContextValue | null>(null);

function persistClientAreaAccountMode(accountMode: AccountMode) {
  const secureAttribute =
    window.location.protocol === "https:" ? "; secure" : "";

  document.cookie =
    `${CLIENT_AREA_ACCOUNT_MODE_COOKIE}=${accountMode}; ` +
    `path=/; max-age=${CLIENT_AREA_ACCOUNT_MODE_COOKIE_MAX_AGE}; ` +
    `samesite=lax${secureAttribute}`;
}

type ClientAreaAccountModeProviderProps = {
  children: ReactNode;
  initialAccountMode: AccountMode;
};

export function ClientAreaAccountModeProvider({
  children,
  initialAccountMode,
}: ClientAreaAccountModeProviderProps) {
  const [accountMode, setAccountMode] =
    useState<AccountMode>(initialAccountMode);

  useEffect(() => {
    persistClientAreaAccountMode(accountMode);
  }, [accountMode]);

  return (
    <ClientAreaAccountModeContext.Provider
      value={{ accountMode, setAccountMode }}
    >
      {children}
    </ClientAreaAccountModeContext.Provider>
  );
}

export function useClientAreaAccountMode() {
  const context = useContext(ClientAreaAccountModeContext);

  if (context === null) {
    throw new Error(
      "useClientAreaAccountMode must be used within ClientAreaAccountModeProvider",
    );
  }

  return context;
}
