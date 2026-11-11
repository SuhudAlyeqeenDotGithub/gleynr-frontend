import type { Metadata } from "next";
import SignInForm from "@/components/auth/signin-form";

export const metadata: Metadata = { title: "Sign in - Gleynr" };

export default function Page() {
  return <SignInForm />;
}
