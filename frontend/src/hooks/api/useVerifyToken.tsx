import { getVerifyToken } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { TokenType } from '@/types';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useVerifyToken({
  token,
  queryKey,
  type,
}: {
  token: string;
  queryKey?: QueryKey;
  type: TokenType;
}) {
  queryKey = queryKey || QueryKeys.verifyToken(token);
  return useQuery({
    queryKey,
    queryFn: async () => {
      return await getVerifyToken(token, type);
    },
    enabled: !!token,
  });
}
