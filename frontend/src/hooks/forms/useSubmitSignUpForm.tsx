import { register } from '@/api/auth-actions';
import { UseFormReturn } from 'react-hook-form';
import { SignUpFormProps } from '@/types';
import useSuccessToast from '../useSuccessToast';
import { isCustomError, isError } from '@/errors';

export default function useSubmitSignUpForm(form: UseFormReturn<SignUpFormProps>) {
  const { successToast } = useSuccessToast();

  async function onSubmit(data: SignUpFormProps) {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    try {
      await register(data);
      form.reset();
      successToast({
        title: 'Registered Successfully',
        message: 'You have been registered and are waiting approval from an admin',
      });
    } catch (error) {
      console.error(['signInFormError'], error);
      form.setError('root', {
        message: isCustomError(error) || isError(error) ? error.message : 'Error registering',
      });
    }
  }

  return onSubmit;
}
