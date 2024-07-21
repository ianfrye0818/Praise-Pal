import { validateParsedPhoneNumber } from '@/lib/utils';
import { Role } from '@/types';
import { z, ZodError } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const AddUserSchema = SignInSchema.extend({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.nativeEnum(Role).optional(),
  companyCode: z
    .string()
    .min(4, 'Company code must be 4 characters')
    .max(4, 'Company code must be 4 characters')
    .transform((value) => value.toUpperCase()),
  confirmPassword: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateUserSchema = AddUserSchema.partial().optional();

export const AddCompanySchema = z.object({
  name: z.string().min(2, 'Please enter a valid name'),
  address: z.string().min(2, 'Please enter a valid address').optional().or(z.literal('')),
  city: z.string().min(2, 'Please enter a valid city').optional().or(z.literal('')),
  state: z
    .string()
    .min(2, 'State must be two characters')
    .max(2, 'State must be 2 characters')
    .transform((value) => value.toUpperCase())
    .refine((value) => /^[A-Z]{2}$/.test(value), {
      message: 'Please enter a valid state',
    })
    .optional()
    .or(z.literal('')),
  zip: z
    .string()
    .min(5, 'Please enter a valid zip code')
    .max(5, 'Please enter a valid zip code')
    .refine((value) => /^\d{5}$/.test(value), {
      message: 'Please enter a valid zip code',
    })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(2, 'Please enter a valid phone number')
    .transform((val) => {
      const { isValid, formattedNumber } = validateParsedPhoneNumber(val, [
        'companyInfo',
        'phone',
      ]) as { isValid: boolean; formattedNumber: string };
      if (!isValid) {
        throw new ZodError([
          {
            validation: 'base64',
            message: 'Please enter a valid phone number',
            fatal: true,
            code: 'invalid_string',
            path: ['companyInfo', 'phone'],
          },
        ]);
      }
      return formattedNumber;
    }),
});

const ContactTimeEnum = z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME']);
export const ContactTime = ContactTimeEnum.enum;

export const AddCompanyContactSchema = z
  .object({
    firstName: z.string().min(2, 'Please enter a valid first name'),
    lastName: z.string().min(2, 'Please enter a valid last name'),
    email: z.string().email('Please enter a valid email address'),
    bestTimeToContact: ContactTimeEnum,
    phone: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return '';
        const { isValid, formattedNumber } = validateParsedPhoneNumber(val, [
          'contactInfo',
          'phone',
        ]) as { isValid: boolean; formattedNumber: string };
        if (!isValid) {
          throw new ZodError([
            {
              validation: 'base64',
              message: 'Please enter a valid phone number',
              fatal: true,
              code: 'invalid_string',
              path: ['contactInfo', 'phone'],
            },
          ]);
        }
        return formattedNumber;
      }),
    sameNumber: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.sameNumber && (!data.phone || data.phone === '')) {
      ctx.addIssue({
        path: ['phone'],
        message: 'Please enter a valid phone number',
        code: 'custom',
      });
    }
  });

export const SubmitCompanyContactSchema = z.object({
  companyInfo: AddCompanySchema,
  contactInfo: AddCompanyContactSchema,
});
export const UpdateCompanySchema = AddCompanySchema.partial().extend({
  companyCode: z.string().optional(),
});

export const AddKudosSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  message: z.string().min(2, 'Please provide a valid message.'),
  receiverId: z.string().min(2, 'Please provide a valid recipient.'),
  isAnonymous: z.boolean(),
  senderId: z.string(),
  companyCode: z.string(),
});

export const EditKudosSchema = AddKudosSchema.extend({
  id: z.string(),
  isHidden: z.boolean(),
});

export const NewCommentSchema = z.object({
  content: z.string().min(2, 'Please enter a valid comment'),
  parentId: z.string().optional(),
  kudosId: z.string(),
  userId: z.string(),
});

export const EditCommentSchema = NewCommentSchema.extend({
  commentId: z.string(),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  token: z.string(),
});
