import type { Metadata } from "next";
import SignUpForm from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Sign up - Gleynr" };

export default function Page() {
  return <SignUpForm />;
}
