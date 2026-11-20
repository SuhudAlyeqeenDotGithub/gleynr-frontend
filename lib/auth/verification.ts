import { ApiFetch } from "../api/api";

export type OrgRegistrationSteps =
  | "Detail Entry"
  | "Codes Sent"
  | "Enter Admin Code"
  | "Enter Org Code"
  | "Verification Complete";

export const verifyCode = async (code: string, email: string) => {
  return await ApiFetch.post("/api/codes/verify", { code, email });
};

export const sendCode = async (email: string) => {
  return await ApiFetch.post("/api/codes/email/send", { email });
};
