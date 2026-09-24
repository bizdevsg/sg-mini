import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@/locales";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildRedirectHref(
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }

      continue;
    }

    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const query = params.toString();

  const loginPath = `/${DEFAULT_LOCALE}/client-area/login`;

  return query ? `${loginPath}?${query}` : loginPath;
}

export default async function Home({ searchParams }: HomePageProps) {
  redirect(buildRedirectHref(searchParams ? await searchParams : undefined));
}
