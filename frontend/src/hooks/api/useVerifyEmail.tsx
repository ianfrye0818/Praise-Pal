import { postSendVerifyEmail, postVerifyEmailWithToken } from '@/api/api-handlers';
import { useMutation } from '@tanstack/react-query';
import useSuccessToast from '../useSuccessToast';

interface VerifyEmailProps {
  email?: string;
  token?: string;
}

export default function useVerifyEmail({ type }: { type: 'sendVerifyEmail' | 'verifyToken' }) {
  const { successToast } = useSuccessToast();
  return useMutation({
    mutationFn: async (payload: VerifyEmailProps) => {
      if (type === 'sendVerifyEmail') {
        console.log({ payload });
        if (!payload.email) throw new Error('Email is required');
        return await postSendVerifyEmail(payload.email);
      } else {
        if (!payload.token) throw new Error('Email and token are required');
        return await postVerifyEmailWithToken(payload.token);
      }
    },
    onSuccess: () => {
      if (type === 'sendVerifyEmail') {
        successToast({
          message: type === 'sendVerifyEmail' ? 'Verification email sent' : 'Email verified',
        });
      }
    },
  });
}
