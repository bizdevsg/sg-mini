"use client";

import "@/lib/fontawesome";

type FontAwesomeProviderProps = {
  children: React.ReactNode;
};

export function FontAwesomeProvider({
  children,
}: FontAwesomeProviderProps) {
  return <>{children}</>;
}
