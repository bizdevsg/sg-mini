"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import type {
  AccountSnapshot,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
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

type RadioOption = {
  label: string;
  value: string;
};

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-zinc-700 bg-[#6a6a6a] px-4 text-base text-white outline-none transition placeholder:text-zinc-200/70 focus:border-yellow-500/50";
const inputLabelClassName = "text-base font-semibold text-zinc-100";
const inlineInputClassName =
  "h-8 w-24 rounded-md border border-zinc-700 bg-[#6a6a6a] px-2 text-sm text-white outline-none transition focus:border-yellow-500/50";

function AccountField({
  defaultValue,
  label,
  required = false,
  span = 1,
}: {
  defaultValue: string;
  label: string;
  required?: boolean;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? "col-span-full" : undefined}>
      <label className={inputLabelClassName}>
        <span>
          {label}
          {required ? <span className="text-red-400">*</span> : null}
        </span>
        <input className={inputClassName} defaultValue={defaultValue} type="text" />
      </label>
    </div>
  );
}

function AccountDateField({
  defaultValue,
  label,
}: {
  defaultValue: string;
  label: string;
}) {
  return (
    <div>
      <label className={inputLabelClassName}>
        <span>{label}</span>
        <div className="relative">
          <input className={`${inputClassName} pr-11`} defaultValue={defaultValue} type="text" />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-200">
            <FontAwesomeIcon icon={["fas", "calendar-days"]} className="text-sm" />
          </span>
        </div>
      </label>
    </div>
  );
}

function PlaceholderSection({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-zinc-800 bg-zinc-900/70 p-4 text-base leading-7 text-zinc-300">
      {message}
    </div>
  );
}

