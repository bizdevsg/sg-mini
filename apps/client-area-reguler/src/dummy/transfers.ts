export const dummyTransfers = {
  deposit: [
    {
      id: "DEP-001",
      date: "2026-11-10",
      amount: 50000,
      reference: "DUMMY-001",
    },
  ],
  withdrawal: [
    { id: "WDR-001", date: "2026-11-12", amount: 1000, reference: "DUMMY-002" },
  ],
} as const;
