import { patchUpdateKudo } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import { isCustomError, isError } from '@/errors';

import useErrorToast from '@/hooks/useErrorToast';
import { TKudos, UpdateKudoProps } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateKudo(queryKey: QueryKey = QueryKeys.allKudos) {
  const KUDOS_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();

  const mutation = useMutation({
    mutationFn: async ({
      companyCode,
      payload,
    }: {
      companyCode: string;
      payload: UpdateKudoProps;
    }) => {
      await patchUpdateKudo(companyCode, payload);
    },
    onMutate: async ({ payload }) => {
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);
      const previousData = queryClient.getQueryData(['kudos']);

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

    onError: (err) => {
      console.error(['useUpdateKudo', err]);
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
      errorToast({
        message:
          isCustomError(err) || isError(err)
            ? err.message
            : 'Something went wrong updating this Kudo',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
    },
  });

  return mutation;
}
