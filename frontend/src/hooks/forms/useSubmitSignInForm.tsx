import { login } from '@/api/auth-actions';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../useAuth';
import { isCustomError, isError } from '@/errors';
import { SignInFormProps } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import { Route } from '@/routes/_authLayout';

export default function useSubmitSignInForm({ form }: { form: UseFormReturn<SignInFormProps> }) {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const searchParams = Route.useSearch();
  const redirectUrl = searchParams.redirectUrl;
  async function onSubmit(data: SignInFormProps) {
    try {
      await login(dispatch, data);
      await navigate({ to: redirectUrl?.toString() ?? '/' });
    } catch (error) {
      console.error(['signInFormError'], error);
      form.setError('root', {
        message: isCustomError(error) || isError(error) ? error.message : 'Error signing in',
      });
    }
  }
  return onSubmit;
}
