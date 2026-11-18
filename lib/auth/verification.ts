import { getBackendApiUrl } from "../env/getter";
export type OrgRegistrationSteps =
  | "Detail Entry"
  | "Admin Code Sent"
  | "Enter Admin Code"
  | "Enter Org Code"
  | "Org Code Sent"
  | "Verification Complete";

export const verifyCode = async (code: string, email: string) => {
  const backendApiUrl = getBackendApiUrl();

  const response = await fetch(`${backendApiUrl}/api/codes/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, email }),
  });

  if (!response.ok) {
    const content = await response.json();
    throw new Error(content.message || "Failed to verify code");
  }
};

export const sendCode = async (email: string) => {
  const backendApiUrl = getBackendApiUrl();

  const response = await fetch(`${backendApiUrl}/api/codes/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const content = await response.json();

    throw new Error(content.message || "Failed to request new code");
  }
};
