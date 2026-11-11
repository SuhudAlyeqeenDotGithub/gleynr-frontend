"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { FormInput } from "@/lib/forms/form-input";

type VerificationCodeProps = {
  email: string;
  onVerify: (code: string) => Promise<"success" | "invalid" | "expired">;
  onResend: () => Promise<void>;
  minLength?: number;
  resendCooldownSeconds?: number;
};

export function VerificationCode({
  email,
  onVerify,
  onResend,
  minLength = 6,
  resendCooldownSeconds = 30,
}: VerificationCodeProps) {
  const [code, setCode] = useState("");
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
    try {
      const result = await onVerify(code);
      if (result === "success") {
        setStatus("success");
        return;
      }
      setError(
        result === "expired"
          ? "This code has expired. Request a new code."
          : "This code is invalid. Try again.",
      );
    } catch {
      setError("Could not verify the code. Try again.");
    }
    setStatus("idle");
  };

  const handleResend = async () => {
    setError("");
    setStatus("resending");
    try {
      await onResend();
      setCode("");
      setRemaining(resendCooldownSeconds);
      setDeadline(Date.now() + resendCooldownSeconds * 1000);
    } catch {
      setError("Could not request a new code. Try again.");
    }
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="org-auth-success" role="status">
        <strong>Code verified</strong>
        <p>This is a simulation. You have not been signed in.</p>
      </div>
    );
  }

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
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, ""));
            setError("");
          }}
          disabled={busy}
          error={error}
        />
        <button
          type="submit"
          className="button primary auth-wide"
          disabled={busy}
        >
          {status === "verifying" && (
            <Loader2 size={14} className="auth-spin" />
          )}
          Verify code
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
      </p>
    </>
  );
}
