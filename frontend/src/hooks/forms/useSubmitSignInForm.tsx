import * as z from 'zod';
import { login } from '@/api/auth-actions';
import { signInFormSchema } from '@/zodSchemas';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../useAuth';
import useErrorToast from '../useErrorToast';
import { isCustomError } from '@/errors';
import VerifyEmailAction from '@/components/dialogs/verify-email-action-toast';

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
      if (isCustomError(error))
        errorToast({
          title: 'Error logging in',
          message: error.message || 'An error occurred. Please try again.',
          action:
            error.message === 'Please verify your email before logging in' ? (
              <VerifyEmailAction email={data.email} />
            ) : undefined,
        });
      else
        errorToast({ message: 'An error occurred. Please try again.', title: 'Error logging in' });
    }
  }
  return onSubmit;
}
