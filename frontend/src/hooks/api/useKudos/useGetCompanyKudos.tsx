import { getCompanyKudos } from '@/api/api-handlers';
import { KudosQueryParams } from '@/types';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetCompanyKudos(queryParams: KudosQueryParams, queryKey: QueryKey) {
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const kudos = await getCompanyKudos(queryParams);
      return kudos;
    },
    enabled: !!queryParams.companyId,
  });

  return query;
}
