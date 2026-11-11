import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character.");

const emailSchema = z.email("Enter a valid email address.");

export const userSignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserSignUp = z.infer<typeof userSignUpSchema>;

export const userSignUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserSignIn = z.infer<typeof userSignInSchema>;

// org auth
export const orgSignInSchema = z.object({
  orgEmail: emailSchema,
});

export type OrgSignIn = z.infer<typeof orgSignInSchema>;

export const orgRegistrationSchema = z
  .object({
    orgEmail: emailSchema,
    orgPhone: z
      .string()
      .min(10, "Enter a phone number with at least 10 characters."),
    orgName: z
      .string()
      .min(2, "Enter an organisation name with at least 2 characters."),
    orgCountryCode: z.string().min(2, "Select an organisation country."),
    adminEmail: emailSchema,
    adminFullName: z
      .string()
      .min(2, "Enter an administrator name with at least 2 characters."),
    acceptedTermOfService: z.literal(true, {
      error: "You must accept the terms of service.",
    }),
    acknowledgedPrivacyPolicy: z.literal(true, {
      error: "You must accept the privacy policy.",
    }),
  })
  .refine(
    (data) =>
      data.adminEmail.trim().toLowerCase() !==
      data.orgEmail.trim().toLowerCase(),
    {
      message: "Admin email must be different from organization email.",
      path: ["adminEmail"],
    },
  );

export type OrgSignUp = z.infer<typeof orgRegistrationSchema>;
