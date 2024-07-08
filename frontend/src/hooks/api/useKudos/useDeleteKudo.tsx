import { deleteSingleKudo } from '@/api/api-handlers';
import { QueryKeys } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { TKudos } from '@/types';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteKudoProps {
  companyId: string;
  kudoId: string;
}

export default function useDeleteKudo(queryKey: QueryKey = QueryKeys.allKudos) {
  const KUDOS_QUERY_OPTIONS = { queryKey, exact: false };
  const queryClient = useQueryClient();
  const { errorToast } = useErrorToast();
  const { successToast } = useSuccessToast();
  const mutation = useMutation({
    mutationFn: async ({ companyId, kudoId }: DeleteKudoProps) =>
      await deleteSingleKudo(companyId, kudoId),
    onMutate: async ({ kudoId }) => {
      await queryClient.cancelQueries(KUDOS_QUERY_OPTIONS);
      const previousData = queryClient.getQueriesData(KUDOS_QUERY_OPTIONS);

      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, (old: any) => {
        return Array.isArray(old) ? old.filter((kudo: TKudos) => kudo.id !== kudoId) : old;
      });
      return { previousData };
    },
    onError: (err, __, context) => {
      console.error(['useDeleteKudos'], err);
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: 'Error deleting your kudo, please try again. ' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
      successToast({ message: 'Kudo deleted successfully' });
    },
  });

  return mutation;
}
