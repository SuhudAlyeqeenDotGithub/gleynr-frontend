"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { FormInput } from "@/lib/forms/form-input";

type VerificationCodeProps = {
  initialCode?: string;
  outcome: "verify" | "continue";
  actionButtonText?: string;
  email: string;
  onBack?: () => void;
  onVerify?: (code: string, email: string) => Promise<void>;
  onContinue?: (code: string) => void;
  onResend: (email: string) => Promise<void>;
  minLength?: number;
  resendCooldownSeconds?: number;
  disabled?: boolean;
};

export function VerificationCode({
  initialCode = "",
  outcome = "verify",
  email,
  onVerify,
  onContinue,
  actionButtonText,
  onResend,
  onBack,
  disabled = false,
  minLength = 6,
  resendCooldownSeconds = 30,
}: VerificationCodeProps) {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "verifying" | "resending" | "success"
  >("idle");
  const [remaining, setRemaining] = useState(resendCooldownSeconds);
  const [deadline, setDeadline] = useState<number | null>(null);
  const requiredLength = Math.max(6, minLength);

  useEffect(() => {
    setDeadline(Date.now() + resendCooldownSeconds * 1000);
  }, [resendCooldownSeconds]);

  useEffect(() => {
    if (deadline === null) return;
    const updateRemaining = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) setDeadline(null);
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (code.length < requiredLength) {
      setError(`Enter at least ${requiredLength} digits.`);
      return;
    }
    setError("");
    setStatus("verifying");

    if (outcome === "verify") {
      try {
        await onVerify?.(code, email);
      } catch (error: unknown) {
        setError(
          error instanceof Error && error.message
            ? error.message
            : "Could not verify the code. Try again.",
        );
      }
    }

    if (outcome === "continue") {
      onContinue?.(code);
    }

    setStatus("idle");
  };

  const handleResend = async () => {
    setError("");
    setStatus("resending");
    try {
      await onResend(email);
      setCode("");
      setRemaining(resendCooldownSeconds);
      setDeadline(Date.now() + resendCooldownSeconds * 1000);
    } catch (error: unknown) {
      setError(
        error instanceof Error && error.message
          ? error.message
          : "Could not request a new code. Try again.",
      );
    }
    setStatus("idle");
  };

  // if (status === "success") {
  //   return (
  //     <div className="org-auth-success" role="status">
  //       <strong>Code verified</strong>
  //       <p>The verification code has been successfully verified.</p>
  //     </div>
  //   );
  // }

  const busy = status !== "idle";
  return (
    <>
      <p className="org-auth-note">
        Verification for <strong>{email}</strong>
      </p>
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Verification code"
          type="text"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
          disabled={busy || disabled}
          error={error}
        />
        <button
          type="submit"
          className="button primary auth-wide"
          disabled={busy || disabled}
        >
          {status === "verifying" && (
            <Loader2 size={14} className="auth-spin" />
          )}
          {actionButtonText ||
            (outcome === "verify" ? "Verify code" : "Submit")}
        </button>
      </form>
      <p className="org-auth-resend">
        <button
          type="button"
          onClick={handleResend}
          disabled={busy || remaining > 0}
        >
          {status === "resending"
            ? "Requesting..."
            : remaining > 0
              ? `Resend code in ${remaining}s`
              : "Resend code"}
        </button>
      </p>{" "}
      {onBack && (
        <button
          type="button"
          className="button secondary"
          onClick={onBack}
          disabled={busy || disabled}
        >
          Back
        </button>
      )}
    </>
  );
}
