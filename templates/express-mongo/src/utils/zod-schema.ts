import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string({ error: 'Email must be a string' })
    .email({
      pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      error: 'Please enter a valid email',
    })
    .nonempty({ error: 'Email is required' })
    .transform((val) => val.toLowerCase()),
  password: z
    .string({ error: 'password must be a string' })
    .nonempty({ error: 'Password is required' }),
});

export const signUpSchema = z.object({
  name: z.string({ error: 'Name must be a string' }).nonempty({ error: 'Name is required' }),
  email: z
    .string({ error: 'Email must be a string' })
    .email({
      pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      error: 'Please enter a valid email',
    })
    .nonempty({ error: 'Email is required' })
    .transform((val) => val.toLowerCase()),
  password: z
    .string({ error: 'Password must be a string' })
    .min(8, { error: 'Password must be at least 8 characters' })
    .nonempty({ error: 'Password is required' }),
});

export const verifyEmailSchema = z.object({
  email: z
    .string({ error: 'Email must be a string' })
    .email({
      pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      error: 'Please enter a valid email',
    })
    .nonempty({ error: 'Email is required' })
    .transform((val) => val.toLowerCase()),
  otp: z.string({ error: 'OTP must be a string' }).nonempty({ error: 'OTP is required' }),
});

export const passwordChangeSchema = z.object({
  oldPassword: z
    .string({ error: 'Old Password must be a string' })
    .min(8, { error: 'Old Password must be at least 8 characters' })
    .nonempty({ error: 'Old Password is required' }),
  newPassword: z
    .string({ error: 'New Password must be a string' })
    .min(8, { error: 'New Password must be at least 8 characters' })
    .nonempty({ error: 'New Password is required' }),
  confirmPassword: z
    .string({ error: 'Confirm Password must be a string' })
    .min(8, { error: 'Confirm Password must be at least 8 characters' })
    .nonempty({ error: 'Confirm Password is required' }),
});
