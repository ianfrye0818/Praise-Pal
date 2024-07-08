import { getsingleKudo } from '@/api/api-handlers';
import { useQuery } from '@tanstack/react-query';

export default function useGetSingleKudo({
  companyId,
  kudoId,
}: {
  companyId: string;
  kudoId: string;
}) {
  const query = useQuery({
    queryKey: ['singleKudo', kudoId],
    queryFn: async () => getsingleKudo(companyId, kudoId),
    enabled: !!companyId && !!kudoId,
  });
  return query;
}
