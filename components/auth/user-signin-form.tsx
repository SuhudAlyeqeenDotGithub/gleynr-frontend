"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthLayout, useAuthAction } from "@/components/auth/auth-form";

import { FormInput } from "@/lib/forms/form-input";
import {
  userSignInSchema,
  type UserSignIn,
} from "@/lib/schemaAndTypes/zod/auth";

export default function UserSignInForm() {
  const [values, setValues] = useState<UserSignIn>({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserSignIn, string>>
  >({});
  const { error, loading, signInWithGoogle, signInWithEmail } = useAuthAction();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = userSignInSchema.safeParse({
      ...values,
      email: values.email.trim(),
    });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        email: fieldErrors.email && fieldErrors.email[0],
        password: fieldErrors.password && fieldErrors.password[0],
      });
      return;
    }
    setErrors({});

    signInWithEmail(result.data.email, result.data.password);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Gleynr dashboard."
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
          autoComplete="current-password"
          value={values.password}
          onChange={(event) =>
            setValues({ ...values, password: event.target.value })
          }
          disabled={loading !== null}
          error={errors.password}
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
          Sign in
        </button>
      </form>
      <p className="auth-switch">
        Just been invited?{" "}
        <Link href="/auth/user/setup">Set up your account</Link>
      </p>
    </AuthLayout>
  );
}
