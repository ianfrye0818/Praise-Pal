import { getVerifyToken, postSendVerifyEmail } from '@/api/api-handlers';
import { useMutation } from '@tanstack/react-query';

export default function useVerifyEmail({ type }: { type: 'sendVerifyEmail' | 'verifyToken' }) {
  return useMutation({
    mutationFn: async (email: string) => {
      if (type === 'sendVerifyEmail') {
        return await postSendVerifyEmail(email);
      } else {
        return await getVerifyToken(email);
      }
    },
  });
}
