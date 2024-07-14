import { getCompany } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetCompany(companyCode: string, queryKey: QueryKey = QueryKeys.company) {
  const query = useQuery({
    queryKey,
    queryFn: async () => getCompany(companyCode),
    enabled: !!companyCode,
  });

  return query;
}
