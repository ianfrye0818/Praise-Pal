import { getCompanyUsers } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { UserQueryParams } from '@/types';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetCompanyUsers(
  queryParams: UserQueryParams,
  queryKey: QueryKey = QueryKeys.allUsers
) {
  const query = useQuery({
    queryKey,
    queryFn: async () => getCompanyUsers(queryParams),
    enabled: !!queryParams.companyId,
  });

  return query;
}
