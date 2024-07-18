import { getsingleKudo } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetSingleKudo({
  companyCode,
  kudoId,
  queryKey = QueryKeys.singleKudo(kudoId),
}: {
  companyCode: string;
  kudoId: string;
  queryKey?: QueryKey;
}) {
  const query = useQuery({
    queryKey,
    queryFn: async () => getsingleKudo(companyCode, kudoId),
    enabled: !!companyCode && !!kudoId,
  });
  return query;
}
