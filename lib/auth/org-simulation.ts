export type VerificationResult = "success" | "invalid" | "expired";

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 500));

export const simulateCodeRequest = async () => {
  await delay();
};

export const simulateCodeVerification = async (
  code: string,
): Promise<VerificationResult> => {
  await delay();
  if (/^1{6,}$/.test(code)) return "success";
  if (/^0{6,}$/.test(code)) return "expired";
  return "invalid";
};
