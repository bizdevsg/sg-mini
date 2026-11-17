import type { ClientAreaCustomerProfile } from "@/lib/client-area-profile.shared";
import type {
  AccountSummaryCard,
  OpenPositionCard,
  SettledPositionCard,
} from "@/types/account-summary";
import type { DailyStatementReport } from "@/types/daily-statement";
import type { TradeHistoryCard } from "@/types/trade-history";

export const dummyAccounts = [
  { account: "REG123456", type: "real" },
  { account: "DEMO123456", type: "demo" },
];

export const dummyProfile: ClientAreaCustomerProfile = {
  accountId: "REG123456",
  displayName: "Nasabah Demo",
  email: "reguler@example.com",
  details: {
    personal: {
      birthPlace: "Jakarta",
      birthDate: "1990-01-01",
      identityNumber: "****1234",
      taxNumber: "****5678",
      gender: "-",
      maritalStatus: "-",
      spouseName: "-",
      phone: "081234567890",
      homeAddress: "Jakarta",
      province: "DKI Jakarta",
      city: "Jakarta",
      subdistrict: "-",
      postalCode: "10110",
    },
    purpose: {
      openingPurpose: "-",
      sourceFunds: "-",
      estimatedTransaction: "-",
      investmentExperience: "-",
      futuresExperience: "-",
      familyAffiliation: "-",
      bankruptStatus: "-",
    },
    emergency: {
      name: "Kontak Demo",
      relationship: "-",
      phone: "081234567891",
      address: "Jakarta",
      province: "DKI Jakarta",
      city: "Jakarta",
      subdistrict: "-",
      postalCode: "10110",
    },
    employment: {
      occupation: "-",
      companyName: "PT Contoh",
      businessSector: "-",
      position: "-",
      yearsWorking: "5",
      previousOffice: "-",
      officeAddress: "Jakarta",
      officePostalCode: "10110",
      officePhone: "-",
      monthlyIncome: "-",
    },
    wealth: {
      totalAssets: "-",
      annualIncome: "-",
      propertyOwnership: "-",
      vehicleOwnership: "-",
      bankDeposit: "-",
      otherInvestments: "-",
      bankAccount: "****1234",
    },
  },
};

export function dummyAccountSummary(mode: "real" | "demo") {
  const accountId = mode === "real" ? "REG123456" : "DEMO123456";
  const account: AccountSummaryCard = {
    accountId,
    balance: 50000,
    floatingPl: 250,
    equity: 50250,
    marginRequired: 1000,
    effectiveMargin: 49250,
    equityRatio: 5025,
    callMarginPlace: 0,
    autoLiquidation: 0,
  };
  const positions: OpenPositionCard[] = [
    {
      id: "1001",
      productName: "XUL10",
      side: "buy",
      lot: 1,
      openPrice: 2650,
      currentPrice: 2652.5,
      profitLoss: 250,
      storage: 0,
      commission: 0,
      vat: 0,
      orderDate: "2026-11-16",
      time: "10:00",
    },
  ];
  const settled: SettledPositionCard[] = [
    {
      id: "1000",
      productName: "XUL10",
      lot: 1,
      liquidId: 999,
      openPrice: 2640,
      closePrice: 2645,
      profitLoss: 500,
      commission: 10,
      vat: 1,
      date: "2026-11-15",
      time: "14:30",
    },
  ];
  return { mode, account, positions, settled };
}

export function dummyDailyStatement(
  mode: "real" | "demo",
): DailyStatementReport {
  return {
    accountId: mode === "real" ? "REG123456" : "DEMO123456",
    aeCode: "DEMO",
    statementDate: "2026-11-16",
    previousBalance: 49511,
    marginIn: 0,
    marginOut: 0,
    storage: 0,
    profitLoss: 500,
    commissionFee: 10,
    vat: 1,
    discount: 0,
    interest: 0,
    adjustment: 0,
    newBalance: 50000,
    floating: 250,
    equity: 50250,
    marginRequired: 1000,
    effectiveMargin: 49250,
    equityRatio: 5025,
    positions: [
      {
        productName: "XUL10",
        side: "buy",
        lot: 1,
        openPrice: 2650,
        closingPrice: 2652.5,
        floating: 250,
        storage: 0,
        orderDate: "2026-11-16",
        time: "10:00",
      },
    ],
    settledCount: 1,
  };
}

export const dummyTradeHistory: TradeHistoryCard[] = [
  {
    id: "1001",
    product: "XUL10",
    side: "buy",
    lot: 1,
    price: 2650,
    liquidId: null,
    liquidPrice: null,
    executedAt: "2026-11-16 10:00:00",
  },
  {
    id: "1000",
    product: "XUL10",
    side: "sell",
    lot: 1,
    price: 2645,
    liquidId: 999,
    liquidPrice: 2640,
    executedAt: "2026-11-15 14:30:00",
  },
];
