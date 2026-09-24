"use client";

import { useEffect, useRef, useState } from "react";

import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { PrivacyPolicyRecord } from "@/lib/privacy-policy";
import { getMessages, type AppLocale } from "@/locales";
import { PageHeroBanner } from "./PageHeroBanner";

type PrivacyPolicyPageProps = {
  privacyPolicy: PrivacyPolicyRecord;
  locale: AppLocale;
  messages: ReturnType<typeof getMessages>;
};

type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const proseClasses = [
  "text-[15px] leading-7 text-zinc-300 sm:text-base sm:leading-8",
  "[&_h1]:mb-6 [&_h1]:mt-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-white sm:[&_h1]:text-3xl",
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:pt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-white sm:[&_h2]:text-xl",
  "[&_h2:first-child]:mt-0 [&_h2:first-child]:border-t-0 [&_h2:first-child]:pt-0",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-28 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-white sm:[&_h3]:text-lg",
  "[&_p]:mb-5 [&_p]:leading-7 [&_p]:text-zinc-300 sm:[&_p]:leading-8",
  "[&_p:first-of-type]:text-base [&_p:first-of-type]:leading-8 [&_p:first-of-type]:text-zinc-100 sm:[&_p:first-of-type]:text-lg sm:[&_p:first-of-type]:leading-9",
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-yellow-400/70",
  "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:marker:font-medium [&_ol]:marker:text-yellow-400/85",
  "[&_li]:leading-7 [&_li]:text-zinc-300 sm:[&_li]:leading-8",
  "[&_li>ul]:mt-2 [&_li>ol]:mt-2",
  "[&_blockquote]:mb-5 [&_blockquote]:rounded-xl [&_blockquote]:border-l-2 [&_blockquote]:border-yellow-500/45 [&_blockquote]:bg-white/[0.03] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-zinc-200 [&_blockquote]:italic",
  "[&_a]:font-medium [&_a]:text-yellow-400 [&_a]:underline [&_a]:decoration-yellow-400/30 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:decoration-yellow-400/70",
  "[&_strong]:font-semibold [&_strong]:text-white",
  "[&_em]:italic",
  "[&_hr]:my-10 [&_hr]:h-px [&_hr]:border-0 [&_hr]:bg-linear-to-r [&_hr]:from-transparent [&_hr]:via-yellow-500/50 [&_hr]:to-transparent",
  "[&_table]:mb-6 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-sm sm:[&_table]:table",
  "[&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-zinc-300",
  "[&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white",
  "[&_img]:my-8 [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10",
].join(" ");

function PrivacyPolicyArticle({
  html,
  onThisPageLabel,
  readingTimeLabel,
}: {
  html: string;
  onThisPageLabel: string;
  readingTimeLabel: (minutes: number) => string;
}) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const stickyOffset = 128;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - stickyOffset;

    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
    setActiveId(id);
  };

  useEffect(() => {
    const container = articleRef.current;
    if (!container) return;

    const headings = Array.from(
      container.querySelectorAll<HTMLElement>("h2, h3"),
    );
    const used = new Set<string>();

    const items: TocItem[] = headings.map((heading) => {
      const base = slugify(heading.textContent || "") || "section";
      let id = base;
      let suffix = 1;

      while (used.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }

      used.add(id);
      heading.id = id;

      return {
        id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      };
    });

    setToc(items);
  }, [html]);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc]);

  const wordCount = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  const hasToc = toc.length > 2;

  return (
    <div
      className={
        hasToc ? "lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12" : ""
      }
    >
      {hasToc ? (
        <aside className="hidden self-start lg:block">
          <div className="sticky top-28">
            <div className="relative pl-4">
              <div
                className="absolute inset-y-0 left-0 w-px bg-white/10"
                aria-hidden
              />
              <div
                className="absolute left-0 top-0 w-px bg-yellow-400 transition-[height] duration-150 ease-out"
                style={{ height: `${progress}%` }}
                aria-hidden
              />
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                {onThisPageLabel}
              </p>
              <nav
                className="flex flex-col gap-0.5 text-sm"
                aria-label={onThisPageLabel}
              >
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToHeading(item.id);
                    }}
                    className={[
                      "rounded-md px-2 py-1.5 leading-snug transition-colors",
                      item.level === 3 ? "ml-3 text-[13px] text-zinc-500" : "",
                      activeId === item.id
                        ? "bg-yellow-500/10 text-yellow-300"
                        : "text-zinc-400 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      ) : null}

      <div>
        <p className="mb-6 text-xs text-zinc-500">{readingTimeLabel(minutes)}</p>
        <div
          ref={articleRef}
          className={proseClasses}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export function PrivacyPolicyPage({
  privacyPolicy,
  locale,
  messages,
}: PrivacyPolicyPageProps) {
  const page = messages.privacyPolicyPage;
  const onThisPageLabel = locale === "id" ? "Di halaman ini" : "On this page";
  const readingTimeLabel = (minutes: number) =>
    locale === "id" ? `${minutes} menit baca` : `${minutes} min read`;

  return (
    <main>
      <PageHeroBanner
        locale={locale}
        homeLabel={messages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        backgroundImageUrl="/assets/kebijakan-privasi.webp"
        breadcrumbs={[
          {
            label: page.breadcrumb,
            tone: "current",
          },
        ]}
      />

      <section id="privacy-policy-content" className="relative">
        <div className="w-full h-100 absolute bg-linear-to-b from-black to-transparent" />
        <ScrollReveal effect="fade-up" delay={80}>
          <div className="relative mx-auto max-w-8xl overflow-hidden rounded-[28px] p-6 sm:p-8 md:p-10 lg:p-12">
            {privacyPolicy.content ? (
              <div>
                <PrivacyPolicyArticle
                  html={privacyPolicy.content}
                  onThisPageLabel={onThisPageLabel}
                  readingTimeLabel={readingTimeLabel}
                />
              </div>
            ) : (
              <div className="py-8 text-center">
                <h3 className="text-xl font-semibold text-white">
                  {page.content.emptyTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                  {page.content.emptyBody}
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
