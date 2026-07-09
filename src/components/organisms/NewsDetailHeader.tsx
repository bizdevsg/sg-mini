"use client";

import { useEffect, useMemo, useState } from "react";
import {
  faFacebookF,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  formatLocaleArticleDateTime,
  getMessages,
  type AppLocale,
} from "@/locales";

type NewsDetailHeaderProps = {
  locale: AppLocale;
  publishedAt: string;
  sharePathBase?: string;
  slug: string;
  title: string;
};

export function NewsDetailHeader({
  locale,
  publishedAt,
  sharePathBase = "/news",
  slug,
  title,
}: NewsDetailHeaderProps) {
  const shareLabels = getMessages(locale).newsDetailPage.share;
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const normalizedSharePath = sharePathBase.startsWith("/")
      ? sharePathBase
      : `/${sharePathBase}`;

    setShareUrl(
      new URL(
        `/${locale}${normalizedSharePath}/${slug}`,
        window.location.origin,
      ).toString(),
    );
  }, [locale, sharePathBase, slug]);

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

  const shareLinks = useMemo(() => {
    if (!shareUrl) {
      return [];
    }

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    return [
      {
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        label: shareLabels.facebook,
        icon: faFacebookF,
      },
      {
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        label: shareLabels.x,
        icon: faXTwitter,
      },
      {
        href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        label: shareLabels.whatsapp,
        icon: faWhatsapp,
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
    <header className="space-y-4 mt-5">
      <h1 className="mx-auto max-w-3xl text-center text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">
        {title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-center text-sm font-medium text-zinc-300">
          {formatLocaleArticleDateTime(publishedAt, locale)}
        </span>
      </div>

      <div className="mx-auto h-1 w-30 rounded-full bg-yellow-400/70" />

      <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3">
        {shareLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-300 transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-zinc-950"
          >
            <FontAwesomeIcon icon={item.icon} />
          </a>
        ))}

        <button
          type="button"
          disabled={!shareUrl}
          aria-label={isCopied ? shareLabels.copied : shareLabels.copy}
          title={isCopied ? shareLabels.copied : shareLabels.copy}
          onClick={handleCopyLink}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-300 transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={isCopied ? faCheck : faCopy}
          />
        </button>
      </div>
    </header>
  );
}
