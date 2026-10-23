import { z } from "zod"

export const signInSchema = z.object({
 email: z.email({ message: "Invalid email address" }),
 password: z.string().min(3, "Password is required")
})

export const signUpSchema = z.object({
 email: z.email({ message: "Invalid email address" }),
 password: z.string().min(3, "Password is required"),
 confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
 message: "Passwords do not match",
 path: ["confirmPassword"]
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>