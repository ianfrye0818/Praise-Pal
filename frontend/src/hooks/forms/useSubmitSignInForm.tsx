import * as z from 'zod';
import { login } from '@/api/auth-actions';
import { signInFormSchema } from '@/zodSchemas';
import { useNavigate } from '@tanstack/react-router';
import { isCustomError, isError } from '@/errors';
import { useAuth } from '../useAuth';
import { isAxiosError } from 'axios';
import useErrorToast from '../useErrorToast';

export default function useSubmitSignInForm() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const { errorToast } = useErrorToast();

  async function onSubmit(data: z.infer<typeof signInFormSchema>) {
    try {
      await login(dispatch, data);
      await navigate({ to: '/' });
    } catch (error) {
      console.error(['signInFormError'], error);
      if (isAxiosError(error))
        errorToast({
          message: error.response?.data.message || 'An error occurred. Please try again.',
        });
      else if (isError(error) || isCustomError(error)) errorToast({ message: error.message });
      else errorToast({ message: 'An error occurred. Please try again.' });
    }
  }
  return onSubmit;
}
