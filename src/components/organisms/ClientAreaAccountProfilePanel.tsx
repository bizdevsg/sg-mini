"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaAccountDateField } from "@/components/atoms/ClientAreaAccountDateField";
import { ClientAreaAccountField } from "@/components/atoms/ClientAreaAccountField";
import { ClientAreaAccordionItem } from "@/components/molecules/ClientAreaAccordionItem";
import { ClientAreaInlineRadioGroup } from "@/components/molecules/ClientAreaInlineRadioGroup";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import type {
  AccountSnapshot,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import { type ClientAreaRadioOption } from "@/components/organisms/client-area-account-profile.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountProfilePanelProps = {
  copy: DashboardCopy;
  currentAccount: AccountSnapshot;
  locale: AppLocale;
};

type AccordionSectionId =
  | "personal"
  | "purpose"
  | "emergency"
  | "job"
  | "wealth";

export function ClientAreaAccountProfilePanel({
  copy,
  currentAccount,
  locale,
}: ClientAreaAccountProfilePanelProps) {
  const accountPage = useMemo(
    () => getMessages(locale).clientArea.accountPage,
    [locale],
  );

  const [openSection, setOpenSection] =
    useState<AccordionSectionId | null>("personal");
  const [openingPurpose, setOpeningPurpose] = useState("hedging");
  const [investmentExperience, setInvestmentExperience] = useState("no");
  const [futuresExperience, setFuturesExperience] = useState("yes");
  const [familyAffiliation, setFamilyAffiliation] = useState("no");
  const [bankruptStatus, setBankruptStatus] = useState("yes");
  const [occupation, setOccupation] = useState("private");
  const [annualIncome, setAnnualIncome] = useState("100to250");

  const accountHref = resolveLocalizedHref(locale, "/client-area/account");

  return (
    <div className="space-y-4 rounded-[34px] border border-zinc-800 bg-black/45 p-4 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Link
          href={accountHref}
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-yellow-500/40 hover:text-yellow-400"
        >
          <FontAwesomeIcon icon={["fas", "chevron-left"]} className="text-xs" />
          <span>{accountPage.backLabel}</span>
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-left sm:text-right">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            {accountPage.activeAccount}
          </p>
          <p className="mt-1 text-base font-bold text-white">
            {currentAccount.accountId}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-500/90">
          {currentAccount.typeLabel}
        </p>
        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          {copy.accountTitle}
        </h2>
      </div>

      <ClientAreaAccordionItem
        isOpen={openSection === "personal"}
        onToggle={() =>
          setOpenSection((current) =>
            current === "personal" ? null : "personal",
          )
        }
        title={accountPage.sections.personal}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4">
            <ClientAreaAccountField
              defaultValue="Franky Reagan Law"
              label={accountPage.fields.fullName}
            />
            <ClientAreaAccountField
              defaultValue="frankyreaganlaw@gmail.com"
              label={accountPage.fields.email}
            />
            <ClientAreaAccountField
              defaultValue="Makassar"
              label={accountPage.fields.birthPlace}
            />
            <ClientAreaAccountDateField
              defaultValue="12/03, 1987"
              label={accountPage.fields.birthDate}
            />
            <ClientAreaAccountField
              defaultValue="frankyreaganlaw@gmail.com"
              label={accountPage.fields.identityNumber}
              required
            />
            <ClientAreaAccountField
              defaultValue="1234567890111213"
              label={accountPage.fields.taxNumber}
              required
            />
            <ClientAreaAccountField defaultValue="Pria" label={accountPage.fields.gender} />
            <ClientAreaAccountField
              defaultValue="Kawin"
              label={accountPage.fields.maritalStatus}
            />
            <ClientAreaAccountField
              defaultValue="Istri"
              label={accountPage.fields.spouseName}
            />
            <ClientAreaAccountField
              defaultValue="Jl. Sudirman Raya"
              label={accountPage.fields.homeAddress}
              required
            />

            <div className="grid gap-3 min-[560px]:grid-cols-[80px_80px_minmax(0,1fr)]">
              <ClientAreaAccountField
                defaultValue="01"
                label={accountPage.fields.rt}
                required
              />
              <ClientAreaAccountField
                defaultValue="03"
                label={accountPage.fields.rw}
                required
              />
              <ClientAreaAccountField
                defaultValue="DKI Jakarta"
                label={accountPage.fields.province}
                required
              />
            </div>

            <ClientAreaAccountField
              defaultValue="Jakarta Selatan"
              label={accountPage.fields.city}
              required
            />
            <ClientAreaAccountField
              defaultValue="Kebayoran Lama"
              label={accountPage.fields.subdistrict}
              required
            />
            <ClientAreaAccountField
              defaultValue="12240"
              label={accountPage.fields.postalCode}
              required
            />
            <ClientAreaAccountField
              defaultValue="081234567890"
              label={accountPage.fields.phone}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 text-sm font-bold text-black transition hover:brightness-105"
          >
            {accountPage.saveLabel}
          </button>
        </form>
      </ClientAreaAccordionItem>

      <ClientAreaAccordionItem
        isOpen={openSection === "purpose"}
        onToggle={() =>
          setOpenSection((current) =>
            current === "purpose" ? null : "purpose",
          )
        }
        title={accountPage.sections.purpose}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <ClientAreaInlineRadioGroup
            label={accountPage.fields.openingPurpose}
            name="openingPurpose"
            onChange={setOpeningPurpose}
            options={accountPage.options.purpose}
            required
            selectedValue={openingPurpose}
            trailingInputForValue="other"
          />

          <ClientAreaInlineRadioGroup
            label={accountPage.fields.investmentExperience}
            name="investmentExperience"
            onChange={setInvestmentExperience}
            options={accountPage.options.investmentExperience}
            required
            selectedValue={investmentExperience}
            trailingInputForValue="yes"
          />

          <ClientAreaInlineRadioGroup
            label={accountPage.fields.futuresExperience}
            name="futuresExperience"
            onChange={setFuturesExperience}
            options={accountPage.options.binary as ClientAreaRadioOption[]}
            required
            selectedValue={futuresExperience}
          />

          <ClientAreaInlineRadioGroup
            label={accountPage.fields.familyAffiliation}
            name="familyAffiliation"
            onChange={setFamilyAffiliation}
            options={accountPage.options.binary as ClientAreaRadioOption[]}
            required
            selectedValue={familyAffiliation}
            trailingInputForValue="yes"
          />

          <ClientAreaInlineRadioGroup
            label={accountPage.fields.bankruptStatus}
            name="bankruptStatus"
            onChange={setBankruptStatus}
            options={accountPage.options.binary as ClientAreaRadioOption[]}
            selectedValue={bankruptStatus}
          />

          <button
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 text-sm font-bold text-black transition hover:brightness-105"
          >
            {accountPage.saveLabel}
          </button>
        </form>
      </ClientAreaAccordionItem>

      <ClientAreaAccordionItem
        isOpen={openSection === "emergency"}
        onToggle={() =>
          setOpenSection((current) =>
            current === "emergency" ? null : "emergency",
          )
        }
        title={accountPage.sections.emergency}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4">
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.emergencyName}
              required
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.emergencyAddress}
              required
            />

            <div className="grid gap-3 min-[560px]:grid-cols-[80px_80px_minmax(0,1fr)]">
              <ClientAreaAccountField
                defaultValue=""
                label={accountPage.fields.rt}
                required
              />
              <ClientAreaAccountField
                defaultValue=""
                label={accountPage.fields.rw}
                required
              />
              <ClientAreaAccountField
                defaultValue=""
                label={accountPage.fields.emergencyProvince}
                required
              />
            </div>

            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.emergencyCity}
              required
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.emergencySubdistrict}
              required
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.emergencyPostalCode}
              required
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.emergencyPhone}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 text-sm font-bold text-black transition hover:brightness-105"
          >
            {accountPage.saveLabel}
          </button>
        </form>
      </ClientAreaAccordionItem>

      <ClientAreaAccordionItem
        isOpen={openSection === "job"}
        onToggle={() =>
          setOpenSection((current) => (current === "job" ? null : "job"))
        }
        title={accountPage.sections.job}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <ClientAreaInlineRadioGroup
            label={accountPage.fields.occupation}
            name="occupation"
            onChange={setOccupation}
            options={accountPage.options.occupation}
            required
            selectedValue={occupation}
            trailingInputForValue="other"
          />

          <div className="grid gap-4">
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.companyName}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <ClientAreaAccountField
                defaultValue=""
                label={accountPage.fields.businessSector}
                required
              />
              <ClientAreaAccountField
                defaultValue=""
                label={accountPage.fields.position}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ClientAreaAccountField
                defaultValue=""
                label={accountPage.fields.yearsWorking}
              />
              <ClientAreaAccountField
                defaultValue=""
                label={accountPage.fields.previousOffice}
              />
            </div>

            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.officeAddress}
              required
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.officePostalCode}
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.officePhone}
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 text-sm font-bold text-black transition hover:brightness-105"
          >
            {accountPage.saveLabel}
          </button>
        </form>
      </ClientAreaAccordionItem>

      <ClientAreaAccordionItem
        isOpen={openSection === "wealth"}
        onToggle={() =>
          setOpenSection((current) => (current === "wealth" ? null : "wealth"))
        }
        title={accountPage.sections.wealth}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <ClientAreaInlineRadioGroup
            label={accountPage.fields.annualIncome}
            name="annualIncome"
            onChange={setAnnualIncome}
            options={accountPage.options.annualIncome}
            required
            selectedValue={annualIncome}
          />

          <div className="grid gap-4">
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.houseLocation}
              required
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.njop}
              required
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.bankDeposit}
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.amount}
            />
            <ClientAreaAccountField
              defaultValue=""
              label={accountPage.fields.otherAssets}
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 text-sm font-bold text-black transition hover:brightness-105"
          >
            {accountPage.saveLabel}
          </button>
        </form>
      </ClientAreaAccordionItem>
    </div>
  );
}
