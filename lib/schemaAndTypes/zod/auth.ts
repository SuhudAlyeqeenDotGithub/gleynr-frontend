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

export const orgRegistrationSchema = z.object({
  orgEmail: emailSchema,
  orgPhone: z.string().min(10),
  orgName: z.string().min(2),
  orgCountry: z.string().min(2),
  adminEmail: emailSchema,
  adminFullName: z.string().min(2),
});

export type OrgSignUp = z.infer<typeof orgRegistrationSchema>;
