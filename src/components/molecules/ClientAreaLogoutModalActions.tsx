"use client";

import { useFormStatus } from "react-dom";

type ClientAreaLogoutModalActionsProps = {
  cancelLabel: string;
  confirmLabel: string;
  onClose: () => void;
  submittingLabel: string;
};

export function ClientAreaLogoutModalActions({
  cancelLabel,
  confirmLabel,
  onClose,
  submittingLabel,
}: ClientAreaLogoutModalActionsProps) {
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onClose}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cancelLabel}
      </button>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:border-red-400/40 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? submittingLabel : confirmLabel}
      </button>
    </div>
  );
}
