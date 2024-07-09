import { getVerifyToken } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useVerifyEmailToken({
  token,
  queryKey,
}: {
  token: string;
  queryKey?: QueryKey;
}) {
  queryKey = queryKey || QueryKeys.verifyToken(token);
  return useQuery({
    queryKey,
    queryFn: async () => {
      return await getVerifyToken(token);
    },
    enabled: !!token,
  });
}
