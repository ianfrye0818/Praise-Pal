import { getCompany } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetCompany(companyId: string, queryKey: QueryKey = QueryKeys.company) {
  const query = useQuery({
    queryKey,
    queryFn: async () => getCompany(companyId),
    enabled: !!companyId,
  });

  return query;
}
