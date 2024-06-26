import { patchUpdateKudo } from '@/api/api-handlers';
import { KUDOS_QUERY_OPTIONS } from '@/constants';
import { TKudos, UpdateKudoProps } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateKudo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ companyId, payload }: { companyId: string; payload: UpdateKudoProps }) => {
      await patchUpdateKudo(companyId, payload);
    },
    onMutate: async ({ payload }) => {
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);
      const previousData = queryClient.getQueriesData(KUDOS_QUERY_OPTIONS);

      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, (old: any) => {
        return old.map((kudo: TKudos) => {
          if (kudo.id === payload.id) {
            return {
              ...kudo,
              ...payload,
            };
          }
          return kudo;
        });
      });
      return { previousData };
    },

    onError: (_, __, context) => {
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context?.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
    },
  });

  return mutation;
}
