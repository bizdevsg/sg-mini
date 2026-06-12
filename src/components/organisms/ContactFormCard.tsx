"use client";

import { useState, type FormEvent } from "react";

import type { AppMessages } from "@/locales";

type ContactFormCardProps = {
  recipientEmail: string;
  copy: AppMessages["contactPage"]["form"];
};

export function ContactFormCard({
  recipientEmail,
  copy,
}: ContactFormCardProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [captchaSeed, setCaptchaSeed] = useState(7421);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const subjectInput = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = subjectInput || "Website Inquiry";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setHasSubmitted(true);
    form.reset();
  };

  return (
    <div className="">
      <div className="max-w-2xl">
        <h2 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500 md:text-[2rem]">
          {copy.title}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-yellow-500/88">
            {copy.nameLabel}
          </span>
          <input
            name="name"
            required
            placeholder={copy.namePlaceholder}
            className="h-12 rounded-lg border border-line bg-black/20 px-4 text-sm text-foreground outline-none transition focus:border-yellow-500/70"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-yellow-500/88">
            {copy.emailLabel}
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder={copy.emailPlaceholder}
            className="h-12 rounded-lg border border-line bg-black/20 px-4 text-sm text-foreground outline-none transition focus:border-yellow-500/70"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-yellow-500/88">
            {copy.phoneLabel}
          </span>
          <input
            name="phone"
            type="tel"
            required
            placeholder={copy.phonePlaceholder}
            className="h-12 rounded-lg border border-line bg-black/20 px-4 text-sm text-foreground outline-none transition focus:border-yellow-500/70"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-yellow-500/88">
            {copy.subjectLabel}
          </span>
          <input
            name="subject"
            required
            placeholder={copy.subjectPlaceholder}
            className="h-12 rounded-lg border border-line bg-black/20 px-4 text-sm text-foreground outline-none transition focus:border-yellow-500/70"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-yellow-500/88">
            {copy.messageLabel}
          </span>
          <textarea
            name="message"
            required
            rows={7}
            placeholder={copy.messagePlaceholder}
            className="rounded-lg border border-line bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-yellow-500/70"
          />
        </label>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#f2cf78_0%,#cda13a_100%)] px-5 py-3 text-sm font-semibold text-[#120f08] transition-all duration-300 hover:brightness-110"
          >
            {copy.submit}
          </button>

          {hasSubmitted ? (
            <p
              className="text-sm font-medium text-yellow-500"
              aria-live="polite"
            >
              {copy.success}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
