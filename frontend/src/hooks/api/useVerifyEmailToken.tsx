import { getVerifyToken } from '@/api/api-handlers';
import { useQuery } from '@tanstack/react-query';

export default function useVerifyEmailToken({ token }: { token: string }) {
  return useQuery({
    queryKey: ['verifyToken', token],
    queryFn: async () => {
      return await getVerifyToken(token);
    },
    enabled: !!token,
  });
}
