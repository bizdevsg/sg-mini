"use client";

import {
  useEffect,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

import { revealClientAreaSensitiveProfile } from "@/app/actions/clientAreaSensitiveProfile";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import { getClientAreaProfileDemoData } from "@/components/organisms/client-area-account-profile.data";
import type { AccountSnapshot } from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountProfilePanelProps = {
  currentAccount: AccountSnapshot;
  locale: AppLocale;
};

type ProfileDetailProps = {
  full?: boolean;
  label: string;
  value: ReactNode;
};

type ProfileSectionProps = {
  children: ReactNode;
  description: string;
  icon: IconProp;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
};

type ProfileSectionId =
  | "personal"
  | "purpose"
  | "emergency"
  | "employment"
  | "wealth";

type SensitiveProfileData = {
  identityNumber: string;
  taxNumber: string;
};

type SensitiveProfileField = keyof SensitiveProfileData;

type SensitiveProfileDetailProps = {
  isRevealed: boolean;
  label: string;
  locale: AppLocale;
  maskedValue: string;
  onHide: () => void;
  onRequestReveal: () => void;
  revealedValue?: string;
};

type SensitiveProfilePasswordModalProps = {
  field: SensitiveProfileField;
  isOpen: boolean;
  locale: AppLocale;
  onClose: () => void;
  onSuccess: (data: { field: SensitiveProfileField; value: string }) => void;
};

const SENSITIVE_DATA_REVEAL_DURATION_MS = 2 * 60 * 1000;

function ProfileDetail({ full = false, label, value }: ProfileDetailProps) {
  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 shadow-sm shadow-black/10 ${full ? "sm:col-span-2" : ""}`}
    >
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 break-words text-[15px] font-medium leading-6 text-white">
        {value}
      </dd>
    </div>
  );
}

function SensitiveProfileDetail({
  isRevealed,
  label,
  locale,
  maskedValue,
  onHide,
  onRequestReveal,
  revealedValue,
}: SensitiveProfileDetailProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 shadow-sm shadow-black/10">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 flex min-w-0 items-center justify-between gap-3">
        <span className="min-w-0 break-words text-[15px] font-medium leading-6 text-white">
          {isRevealed ? revealedValue : maskedValue}
        </span>
        <button
          type="button"
          onClick={isRevealed ? onHide : onRequestReveal}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-yellow-500/25 bg-yellow-500/10 px-2.5 py-1.5 text-xs font-semibold text-yellow-400 transition hover:border-yellow-500/45 hover:bg-yellow-500/15"
        >
          <FontAwesomeIcon
            icon={["fas", isRevealed ? "eye-slash" : "eye"]}
            className="text-[11px]"
          />
        </button>
      </dd>
    </div>
  );
}

function SensitiveProfilePasswordModal({
  field,
  isOpen,
  locale,
  onClose,
  onSuccess,
}: SensitiveProfilePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const copy = locale === "id"
    ? {
      title: "Konfirmasi password",
      description: "Masukkan password akun untuk melihat data sensitif.",
      passwordLabel: "Password akun",
      passwordPlaceholder: "Masukkan password",
      cancel: "Batal",
      confirm: "Konfirmasi",
      invalid: "Password tidak sesuai. Silakan coba lagi.",
      unauthorized: "Sesi Anda telah berakhir. Silakan masuk kembali.",
      showPassword: "Tampilkan password",
      hidePassword: "Sembunyikan password",
    }
    : {
      title: "Confirm password",
      description: "Enter your account password to view sensitive data.",
      passwordLabel: "Account password",
      passwordPlaceholder: "Enter password",
      cancel: "Cancel",
      confirm: "Confirm",
      invalid: "The password is incorrect. Please try again.",
      unauthorized: "Your session has expired. Please sign in again.",
      showPassword: "Show password",
      hidePassword: "Hide password",
    };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isPending, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await revealClientAreaSensitiveProfile(field, password);

      if (result.status === "success") {
        onSuccess(result.data);
        onClose();
        return;
      }

      setError(
        result.status === "unauthorized" ? copy.unauthorized : copy.invalid,
      );
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onClick={isPending ? undefined : onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="sensitive-profile-modal-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto grid size-14 place-items-center rounded-full border border-yellow-500/25 bg-yellow-500/10 text-xl text-yellow-400">
          <FontAwesomeIcon icon={["fas", "lock"]} />
        </div>
        <h2
          id="sensitive-profile-modal-title"
          className="mt-4 text-center text-xl font-bold text-white"
        >
          {copy.title}
        </h2>
        <p className="mt-2 text-center text-sm leading-6 text-zinc-400">
          {copy.description}
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
          {copy.passwordLabel}
          <span className="relative mt-2 block">
            <input
              autoFocus
              required
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.passwordPlaceholder}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 pr-12 text-sm font-normal normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500/50"
            />
            <button
              type="button"
              aria-label={showPassword ? copy.hidePassword : copy.showPassword}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 grid w-12 cursor-pointer place-items-center text-zinc-500 transition hover:text-yellow-400"
            >
              <FontAwesomeIcon
                icon={["fas", showPassword ? "eye-slash" : "eye"]}
              />
            </button>
          </span>
        </label>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-11 cursor-pointer rounded-xl border border-white/10 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            disabled={isPending || !password}
            className="h-11 cursor-pointer rounded-xl bg-yellow-500 text-sm font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "..." : copy.confirm}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfileSection({
  children,
  description,
  icon,
  isOpen,
  onToggle,
  title,
}: ProfileSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]/80 shadow-lg shadow-black/25">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center gap-3 bg-gradient-to-r from-white/[0.045] to-transparent px-5 py-4 text-left transition hover:bg-white/[0.025] cursor-pointer"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
          <FontAwesomeIcon icon={icon} className="text-base" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold text-white">
            {title}
          </span>
          <span className="mt-0.5 block text-xs text-zinc-500">
            {description}
          </span>
        </span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-400">
          <FontAwesomeIcon
            icon={["fas", "chevron-down"]}
            className={`text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {isOpen ? (
        <dl className="grid grid-cols-1 gap-3 border-t border-white/5 px-5 py-6 sm:grid-cols-2">
          {children}
        </dl>
      ) : null}
    </section>
  );
}

