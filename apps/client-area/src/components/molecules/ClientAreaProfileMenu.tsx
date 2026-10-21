"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, LogOut, UserRound, WalletCards } from "lucide-react";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import type { AccountMode } from "@/components/organisms/client-area.types";
import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";
import { resolveClientAreaAccountId } from "@/lib/client-area-profile.shared";

type ClientAreaProfileMenuProps = {
  accountModeLabel: string;
  demoModeLabel: string;
  logoutLabel: string;
  onLogout: () => void;
  profile: ClientAreaSessionProfile;
  realModeLabel: string;
};

export function ClientAreaProfileMenu({
  accountModeLabel,
  demoModeLabel,
  logoutLabel,
  onLogout,
  profile,
  realModeLabel,
}: ClientAreaProfileMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { accountMode, setAccountMode } = useClientAreaAccountMode();
  const activeAccountId = resolveClientAreaAccountId(profile, accountMode);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function selectMode(mode: AccountMode) {
    setAccountMode(mode);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative min-w-0">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-w-0 items-center gap-1 rounded-xl border border-white/8 bg-white/[0.03] p-1 pr-1.5 transition hover:border-amber-500/30 hover:bg-white/[0.06] min-[380px]:gap-2 min-[380px]:p-1.5 min-[380px]:pr-2"
      >
        {/* <Image
          src={profile.avatarSrc}
          alt={profile.displayName}
          width={34}
          height={34}
          className="h-8 w-8 rounded-lg object-cover"
        /> */}

        <div className="h-8 w-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
          <UserRound className="h-4 w-4 text-yellow-500" />
        </div>

        <div className="hidden min-w-0 text-left md:block">
          <p className="max-w-32 truncate text-xs font-semibold text-white">
            {profile.displayName}
          </p>
          {profile.displayName !== activeAccountId ? (
            <p className="text-[10px] text-zinc-500">{activeAccountId}</p>
          ) : null}
        </div>
        <ChevronDown
          className={`hidden h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform min-[360px]:block ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="fixed inset-x-4 top-[5.75rem] z-50 w-auto overflow-hidden rounded-2xl border border-white/10 bg-[#111214] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.65rem)] sm:w-56"
        >
          <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold text-zinc-400">
            <WalletCards className="h-4 w-4 text-amber-400" />
            {accountModeLabel}
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/30 p-1">
            {([
              ["demo", demoModeLabel],
              ["real", realModeLabel],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                role="menuitemradio"
                aria-checked={accountMode === mode}
                onClick={() => selectMode(mode)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${accountMode === mode ? "bg-amber-500 text-black" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
              >
                {accountMode === mode ? <Check className="h-3.5 w-3.5" /> : null}
                {label}
              </button>
            ))}
          </div>
          <div className="my-2 h-px bg-white/8" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            {logoutLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
