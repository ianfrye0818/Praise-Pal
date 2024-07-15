import { Role } from '@/types';
import { z } from 'zod';
export const signInFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// export const signUpFormSchema = z.object({
//   email: z.string().email('please enter a valid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
//   firstName: z.string().min(2, 'Please enter a valid name'),
//   lastName: z.string().min(2, 'Please enter a valid name'),
//   companyCode: z
//     .string()
//     .min(4, 'Company code must be 4 characters')
//     .max(4, 'Company code must be 4 characters')
//     .transform((val) => val.toUpperCase()),
// });

export const addUserSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  role: z.nativeEnum(Role).optional(),
  companyCode: z
    .string()
    .min(4, 'Company code must be 4 characters')
    .max(4, 'Company code must be 4 characters')
    .transform((value) => value.toUpperCase()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = addUserSchema.partial();

export const updateCompanyFormSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
});

export const addKudoFormSchema = z.object({
  title: z.string().optional(),
  message: z.string().min(2, 'Please provide a valid message.'),
  receiverId: z.string().min(2, 'Please provide a valid recipient.'),
  isAnonymous: z.boolean(),
  senderId: z.string(),
  companyCode: z.string(),
});

export const editKudosFormSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  message: z.string().min(2, 'Please provide a valid message.'),
  isHidden: z.boolean(),
  companyCode: z.string(),
});

export const EditCommentSchema = z.object({
  content: z.string().min(2, 'Please enter a valid comment'),
  commentId: z.string(),
});

export const NewCommentSchema = z.object({
  content: z.string().min(2, 'Please enter a valid comment'),
  parentId: z.string().optional(),
  kudosId: z.string(),
  userId: z.string(),
});

export const ResetPasswordFormSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  token: z.string(),
});
