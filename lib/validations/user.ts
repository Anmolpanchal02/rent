import { z } from 'zod'

/**
 * User registration validation schema
 * Validates user registration data against requirements 1.1 and 11.2
 */
export const userRegistrationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .trim()
    .toLowerCase()
    .email('Please provide a valid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  role: z.enum(['tenant', 'owner', 'admin'], {
    errorMap: () => ({ message: 'Role must be tenant, owner, or admin' }),
  }),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, 'Please provide a valid phone number')
    .optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
})

/**
 * User login validation schema
 */
export const userLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .trim()
    .toLowerCase()
    .email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
})

/**
 * User profile update validation schema
 */
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, 'Please provide a valid phone number')
    .optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
})

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
