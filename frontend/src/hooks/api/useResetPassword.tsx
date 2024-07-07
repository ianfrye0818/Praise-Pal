import {
  postSendResetPasswordEmail,
  postVerifyAndUpdatePasswordWithToken,
} from '@/api/api-handlers';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import useSuccessToast from '../useSuccessToast';
import useErrorToast from '../useErrorToast';
import { isCustomError } from '@/errors';

interface ResetPasswordProps {
  email?: string;
  token?: string;
  password?: string;
}

export default function useResetPassword({ type }: { type: 'sendResetPassword' | 'verifyToken' }) {
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: ResetPasswordProps) => {
      if (type === 'sendResetPassword') {
        if (!payload.email) throw new Error('Email is required');
        return await postSendResetPasswordEmail(payload.email);
      } else {
        if (!payload.token || !payload.password) throw new Error('Token and password are required');
        return await postVerifyAndUpdatePasswordWithToken(payload.token, payload.password);
      }
    },
    onError(err) {
      if (isCustomError(err)) {
        errorToast({
          title: 'Password reset error',
          message: err.message || 'An error occurred. Please try again.',
        });
      } else
        errorToast({
          message: 'An error occurred. Please try again.',
          title: 'Error sending reset password email',
        });
    },
    onSuccess(data) {
      if (type === 'sendResetPassword') {
        successToast({
          message: data?.message || 'Please check your email for password reset link',
        });
      }
      if (type === 'verifyToken') {
        successToast({
          message: data?.message || 'Password reset successfully! Please login.',
        });
        navigate({ to: '/sign-in' });
      }
    },
  });
}
