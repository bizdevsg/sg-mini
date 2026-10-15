import type { AccountMode } from "@/components/organisms/client-area.types";

export type ClientAreaAccountIds = Record<AccountMode, string | null>;

export type ClientAreaProfileDetails = {
  personal: {
    birthPlace: string;
    birthDate: string;
    identityNumber: string;
    taxNumber: string;
    gender: string;
    maritalStatus: string;
    spouseName: string;
    phone: string;
    homeAddress: string;
    province: string;
    city: string;
    subdistrict: string;
    postalCode: string;
  };
  purpose: {
    openingPurpose: string;
    sourceFunds: string;
    estimatedTransaction: string;
    investmentExperience: string;
    futuresExperience: string;
    familyAffiliation: string;
    bankruptStatus: string;
  };
  emergency: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
    province: string;
    city: string;
    subdistrict: string;
    postalCode: string;
  };
  employment: {
    occupation: string;
    companyName: string;
    businessSector: string;
    position: string;
    yearsWorking: string;
    previousOffice: string;
    officeAddress: string;
    officePostalCode: string;
    officePhone: string;
    monthlyIncome: string;
  };
  wealth: {
    totalAssets: string;
    annualIncome: string;
    propertyOwnership: string;
    vehicleOwnership: string;
    bankDeposit: string;
    otherInvestments: string;
    bankAccount: string;
  };
};

export type ClientAreaCustomerProfile = {
  accountId: string;
  displayName: string;
  email: string;
  details: ClientAreaProfileDetails;
};

export function resolveClientAreaAccountId(
  profile: { accountId: string; accountIds: ClientAreaAccountIds },
  mode: AccountMode,
) {
  return profile.accountIds[mode] ?? profile.accountId;
}
