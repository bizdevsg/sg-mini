"use client";

import { useActionState } from "react";

import {
  submitContactMessage,
  type ContactMessageState,
} from "@/app/actions/contactMessage";
import type { AppMessages } from "@/locales";

type ContactFormCardProps = {
  copy: AppMessages["contactPage"]["form"];
};

const INITIAL_STATE: ContactMessageState = {
  status: "idle",
  message: "",
};

export function ContactFormCard({ copy }: ContactFormCardProps) {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] p-6 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-500">
          <span className="text-lg font-bold">OK</span>
        </div>
        <h2 className="mt-5 font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500 md:text-[2rem]">
          {copy.success}
        </h2>
        <p className="mt-3 text-sm leading-7 text-foreground/75">{state.message}</p>
        {state.reportId ? (
          <div className="mt-5 rounded-xl border border-yellow-500/15 bg-black/20 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500/70">
              {copy.successReportLabel}
            </p>
            <p className="mt-2 font-mono text-base font-bold text-white">
              {state.reportId}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-2xl">
        <h2 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500 md:text-[2rem]">
          {copy.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-foreground/72">
          {copy.description}
        </p>
      </div>

      <div className="relative mt-8">
        {pending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border border-yellow-500/10 bg-black/72 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500/20 border-t-yellow-500" />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-yellow-500/85">
                {copy.submitting}
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                {copy.helper}
              </p>
            </div>
          </div>
        ) : null}

        <form action={formAction} className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-yellow-500/88">
              {copy.nameLabel}
            </span>
            <input
              name="name"
              required
              disabled={pending}
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
              disabled={pending}
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
              disabled={pending}
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
              disabled={pending}
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
              disabled={pending}
              placeholder={copy.messagePlaceholder}
              className="rounded-lg border border-line bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-yellow-500/70"
            />
          </label>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#f2cf78_0%,#cda13a_100%)] px-5 py-3 text-sm font-semibold text-[#120f08] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {pending ? copy.submitting : copy.submit}
            </button>

            {state.status === "error" ? (
              <p
                className="text-sm font-medium text-yellow-500"
                aria-live="polite"
              >
                {state.message || copy.error}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
