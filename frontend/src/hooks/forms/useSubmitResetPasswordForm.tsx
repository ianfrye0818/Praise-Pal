import { ErrorOption } from 'react-hook-form';
import useResetPassword from '../api/useResetPassword';
import * as z from 'zod';
import { ResetPasswordFormSchema } from '@/zodSchemas';
interface ResetPasswordFormProps {
  setError: (
    name: 'password' | 'confirmPassword' | 'token' | 'root' | `root.${string}`,
    error: ErrorOption,
    options?: {
      shouldFocus: boolean;
    }
  ) => void;
}
export default function useSubmitResetPasswordForm({ setError }: ResetPasswordFormProps) {
  const { mutateAsync: resetPassword } = useResetPassword({ type: 'verifyToken' });

  const onSubmit = async (data: z.infer<typeof ResetPasswordFormSchema>) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    await resetPassword({ token: data.token, password: data.password });
  };

  return onSubmit;
}
