import { z } from "zod";

export const userSignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type UserSignUp = z.infer<typeof userSignUpSchema>;

export const userSignUpSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserSignIn = z.infer<typeof userSignInSchema>;

// org auth
export const orgSignInSchema = z.object({
  orgEmail: z.email(),
});

export type OrgSignIn = z.infer<typeof orgSignInSchema>;

export const orgRegistrationSchema = z
  .object({
    orgEmail: z.email(),
    orgPhone: z.string().min(10),
    orgName: z.string().min(2),
    orgCountry: z.string().min(2),
    adminEmail: z.email(),
    adminFullName: z.string().min(2),
  })
  ;

export type OrgSignUp = z.infer<typeof orgRegistrationSchema>;
