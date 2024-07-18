import { getSingleCompanyUser } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetCompanyUser({
  companyCode,
  userId,
  queryKey,
}: {
  companyCode: string;
  userId: string;
  queryKey?: QueryKey;
}) {
  queryKey = queryKey || QueryKeys.singleUser(userId);
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      return await getSingleCompanyUser(companyCode, userId);
    },
    enabled: !!userId,
  });
  return query;
}
