import { login } from '@/api/auth-actions';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../useAuth';
import { isCustomError, isError } from '@/errors';
import { SignInFormProps } from '@/types';
import { UseFormReturn } from 'react-hook-form';

export default function useSubmitSignInForm({ form }: { form: UseFormReturn<SignInFormProps> }) {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  async function onSubmit(data: SignInFormProps) {
    try {
      await login(dispatch, data);
      await navigate({ to: '/' });
    } catch (error) {
      console.error(['signInFormError'], error);
      form.setError('root', {
        message: isCustomError(error) || isError(error) ? error.message : 'Error signing in',
      });
    }
  }
  return onSubmit;
}
