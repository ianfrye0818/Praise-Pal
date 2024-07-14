import { getCompanyKudos } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { KudosQueryParams } from '@/types';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetCompanyKudos(
  queryParams: KudosQueryParams,
  queryKey: QueryKey = QueryKeys.allUsers
) {
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const kudos = await getCompanyKudos(queryParams);
      return kudos;
    },
    enabled: !!queryParams.companyCode,
  });

  return query;
}
