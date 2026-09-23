"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

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

function ProfileDetail({ full = false, label, value }: ProfileDetailProps) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 break-words text-[15px] font-medium leading-6 text-white">
        {value}
      </dd>
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
        className="flex w-full items-center gap-3 bg-gradient-to-r from-white/[0.045] to-transparent px-5 py-4 text-left transition hover:bg-white/[0.025]"
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
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-white/5 px-5 py-6 sm:grid-cols-2">
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

  const toggleSection = (section: ProfileSectionId) => {
    setOpenSection((current) => (current === section ? null : section));
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
          <ProfileDetail
            label={accountPage.fields.identityNumber}
            value={profile.personal.identityNumber}
          />
          <ProfileDetail
            label={accountPage.fields.taxNumber}
            value={profile.personal.taxNumber}
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
    </section>
  );
}
