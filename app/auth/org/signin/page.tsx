import type { Metadata } from "next";
import OrgSignInForm from "@/components/auth/org-signin-form";

export const metadata: Metadata = { title: "Organisation sign in - Gleynr" };

export default function Page() {
  return <OrgSignInForm />;
}