function InlineRadioGroup({
  label,
  name,
  onChange,
  options,
  required = false,
  selectedValue,
  trailingInputForValue,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  selectedValue: string;
  trailingInputForValue?: string;
}) {
  return (
    <div className="space-y-2">
      <p className={inputLabelClassName}>
        {label}
        {required ? <span className="text-red-400">*</span> : null}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-100">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <label
              key={`${name}-${option.value}`}
              className="inline-flex items-center gap-1.5"
            >
              <input
                checked={isSelected}
                className="h-4 w-4 accent-yellow-400"
                name={name}
                onChange={() => onChange(option.value)}
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
              {trailingInputForValue === option.value ? (
                <input
                  className={inlineInputClassName}
                  defaultValue=""
                  type="text"
                />
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function AccordionItem({
  children,
  isOpen,
  onToggle,
  title,
}: {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
}) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between rounded-[26px] bg-gradient-to-r from-yellow-500 to-amber-400 px-5 py-4 text-left text-lg font-bold text-black shadow-[0_10px_30px_rgba(245,158,11,0.18)] transition hover:brightness-105 sm:px-7"
      >
        <span>{title}</span>
        <FontAwesomeIcon
          icon={["fas", "chevron-down"]}
          className={`text-base transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="rounded-[18px] border border-zinc-800 bg-[#232428] p-4 sm:p-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={accountHref}
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-yellow-500/40 hover:text-yellow-400"
        >
          <FontAwesomeIcon icon={["fas", "chevron-left"]} className="text-xs" />
          <span>{accountPage.backLabel}</span>
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-right">
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

      <AccordionItem
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
            <AccountField
              defaultValue="Franky Reagan Law"
              label={accountPage.fields.fullName}
            />
            <AccountField
              defaultValue="frankyreaganlaw@gmail.com"
              label={accountPage.fields.email}
            />
            <AccountField
              defaultValue="Makassar"
              label={accountPage.fields.birthPlace}
            />
            <AccountDateField
              defaultValue="12/03, 1987"
              label={accountPage.fields.birthDate}
            />
            <AccountField
              defaultValue="frankyreaganlaw@gmail.com"
              label={accountPage.fields.identityNumber}
              required
            />
            <AccountField
              defaultValue="1234567890111213"
              label={accountPage.fields.taxNumber}
              required
            />
            <AccountField defaultValue="Pria" label={accountPage.fields.gender} />
            <AccountField
              defaultValue="Kawin"
              label={accountPage.fields.maritalStatus}
            />
            <AccountField
              defaultValue="Istri"
              label={accountPage.fields.spouseName}
            />
            <AccountField
              defaultValue="Jl. Sudirman Raya"
              label={accountPage.fields.homeAddress}
              required
            />

            <div className="grid gap-3 md:grid-cols-[80px_80px_minmax(0,1fr)]">
              <AccountField
                defaultValue="01"
                label={accountPage.fields.rt}
                required
              />
              <AccountField
                defaultValue="03"
                label={accountPage.fields.rw}
                required
              />
              <AccountField
                defaultValue="DKI Jakarta"
                label={accountPage.fields.province}
                required
              />
            </div>

            <AccountField
              defaultValue="Jakarta Selatan"
              label={accountPage.fields.city}
              required
            />
            <AccountField
              defaultValue="Kebayoran Lama"
              label={accountPage.fields.subdistrict}
              required
            />
            <AccountField
              defaultValue="12240"
              label={accountPage.fields.postalCode}
              required
            />
            <AccountField
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
      </AccordionItem>

      <AccordionItem
        isOpen={openSection === "purpose"}
        onToggle={() =>
          setOpenSection((current) =>
            current === "purpose" ? null : "purpose",
          )
        }
        title={accountPage.sections.purpose}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <InlineRadioGroup
            label={accountPage.fields.openingPurpose}
            name="openingPurpose"
            onChange={setOpeningPurpose}
            options={accountPage.options.purpose}
            required
            selectedValue={openingPurpose}
            trailingInputForValue="other"
          />

          <InlineRadioGroup
            label={accountPage.fields.investmentExperience}
            name="investmentExperience"
            onChange={setInvestmentExperience}
            options={accountPage.options.investmentExperience}
            required
            selectedValue={investmentExperience}
            trailingInputForValue="yes"
          />

          <InlineRadioGroup
            label={accountPage.fields.futuresExperience}
            name="futuresExperience"
            onChange={setFuturesExperience}
            options={accountPage.options.binary as RadioOption[]}
            required
            selectedValue={futuresExperience}
          />

          <InlineRadioGroup
            label={accountPage.fields.familyAffiliation}
            name="familyAffiliation"
            onChange={setFamilyAffiliation}
            options={accountPage.options.binary as RadioOption[]}
            required
            selectedValue={familyAffiliation}
            trailingInputForValue="yes"
          />

          <InlineRadioGroup
            label={accountPage.fields.bankruptStatus}
            name="bankruptStatus"
            onChange={setBankruptStatus}
            options={accountPage.options.binary as RadioOption[]}
            selectedValue={bankruptStatus}
          />

          <button
            type="submit"
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 text-sm font-bold text-black transition hover:brightness-105"
          >
            {accountPage.saveLabel}
          </button>
        </form>
      </AccordionItem>

      <AccordionItem
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
            <AccountField
              defaultValue=""
              label={accountPage.fields.emergencyName}
              required
            />
            <AccountField
              defaultValue=""
              label={accountPage.fields.emergencyAddress}
              required
            />

            <div className="grid gap-3 md:grid-cols-[80px_80px_minmax(0,1fr)]">
              <AccountField
                defaultValue=""
                label={accountPage.fields.rt}
                required
              />
              <AccountField
                defaultValue=""
                label={accountPage.fields.rw}
                required
              />
              <AccountField
                defaultValue=""
                label={accountPage.fields.emergencyProvince}
                required
              />
            </div>

            <AccountField
              defaultValue=""
              label={accountPage.fields.emergencyCity}
              required
            />
            <AccountField
              defaultValue=""
              label={accountPage.fields.emergencySubdistrict}
              required
            />
            <AccountField
              defaultValue=""
              label={accountPage.fields.emergencyPostalCode}
              required
            />
            <AccountField
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
      </AccordionItem>

      <AccordionItem
        isOpen={openSection === "job"}
        onToggle={() =>
          setOpenSection((current) => (current === "job" ? null : "job"))
        }
        title={accountPage.sections.job}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <InlineRadioGroup
            label={accountPage.fields.occupation}
            name="occupation"
            onChange={setOccupation}
            options={accountPage.options.occupation}
            required
            selectedValue={occupation}
            trailingInputForValue="other"
          />

          <div className="grid gap-4">
            <AccountField
              defaultValue=""
              label={accountPage.fields.companyName}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <AccountField
                defaultValue=""
                label={accountPage.fields.businessSector}
                required
              />
              <AccountField
                defaultValue=""
                label={accountPage.fields.position}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AccountField
                defaultValue=""
                label={accountPage.fields.yearsWorking}
              />
              <AccountField
                defaultValue=""
                label={accountPage.fields.previousOffice}
              />
            </div>

            <AccountField
              defaultValue=""
              label={accountPage.fields.officeAddress}
              required
            />
            <AccountField
              defaultValue=""
              label={accountPage.fields.officePostalCode}
            />
            <AccountField
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
      </AccordionItem>

      <AccordionItem
        isOpen={openSection === "wealth"}
        onToggle={() =>
          setOpenSection((current) => (current === "wealth" ? null : "wealth"))
        }
        title={accountPage.sections.wealth}
      >
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <InlineRadioGroup
            label={accountPage.fields.annualIncome}
            name="annualIncome"
            onChange={setAnnualIncome}
            options={accountPage.options.annualIncome}
            required
            selectedValue={annualIncome}
          />

          <div className="grid gap-4">
            <AccountField
              defaultValue=""
              label={accountPage.fields.houseLocation}
              required
            />
            <AccountField
              defaultValue=""
              label={accountPage.fields.njop}
              required
            />
            <AccountField
              defaultValue=""
              label={accountPage.fields.bankDeposit}
            />
            <AccountField
              defaultValue=""
              label={accountPage.fields.amount}
            />
            <AccountField
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
      </AccordionItem>
    </div>
  );
}
