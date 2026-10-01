"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";

const ClientAreaProfileContext = createContext<ClientAreaSessionProfile | null>(
  null,
);

type ClientAreaProfileProviderProps = {
  children: ReactNode;
  profile: ClientAreaSessionProfile;
};

/**
 * Hands the server-resolved session profile (name, email, account number) to
 * client components such as the account page header, so they do not have to be
 * passed it through every view.
 */
export function ClientAreaProfileProvider({
  children,
  profile,
}: ClientAreaProfileProviderProps) {
  return (
    <ClientAreaProfileContext.Provider value={profile}>
      {children}
    </ClientAreaProfileContext.Provider>
  );
}

export function useClientAreaProfile() {
  const profile = useContext(ClientAreaProfileContext);

  if (profile === null) {
    throw new Error(
      "useClientAreaProfile must be used within ClientAreaProfileProvider",
    );
  }

  return profile;
}
