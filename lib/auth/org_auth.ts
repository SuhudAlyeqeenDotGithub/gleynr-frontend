import { ApiFetch } from "../api/api";
import { getBackendApiUrl } from "../env/getter";
import { OrgRegistration } from "../schemaAndTypes/zod/auth";

export const registerOrg = async (data: OrgRegistration) => {
  await ApiFetch.post<void, OrgRegistration>(
    `/api/auth/org/register`,
    data,
    "Failed to register organisation",
  );
};
