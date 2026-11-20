import { z } from "zod";
import {
  type OrgRegistrationVerificationData,
  type OrgRegistrationDetails,
  orgRegistrationVerificationDataSchema,
} from "@/lib/schemaAndTypes/zod/auth";
import { ApiFetch } from "../api/api";

export const registerOrg = async (
  data: OrgRegistrationDetails & OrgRegistrationVerificationData,
) => {
  const result = orgRegistrationVerificationDataSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;

    throw new Error(
      fieldErrors.orgVerificationCode?.[0] ||
        fieldErrors.registeringAdminVerificationCode?.[0] ||
        "Invalid verification data",
    );
  }

  return await ApiFetch.post<
    void,
    OrgRegistrationDetails & OrgRegistrationVerificationData
  >("/api/auth/org/register", data, "Failed to register org");
};
