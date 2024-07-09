import { patchUpdateKudo } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';

import useErrorToast from '@/hooks/useErrorToast';
import { TKudos, UpdateKudoProps } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateKudo(queryKey: QueryKey = QueryKeys.allKudos) {
  const KUDOS_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();

  const mutation = useMutation({
    mutationFn: async ({ companyId, payload }: { companyId: string; payload: UpdateKudoProps }) => {
      await patchUpdateKudo(companyId, payload);
    },
    onMutate: async ({ payload }) => {
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);
      const previousData = queryClient.getQueriesData(KUDOS_QUERY_OPTIONS);

      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, (old: any) => {
        return Array.isArray(old)
          ? old.map((kudo: TKudos) => {
              if (kudo.id === payload.id) {
                return {
                  ...kudo,
                  ...payload,
                };
              }
              return kudo;
            })
          : old;
      });
      return { previousData };
    },

    onError: (err, __, context) => {
      console.error(['useUpdateKudo', err]);
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: 'Something went wrong updating kudo - please try again.' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
    },
  });

  return mutation;
}
