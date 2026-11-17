import "server-only";

// Temporary local account while the Reguler API is being integrated.
export const dummyLogin = {
  email: "reguler@example.com",
  password: "reguler123",
  token: "reguler-local-dummy-session",
} as const;
