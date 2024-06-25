import { z } from 'zod';
export const signInFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpFormSchema = z.object({
  email: z.string().email('please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Please enter a valid display name'),
  companyCode: z
    .string()
    .min(4, 'Company code must be 4 characters')
    .max(4, 'Company code must be 4 characters')
    .transform((val) => val.toUpperCase()),
});

export const updateUserFormSchema = z.object({
  firstName: z.string().min(2, 'Please enter a valid first name'),
  lastName: z.string().min(2, 'Please enter a valid last name'),
  displayName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
});

export const addKudoFormSchema = z.object({
  title: z.string().optional(),
  message: z.string().min(2, 'Please provide a valid message.'),
  receiverId: z.string().min(2, 'Please provide a valid recipient.'),
  isAnonymous: z.boolean(),
});

export const editKudosFormSchema = z.object({
  title: z.string().optional(),
  message: z.string().min(2, 'Please provide a valid message.'),
});

export function getSchema(schema: SchemaTypes) {
  switch (schema) {
    case 'signIn':
      return signInFormSchema;
    case 'signUp':
      return signUpFormSchema;
    case 'addKudo':
      return addKudoFormSchema;
    default:
      return null;
  }
}

type SchemaTypes = 'signIn' | 'signUp' | 'addKudo';
