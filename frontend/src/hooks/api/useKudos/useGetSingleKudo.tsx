import { getsingleKudo } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { QueryKey, useQuery } from '@tanstack/react-query';

export default function useGetSingleKudo({
  companyId,
  kudoId,
  queryKey = QueryKeys.singleKudo(kudoId),
}: {
  companyId: string;
  kudoId: string;
  queryKey?: QueryKey;
}) {
  const query = useQuery({
    queryKey,
    queryFn: async () => getsingleKudo(companyId, kudoId),
    enabled: !!companyId && !!kudoId,
  });
  return query;
}
