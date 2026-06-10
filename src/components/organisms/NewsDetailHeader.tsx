"use client";

import { useEffect, useMemo, useState } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  formatLocaleArticleDateTime,
  type AppLocale,
} from "@/locales";

type NewsDetailHeaderProps = {
  locale: AppLocale;
  publishedAt: string;
  slug: string;
  title: string;
};

export function NewsDetailHeader({
  locale,
  publishedAt,
  slug,
  title,
}: NewsDetailHeaderProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setShareUrl(
      new URL(`/${locale}/news/${slug}`, window.location.origin).toString(),
    );
  }, [locale, slug]);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsCopied(false);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isCopied]);

  const shareLabels =
    locale === "id"
      ? {
          facebook: "Bagikan ke Facebook",
          x: "Bagikan ke X",
          whatsapp: "Bagikan ke WhatsApp",
          copy: "Salin link",
          copied: "Link tersalin",
        }
      : {
          facebook: "Share to Facebook",
          x: "Share to X",
          whatsapp: "Share to WhatsApp",
          copy: "Copy link",
          copied: "Link copied",
        };

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    return [
      {
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        label: shareLabels.facebook,
        icon: ["fab", "facebook-f"] as IconProp,
      },
      {
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        label: shareLabels.x,
        icon: ["fab", "x-twitter"] as IconProp,
      },
      {
        href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        label: shareLabels.whatsapp,
        icon: ["fab", "whatsapp"] as IconProp,
      },
    ];
  }, [shareLabels.facebook, shareLabels.whatsapp, shareLabels.x, shareUrl, title]);

  async function handleCopyLink() {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
    }
  }

  return (
    <header className="mt-8 space-y-4">
      <h1 className="mx-auto max-w-3xl text-center text-3xl font-bold leading-tight text-yellow-500 sm:text-4xl">
        {title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-center text-sm text-gray-400">
          {formatLocaleArticleDateTime(publishedAt, locale)}
        </span>
      </div>

      <div className="mx-auto h-1 w-30 rounded-full bg-yellow-500/50" />

      <div className="mx-auto flex w-fit items-center gap-3">
        {shareLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
          >
            <FontAwesomeIcon icon={item.icon} />
          </a>
        ))}

        <button
          type="button"
          aria-label={isCopied ? shareLabels.copied : shareLabels.copy}
          title={isCopied ? shareLabels.copied : shareLabels.copy}
          onClick={handleCopyLink}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
        >
          <FontAwesomeIcon
            icon={
              isCopied
                ? (["fas", "check"] as IconProp)
                : (["fas", "copy"] as IconProp)
            }
          />
        </button>
      </div>
    </header>
  );
}
