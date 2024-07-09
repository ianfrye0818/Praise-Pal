import * as z from 'zod';
import { register } from '@/api/auth-actions';
import { signUpFormSchema } from '@/zodSchemas';
import { UseFormReturn } from 'react-hook-form';
import { isCustomError } from '@/errors';
import { useAuth } from '../useAuth';
import { isAxiosError } from 'axios';
import useErrorToast from '../useErrorToast';
import useSuccessToast from '../useSuccessToast';

export default function useSubmitSignUpForm(form: UseFormReturn<z.infer<typeof signUpFormSchema>>) {
  const { dispatch } = useAuth();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();

  async function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    try {
      const resp = await register(dispatch, data);
      if (resp) {
        successToast({ title: 'Account created', message: resp.message });
      }
    } catch (error) {
      console.error(['signInFormError'], error);
      if (isAxiosError(error))
        errorToast({
          title: 'Error logging in',
          message: error.response?.data.message || 'An error occurred. Please try again.',
        });
      if (isCustomError(error)) errorToast({ title: 'Error loggin in', message: error.message });
      else
        errorToast({ message: 'An error occurred. Please try again.', title: 'Error logging in' });
    }
  }

  return onSubmit;
}
