"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthLayout, useAuthAction } from "@/components/auth/auth-form";
import { signUpWithEmail } from "@/lib/auth/auth";
import { FormInput } from "@/lib/forms/form-input";
import {
  userSignUpSchema,
  type UserSignUp,
} from "@/lib/schemaAndTypes/zod/auth";
import { z } from "zod";

export default function SignUpForm() {
  const [values, setValues] = useState<UserSignUp>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserSignUp, string>>
  >({});
  const { error, loading, signInWithGoogle, signUpWithEmail } = useAuthAction();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = userSignUpSchema.safeParse({
      ...values,
      email: values.email.trim(),
    });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        email: fieldErrors.email && fieldErrors.email[0],
        password: fieldErrors.password && fieldErrors.password[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }
    setErrors({});
    void signUpWithEmail(result.data.email, result.data.password);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking building analytics with Gleynr."
      loading={loading}
      onGoogle={signInWithGoogle}
    >
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email address"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) =>
            setValues({ ...values, email: event.target.value })
          }
          placeholder="you@company.com"
          disabled={loading !== null}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(event) =>
            setValues({ ...values, password: event.target.value })
          }
          disabled={loading !== null}
          error={errors.password}
        />
        <FormInput
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(event) =>
            setValues({ ...values, confirmPassword: event.target.value })
          }
          disabled={loading !== null}
          error={errors.confirmPassword}
        />
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="button primary auth-wide"
          disabled={loading !== null}
        >
          {loading === "email" && <Loader2 size={14} className="auth-spin" />}
          Create account
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link href="/auth/user/signin">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
