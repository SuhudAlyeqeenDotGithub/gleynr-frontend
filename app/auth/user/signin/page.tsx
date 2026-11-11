import type { Metadata } from "next";
import UserSignInForm from "@/components/auth/user-signin-form";

export const metadata: Metadata = { title: "Sign in - Gleynr" };

export default function Page() {
  return <UserSignInForm />;
}
