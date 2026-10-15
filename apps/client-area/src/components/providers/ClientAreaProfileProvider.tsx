"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";
import { clientAreaFetch } from "@/lib/client-area-fetch";
import type { ClientAreaCustomerProfile } from "@/lib/client-area-profile.shared";

export type CustomerProfileState =
  | { status: "loading" }
  | { status: "ready"; profile: ClientAreaCustomerProfile }
  | { status: "unavailable" }
  | { status: "error" };

type ClientAreaProfileContextValue = {
  profile: ClientAreaSessionProfile;
  customerProfileState: CustomerProfileState;
  retryCustomerProfile: () => void;
};

const ClientAreaProfileContext =
  createContext<ClientAreaProfileContextValue | null>(null);

type ClientAreaProfileProviderProps = {
  children: ReactNode;
  profile: ClientAreaSessionProfile;
};

/**
 * Resolves the browser-safe customer profile once for the authenticated shell.
 * Topbar and account pages then share the same mapped data and token rotation.
 */
export function ClientAreaProfileProvider({
  children,
  profile: initialProfile,
}: ClientAreaProfileProviderProps) {
  const [attempt, setAttempt] = useState(0);
  const [profile, setProfile] =
    useState<ClientAreaSessionProfile>(initialProfile);
  const [customerProfileState, setCustomerProfileState] =
    useState<CustomerProfileState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setCustomerProfileState({ status: "loading" });

      try {
        const response = await clientAreaFetch("/api/client-area/profile", {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (response.status === 409 || response.status === 404) {
          setCustomerProfileState({ status: "unavailable" });
          return;
        }

        if (!response.ok) {
          setCustomerProfileState({ status: "error" });
          return;
        }

        const payload = (await response.json()) as {
          profile?: ClientAreaCustomerProfile;
        };
        const customerProfile = payload.profile;

        if (!customerProfile) {
          setCustomerProfileState({ status: "error" });
          return;
        }

        setProfile((current) => ({
          ...current,
          accountId: current.accountIds.real ?? customerProfile.accountId,
          displayName: customerProfile.displayName,
          email: customerProfile.email,
        }));
        setCustomerProfileState({ status: "ready", profile: customerProfile });
      } catch {
        if (!controller.signal.aborted) {
          setCustomerProfileState({ status: "error" });
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [attempt]);

  const retryCustomerProfile = useCallback(
    () => setAttempt((current) => current + 1),
    [],
  );

  return (
    <ClientAreaProfileContext.Provider
      value={{ profile, customerProfileState, retryCustomerProfile }}
    >
      {children}
    </ClientAreaProfileContext.Provider>
  );
}

export function useClientAreaProfile() {
  const context = useContext(ClientAreaProfileContext);

  if (context === null) {
    throw new Error(
      "useClientAreaProfile must be used within ClientAreaProfileProvider",
    );
  }

  return context.profile;
}

export function useClientAreaCustomerProfile() {
  const context = useContext(ClientAreaProfileContext);

  if (context === null) {
    throw new Error(
      "useClientAreaCustomerProfile must be used within ClientAreaProfileProvider",
    );
  }

  return {
    state: context.customerProfileState,
    retry: context.retryCustomerProfile,
  };
}
