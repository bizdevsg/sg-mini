"use client";

import { useClientAreaCustomerProfile } from "@/components/providers/ClientAreaProfileProvider";

/** Uses the single profile request owned by ClientAreaProfileProvider. */
export function useCustomerProfile() {
  return useClientAreaCustomerProfile();
}
