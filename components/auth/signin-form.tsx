"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthLayout, useAuthAction } from "@/components/auth/auth-form";
import { signInWithEmail } from "@/lib/auth/auth";
import { FormInput } from "@/lib/forms/form-input";
import {
  userSignInSchema,
  type UserSignIn,
} from "@/lib/schemaAndTypes/zod/auth";

export default function SignInForm() {
  const [values, setValues] = useState<UserSignIn>({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserSignIn, string>>
  >({});
  const { error, loading, run, signInWithGoogle } = useAuthAction();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = userSignInSchema.safeParse({
      ...values,
      email: values.email.trim(),
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email && "Enter a valid email address.",
        password:
          fieldErrors.password && "Password must be at least 8 characters.",
      });
      return;
    }
    setErrors({});
    void run("email", () =>
      signInWithEmail(result.data.email, result.data.password),
    );
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
        New to Gleynr? <Link href="/auth/user/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
