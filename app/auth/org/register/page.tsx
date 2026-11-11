import type { Metadata } from "next";
import OrgRegisterForm from "@/components/auth/org-register-form";

export const metadata: Metadata = { title: "Register organisation - Gleynr" };

export default function Page() {
  return <OrgRegisterForm />;
}
