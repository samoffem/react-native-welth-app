import { z } from "zod"

export const signupSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.email("Enter a valid email").trim().min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type SignupFormValues = z.infer<typeof signupSchema>

export const signinSchema = z.object({
   
    email: z.email("Enter a valid email").trim().min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type SigninFormValues = z.infer<typeof signinSchema>

export const codeSchema = z.object({
    code: z.string().min(1, 'Enter the verification code'),
})

export type CodeFormValues = z.infer<typeof codeSchema>