import { register } from '@/api/auth-actions';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '../useAuth';
import useErrorToast from '../useErrorToast';
import { SignUpFormProps } from '@/types';

export default function useSubmitSignUpForm(form: UseFormReturn<SignUpFormProps>) {
  const { dispatch } = useAuth();
  const { errorToast } = useErrorToast();

  async function onSubmit(data: SignUpFormProps) {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    try {
      await register(dispatch, data);
    } catch (error) {
      console.error(['signInFormError'], error);
      errorToast({ message: 'An error occured while signing up.' });
    }
  }

  return onSubmit;
}
