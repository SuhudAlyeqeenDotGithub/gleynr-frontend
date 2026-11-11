import type { Metadata } from "next";
import UserSetUpForm from "@/components/auth/user-setup-form";

export const metadata: Metadata = { title: "Sign up - Gleynr" };

export default function Page() {
  return <UserSetUpForm />;
}
