import { postCreateKudo } from '@/api/api-handlers';
import { KUDOS_QUERY_OPTIONS } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { CreateKudoFormProps } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateKudo() {
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const mutation = useMutation({
    mutationFn: async (payload: CreateKudoFormProps) => await postCreateKudo(payload),
    onMutate: (payload) => {
      queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);

      const previousData = queryClient.getQueriesData(KUDOS_QUERY_OPTIONS);

      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, (old: any) => {
        return {
          ...old,
          payload: {
            ...payload,
            id: '1',
          },
        };
      });

      return previousData;
    },
    onError: (err, __, context) => {
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context);
      errorToast({ message: err.message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
      successToast({ message: 'Kudo created successfully' });
    },
  });

  return mutation;
}
