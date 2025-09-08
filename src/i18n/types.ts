import { routing } from "./routing";

export type Locale = (typeof routing)["locales"][number];
export const KYCStatus = {
  pending: "pending",
  verified: "verified",
  rejected: "rejected",
} as const;