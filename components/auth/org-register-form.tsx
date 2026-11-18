"use client";

import { useState, type FormEvent } from "react";
import type { OrgRegistrationSteps } from "@/lib/auth/verification";
import { verifyCode, sendCode } from "@/lib/auth/verification";
import Link from "next/link";
import { set, z } from "zod";
import { OrgAuthLayout } from "@/components/auth/org-auth-layout";
import { countries } from "@/lib/data/countries";
import { FormInput } from "@/lib/forms/form-input";
import {
  orgRegistrationSchema,
  type OrgSignUp,
} from "@/lib/schemaAndTypes/zod/auth";
import { VerificationCode } from "./verification-code";

type RegistrationValues = Omit<
  OrgSignUp,
  "acceptedTermOfService" | "acknowledgedPrivacyPolicy"
> & {
  acceptedTermOfService: boolean;
  acknowledgedPrivacyPolicy: boolean;
};

const sortedCountries = [...countries].sort((first, second) =>
  first.name.localeCompare(second.name),
);

export default function OrgRegisterForm() {
  const [values, setValues] = useState<RegistrationValues>({
    orgName: "SuhudCorp",
    orgEmail: "alyekeeniy@gmail.com",
    orgPhone: "07840262030",
    orgCountryCode: "GB",
    adminFullName: "Suhud",
    adminEmail: "alyekeeniybackup@gmail.com",
    acceptedTermOfService: true,
    acknowledgedPrivacyPolicy: true,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationValues, string>>
  >({});
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<OrgRegistrationSteps>("Detail Entry");

  const submitDetails = async (event: FormEvent) => {
    if (step !== "Detail Entry") return;

    event.preventDefault();
    const result = orgRegistrationSchema.safeParse({
      ...values,
      orgName: values.orgName.trim(),
      orgEmail: values.orgEmail.trim(),
      orgPhone: values.orgPhone.trim(),
      adminFullName: values.adminFullName.trim(),
      adminEmail: values.adminEmail.trim(),
    });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        orgName: fieldErrors.orgName?.[0],
        orgEmail: fieldErrors.orgEmail?.[0],
        orgPhone: fieldErrors.orgPhone?.[0],
        orgCountryCode: fieldErrors.orgCountryCode?.[0],
        adminFullName: fieldErrors.adminFullName?.[0],
        adminEmail: fieldErrors.adminEmail?.[0],
        acceptedTermOfService: fieldErrors.acceptedTermOfService?.[0],
        acknowledgedPrivacyPolicy: fieldErrors.acknowledgedPrivacyPolicy?.[0],
      });
      return;
    }
    setErrors({});
    setError("");

    handleSendCode(values.adminEmail, "Admin Code Sent");
  };

  const handleVerifyCode = async (
    code: string,
    email: string,
    currentStep: OrgRegistrationSteps,
  ) => {
    if (!["Enter Admin Code", "Enter Org Code"].includes(currentStep)) return;

    try {
      setError("");
      await verifyCode(code, email);

      if (currentStep === "Enter Admin Code") {
        handleSendCode(values.orgEmail, "Org Code Sent");
      } else if (currentStep === "Enter Org Code") {
        setStep("Verification Complete");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to verify code";
      setError(message);
    }
  };

  const handleSendCode = async (
    email: string,
    nextStep: OrgRegistrationSteps,
  ) => {
    setError("");
    try {
      await sendCode(email);
      setStep(nextStep);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send verification code";
      setError(message);
    }
  };

  const handleResendCode = async (email: string) => {
    setError("");
    await sendCode(email);
  };

  const Instruction = ({
    onContinue,
    title,
    message,
    hideContinue = false,
  }: {
    title: string;
    message: string;
    onContinue: () => void;
    hideContinue?: boolean;
  }) => (
    <div className="org-auth-success" role="status">
      <strong>{title}</strong>
      <p className="mb-5">{message}</p>
      {!hideContinue && (
        <button className="button primary auth-wide" onClick={onContinue}>
          Continue
        </button>
      )}
    </div>
  );

  return (
    <OrgAuthLayout
      title="Register your organisation"
      subtitle="Set up your organisation and administrator details."
      cardColCount={2}
      error={error}
    >
      {step === "Detail Entry" && (
        <form
          className="form-stack org-registration"
          onSubmit={submitDetails}
          noValidate
        >
          <fieldset>
            <legend>Organisation details</legend>
            <FormInput
              label="Organisation name"
              autoComplete="organization"
              value={values.orgName}
              onChange={(event) =>
                setValues({ ...values, orgName: event.target.value })
              }
              error={errors.orgName}
            />
            <FormInput
              label="Organisation email"
              type="email"
              autoComplete="email"
              value={values.orgEmail}
              onChange={(event) =>
                setValues({ ...values, orgEmail: event.target.value })
              }
              error={errors.orgEmail}
            />
            <FormInput
              label="Organisation phone"
              type="tel"
              autoComplete="tel"
              value={values.orgPhone}
              onChange={(event) =>
                setValues({ ...values, orgPhone: event.target.value })
              }
              error={errors.orgPhone}
            />
            <div className="org-auth-field">
              <label htmlFor="org-country">
                Organisation country
                <select
                  id="org-country"
                  autoComplete="country"
                  value={values.orgCountryCode}
                  onChange={(event) =>
                    setValues({ ...values, orgCountryCode: event.target.value })
                  }
                  aria-invalid={errors.orgCountryCode ? true : undefined}
                  aria-describedby={
                    errors.orgCountryCode ? "org-country-error" : undefined
                  }
                >
                  <option value="">Select a country</option>
                  {sortedCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>
              {errors.orgCountryCode && (
                <div id="org-country-error" className="form-error">
                  {errors.orgCountryCode}
                </div>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Administrator details</legend>
            <FormInput
              label="Administrator full name"
              autoComplete="name"
              value={values.adminFullName}
              onChange={(event) =>
                setValues({ ...values, adminFullName: event.target.value })
              }
              error={errors.adminFullName}
            />
            <FormInput
              label="Administrator email"
              type="email"
              autoComplete="email"
              value={values.adminEmail}
              onChange={(event) =>
                setValues({ ...values, adminEmail: event.target.value })
              }
              error={errors.adminEmail}
            />
          </fieldset>
          <fieldset>
            <legend>Legal acknowledgements</legend>
            <div className="org-consent-field">
              <label className="org-consent">
                <input
                  type="checkbox"
                  checked={values.acceptedTermOfService}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      acceptedTermOfService: event.target.checked,
                    })
                  }
                  aria-invalid={errors.acceptedTermOfService ? true : undefined}
                  aria-describedby={
                    errors.acceptedTermOfService ? "org-terms-error" : undefined
                  }
                />
                I accept the Terms of Service.
              </label>
              {errors.acceptedTermOfService && (
                <div id="org-terms-error" className="form-error">
                  {errors.acceptedTermOfService}
                </div>
              )}
            </div>
            <div className="org-consent-field">
              <label className="org-consent">
                <input
                  type="checkbox"
                  checked={values.acknowledgedPrivacyPolicy}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      acknowledgedPrivacyPolicy: event.target.checked,
                    })
                  }
                  aria-invalid={
                    errors.acknowledgedPrivacyPolicy ? true : undefined
                  }
                  aria-describedby={
                    errors.acknowledgedPrivacyPolicy
                      ? "org-privacy-error"
                      : undefined
                  }
                />
                I acknowledge the Privacy Policy.
              </label>
              {errors.acknowledgedPrivacyPolicy && (
                <div id="org-privacy-error" className="form-error">
                  {errors.acknowledgedPrivacyPolicy}
                </div>
              )}
            </div>
          </fieldset>
          <button type="submit" className="button primary auth-wide">
            Register organisation
          </button>
          <p className="auth-switch">
            Already registered? <Link href="/auth/org/signin">Sign in</Link>
          </p>
        </form>
      )}
      {step === "Admin Code Sent" && (
        <Instruction
          title="Verify Admin Email"
          message={`A code has been sent to ${values.adminEmail} for verification. Continue to enter the code.`}
          onContinue={() => setStep("Enter Admin Code")}
        />
      )}
      {step === "Enter Admin Code" && (
        <VerificationCode
          email={values.adminEmail}
          onVerify={(code) => handleVerifyCode(code, values.adminEmail, step)}
          onResend={(email) => handleResendCode(email)}
        />
      )}
      {step === "Org Code Sent" && (
        <Instruction
          title="Verify Organisation Email"
          message={`A code has been sent to ${values.orgEmail} for verification. Continue to enter the code.`}
          onContinue={() => setStep("Enter Org Code")}
        />
      )}
      {step === "Enter Org Code" && (
        <VerificationCode
          email={values.orgEmail}
          onVerify={(code) => handleVerifyCode(code, values.orgEmail, step)}
          onResend={(email) => handleResendCode(email)}
        />
      )}
      {step === "Verification Complete" && (
        <Instruction
          title="Verification Complete"
          message="Emails have been successfully verified. You will be redirected shortly."
          onContinue={() => {}}
          hideContinue={true}
        />
      )}
    </OrgAuthLayout>
  );
}
