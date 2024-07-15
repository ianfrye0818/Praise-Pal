import { register } from '@/api/auth-actions';
import { UseFormReturn } from 'react-hook-form';
import useErrorToast from '../useErrorToast';
import { SignUpFormProps } from '@/types';
import useSuccessToast from '../useSuccessToast';

export default function useSubmitSignUpForm(form: UseFormReturn<SignUpFormProps>) {
  const { errorToast } = useErrorToast();
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
      errorToast({ message: 'An error occured while signing up.' });
    }
  }

  return onSubmit;
}
