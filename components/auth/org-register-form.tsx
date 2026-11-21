"use client";

import { useState, type FormEvent } from "react";
import type { OrgRegistrationSteps } from "@/lib/auth/verification";
import { sendCode } from "@/lib/auth/verification";
import { registerOrg } from "@/lib/auth/org_auth";
import Link from "next/link";
import { set, z } from "zod";
import type { OrgRegistrationVerificationData } from "@/lib/schemaAndTypes/zod/auth";
import { OrgAuthLayout } from "@/components/auth/org-auth-layout";
import { countries } from "@/lib/data/countries";
import { FormInput } from "@/lib/forms/form-input";
import {
  orgRegistrationDetailsSchema,
  type OrgRegistrationDetails,
} from "@/lib/schemaAndTypes/zod/auth";
import { VerificationCode } from "./verification-code";
import { delayBy } from "@/lib/general/general";

const sortedCountries = [...countries].sort((first, second) =>
  first.name.localeCompare(second.name),
);

export default function OrgRegisterForm() {
  const [values, setValues] = useState<OrgRegistrationDetails>({
    orgName: "SuhudCorp",
    orgEmail: "alyekeeniy@gmail.com",
    orgPhoneNumber: "07840262030",
    orgCountryCode: "GB",
    registeringAdminName: "Suhud",
    registeringAdminEmail: "alyekeeniybackup@gmail.com",
    acceptedTermsOfService: true,
    acknowledgedPrivacyPolicy: true,
  });

  const [verificationData, setVerificationData] =
    useState<OrgRegistrationVerificationData>({
      orgVerificationCode: "",
      registeringAdminVerificationCode: "",
    });
  const [errors, setErrors] = useState<
    Partial<Record<keyof OrgRegistrationDetails, string>>
  >({});
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<OrgRegistrationSteps>("Detail Entry");

  const submitDetails = async (event: FormEvent) => {
    if (step !== "Detail Entry") return;

    event.preventDefault();
    const result = orgRegistrationDetailsSchema.safeParse({
      ...values,
      orgName: values.orgName.trim(),
      orgEmail: values.orgEmail.trim(),
      orgPhoneNumber: values.orgPhoneNumber.trim(),
      registeringAdminName: values.registeringAdminName.trim(),
      registeringAdminEmail: values.registeringAdminEmail.trim(),
    });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        orgName: fieldErrors.orgName?.[0],
        orgEmail: fieldErrors.orgEmail?.[0],
        orgPhoneNumber: fieldErrors.orgPhoneNumber?.[0],
        orgCountryCode: fieldErrors.orgCountryCode?.[0],
        registeringAdminName: fieldErrors.registeringAdminName?.[0],
        registeringAdminEmail: fieldErrors.registeringAdminEmail?.[0],
        acceptedTermsOfService: fieldErrors.acceptedTermsOfService?.[0],
        acknowledgedPrivacyPolicy: fieldErrors.acknowledgedPrivacyPolicy?.[0],
      });
      return;
    }
    setErrors({});
    setError("");

    handleSendCode(values.registeringAdminEmail);
    handleSendCode(values.orgEmail, "Codes Sent");
  };

  const registerWithCodes = async (
    verificationDataObj: OrgRegistrationVerificationData,
  ) => {
    if (step !== "Enter Org Code") return;

    try {
      setError("");
      await registerOrg({ ...values, ...verificationDataObj });
      setStep("Verification Complete");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to register org";
      setError(message);
    }
  };

  const handleSendCode = async (
    email: string,
    nextStep?: OrgRegistrationSteps,
  ) => {
    setError("");
    try {
      await sendCode(email);
      if (nextStep) setStep(nextStep);
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
    onBack,
    hideContinue = false,
  }: {
    title: string;
    message: string;
    onContinue: () => void;
    onBack?: () => void;
    hideContinue?: boolean;
  }) => (
    <div className="org-auth-success" role="status">
      <strong>{title}</strong>
      <p className="mb-5">{message}</p>
      {!hideContinue && (
        <button className="button primary auth-wide" onClick={onContinue}>
          Continue
        </button>
      )}{" "}
      <div className="mt-5">
        {" "}
        {onBack && (
          <button className="button secondary" onClick={onBack}>
            Back
          </button>
        )}
      </div>
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
              value={values.orgPhoneNumber}
              onChange={(event) =>
                setValues({ ...values, orgPhoneNumber: event.target.value })
              }
              error={errors.orgPhoneNumber}
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
              value={values.registeringAdminName}
              onChange={(event) =>
                setValues({
                  ...values,
                  registeringAdminName: event.target.value,
                })
              }
              error={errors.registeringAdminName}
            />
            <FormInput
              label="Administrator email"
              type="email"
              autoComplete="email"
              value={values.registeringAdminEmail}
              onChange={(event) =>
                setValues({
                  ...values,
                  registeringAdminEmail: event.target.value,
                })
              }
              error={errors.registeringAdminEmail}
            />
          </fieldset>
          <fieldset>
            <legend>Legal acknowledgements</legend>
            <div className="org-consent-field">
              <label className="org-consent">
                <input
                  type="checkbox"
                  checked={values.acceptedTermsOfService}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      acceptedTermsOfService: event.target.checked,
                    })
                  }
                  aria-invalid={
                    errors.acceptedTermsOfService ? true : undefined
                  }
                  aria-describedby={
                    errors.acceptedTermsOfService
                      ? "org-terms-error"
                      : undefined
                  }
                />
                I accept the Terms of Service.
              </label>
              {errors.acceptedTermsOfService && (
                <div id="org-terms-error" className="form-error">
                  {errors.acceptedTermsOfService}
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
            Continue
          </button>
          <p className="auth-switch">
            Already registered? <Link href="/auth/org/signin">Sign in</Link>
          </p>
        </form>
      )}
      {step === "Codes Sent" && (
        <Instruction
          title="Verify Admin and Organisation Email"
          message={`A code has been sent to ${values.registeringAdminEmail} and ${values.orgEmail} for verification. Continue to enter the codes.`}
          onContinue={() => setStep("Enter Admin Code")}
          onBack={() => setStep("Detail Entry")}
        />
      )}
      {step === "Enter Admin Code" && (
        <VerificationCode
          initialCode={verificationData.registeringAdminVerificationCode}
          outcome="continue"
          email={values.registeringAdminEmail}
          onContinue={async (code: string) => {
            setVerificationData({
              ...verificationData,
              registeringAdminVerificationCode: code,
            });
            await delayBy(500);
            setStep("Enter Org Code");
          }}
          onBack={() => setStep("Codes Sent")}
          onResend={(email) => handleResendCode(email)}
        />
      )}
      {step === "Enter Org Code" && (
        <VerificationCode
          initialCode={verificationData.orgVerificationCode}
          outcome="continue"
          email={values.orgEmail}
          onContinue={async (code: string) => {
            const verificationDataObj = {
              ...verificationData,
              orgVerificationCode: code,
            };

            setVerificationData(verificationDataObj);
            await registerWithCodes(verificationDataObj);
          }}
          onBack={() => setStep("Enter Admin Code")}
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
