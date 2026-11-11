"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { OrgAuthLayout } from "@/components/auth/org-auth-layout";
import { VerificationCode } from "@/components/auth/verification-code";
import {
  simulateCodeRequest,
  simulateCodeVerification,
} from "@/lib/auth/org-simulation";
import { FormInput } from "@/lib/forms/form-input";
import { orgSignInSchema, type OrgSignIn } from "@/lib/schemaAndTypes/zod/auth";

export default function OrgSignInForm() {
  const [values, setValues] = useState<OrgSignIn>({ orgEmail: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = orgSignInSchema.safeParse({
      orgEmail: values.orgEmail.trim(),
    });
    if (!result.success) {
      setError(
        z.flattenError(result.error).fieldErrors.orgEmail?.[0] ??
          "Enter a valid email address.",
      );
      return;
    }
    setError("");
    setSending(true);
    try {
      await simulateCodeRequest();
      setVerificationEmail(result.data.orgEmail);
    } catch {
      setError("Could not request a code. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <OrgAuthLayout
      title={verificationEmail ? "Verify your email" : "Organisation sign in"}
      subtitle={
        verificationEmail
          ? "Enter your verification code."
          : "Use your organisation email to sign in."
      }
    >
      {verificationEmail ? (
        <>
          <VerificationCode
            email={verificationEmail}
            onVerify={simulateCodeVerification}
            onResend={simulateCodeRequest}
          />

          <p className="auth-switch">
            <button
              type="button"
              className="org-auth-link"
              onClick={() => setVerificationEmail("")}
            >
              Change email
            </button>
          </p>
        </>
      ) : (
        <>
          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Organisation email"
              type="email"
              autoComplete="email"
              value={values.orgEmail}
              onChange={(event) => setValues({ orgEmail: event.target.value })}
              error={error}
              disabled={sending}
            />
            <button
              type="submit"
              className="button primary auth-wide"
              disabled={sending}
            >
              {sending && <Loader2 size={14} className="auth-spin" />}
              Send verification code
            </button>
          </form>
          <p className="auth-switch">
            New organisation? <Link href="/auth/org/register">Register</Link>
          </p>
        </>
      )}
    </OrgAuthLayout>
  );
}
