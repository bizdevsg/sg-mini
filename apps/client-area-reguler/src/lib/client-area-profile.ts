import "server-only";

import { z } from "zod";

import type { ClientAreaCustomerProfile } from "@/lib/client-area-profile.shared";

const EMPTY = "—";
const MASKED = "••••••••";

const customerProfileSchema = z.object({
  no_account: z.unknown().optional(),
  email: z.unknown().optional(),
  phone_number: z.unknown().optional(),
  identity_number: z.unknown().optional(),
  full_name: z.unknown().optional(),
  place_of_birth: z.unknown().optional(),
  date_of_birth: z.unknown().optional(),
  sex: z.unknown().optional(),
  marital_status: z.unknown().optional(),
  spouse_name: z.unknown().optional(),
  npwp: z.unknown().optional(),
  home_address: z.unknown().optional(),
  kelurahan: z.unknown().optional(),
  kabupaten_kota: z.unknown().optional(),
  provinsi: z.unknown().optional(),
  postal_code: z.unknown().optional(),
  house_location: z.unknown().optional(),
  njop: z.unknown().optional(),
  deposit_amount: z.unknown().optional(),
  tujuan_pembukaan: z.unknown().optional(),
  acc_opening_goal: z.unknown().optional(),
  is_invest_exp: z.unknown().optional(),
  investment_exp: z.unknown().optional(),
  is_future_trades_exp: z.unknown().optional(),
  future_trades_name_exp: z.unknown().optional(),
  is_family_works: z.unknown().optional(),
  family_works: z.unknown().optional(),
  is_bankrupt_status: z.unknown().optional(),
  occupation: z.unknown().optional(),
  company_name: z.unknown().optional(),
  business_type: z.unknown().optional(),
  job_position: z.unknown().optional(),
  work_exp: z.unknown().optional(),
  prev_office: z.unknown().optional(),
  office_address: z.unknown().optional(),
  office_postal_code: z.unknown().optional(),
  office_phone_num: z.unknown().optional(),
  yearly_income: z.unknown().optional(),
  bank_deposit: z.unknown().optional(),
  other: z.unknown().optional(),
});

function text(value: unknown): string {
  if (typeof value === "string") {
    return value.trim() || EMPTY;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return EMPTY;
}

/** Sentence case ("Kota depok"); "Rp" stays capitalised as a currency prefix. */
function sentenceCase(value: string): string {
  if (value === EMPTY) {
    return value;
  }

  const lower = value
    .toLocaleLowerCase("id-ID")
    .replace(/\brp(?=\d|\b)/g, "Rp");

  return lower.charAt(0).toLocaleUpperCase("id-ID") + lower.slice(1);
}

function prose(value: unknown): string {
  return sentenceCase(text(value));
}

/** Indonesian phone numbers with the +62 country code ("0812…" → "+62812…"). */
function phone(value: unknown): string {
  const raw = text(value);

  if (raw === EMPTY) {
    return raw;
  }

  const digits = raw.replace(/\D/g, "");

  if (!digits) {
    return raw;
  }

  if (digits.startsWith("62")) {
    return `+${digits}`;
  }

  return `+62${digits.replace(/^0+/, "")}`;
}

function hasValue(value: unknown) {
  return text(value) !== EMPTY;
}

function firstFilled(...values: unknown[]): string {
  const filled = values.find(hasValue);

  return filled === undefined ? EMPTY : text(filled);
}

// SGB returns these enums in English; the profile UI is Indonesian ("Ya"/"Tidak"
// below). Unknown values pass through unchanged rather than being guessed.
const GENDER_LABELS: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

const MARITAL_STATUS_LABELS: Record<string, string> = {
  single: "Belum Menikah",
  married: "Menikah",
  divorced: "Cerai Hidup",
  widowed: "Cerai Mati",
};

function labelled(value: unknown, labels: Record<string, string>): string {
  const raw = text(value);

  return labels[raw.toLowerCase()] ?? sentenceCase(raw);
}

function yesNo(value: unknown) {
  if (value === true || value === 1 || value === "1") return "Ya";
  if (value === false || value === 0 || value === "0") return "Tidak";
  return EMPTY;
}

function experience(
  enabled: unknown,
  description: unknown,
): string {
  if (enabled === true || enabled === 1 || enabled === "1") {
    return hasValue(description) ? prose(description) : "Ya";
  }

  if (enabled === false || enabled === 0 || enabled === "0") {
    return "Tidak";
  }

  return prose(description);
}

/** Maps the verified getcustomerfullinfo production shape to browser-safe fields. */
export function parseClientAreaCustomerProfile(
  payload: unknown,
): ClientAreaCustomerProfile | null {
  const parsed = customerProfileSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  const row = parsed.data;
  const accountId = text(row.no_account);
  const displayName = prose(row.full_name);
  const email = text(row.email);

  if (accountId === EMPTY || displayName === EMPTY || email === EMPTY) {
    return null;
  }

  return {
    accountId,
    displayName,
    email,
    details: {
      personal: {
        birthPlace: prose(row.place_of_birth),
        birthDate: text(row.date_of_birth),
        identityNumber: hasValue(row.identity_number) ? MASKED : EMPTY,
        taxNumber: hasValue(row.npwp) ? MASKED : EMPTY,
        gender: labelled(row.sex, GENDER_LABELS),
        maritalStatus: labelled(row.marital_status, MARITAL_STATUS_LABELS),
        spouseName: prose(row.spouse_name),
        phone: phone(row.phone_number),
        homeAddress: prose(row.home_address),
        province: prose(row.provinsi),
        city: prose(row.kabupaten_kota),
        subdistrict: prose(row.kelurahan),
        postalCode: text(row.postal_code),
      },
      purpose: {
        openingPurpose: prose(row.acc_opening_goal ?? row.tujuan_pembukaan),
        sourceFunds: EMPTY,
        estimatedTransaction: EMPTY,
        investmentExperience: experience(row.is_invest_exp, row.investment_exp),
        futuresExperience: experience(
          row.is_future_trades_exp,
          row.future_trades_name_exp,
        ),
        familyAffiliation: experience(row.is_family_works, row.family_works),
        bankruptStatus: yesNo(row.is_bankrupt_status),
      },
      emergency: {
        name: EMPTY,
        relationship: EMPTY,
        phone: EMPTY,
        address: EMPTY,
        province: EMPTY,
        city: EMPTY,
        subdistrict: EMPTY,
        postalCode: EMPTY,
      },
      employment: {
        occupation: prose(row.occupation),
        companyName: prose(row.company_name),
        businessSector: prose(row.business_type),
        position: prose(row.job_position),
        yearsWorking: text(row.work_exp),
        previousOffice: prose(row.prev_office),
        officeAddress: prose(row.office_address),
        officePostalCode: text(row.office_postal_code),
        officePhone: phone(row.office_phone_num),
        monthlyIncome: EMPTY,
      },
      wealth: {
        totalAssets: EMPTY,
        annualIncome: prose(row.yearly_income),
        propertyOwnership: sentenceCase(firstFilled(row.house_location, row.njop)),
        vehicleOwnership: EMPTY,
        bankDeposit: sentenceCase(firstFilled(row.bank_deposit, row.deposit_amount)),
        otherInvestments: prose(row.other),
        bankAccount: EMPTY,
      },
    },
  };
}
