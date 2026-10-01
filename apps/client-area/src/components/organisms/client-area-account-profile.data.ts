export type ClientAreaProfileData = {
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

export const EMPTY_PROFILE_VALUE = "—";

const EMPTY = EMPTY_PROFILE_VALUE;

/**
 * Every field blank ("—"). The profile page used to render invented demo data;
 * until getcustomerfullinfo is mapped (it needs a customer with finished
 * registration) nothing may be shown as if it were the customer's own record.
 */
export const EMPTY_CLIENT_AREA_PROFILE: ClientAreaProfileData = {
  personal: {
    birthPlace: EMPTY,
    birthDate: EMPTY,
    identityNumber: EMPTY,
    taxNumber: EMPTY,
    gender: EMPTY,
    maritalStatus: EMPTY,
    spouseName: EMPTY,
    phone: EMPTY,
    homeAddress: EMPTY,
    province: EMPTY,
    city: EMPTY,
    subdistrict: EMPTY,
    postalCode: EMPTY,
  },
  purpose: {
    openingPurpose: EMPTY,
    sourceFunds: EMPTY,
    estimatedTransaction: EMPTY,
    investmentExperience: EMPTY,
    futuresExperience: EMPTY,
    familyAffiliation: EMPTY,
    bankruptStatus: EMPTY,
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
    occupation: EMPTY,
    companyName: EMPTY,
    businessSector: EMPTY,
    position: EMPTY,
    yearsWorking: EMPTY,
    previousOffice: EMPTY,
    officeAddress: EMPTY,
    officePostalCode: EMPTY,
    officePhone: EMPTY,
    monthlyIncome: EMPTY,
  },
  wealth: {
    totalAssets: EMPTY,
    annualIncome: EMPTY,
    propertyOwnership: EMPTY,
    vehicleOwnership: EMPTY,
    bankDeposit: EMPTY,
    otherInvestments: EMPTY,
    bankAccount: EMPTY,
  },
};
