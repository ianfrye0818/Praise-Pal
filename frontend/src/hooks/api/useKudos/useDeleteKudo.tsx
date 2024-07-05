import { deleteSingleKudo } from '@/api/api-handlers';
import { KUDOS_QUERY_OPTIONS } from '@/constants';
import useErrorToast from '@/hooks/useErrorToast';
import useSuccessToast from '@/hooks/useSuccessToast';
import { TKudos } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteKudoProps {
  companyId: string;
  kudoId: string;
}

export default function useDeleteKudo() {
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
        return old.filter((kudo: TKudos) => kudo.id !== kudoId);
      });
      return { previousData };
    },
    onError: (err, __, context) => {
      queryClient.setQueriesData(KUDOS_QUERY_OPTIONS, context?.previousData);
      errorToast({ message: err.message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(KUDOS_QUERY_OPTIONS);
      successToast({ message: 'Kudo deleted successfully' });
    },
  });

  return mutation;
}