export function ClientAreaAccountProfilePanel({
  currentAccount,
  locale,
}: ClientAreaAccountProfilePanelProps) {
  const accountPage = getMessages(locale).clientArea.accountPage;
  const viewOnly = accountPage.viewOnly;
  const profile = getClientAreaProfileDemoData(locale);
  const accountHref = resolveLocalizedHref(locale, "/client-area/account");
  const [openSection, setOpenSection] =
    useState<ProfileSectionId | null>("personal");
  const [pendingSensitiveField, setPendingSensitiveField] =
    useState<SensitiveProfileField | null>(null);
  const [sensitiveData, setSensitiveData] =
    useState<Partial<SensitiveProfileData>>({});

  useEffect(() => {
    if (Object.keys(sensitiveData).length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setSensitiveData({}),
      SENSITIVE_DATA_REVEAL_DURATION_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [sensitiveData]);

  const toggleSection = (section: ProfileSectionId) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const hideSensitiveField = (field: SensitiveProfileField) => {
    setSensitiveData((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  return (
    <section aria-label={accountPage.menuItems.profile} className="space-y-6">
      <Link
        href={accountHref}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/40 hover:text-yellow-400"
      >
        <FontAwesomeIcon icon={["fas", "chevron-left"]} className="text-xs" />
        <span>{accountPage.backLabel}</span>
      </Link>

      <div className="space-y-4">
        <ProfileSection
          description={viewOnly.personalDescription}
          icon={["fas", "user"]}
          isOpen={openSection === "personal"}
          onToggle={() => toggleSection("personal")}
          title={accountPage.sections.personal}
        >
          <ProfileDetail
            label={accountPage.fields.fullName}
            value={currentAccount.accountOwner}
          />
          <ProfileDetail
            label={accountPage.fields.email}
            value={currentAccount.email}
          />
          <ProfileDetail
            label={accountPage.fields.birthPlace}
            value={profile.personal.birthPlace}
          />
          <ProfileDetail
            label={accountPage.fields.birthDate}
            value={profile.personal.birthDate}
          />
          <SensitiveProfileDetail
            isRevealed={Boolean(sensitiveData.identityNumber)}
            label={accountPage.fields.identityNumber}
            locale={locale}
            maskedValue={profile.personal.identityNumber}
            onHide={() => hideSensitiveField("identityNumber")}
            onRequestReveal={() => setPendingSensitiveField("identityNumber")}
            revealedValue={sensitiveData.identityNumber}
          />
          <SensitiveProfileDetail
            isRevealed={Boolean(sensitiveData.taxNumber)}
            label={accountPage.fields.taxNumber}
            locale={locale}
            maskedValue={profile.personal.taxNumber}
            onHide={() => hideSensitiveField("taxNumber")}
            onRequestReveal={() => setPendingSensitiveField("taxNumber")}
            revealedValue={sensitiveData.taxNumber}
          />
          <ProfileDetail
            label={accountPage.fields.gender}
            value={profile.personal.gender}
          />
          <ProfileDetail
            label={accountPage.fields.maritalStatus}
            value={profile.personal.maritalStatus}
          />
          <ProfileDetail
            label={accountPage.fields.spouseName}
            value={profile.personal.spouseName}
          />
          <ProfileDetail
            label={accountPage.fields.phone}
            value={profile.personal.phone}
          />
          <ProfileDetail
            full
            label={accountPage.fields.homeAddress}
            value={profile.personal.homeAddress}
          />
          <ProfileDetail
            label={accountPage.fields.province}
            value={profile.personal.province}
          />
          <ProfileDetail
            label={accountPage.fields.city}
            value={profile.personal.city}
          />
          <ProfileDetail
            label={accountPage.fields.subdistrict}
            value={profile.personal.subdistrict}
          />
          <ProfileDetail
            label={accountPage.fields.postalCode}
            value={profile.personal.postalCode}
          />
        </ProfileSection>

        <ProfileSection
          description={viewOnly.purposeDescription}
          icon={["fas", "bullseye"]}
          isOpen={openSection === "purpose"}
          onToggle={() => toggleSection("purpose")}
          title={accountPage.sections.purpose}
        >
          <ProfileDetail
            label={accountPage.fields.openingPurpose}
            value={profile.purpose.openingPurpose}
          />
          <ProfileDetail
            label={accountPage.fields.sourceFunds}
            value={profile.purpose.sourceFunds}
          />
          <ProfileDetail
            full
            label={accountPage.fields.estimatedTransaction}
            value={profile.purpose.estimatedTransaction}
          />
          <ProfileDetail
            label={accountPage.fields.investmentExperience}
            value={profile.purpose.investmentExperience}
          />
          <ProfileDetail
            label={accountPage.fields.futuresExperience}
            value={profile.purpose.futuresExperience}
          />
          <ProfileDetail
            full
            label={accountPage.fields.familyAffiliation}
            value={profile.purpose.familyAffiliation}
          />
          <ProfileDetail
            full
            label={accountPage.fields.bankruptStatus}
            value={profile.purpose.bankruptStatus}
          />
        </ProfileSection>

        <ProfileSection
          description={viewOnly.emergencyDescription}
          icon={["fas", "life-ring"]}
          isOpen={openSection === "emergency"}
          onToggle={() => toggleSection("emergency")}
          title={accountPage.sections.emergency}
        >
          <ProfileDetail
            label={accountPage.fields.emergencyName}
            value={profile.emergency.name}
          />
          <ProfileDetail
            label={accountPage.fields.emergencyRelationship}
            value={profile.emergency.relationship}
          />
          <ProfileDetail
            label={accountPage.fields.emergencyPhone}
            value={profile.emergency.phone}
          />
          <ProfileDetail
            full
            label={accountPage.fields.emergencyAddress}
            value={profile.emergency.address}
          />
          <ProfileDetail
            label={accountPage.fields.emergencyProvince}
            value={profile.emergency.province}
          />
          <ProfileDetail
            label={accountPage.fields.emergencyCity}
            value={profile.emergency.city}
          />
          <ProfileDetail
            label={accountPage.fields.emergencySubdistrict}
            value={profile.emergency.subdistrict}
          />
          <ProfileDetail
            label={accountPage.fields.emergencyPostalCode}
            value={profile.emergency.postalCode}
          />
        </ProfileSection>

        <ProfileSection
          description={viewOnly.employmentDescription}
          icon={["fas", "briefcase"]}
          isOpen={openSection === "employment"}
          onToggle={() => toggleSection("employment")}
          title={accountPage.sections.job}
        >
          <ProfileDetail
            label={accountPage.fields.occupation}
            value={profile.employment.occupation}
          />
          <ProfileDetail
            label={accountPage.fields.position}
            value={profile.employment.position}
          />
          <ProfileDetail
            label={accountPage.fields.companyName}
            value={profile.employment.companyName}
          />
          <ProfileDetail
            label={accountPage.fields.businessSector}
            value={profile.employment.businessSector}
          />
          <ProfileDetail
            label={accountPage.fields.yearsWorking}
            value={profile.employment.yearsWorking}
          />
          <ProfileDetail
            label={accountPage.fields.previousOffice}
            value={profile.employment.previousOffice}
          />
          <ProfileDetail
            full
            label={accountPage.fields.officeAddress}
            value={profile.employment.officeAddress}
          />
          <ProfileDetail
            label={accountPage.fields.officePostalCode}
            value={profile.employment.officePostalCode}
          />
          <ProfileDetail
            label={accountPage.fields.officePhone}
            value={profile.employment.officePhone}
          />
          <ProfileDetail
            full
            label={accountPage.fields.monthlyIncome}
            value={profile.employment.monthlyIncome}
          />
        </ProfileSection>

        <ProfileSection
          description={viewOnly.wealthDescription}
          icon={["fas", "wallet"]}
          isOpen={openSection === "wealth"}
          onToggle={() => toggleSection("wealth")}
          title={accountPage.sections.wealth}
        >
          <ProfileDetail
            label={accountPage.fields.totalAssets}
            value={profile.wealth.totalAssets}
          />
          <ProfileDetail
            label={accountPage.fields.annualIncome}
            value={profile.wealth.annualIncome}
          />
          <ProfileDetail
            label={accountPage.fields.propertyOwnership}
            value={profile.wealth.propertyOwnership}
          />
          <ProfileDetail
            label={accountPage.fields.vehicleOwnership}
            value={profile.wealth.vehicleOwnership}
          />
          <ProfileDetail
            label={accountPage.fields.bankDeposit}
            value={profile.wealth.bankDeposit}
          />
          <ProfileDetail
            label={accountPage.fields.otherInvestments}
            value={profile.wealth.otherInvestments}
          />
          <ProfileDetail
            full
            label={accountPage.fields.bankAccount}
            value={profile.wealth.bankAccount}
          />
        </ProfileSection>

      </div>

      {pendingSensitiveField ? (
        <SensitiveProfilePasswordModal
          field={pendingSensitiveField}
          isOpen
          locale={locale}
          onClose={() => setPendingSensitiveField(null)}
          onSuccess={(data) => {
            setSensitiveData((current) => ({
              ...current,
              [data.field]: data.value,
            }));
          }}
        />
      ) : null}
    </section>
  );
}
