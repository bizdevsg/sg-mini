import type { AppLocale } from "@/locales";

export type ClientAreaProfileDemoData = {
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

const idProfileDemoData: ClientAreaProfileDemoData = {
  personal: {
    birthPlace: "Surabaya",
    birthDate: "17 April 1986",
    identityNumber: "3578 •••• •••• 0003",
    taxNumber: "09.254.•••.•-054.000",
    gender: "Laki-laki",
    maritalStatus: "Menikah",
    spouseName: "Melisa Tanuwijaya",
    phone: "0812-••••-6721",
    homeAddress: "Jl. Kemang Raya No. 42, Blok C7, RT 004 / RW 008",
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    subdistrict: "Bangka, Mampang Prapatan",
    postalCode: "12730",
  },
  purpose: {
    openingPurpose: "Investasi Jangka Panjang",
    sourceFunds: "Gaji dan Pendapatan Usaha",
    estimatedTransaction: "Rp500.000.000 – Rp1.000.000.000 per tahun",
    investmentExperience: "3 – 5 tahun",
    futuresExperience: "Berpengalaman",
    familyAffiliation: "Tidak",
    bankruptStatus: "Tidak",
  },
  emergency: {
    name: "Joko Susilo",
    relationship: "Saudara Kandung",
    phone: "0813-••••-9087",
    address: "Jl. Dharmahusada Indah Timur No. 18",
    province: "Jawa Timur",
    city: "Surabaya",
    subdistrict: "Mulyorejo",
    postalCode: "60115",
  },
  employment: {
    occupation: "Wiraswasta",
    companyName: "PT Nusantara Cipta Mandiri",
    businessSector: "Perdagangan dan Distribusi",
    position: "Direktur Utama",
    yearsWorking: "12 tahun",
    previousOffice: "PT Mandiri Niaga Utama",
    officeAddress: "Gedung Cyber 2 Tower Lt. 15, Jl. HR Rasuna Said",
    officePostalCode: "12950",
    officePhone: "021-2953-1200",
    monthlyIncome: "Rp85.000.000 – Rp120.000.000",
  },
  wealth: {
    totalAssets: "Rp12.500.000.000",
    annualIncome: "Rp1.200.000.000",
    propertyOwnership: "3 properti (rumah dan ruko)",
    vehicleOwnership: "2 mobil dan 1 motor",
    bankDeposit: "Rp2.500.000.000",
    otherInvestments: "Saham, reksa dana, dan emas batangan",
    bankAccount: "BCA •••• 5210",
  },
};

const enProfileDemoData: ClientAreaProfileDemoData = {
  personal: {
    birthPlace: "Surabaya",
    birthDate: "April 17, 1986",
    identityNumber: "3578 •••• •••• 0003",
    taxNumber: "09.254.•••.•-054.000",
    gender: "Male",
    maritalStatus: "Married",
    spouseName: "Melisa Tanuwijaya",
    phone: "+62 812-••••-6721",
    homeAddress: "42 Kemang Raya, Block C7, RT 004 / RW 008",
    province: "DKI Jakarta",
    city: "South Jakarta",
    subdistrict: "Bangka, Mampang Prapatan",
    postalCode: "12730",
  },
  purpose: {
    openingPurpose: "Long-Term Investment",
    sourceFunds: "Salary and Business Income",
    estimatedTransaction: "IDR 500,000,000 – IDR 1,000,000,000 per year",
    investmentExperience: "3 – 5 years",
    futuresExperience: "Experienced",
    familyAffiliation: "No",
    bankruptStatus: "No",
  },
  emergency: {
    name: "Joko Susilo",
    relationship: "Sibling",
    phone: "+62 813-••••-9087",
    address: "18 Dharmahusada Indah Timur",
    province: "East Java",
    city: "Surabaya",
    subdistrict: "Mulyorejo",
    postalCode: "60115",
  },
  employment: {
    occupation: "Entrepreneur",
    companyName: "PT Nusantara Cipta Mandiri",
    businessSector: "Trading and Distribution",
    position: "President Director",
    yearsWorking: "12 years",
    previousOffice: "PT Mandiri Niaga Utama",
    officeAddress: "Cyber 2 Tower, 15th Floor, HR Rasuna Said",
    officePostalCode: "12950",
    officePhone: "+62 21-2953-1200",
    monthlyIncome: "IDR 85,000,000 – IDR 120,000,000",
  },
  wealth: {
    totalAssets: "IDR 12,500,000,000",
    annualIncome: "IDR 1,200,000,000",
    propertyOwnership: "3 properties (house and shop house)",
    vehicleOwnership: "2 cars and 1 motorcycle",
    bankDeposit: "IDR 2,500,000,000",
    otherInvestments: "Stocks, mutual funds, and gold bullion",
    bankAccount: "BCA •••• 5210",
  },
};

export function getClientAreaProfileDemoData(locale: AppLocale) {
  return locale === "id" ? idProfileDemoData : enProfileDemoData;
}
