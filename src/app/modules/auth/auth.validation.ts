import { z } from 'zod';

const createLoginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Not a valid email!')
      .nonempty("Email can't be empty!"),
    password: z
      .string({ required_error: 'Password is required' })
      .nonempty("Password can't be empty!"),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Not a valid email!')
      .nonempty("Email can't be empty!"),
  }),
});

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Not a valid email!')
      .nonempty("Email can't be empty!"),
    oneTimeCode: z
      .number({ required_error: 'One time code is required' })
      .nonnegative('One time code must be a positive number'),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z
      .string({ required_error: 'Password is required' })
      .nonempty("Password can't be empty!")
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
      })
      .nonempty("Confirm Password can't be empty!")
      .min(8, 'Confirm Password must be at least 8 characters long'),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current Password is required',
      })
      .nonempty("Current Password can't be empty!"),
    newPassword: z
      .string({ required_error: 'New Password is required' })
      .nonempty("New Password can't be empty!"),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
      })
      .nonempty("Confirm Password can't be empty!"),
  }),
});

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
};
