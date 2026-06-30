import type { ReactNode } from "react";

type ClientAreaLayoutProps = {
  children: ReactNode;
};

export default function ClientAreaLayout({
  children,
}: ClientAreaLayoutProps) {
  return children;
}
